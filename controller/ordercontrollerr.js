const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../model/ordermodel");
const Cart = require("../model/cartmodel");

exports.verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const { session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const order = await Order.create({
      userId: session.metadata.userId,
      products: JSON.parse(session.metadata.products),
      address: JSON.parse(session.metadata.address),
      totalAmount: session.metadata.totalAmount,
      paymentStatus: "paid",
      orderStatus: "pending", // 👈 DELIVERY NOT STARTED
      stripeSessionId: session.id,
    });

    res.json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "cancelled") {
      return res.json({ message: "Already cancelled" });
    }

    // 🔥 FIX
    order.orderStatus = "cancelled";

    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getmyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("products.productId")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "get my orders have some error" });
  }
};
