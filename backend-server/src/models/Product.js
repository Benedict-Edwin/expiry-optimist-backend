const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    expiry_date: {
        type: Date,
        required: true,
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    unit_price: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
