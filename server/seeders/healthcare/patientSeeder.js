const sequelize = require('../../config/db');
const { Patient } = require('../../models/healthcare/Patient');

const seedPatients = async () => {
  try {
    // Sync the database without forcing to avoid data loss
    await sequelize.sync({ force: false });

    // Bulk create patient records with corresponding User_id values
    await Patient.bulkCreate([
      { User_id: 1, first_name: 'John', last_name: 'Doe', date_of_birth: '1990-01-01', gender: 'male', phone_number: '123-456-7890', address: '123 Main St' },
      { User_id: 2, first_name: 'Jane', last_name: 'Doe', date_of_birth: '1992-02-02', gender: 'female', phone_number: '098-765-4321', address: '456 Elm St' },
      // Add more patient records as needed
    ], { ignoreDuplicates: true });

    console.log('Patient seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Patient seeding failed:', err);
    process.exit(1);
  }
};


module.exports = {
  seedPatients
};
