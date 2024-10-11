const mongoose = require('mongoose');


const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const checkoutSchema = new mongoose.Schema({
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        note: { type: String },
    },
    payment: {
        method: { type: String, required: true, enum: ['cash', 'card'] },
        cardType: { type: String, enum: ['visa', 'mastercard', 'skrill', 'paypal'], required: function () { return this.payment.method === 'card'; } },
        cardHolder: { type: String },
        cardNumber: { type: String },
        expireDate: { type: String },
        cvv: { type: String },
    },
    cartItems: [cartItemSchema],
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;