import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

// Admin Signup
export const adminSignup = async (req, res) => {
  try {
    const { adminName, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      adminName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // KEY CHANGE: Using the correct environment variable name from your .env file
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ 
        message: "Login successful", 
        token, 
        admin: { 
            id: admin._id, 
            name: admin.adminName, 
            email: admin.email 
        } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};