require('dotenv').config();
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

app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

module.exports = app;
