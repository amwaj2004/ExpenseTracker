const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expense-controller');

router.get('/', ExpenseController.getExpenses);
router.get('/:id', ExpenseController.getExpense);
router.post('/', ExpenseController.createExpense);
router.put('/:id', ExpenseController.updateExpense);
router.delete('/:id', ExpenseController.deleteExpense);

module.exports = router;
