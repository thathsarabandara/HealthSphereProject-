const sequelize = require('./config/db'); // Adjust the path according to your structure
const seedUsers = require('./seeders/userSeeder'); // Adjust the path according to your structure

const seedDatabase = async () => {
    try {
        // Sync the database (this will drop existing tables and recreate them)
        await sequelize.sync({ force: true });

        // Call the user seeder
        await seedUsers();

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
