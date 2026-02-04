const Order = require("../model/ordermodel");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ orderStatus: "delivered" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "cancelled" });
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });

    
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          orderStatus: { $ne: "cancelled" },
          refundStatus: "none",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.status(200).json({
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      pendingOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
