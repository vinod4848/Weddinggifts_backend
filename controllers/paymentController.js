const Payment = require("../models/Payments")
const Product = require("../models/Product");

exports.createPayment = async (req, res) => {
    const { userId, cartItems, paymentMode } = req.body;

    try {
        let totalPrice = 0;


        for (const item of cartItems) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ error: `Product not found for ID: ${item.productId}` });
            }
            totalPrice += product.price * item.quantity;
        }


        const newPayment = new Payment({
            userId,
            cartItems,
            totalPrice,
            paymentMode,
        });

        await newPayment.save();
        res.status(201).json({ message: "Payment created successfully", newPayment });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ error: "Failed to create payment" });
    }
};

exports.getPaymentsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const payments = await Payment.find({ userId })
            .populate({
                path: 'cartItems.productId', 
                select: 'name price description imageUrl', 
            })
            .populate('userId'); 
        if (payments.length === 0) {
            return res.status(404).json({ message: "No payments found for this user." });
        }

        res.status(200).json(payments); 
    } catch (error) {
        console.error("Error fetching payments:", error); 
        res.status(500).json({ error: "Failed to fetch payments" });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('userId').populate('cartItems.productId');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch payments" });
    }
};

exports.deletePayment = async (req, res) => {
    const { paymentId } = req.params;
    try {
        const payment = await Payment.findByIdAndRemove(paymentId);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete payment" });
    }
};

