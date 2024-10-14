const Product = require('../models/Product');
const User = require('../models/User');
const { uploadImage } = require("../helper/uploadImage");

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }
        const image = await uploadImage(file);

        const product = new Product({ ...req.body, image });
        await product.save();

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// exports.updateProduct = async (req, res) => {
//     const { id } = req.params;
//     const { title, price, image, percentageGifted } = req.body;

//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(id, { title, price, image, percentageGifted }, { new: true });
//         if (!updatedProduct) {
//             return res.status(404).json({ message: 'Product not found.' });
//         }
//         res.json(updatedProduct);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, price } = req.body; 
    const file = req.file; 

    try {
        let image;
        if (file) {
            image = await uploadImage(file); 
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { title, price, ...(image && { image }) },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getSingleProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderSummary = async (req, res) => {
    try {
        const Users = await User.find().populate('productId');
        res.json(Users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
