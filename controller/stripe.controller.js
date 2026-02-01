const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("../model/productmodel");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { productId, products } = req.body;

    let line_items = [];

    // ✅ Single product
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      });
    }

    // ✅ Cart products
    else if (products && products.length > 0) {
      const productIds = products.map(p => p.productId);

      const dbProducts = await Product.find({ _id: { $in: productIds } });

      line_items = dbProducts.map(prod => {
        const cartItem = products.find(
          p => p.productId.toString() === prod._id.toString()
        );

        return {
          price_data: {
            currency: "inr",
            product_data: { name: prod.name },
            unit_amount: Math.round(prod.price * 100),
          },
          quantity: cartItem.quantity,
        };
      });
    } else {
      return res.status(400).json({ message: "No products provided" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.CLIENT_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
};

exports.getSessionStatus = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    res.json({
      payment_status: session.payment_status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
