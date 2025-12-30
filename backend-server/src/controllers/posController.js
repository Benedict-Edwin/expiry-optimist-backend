const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Alert = require('../models/Alert');

// @desc    Sync data from POS
// @route   POST /api/pos/sync
const syncPosData = async (req, res) => {
    if (req.headers['x-pos-key'] !== process.env.POS_KEY) {
        return res.status(403).json({ message: 'Unauthorized POS access' });
    }

    const { data } = req.body;

    try {
        for (const item of data) {
            // 1. Upsert Product
            const product = await Product.findOneAndUpdate(
                { sku: item.sku },
                {
                    name: item.name,
                    expiry_date: item.expiry_date,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    category: item.category || 'General'
                },
                { upsert: true, new: true }
            );

            // 2. Generate Alerts if needed
            const today = new Date();
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

            let alertType = null;
            if (new Date(item.expiry_date) < today) {
                alertType = 'EXPIRED';
            } else if (new Date(item.expiry_date) <= sevenDaysFromNow) {
                alertType = 'NEAR_EXPIRY';
            } else if (item.quantity < 10) {
                alertType = 'LOW_STOCK';
            }

            if (alertType) {
                await Alert.findOneAndUpdate(
                    { product_id: product._id, type: alertType, status: 'UNREAD' },
                    { product_id: product._id, type: alertType },
                    { upsert: true }
                );
            }
        }

        res.status(200).json({ message: 'POS Sync Successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { syncPosData };
