
const Wishlist = require("../model/wishlistmodel");

exports.getwishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate("products.productId");

    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ message: "Get wishlist failed" });
  }
};


exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user.id,
        products: [{ productId }],
      });
    } else {
      const exists = wishlist.products.find(
        (p) => p.productId.toString() === productId
      );

      if (exists) {
        return res.status(400).json({ message: "Already in wishlist" });
      }

      wishlist.products.push({ productId });
    }

    await wishlist.save();
    res.json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Add to wishlist failed" });
  }
};


exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await wishlist.save();
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Remove wishlist failed" });
  }
};
