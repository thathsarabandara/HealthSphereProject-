const sequelize = require('../../config/db');
const { PatientHeartRate } = require('../../models/healthcare/PatientHeartRate');

const seedPatientHeartRate = async () => {
  try {
    // Sync the database (ensure it's up-to-date)
    await sequelize.sync({ force: false });

    const heartRates = [
      // Heart rate records for patient 5 (patient_id: 5)
      { patient_id: 5, heart_rate: 72, measurement_time: '2024-06-01T08:00:00', notes: 'Heart rate measured during morning routine.' },
      { patient_id: 5, heart_rate: 85, measurement_time: '2024-06-10T10:00:00', notes: 'Heart rate increased after light exercise.' },
      { patient_id: 5, heart_rate: 78, measurement_time: '2024-07-01T09:00:00', notes: 'Normal resting heart rate.' },
      { patient_id: 5, heart_rate: 90, measurement_time: '2024-07-20T11:00:00', notes: 'Heart rate elevated due to stress.' },
      { patient_id: 5, heart_rate: 80, measurement_time: '2024-08-05T07:30:00', notes: 'Heart rate measured after waking up.' }
    ];

    // Insert heart rate records for patient 5 into the database
    await PatientHeartRate.bulkCreate(heartRates, { returning: true });
    console.log('Patient heart rate records for patient 5 seeded successfully!');
  } catch (error) {
    console.error('Error seeding patient heart rate records for patient 5:', error);
  }
};

module.exports = {
  seedPatientHeartRate,
};
