const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
