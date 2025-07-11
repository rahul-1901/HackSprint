import UserModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
// import { generateVerificationToken } from "../utils/generateVerificationToken.js";
// import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { transporter } from "../nodemailer/nodemailerConfig.js";
import jwt from "jsonwebtoken";
import { oauth2client } from "../utils/googleAuth.utils.js";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({ message: "User already exist, You can login", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const jwtForEmailVerificatiion = jwt.sign(
      { _id: newUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // console.log(jwtForEmailVerificatiion)

    // res.cookie("verifyToken", jwtForEmailVerificatiion, {
    //   httpOnly: true, // this prevent from xss attacks
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // this prevent from csrf
    //   maxAge: 1 * 24 * 60 * 60 * 1000,
    //   path: "/",
    // });

    sendVerficationToken(req, res);

    // if (newUser.isVerified) {
    //   const jwtToken = generateTokenAndSetCookie(
    //     res,
    //     newUser._id,
    //     newUser.email
    //   );

    //   // sending welecome email
    //   const mailOptions = {
    //     from: process.env.SENDER_EMAIL,
    //     to: email,
    //     subject: "Welcome SKT productions!",
    //     text: `Welcome to SKT website. Your account has been created using this email ${email}`,
    //   };

    //   await transporter.sendMail(mailOptions);

    //   res.status(201).json({
    //     message: "User created successfully",
    //     success: true,
    //     jwtToken,
    //     email,
    //     name,
    //   });
    // }

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      verifyToken: jwtForEmailVerificatiion,
      email,
      name,
    });
  } catch (err) {
    res.json({ message: err.message, success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    const errorMsg = "Authentication failed! Email or password is wrong";

    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // const jwtToken = generateTokenAndSetCookie(res, user._id, user.email);
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    user.lastLogin = Date.now()

    await user.save()

    return res.status(201).json({
      message: "User logged in successfully",
      success: true,
      token: jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    res.json({
      message: err.message,
      success: false,
    });
  }
};

// const logout = async (req, res) => {
//   try {
//     res.clearCookie("token", {
//       httpOnly: true, // this prevent from xss attacks
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // this prevent from csrf
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//     });

//     return res.json({
//       message: "Logged Out",
//       success: true,
//     });
//   } catch (err) {
//     res.json({
//       message: err.message,
//       success: false,
//     });
//   }
// };

const sendVerficationToken = async (req, res) => {
  try {
    const { email } = req.body;

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await UserModel.findOne({ email });

    if (user.isVerified) {
      return res.json({
        message: "Account is alread verified",
        success: false,
      });
    }

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${verificationToken}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOption);
  } catch (err) {
    return res.status(504).json({
      message: err.message,
      success: false,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, verificationToken } = req.body;

  if (!userId || !verificationToken) {
    return res.json({ message: "Missing Details", success: false });
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      res.json({
        message: "user not found",
        success: false,
      });
    }

    if (verificationToken !== user.verificationToken) {
      res.json({
        message: "Invalid OTP",
        success: false,
      });
    }

    if (user.verificationTokenExpiresAt < Date.now()) {
      await UserModel.findByIdAndDelete(userId);
      res.json({
        message: "OTP Expired! Signup Again",
        success: false,
      });
    }

    user.isVerified = true;
    await user.save();

    // res.clearCookie("verifyToken");

    // const jwtToken = generateTokenAndSetCookie(res, user._id, user.email);
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // sending welecome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "HackSprint",
      text: `Welcome to HackSprint. Your account has been created using this email ${user.email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "User verified successfully",
      success: true,
      token: jwtToken,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    return res.json({
      message: "i am boss",
      success: false,
    });
  }
};

// Send password reset OTP
const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        message: "User not found..",
        success: false,
      });
    }

    const resetPasswordToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP is ${resetPasswordToken}.Reset your password using this OTP.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      message: "OTP sent to your email for reset password",
      success: true,
    });
  } catch (err) {
    return res.json({
      message: err.message,
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetPasswordToken, newPassword } = req.body;

    if (!email || !resetPasswordToken || !newPassword) {
      return res.json({
        message: "Email, OTP, and newPassword are required",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    }

    if (
      user.resetPasswordToken === "" ||
      user.resetPasswordToken !== resetPasswordToken
    ) {
      return res.json({
        message: "Invalid OTP",
        success: false,
      });
    }

    if (user.resetPasswordExpiresAt < Date.now()) {
      return res.json({
        message: "OTP Expired",
        success: false,
      });
    }

    const isPasswordEqual = await bcrypt.compare(newPassword, user.password);

    if (isPasswordEqual) {
      return res.json({
        message: "New password cannot be same as old password!",
        success: false
      })
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;

    user.resetPasswordToken = "";
    user.resetPasswordExpiresAt = null;

    await user.save();

    return res.json({
      message: "Password has been reset successfully",
      success: true,
    });
  } catch (err) {
    return res.json({
      message: err.message,
      success: false,
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Code not provided", success: false });
    }

    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const tokens = googleRes.tokens;

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { name, email } = userRes.data;

    let user = await UserModel.findOne({ email });

    let isFirstTime = false

    if (!user) {
      isFirstTime = true

      user = await UserModel.create({
        name,
        email,
        provider: "google",
        isVerified: true,
      });
    }

    const { _id } = user;

    const jwtToken = jwt.sign({ email, _id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    // const jwtToken = generateTokenAndSetCookie(res, user._id, user.email);

    // res.cookie("token", jwtToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    // sending welecome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "HackSprint",
      text: `Welcome to HackSprint. Your account has been created using this email ${user.email}`,
    };

    if (isFirstTime) {
      await transporter.sendMail(mailOptions);
    }

    return res.status(201).json({
      message: "login successfully",
      success: true,
      token: jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    console.error("🔥 Error in googleLogin:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export {
  signup,
  login,
  verifyEmail,
  sendResetOTP,
  resetPassword,
  googleLogin,
};
