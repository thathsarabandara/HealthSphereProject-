const sequelize = require('../../config/db');
const { PatientBloodSugar } = require('../../models/healthcare/PatientBloodSugar');

const seedPatientBloodSugar = async () => {
  try {
    // Sync the database schema (ensures tables exist)
    await sequelize.sync({ force: false });

    const bloodSugarRecords = [
      // Blood sugar records for Patient 3 (patient_id: 3)
      {
        patient_id: 3,
        blood_sugar_level: 95.0,
        measurement_time: '2024-11-20T08:00:00',
        notes: 'Normal fasting blood sugar level.',
        status: 'active',
      },
      {
        patient_id: 3,
        blood_sugar_level: 145.0,
        measurement_time: '2024-11-20T12:00:00',
        notes: 'Post-meal blood sugar level high.',
        status: 'active',
      },
      {
        patient_id: 3,
        blood_sugar_level: 110.0,
        measurement_time: '2024-11-20T16:00:00',
        notes: 'Afternoon blood sugar level normal.',
        status: 'active',
      },
      {
        patient_id: 3,
        blood_sugar_level: 160.0,
        measurement_time: '2024-11-20T20:00:00',
        notes: 'Blood sugar elevated post-dinner.',
        status: 'active',
      },
      {
        patient_id: 3,
        blood_sugar_level: 105.0,
        measurement_time: '2024-11-21T08:00:00',
        notes: 'Normal fasting blood sugar level.',
        status: 'active',
      },
    ];

    // Insert blood sugar records into the database
    await PatientBloodSugar.bulkCreate(bloodSugarRecords, { returning: true });

    console.log('Patient blood sugar records seeded successfully!');
  } catch (error) {
    console.error('Error seeding patient blood sugar records:', error);
  }
};

module.exports = {
  seedPatientBloodSugar,
};
