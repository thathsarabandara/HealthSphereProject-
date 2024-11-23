const sequelize = require('../../config/db');
const { PatientBloodSugar } = require('../../models/healthcare/PatientBloodSugar');

const seedPatientBloodSugar = async () => {
  try {
    // Sync database (ensure it's up-to-date)
    await sequelize.sync({ force: false });

    const bloodSugarRecords = [
      // Blood sugar records for Patient 5 (patient_id: 5)
      { patient_id: 5, blood_sugar_level: 95.0, measurement_time: '2024-11-20T08:00:00', notes: 'Normal fasting blood sugar level.' },
      { patient_id: 5, blood_sugar_level: 145.0, measurement_time: '2024-11-20T12:00:00', notes: 'Post-meal blood sugar level high.' },
      { patient_id: 5, blood_sugar_level: 110.0, measurement_time: '2024-11-20T16:00:00', notes: 'Afternoon blood sugar level normal.' },
      { patient_id: 5, blood_sugar_level: 160.0, measurement_time: '2024-11-20T20:00:00', notes: 'Blood sugar elevated post-dinner.' },
      { patient_id: 5, blood_sugar_level: 105.0, measurement_time: '2024-11-21T08:00:00', notes: 'Normal fasting blood sugar level.' }
    ];

    // Insert blood sugar records for patient 5 into the database
    await PatientBloodSugar.bulkCreate(bloodSugarRecords, { returning: true });
    console.log('Patient blood sugar records for patient 5 seeded successfully!');
  } catch (error) {
    console.error('Error seeding patient blood sugar records for patient 5:', error);
  }
};

module.exports = {
  seedPatientBloodSugar,
};
