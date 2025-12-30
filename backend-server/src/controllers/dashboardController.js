const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Alert = require('../models/Alert');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
const getSummary = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const totalProducts = await Product.countDocuments();
        const expiredProducts = await Product.countDocuments({ expiry_date: { $lt: today } });
        const nearExpiryProducts = await Product.countDocuments({
            expiry_date: { $gte: today, $lte: sevenDaysFromNow }
        });
        const safeProducts = await Product.countDocuments({ expiry_date: { $gt: sevenDaysFromNow } });

        res.json({
            total: totalProducts,
            expired: expiredProducts,
            nearExpiry: nearExpiryProducts,
            safe: safeProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get latest alerts
// @route   GET /api/dashboard/alerts
const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ status: 'UNREAD' })
            .populate('product_id', 'name sku')
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSummary, getAlerts };
