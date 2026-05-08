require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const expenseRoutes = require('./routes/expense-routes');
const categoryRoutes = require('./routes/category-routes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expensetracker')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes first
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

// Serve Angular build files
const angularPath = path.join(__dirname, '../dist/ExpenseTracker/browser');

app.use(express.static(angularPath));

// Catch-all route for Angular routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(angularPath, 'index.html'));
});

module.exports = app;