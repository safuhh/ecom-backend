const Order = require("../model/ordermodel");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email role")
      .populate("products.productId", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "cancelled" && order.paymentStatus === "paid") {
      order.orderStatus = "cancelled";
      order.refundStatus = "refunded";
    } else if (status === "delivered") {
      order.orderStatus = "delivered";
      if (order.paymentStatus === "paid") {
        order.refundStatus = "none";
      }
    } else {
      order.orderStatus = status;
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
