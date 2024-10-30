const sequelize = require('../../config/db');
const { Doctor } = require('../../models/auth/Doctor');
const { Specialization } = require('../../models/auth/Specialization'); // Ensure this path is correct

const seedDoctors = async () => {
  try {
    // Sync database (without forcing to avoid losing existing data)
    await sequelize.sync({ force: false });

    // Define the doctors' data
    const doctors = [
      // General Practitioner
      { user_id: 1, first_name: 'John', last_name: 'Doe', date_of_birth: '1985-05-15', gender: 'Male', phone_number: '123-456-7890', address: '123 Elm St', medical_license_number: 'GP123456', specialization_id: 1, years_of_experience: 10 },
      { user_id: 2, first_name: 'Jane', last_name: 'Doe', date_of_birth: '1988-06-20', gender: 'Female', phone_number: '123-456-7891', address: '456 Oak St', medical_license_number: 'GP123457', specialization_id: 1, years_of_experience: 8 },
      
      // Pediatrician
      { user_id: 3, first_name: 'Alice', last_name: 'Smith', date_of_birth: '1983-07-25', gender: 'Female', phone_number: '123-456-7892', address: '789 Pine St', medical_license_number: 'PED123458', specialization_id: 2, years_of_experience: 12 },
      { user_id: 4, first_name: 'Bob', last_name: 'Johnson', date_of_birth: '1986-04-30', gender: 'Male', phone_number: '123-456-7893', address: '321 Maple St', medical_license_number: 'PED123459', specialization_id: 2, years_of_experience: 6 },
      
      // Cardiologist
      { user_id: 5, first_name: 'Charlie', last_name: 'Brown', date_of_birth: '1979-03-12', gender: 'Male', phone_number: '123-456-7894', address: '654 Spruce St', medical_license_number: 'CAR123460', specialization_id: 3, years_of_experience: 15 },
      { user_id: 6, first_name: 'Diana', last_name: 'Prince', date_of_birth: '1982-02-28', gender: 'Female', phone_number: '123-456-7895', address: '987 Fir St', medical_license_number: 'CAR123461', specialization_id: 3, years_of_experience: 9 },
      
      // Dermatologist
      { user_id: 7, first_name: 'Edward', last_name: 'Elric', date_of_birth: '1985-11-10', gender: 'Male', phone_number: '123-456-7896', address: '159 Cedar St', medical_license_number: 'DER123462', specialization_id: 4, years_of_experience: 11 },
      { user_id: 8, first_name: 'Fiona', last_name: 'Glenanne', date_of_birth: '1990-12-05', gender: 'Female', phone_number: '123-456-7897', address: '753 Birch St', medical_license_number: 'DER123463', specialization_id: 4, years_of_experience: 7 },
      
      // Neurologist
      { user_id: 9, first_name: 'George', last_name: 'Clooney', date_of_birth: '1977-01-14', gender: 'Male', phone_number: '123-456-7898', address: '258 Willow St', medical_license_number: 'NEU123464', specialization_id: 5, years_of_experience: 14 },
      { user_id: 10, first_name: 'Hannah', last_name: 'Montana', date_of_birth: '1984-09-09', gender: 'Female', phone_number: '123-456-7899', address: '369 Larch St', medical_license_number: 'NEU123465', specialization_id: 5, years_of_experience: 10 },
      
      // Oncologist
      { user_id: 11, first_name: 'Irene', last_name: 'Adler', date_of_birth: '1975-08-01', gender: 'Female', phone_number: '123-456-7800', address: '147 Ash St', medical_license_number: 'ONC123466', specialization_id: 6, years_of_experience: 20 },
      { user_id: 12, first_name: 'Jack', last_name: 'Ryan', date_of_birth: '1982-10-18', gender: 'Male', phone_number: '123-456-7801', address: '258 Elm St', medical_license_number: 'ONC123467', specialization_id: 6, years_of_experience: 5 },
      
      // Psychiatrist
      { user_id: 13, first_name: 'Karen', last_name: 'Smith', date_of_birth: '1980-07-15', gender: 'Female', phone_number: '123-456-7802', address: '369 Oak St', medical_license_number: 'PSY123468', specialization_id: 7, years_of_experience: 13 },
      { user_id: 14, first_name: 'Liam', last_name: 'Neeson', date_of_birth: '1989-06-22', gender: 'Male', phone_number: '123-456-7803', address: '159 Pine St', medical_license_number: 'PSY123469', specialization_id: 7, years_of_experience: 7 },
      
      // Endocrinologist
      { user_id: 15, first_name: 'Mia', last_name: 'Thermopolis', date_of_birth: '1992-03-30', gender: 'Female', phone_number: '123-456-7804', address: '456 Cedar St', medical_license_number: 'END123470', specialization_id: 8, years_of_experience: 4 },
      { user_id: 16, first_name: 'Nathan', last_name: 'Drake', date_of_birth: '1985-02-17', gender: 'Male', phone_number: '123-456-7805', address: '789 Fir St', medical_license_number: 'END123471', specialization_id: 8, years_of_experience: 9 },
      
      // Gastroenterologist
      { user_id: 17, first_name: 'Olivia', last_name: 'Pope', date_of_birth: '1984-09-22', gender: 'Female', phone_number: '123-456-7806', address: '123 Maple St', medical_license_number: 'GAS123472', specialization_id: 9, years_of_experience: 8 },
      { user_id: 18, first_name: 'Paul', last_name: 'Atreides', date_of_birth: '1986-11-11', gender: 'Male', phone_number: '123-456-7807', address: '456 Birch St', medical_license_number: 'GAS123473', specialization_id: 9, years_of_experience: 5 },
      
      // Orthopedic Surgeon
      { user_id: 19, first_name: 'Quinn', last_name: 'Fabray', date_of_birth: '1981-12-09', gender: 'Female', phone_number: '123-456-7808', address: '789 Spruce St', medical_license_number: 'ORTH123474', specialization_id: 10, years_of_experience: 12 },
      { user_id: 20, first_name: 'Ryan', last_name: 'Gosling', date_of_birth: '1988-08-05', gender: 'Male', phone_number: '123-456-7809', address: '258 Cedar St', medical_license_number: 'ORTH123475', specialization_id: 10, years_of_experience: 9 },
      
      // Ophthalmologist
      { user_id: 21, first_name: 'Sophia', last_name: 'Loren', date_of_birth: '1983-04-20', gender: 'Female', phone_number: '123-456-7810', address: '654 Oak St', medical_license_number: 'OPH123476', specialization_id: 11, years_of_experience: 11 },
      { user_id: 22, first_name: 'Tom', last_name: 'Hanks', date_of_birth: '1985-05-15', gender: 'Male', phone_number: '123-456-7811', address: '789 Maple St', medical_license_number: 'OPH123477', specialization_id: 11, years_of_experience: 8 },
      
      // Pulmonologist
      { user_id: 23, first_name: 'Uma', last_name: 'Thurman', date_of_birth: '1990-07-31', gender: 'Female', phone_number: '123-456-7812', address: '321 Birch St', medical_license_number: 'PUL123478', specialization_id: 12, years_of_experience: 6 },
      { user_id: 24, first_name: 'Vin', last_name: 'Diesel', date_of_birth: '1982-08-18', gender: 'Male', phone_number: '123-456-7813', address: '654 Cedar St', medical_license_number: 'PUL123479', specialization_id: 12, years_of_experience: 10 },
    ];

    // Insert the doctors into the database
    await Doctor.bulkCreate(doctors, { ignoreDuplicates: true });

    console.log('Doctor seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Doctor seeding failed:', err);
    process.exit(1);
  }
};

// Execute the seeding function
seedDoctors();

module.exports = {
  seedDoctors
};
