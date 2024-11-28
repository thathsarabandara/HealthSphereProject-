const sequelize = require('../../config/db'); // Make sure this is correct
const { Offer } = require('../../models/ecommerce/Offer'); // Correct path to your Offer model
  
  const seedOffers = async () => {
    try {
      // Sync database (without forcing to avoid losing existing data)
      await sequelize.sync({ force: false });
  
      // Define the offers' data
      const offers = [
        {
            title: 'Black Friday Sale',
            description: 'Get huge 50% discounts for bills above Rs. 2500',
            price: 2500.00,
            discount: 40,
            cupon_code: 22334455,
            start_date: new Date('2024-11-25'),
            end_date: new Date('2025-11-30'),
            status: 'active',
          },
          {
            title: 'Winter Collection',
            description: 'Explore the new winter Protections with up to 30% off!',
            price: 1500.00,
            discount: 30.00,
            cupon_code: 22334455,
            start_date: new Date('2024-12-01'),
            end_date: new Date('2025-12-15'),
            status: 'active',
          },
          { 
            title: 'Spring Health Campaign',
            description: 'Take care of your health this spring with our special deals!',
            price: 180.00,
            discount: 40.00,
            cupon_code: 22334455,
            start_date: new Date('2025-03-01'),
            end_date: new Date('2025-03-20'),
            status: 'active',
          },
      ];
  
      // Insert the offers into the database
      await Offer.bulkCreate(offers, { ignoreDuplicates: false });
  
      console.log('Offers seeding complete!');
    } catch (err) {
      console.error('Offers seeding failed:', err);
    }
  };
  
  module.exports = { seedOffers };
  