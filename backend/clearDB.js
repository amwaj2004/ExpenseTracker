require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Category = require('./models/category');
const Expense = require('./models/expense');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expensetracker';

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    await Expense.deleteMany({});
    console.log('Cleared existing data');

    await mongoose.disconnect();
    console.log('Seeding complete!');
}

seed().catch((err) => {
    console.error('Failed to clear database:', err);
    process.exit(1);
});
