const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");  // Adjust this based on your user model

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup Controller
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, email, password: hashedPassword });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};

// Logout Controller
exports.logout = (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" });
};

// Get User Info
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};
