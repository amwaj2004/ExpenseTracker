require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Category = require('./models/category');
const Expense = require('./models/expense');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expensetracker';

const categoryData = [
  { name: 'Food & Dining' },
  { name: 'Transportation' },
  { name: 'Housing' },
  { name: 'Entertainment' },
  { name: 'Healthcare' },
  { name: 'Shopping' },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Category.deleteMany({});
  await Expense.deleteMany({});
  console.log('Cleared existing data');

  const savedCategories = await Category.insertMany(categoryData);
  console.log(`Seeded ${savedCategories.length} categories`);

  const expenseData = [
    { description: 'Grocery shopping', amount: 85.50, date: new Date('2025-04-01'), category: savedCategories[0]._id },
    { description: 'Gas station fill-up', amount: 45.00, date: new Date('2025-04-02'), category: savedCategories[1]._id },
    { description: 'Monthly rent', amount: 1200.00, date: new Date('2025-04-01'), category: savedCategories[2]._id },
    { description: 'Netflix subscription', amount: 15.99, date: new Date('2025-04-05'), category: savedCategories[3]._id },
    { description: 'Doctor visit copay', amount: 50.00, date: new Date('2025-04-10'), category: savedCategories[4]._id },
    { description: 'Restaurant dinner', amount: 62.30, date: new Date('2025-04-12'), category: savedCategories[0]._id },
    { description: 'New running shoes', amount: 89.99, date: new Date('2025-04-15'), category: savedCategories[5]._id },
    { description: 'Uber ride', amount: 18.50, date: new Date('2025-04-18'), category: savedCategories[1]._id },
    { description: 'Electric bill', amount: 110.00, date: new Date('2025-04-20'), category: savedCategories[2]._id },
    { description: 'Movie tickets', amount: 32.00, date: new Date('2025-04-22'), category: savedCategories[3]._id },
  ];

  const savedExpenses = await Expense.insertMany(expenseData);
  console.log(`Seeded ${savedExpenses.length} expenses`);

  await mongoose.disconnect();
  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
