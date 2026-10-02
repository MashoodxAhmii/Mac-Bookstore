const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

// SIGN UP
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check username length
        if (!username || username.length < 4) {
            return res.status(400).json({ message: "Username must be at least 4 characters" });
        }

        // Check password length
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashPassword,
            address,
        });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
});

// SIGN IN
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const authClaim = {
            id: existingUser._id,
            name: existingUser.username,
            role: existingUser.role
        };

        const token = jwt.sign(authClaim, process.env.JWT_SECRET || "bookstore123", { expiresIn: "30d" });

        res.status(200).json({
            id: existingUser._id,
            role: existingUser.role,
            message: "User signed in successfully",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing in user" });
    }
});

// Get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const data = await User.findById(id).select("-password");

        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//update address
router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating address" });
    }
});

module.exports = router;