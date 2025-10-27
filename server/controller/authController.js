const argon = require("argon2");
const User = require("../models/User.js");
const { generateToken } = require("../utils/generateToken.js");

//Register a new user
const argon = require("argon2");
const User = require("../models/User.js");
const { sendWelcomeEmail } = require("../utils/emailService.js"); // 👈 import

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password using Argon2
    const hashedPassword = await argon.hash(password);

    // Create and save the new user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    sendWelcomeEmail(email, name)
      .then(() => console.log(`Welcome email sent to ${email}`))
      .catch((err) => console.error("Welcome email error:", err.message));

    // Respond immediately
    res.status(201).json({
      message: "User registered successfully",
      registeredUser: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

module.exports = { register };

//Login user and return JWT token
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Respond with token and user info (excluding password)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { register, login };
