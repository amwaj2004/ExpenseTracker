const Category = require('../models/category');

/* =========================
   READ ALL
========================= */
exports.getCategories = async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
};

/* =========================
   READ ONE
========================= */
exports.getCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.json(category);
};

/* =========================
   CREATE
========================= */
exports.createCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name
    });
    const saved = await category.save();
    res.json(saved);
};

/* =========================
   UPDATE
========================= */
exports.updateCategory = async (req, res) => {
    const updated = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
};

/* =========================
   DELETE
========================= */
exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};