const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("../model/productmodel");
const Cart = require("../model/cartmodel");


exports.createCheckoutSession = async (req, res) => {
  try {
    const { products, address } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products" });
    }

    let totalAmount = 0;

    const line_items = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error("Product not found");

        totalAmount += product.price * item.quantity;

        return {
          price_data: {
            currency: "inr",
            product_data: { name: product.name },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.CLIENT_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: req.user._id.toString(),
        products: JSON.stringify(products),
        address: JSON.stringify(address),
        totalAmount: totalAmount.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSessionStatus = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    res.json({ payment_status: session.payment_status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { products: [] }
    );
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
