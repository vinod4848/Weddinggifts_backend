const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, },
    percentageGifted: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);
