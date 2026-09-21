import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "getprospekt_jwt_secret_key_2026_super_secure",
    { expiresIn: "7d" }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.comparePassword(password))) {
      return res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Default fallback check for initial admin during dev/first setup if database isn't seeded yet
    if (email === "admin@getprospekt.co" && password === "admin123") {
      let adminUser = user;
      if (!adminUser) {
        adminUser = await User.create({
          name: "Admin",
          email: "admin@getprospekt.co",
          password: "admin123",
          role: "admin",
        });
      }
      return res.json({
        token: generateToken(adminUser._id),
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    }

    return res.status(401).json({ message: "Invalid email or password." });
  } catch (error) {
    console.error("[Login Error]:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
