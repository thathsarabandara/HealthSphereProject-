const sequelize = require('../../config/db');
const { Patient } = require('../../models/auth/Patient');

const seedPatients = async () => {
  try {
    // Sync the database without forcing to avoid data loss
    await sequelize.sync({ force: false });

    // Bulk create patient records with corresponding User_id values
    await Patient.bulkCreate([
      { User_id: 1, first_name: 'John', last_name: 'Doe', date_of_birth: '1990-01-01', gender: 'male', phone_number: '123-456-7890', address: '123 Main St' },
      { User_id: 2, first_name: 'Jane', last_name: 'Doe', date_of_birth: '1992-02-02', gender: 'female', phone_number: '098-765-4321', address: '456 Elm St' },
      { User_id: 3, first_name: 'Alice', last_name: 'Smith', date_of_birth: '1985-05-05', gender: 'female', phone_number: '555-555-5555', address: '789 Oak St' },
      { User_id: 4, first_name: 'Bob', last_name: 'Jones', date_of_birth: '1988-08-08', gender: 'male', phone_number: '444-444-4444', address: '101 Pine St' },
      { User_id: 5, first_name: 'Charlie', last_name: 'Brown', date_of_birth: '1991-03-10', gender: 'male', phone_number: '111-222-3333', address: '202 Maple St' },
      { User_id: 6, first_name: 'Daisy', last_name: 'Johnson', date_of_birth: '1989-12-20', gender: 'female', phone_number: '222-333-4444', address: '303 Cedar St' },
      { User_id: 7, first_name: 'Edward', last_name: 'Williams', date_of_birth: '1980-06-15', gender: 'male', phone_number: '333-444-5555', address: '404 Birch St' },
      { User_id: 8, first_name: 'Fiona', last_name: 'Taylor', date_of_birth: '1995-09-09', gender: 'female', phone_number: '444-555-6666', address: '505 Walnut St' },
      { User_id: 9, first_name: 'George', last_name: 'Martinez', date_of_birth: '1993-07-25', gender: 'male', phone_number: '555-666-7777', address: '606 Cherry St' },
      { User_id: 10, first_name: 'Hannah', last_name: 'Garcia', date_of_birth: '1987-04-04', gender: 'female', phone_number: '666-777-8888', address: '707 Pine St' },
      // Add more patient records as needed
    ], { ignoreDuplicates: true });

    console.log('Patient seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Patient seeding failed:', err);
    process.exit(1);
  }
};

// Execute the seeding function
seedPatients();

module.exports = {
  seedPatients
};
