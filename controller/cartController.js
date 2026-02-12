const Cart = require("../model/cartmodel");
const Product = require("../model/productmodel");

exports.getcart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "products.productId",
    );

    res.json(cart || { products: [] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Item not getting" });
  }
};

exports.addtocart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product and quantity are required" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      if (quantity < 0) {
        return res.status(400).json({ message: "Invalid operation" });
      }

      cart = await Cart.create({
        userId: req.user.id,
        products: [{ productId, quantity }],
      });

      return res.json(cart);
    }

    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId,
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;

      if (existingProduct.quantity <= 0) {
        cart.products = cart.products.filter(
          (p) => p.productId.toString() !== productId,
        );
      }
    } else {
      if (quantity < 0) {
        return res.status(400).json({ message: "Invalid operation" });
      }

      cart.products.push({ productId, quantity });
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
      (p) => p.productId.toString() !== productId,
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Remove cart not working" });
  }
};
