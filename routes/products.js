const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const authenticate = require("../middlewares/auth");

// Get All Products (with search, sort, and pagination)
router.get("/", async (req, res) => {
  const { search, sort, page = 1, limit = 10 } = req.query;
  const query = search ? { name: new RegExp(search, "i") } : {};
  const options = {
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    skip: (page - 1) * limit,
    limit: parseInt(limit),
  };

  try {
    const products = await Product.find(query, null, options);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Product
router.post("/", authenticate, async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Product
router.put("/:id", authenticate, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Product
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
