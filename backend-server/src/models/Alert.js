const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    type: {
        type: String,
        enum: ['EXPIRED', 'NEAR_EXPIRY', 'LOW_STOCK'],
        required: true
    },
    status: {
        type: String,
        enum: ['UNREAD', 'RESOLVED'],
        default: 'UNREAD',
        index: true
    }
}, {
    timestamps: true
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
