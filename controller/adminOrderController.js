const Order = require("../model/ordermodel");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .populate("products.productId", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ CASE 1: Admin cancels a PAID order → refund
    if (status === "cancelled" && order.paymentStatus === "paid") {
      order.orderStatus = "cancelled";
      order.refundStatus = "refunded";
    }

    // ✅ CASE 2: Admin re-delivers a cancelled order → undo refund
    else if (status === "delivered") {
      order.orderStatus = "delivered";

      if (order.paymentStatus === "paid") {
        order.refundStatus = "none"; // 🔥 THIS WAS MISSING
      }
    }

    // Normal flow
    else {
      order.orderStatus = status;
    }

    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
