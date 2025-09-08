import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied: not an admin" });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ error: "Unauthorized" });

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
