const Order = require('../model/order');
const Cart = require('../model/cart');
const Item = require('../model/items');
const User = require('../model/user');

// Get all orders (Admin only)
async function handleGetAllOrders(req, res) {
    try {
        console.log('handleGetAllOrders called');
        console.log('User:', req.user);
        console.log('Admin user:', req.adminUser);
        
        const orders = await Order.find()
            .sort({ orderDate: -1 });

        console.log('Orders found:', orders.length);
        console.log('Orders data:', JSON.stringify(orders, null, 2));

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
}

// Get orders by user (for regular users to see their own orders)
async function handleGetUserOrders(req, res) {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ userId })
            .populate('items.itemId', 'name description images')
            .sort({ orderDate: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user orders',
            error: error.message
        });
    }
}

// Update order status (Admin only)
async function handleUpdateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: pending, confirmed, shipped, delivered, cancelled'
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('userId', 'name email')
         .populate('items.itemId', 'name description images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
}

// Get order statistics (Admin only)
async function handleGetOrderStats(req, res) {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
        const shippedOrders = await Order.countDocuments({ status: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const monthlyRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$orderDate' },
                        month: { $month: '$orderDate' }
                    },
                    total: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                confirmedOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                monthlyRevenue
            }
        });
    } catch (error) {
        console.error("Get order stats error:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order statistics',
            error: error.message
        });
    }
}

module.exports = {
    handleGetAllOrders,
    handleGetUserOrders,
    handleUpdateOrderStatus,
    handleGetOrderStats
}; 