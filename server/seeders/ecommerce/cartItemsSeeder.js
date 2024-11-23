const sequelize = require('../../config/db');
const { CartItem } = require('../../models/ecommerce/CartItem');

const seedCartItems = async () => {
  try {
    // Sync database (without forcing to avoid losing existing data)
    await sequelize.sync({ force: false });

    // Define the cart items' data
    const cartItems = [
      { id: 1, product_name: 'Essential Health Checkup', price: 2500.00 },
      { id: 2, product_name: 'Advanced Wellness Package', price: 3500.00 },
      { id: 3, product_name: 'Executive Health Package', price: 5000.00 },
      { id: 4, product_name: 'Basic Pediatric Checkup', price: 3000.00 },
      { id: 5, product_name: 'Comprehensive Child Package', price: 4500.00 },
      { id: 6, product_name: 'Child Wellness Package', price: 7000.00 },
      { id: 7, product_name: 'Couples Basic Health Check', price: 7000.00 },
      { id: 8, product_name: 'Couples Comprehensive Package', price: 9500.00 },
      { id: 9, product_name: 'Wellness and Fitness Package', price: 15500.00 },
      { id: 10, product_name: 'Complete Blood Count', price: 2500.00 },
      { id: 11, product_name: 'Kidney Function Tests', price: 2500.00 },
      { id: 12, product_name: 'Thyroid Function Tests', price: 2500.00 },
      { id: 13, product_name: 'Blood Glucose Levels', price: 2500.00 },
      { id: 14, product_name: 'Carcinoembryonic Antigen ', price: 2500.00 },
    ];

    // Insert the cart items into the database
    await CartItem.bulkCreate(cartItems, { ignoreDuplicates: false });

    console.log('Cart items seeding complete!');
  } catch (err) {
    console.error('Cart items seeding failed:', err);
  }
};

module.exports = {
  seedCartItems
};
