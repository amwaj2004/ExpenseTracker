const Expense = require('../models/expense');

/* =========================
   READ ALL
========================= */
exports.getExpenses = async (req, res) => {
    const expenses = await Expense.find().populate('category');
    res.json(expenses);
};

/* =========================
   READ ONE
========================= */
exports.getExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id).populate('category');
    res.json(expense);
};

/* =========================
   CREATE
========================= */
exports.createExpense = async (req, res) => {
    const expense = new Expense({
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
        category: req.body.category
    });
    const saved = await expense.save();
    res.json(saved);
};

/* =========================
   UPDATE
========================= */
exports.updateExpense = async (req, res) => {
    const updated = await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
};

/* =========================
   DELETE
========================= */
exports.deleteExpense = async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};