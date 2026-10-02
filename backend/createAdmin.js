require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.URI || 'mongodb://127.0.0.1:27017/bookstore-mern');
        console.log("Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log("Admin user already exists. You can log in with username 'admin'.");
            process.exit(0);
        }

        const hashPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: hashPassword,
            address: 'Admin Address',
            role: 'admin'
        });

        await adminUser.save();
        console.log("Admin user created successfully!");
        console.log("Username: admin");
        console.log("Password: admin123");
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

createAdmin();
