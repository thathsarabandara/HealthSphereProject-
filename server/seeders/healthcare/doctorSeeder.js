const sequelize = require('../../config/db');
const { Doctor } = require('../../models/healthcare/Doctor');

const seedDoctors = async () => {
  try {
    await sequelize.sync({ force: false });

    const doctors = [
      // General Practitioner
      { user_id: 6, first_name: 'John', last_name: 'Doe', date_of_birth: '1985-05-10', gender: 'Male', phone_number: '123-456-7890', address: '123 Main St, City', medical_license_number: 'A123456', specialization_id: 1, years_of_experience: 10, hospital: 'Hospital A', medical_school: 'Medical School A', npi_number: '9876543210', license_document: 'license_doc_1', certification_document: 'certification_1' },
      { user_id: 7, first_name: 'Jane', last_name: 'Smith', date_of_birth: '1990-02-15', gender: 'Female', phone_number: '987-654-3210', address: '456 Elm St, City', medical_license_number: 'A123457', specialization_id: 1, years_of_experience: 8, hospital: 'Hospital A', medical_school: 'Medical School B', npi_number: '1234567890', license_document: 'license_doc_2', certification_document: 'certification_2' },
      
      // Pediatrician
      { user_id: 8, first_name: 'Emily', last_name: 'Johnson', date_of_birth: '1980-03-25', gender: 'Female', phone_number: '555-123-4567', address: '789 Pine St, City', medical_license_number: 'A123458', specialization_id: 2, years_of_experience: 12, hospital: 'Hospital B', medical_school: 'Medical School C', npi_number: '2345678901', license_document: 'license_doc_3', certification_document: 'certification_3' },
      { user_id: 9, first_name: 'Michael', last_name: 'Brown', date_of_birth: '1982-07-19', gender: 'Male', phone_number: '555-765-4321', address: '321 Oak St, City', medical_license_number: 'A123459', specialization_id: 2, years_of_experience: 15, hospital: 'Hospital B', medical_school: 'Medical School D', npi_number: '3456789012', license_document: 'license_doc_4', certification_document: 'certification_4' },
      
      // Cardiologist
      { user_id: 10, first_name: 'Sarah', last_name: 'Davis', date_of_birth: '1988-04-10', gender: 'Female', phone_number: '555-234-5678', address: '654 Cedar St, City', medical_license_number: 'A123460', specialization_id: 3, years_of_experience: 6, hospital: 'Hospital C', medical_school: 'Medical School E', npi_number: '4567890123', license_document: 'license_doc_5', certification_document: 'certification_5' },
      { user_id: 11, first_name: 'David', last_name: 'Wilson', date_of_birth: '1995-09-12', gender: 'Male', phone_number: '555-888-9999', address: '258 Cedar St, City', medical_license_number: 'A123461', specialization_id: 3, years_of_experience: 4, hospital: 'Hospital C', medical_school: 'Medical School F', npi_number: '5678901234', license_document: 'license_doc_6', certification_document: 'certification_6' },
      
      // Dermatologist
      { user_id: 12, first_name: 'Jessica', last_name: 'Martinez', date_of_birth: '1992-12-01', gender: 'Female', phone_number: '555-999-0000', address: '369 Maple St, City', medical_license_number: 'A123462', specialization_id: 4, years_of_experience: 7, hospital: 'Hospital D', medical_school: 'Medical School G', npi_number: '6789012345', license_document: 'license_doc_7', certification_document: 'certification_7' },
      { user_id: 13, first_name: 'Daniel', last_name: 'Rodriguez', date_of_birth: '1989-01-15', gender: 'Male', phone_number: '555-000-1111', address: '741 Birch St, City', medical_license_number: 'A123463', specialization_id: 4, years_of_experience: 10, hospital: 'Hospital D', medical_school: 'Medical School H', npi_number: '7890123456', license_document: 'license_doc_8', certification_document: 'certification_8' },
      
      // Oncologist
      { user_id: 14, first_name: 'William', last_name: 'Garcia', date_of_birth: '1975-06-30', gender: 'Male', phone_number: '555-222-3333', address: '159 Oak St, City', medical_license_number: 'A123464', specialization_id: 5, years_of_experience: 20, hospital: 'Hospital E', medical_school: 'Medical School I', npi_number: '8901234567', license_document: 'license_doc_9', certification_document: 'certification_9' },
      { user_id: 15, first_name: 'Olivia', last_name: 'Lee', date_of_birth: '1991-11-20', gender: 'Female', phone_number: '555-444-5555', address: '753 Walnut St, City', medical_license_number: 'A123465', specialization_id: 5, years_of_experience: 5, hospital: 'Hospital E', medical_school: 'Medical School J', npi_number: '9012345678', license_document: 'license_doc_10', certification_document: 'certification_10' },
      
      // Psychiatrist
      { user_id: 16, first_name: 'James', last_name: 'White', date_of_birth: '1984-10-15', gender: 'Male', phone_number: '555-555-6666', address: '852 Poplar St, City', medical_license_number: 'A123466', specialization_id: 6, years_of_experience: 9, hospital: 'Hospital F', medical_school: 'Medical School K', npi_number: '123456789', license_document: 'license_doc_11', certification_document: 'certification_11' },
      { user_id: 17, first_name: 'Sophia', last_name: 'Harris', date_of_birth: '1993-02-20', gender: 'Female', phone_number: '555-666-7777', address: '963 Cherry St, City', medical_license_number: 'A123467', specialization_id: 6, years_of_experience: 3, hospital: 'Hospital F', medical_school: 'Medical School L', npi_number: '1234567890', license_document: 'license_doc_12', certification_document: 'certification_12' },
      
      // Endocrinologist
      { user_id: 18, first_name: 'Alexander', last_name: 'Clark', date_of_birth: '1981-08-12', gender: 'Male', phone_number: '555-777-8888', address: '159 Elm St, City', medical_license_number: 'A123468', specialization_id: 7, years_of_experience: 11, hospital: 'Hospital G', medical_school: 'Medical School M', npi_number: '2345678901', license_document: 'license_doc_13', certification_document: 'certification_13' },
      { user_id: 19, first_name: 'Mia', last_name: 'Lewis', date_of_birth: '1985-05-21', gender: 'Female', phone_number: '555-888-9999', address: '258 Maple St, City', medical_license_number: 'A123469', specialization_id: 7, years_of_experience: 6, hospital: 'Hospital G', medical_school: 'Medical School N', npi_number: '3456789012', license_document: 'license_doc_14', certification_document: 'certification_14' },
      
      // Gastroenterologist
      { user_id: 20, first_name: 'Benjamin', last_name: 'Young', date_of_birth: '1983-09-30', gender: 'Male', phone_number: '555-222-3333', address: '357 Cedar St, City', medical_license_number: 'A123470', specialization_id: 8, years_of_experience: 10, hospital: 'Hospital H', medical_school: 'Medical School O', npi_number: '4567890123', license_document: 'license_doc_15', certification_document: 'certification_15' },
      { user_id: 21, first_name: 'Grace', last_name: 'Hall', date_of_birth: '1990-04-17', gender: 'Female', phone_number: '555-333-4444', address: '468 Birch St, City', medical_license_number: 'A123471', specialization_id: 8, years_of_experience: 7, hospital: 'Hospital H', medical_school: 'Medical School P', npi_number: '5678901234', license_document: 'license_doc_16', certification_document: 'certification_16' },
      
      // Neurologist
      { user_id: 22, first_name: 'Noah', last_name: 'Allen', date_of_birth: '1986-01-11', gender: 'Male', phone_number: '555-444-5555', address: '579 Pine St, City', medical_license_number: 'A123472', specialization_id: 9, years_of_experience: 14, hospital: 'Hospital I', medical_school: 'Medical School Q', npi_number: '6789012345', license_document: 'license_doc_17', certification_document: 'certification_17' },
      { user_id: 23, first_name: 'Ella', last_name: 'Wright', date_of_birth: '1989-11-14', gender: 'Female', phone_number: '555-555-6666', address: '684 Maple St, City', medical_license_number: 'A123473', specialization_id: 9, years_of_experience: 6, hospital: 'Hospital I', medical_school: 'Medical School R', npi_number: '7890123456', license_document: 'license_doc_18', certification_document: 'certification_18' },
      
      // Surgeon
      { user_id: 24, first_name: 'Logan', last_name: 'King', date_of_birth: '1982-06-05', gender: 'Male', phone_number: '555-666-7777', address: '795 Walnut St, City', medical_license_number: 'A123474', specialization_id: 10, years_of_experience: 11, hospital: 'Hospital J', medical_school: 'Medical School S', npi_number: '8901234567', license_document: 'license_doc_19', certification_document: 'certification_19' },
      { user_id: 25, first_name: 'Ava', last_name: 'Scott', date_of_birth: '1994-12-30', gender: 'Female', phone_number: '555-777-8888', address: '123 Elm St, City', medical_license_number: 'A123475', specialization_id: 10, years_of_experience: 3, hospital: 'Hospital J', medical_school: 'Medical School T', npi_number: '9012345678', license_document: 'license_doc_20', certification_document: 'certification_20' }
    ];

    await Doctor.bulkCreate(doctors, { returning: true });
    console.log('Doctors seeded successfully!');
  } catch (error) {
    console.error('Error seeding doctors:', error);
  }
};

module.exports = {
  seedDoctors,
}