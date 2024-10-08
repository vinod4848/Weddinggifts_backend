const Product = require('../models/Product');
// const User = require("../models/User")
const Message = require('../models/Message');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }
        const newAdmin = new Admin({ username, password });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Check if JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret is not set.' });
        }

        // Generate a token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful.',admin, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.logoutAdmin = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out.' });
        }
        res.json({ message: 'Logout successful.' });
    });
};


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// exports.getUsers = async (req, res) => {
//     try {
//         const Users = await User.find().populate('productId');
//         res.json(Users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

