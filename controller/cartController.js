const Cart = require("../model/cartmodel");
const Product = require("../model/productmodel"); // REQUIRED

exports.getcart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart || { products: [] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Item not getting" });
  }
};

exports.addtocart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product is required" });
    }

    // 🔥 FETCH PRODUCT NAME
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        products: [
          {
            productId,
            productName: product.name,
            quantity,
          },
        ],
      });
      return res.json(cart);
    }

    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({
        productId,
        productName: product.name,
        quantity,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Add to cart not working" });
  }
};

exports.removecart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Remove cart not working" });
  }
};
