const Product = require("../model/productmodel");

// Create product
exports.createproduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products
exports.getallproducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
exports.getsingleproducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: "Invalid product id" });
  }
};

// Update product
exports.updateproducts = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product
exports.deleteproduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
