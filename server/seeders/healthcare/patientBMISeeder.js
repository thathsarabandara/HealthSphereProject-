const sequelize = require('../../config/db');
const { PatientBMI } = require('../../models/healthcare/PatientBMI');

const seedPatientBMI = async () => {
  try {
    // Sync the database schema (ensures tables exist)
    await sequelize.sync({ force: false });

    const bmiRecords = [
      // BMI records for Patient 3 (patient_id: 3)
      {
        patient_id: 3,
        bmi_value: 22.5,
        height: 170,
        weight: 65,
        measurement_date: '2024-11-20T08:00:00',
        notes: 'Normal BMI, within healthy range.',
        status: 'active',
      },
      {
        patient_id: 3,
        bmi_value: 24.1,
        height: 170,
        weight: 68,
        measurement_date: '2024-11-20T12:00:00',
        notes: 'Slightly above normal BMI.',
        status: 'active',
      },
      {
        patient_id: 3,
        bmi_value: 23.8,
        height: 170,
        weight: 67,
        measurement_date: '2024-11-20T16:00:00',
        notes: 'Normal BMI, within healthy range.',
        status: 'active',
      },
      {
        patient_id: 3,
        bmi_value: 25.2,
        height: 170,
        weight: 70,
        measurement_date: '2024-11-20T20:00:00',
        notes: 'Overweight BMI, requires attention.',
        status: 'active',
      },
      {
        patient_id: 3,
        bmi_value: 22.9,
        height: 170,
        weight: 66,
        measurement_date: '2024-11-21T08:00:00',
        notes: 'Normal BMI, within healthy range.',
        status: 'active',
      },
    ];

    // Insert BMI records into the database
    await PatientBMI.bulkCreate(bmiRecords, { returning: true });

    console.log('Patient BMI records seeded successfully!');
  } catch (error) {
    console.error('Error seeding patient BMI records:', error);
  }
};

module.exports = {
  seedPatientBMI,
};
