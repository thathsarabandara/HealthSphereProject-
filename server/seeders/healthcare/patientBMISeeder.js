const sequelize = require('../../config/db');
const { PatientBMI } = require('../../models/healthcare/PatientBMI');

const seedPatientBMI = async () => {
  try {
    // Sync database (ensure it's up-to-date)
    await sequelize.sync({ force: false });

    const bmiRecords = [
      // BMI records for Patient 5 (patient_id: 5)
      { patient_id: 3, bmi_value: 22.5, height: 170, weight: 65, measurement_date: '2024-11-20T08:00:00', notes: 'Normal BMI, within healthy range.' },
      { patient_id: 3, bmi_value: 24.1, height: 170, weight: 68, measurement_date: '2024-11-20T12:00:00', notes: 'Slightly above normal BMI.' },
      { patient_id: 3, bmi_value: 23.8, height: 170, weight: 67, measurement_date: '2024-11-20T16:00:00', notes: 'Normal BMI, within healthy range.' },
      { patient_id: 3, bmi_value: 25.2, height: 170, weight: 70, measurement_date: '2024-11-20T20:00:00', notes: 'Overweight BMI, requires attention.' },
      { patient_id: 3, bmi_value: 22.9, height: 170, weight: 66, measurement_date: '2024-11-21T08:00:00', notes: 'Normal BMI, within healthy range.' }
    ];

    // Insert BMI records for patient 5 into the database
    await PatientBMI.bulkCreate(bmiRecords, { returning: true });
    console.log('Patient BMI records for patient 5 seeded successfully!');
  } catch (error) {
    console.error('Error seeding patient BMI records for patient 5:', error);
  }
};

module.exports = {
  seedPatientBMI,
};
