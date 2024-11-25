const sequelize = require('../../config/db');
const { PatientCondition } = require('../../models/healthcare/PatientCondition');

const seedPatientCondition = async () => {
  try {
    // Sync the database schema (ensures tables exist)
    await sequelize.sync({ force: false });

    const conditions = [
      // Conditions for patient 3 (patient_id: 3)
      {
        patient_id: 3,
        condition_name: 'Hypertension',
        severity: 'moderate',
        diagnosis_date: '2024-06-15T08:00:00',
        notes: 'Patient diagnosed with moderate hypertension.',
        status: 'active',
      },
      {
        patient_id: 3,
        condition_name: 'Type 2 Diabetes',
        severity: 'severe',
        diagnosis_date: '2024-07-10T09:00:00',
        notes: 'Patient has severe Type 2 Diabetes, requires regular monitoring.',
        status: 'active',
      },
      {
        patient_id: 3,
        condition_name: 'Asthma',
        severity: 'mild',
        diagnosis_date: '2024-08-01T10:00:00',
        notes: 'Patient experiences mild asthma symptoms, controlled with medication.',
        status: 'active',
      },
      {
        patient_id: 3,
        condition_name: 'Chronic Back Pain',
        severity: 'moderate',
        diagnosis_date: '2024-09-05T14:00:00',
        notes: 'Patient reports chronic back pain, requires physical therapy.',
        status: 'active',
      },
      {
        patient_id: 3,
        condition_name: 'Depression',
        severity: 'severe',
        diagnosis_date: '2024-10-25T16:00:00',
        notes: 'Patient diagnosed with severe depression, therapy and medication recommended.',
        status: 'active',
      },
    ];

    // Insert condition records into the database
    await PatientCondition.bulkCreate(conditions, { returning: true });

    console.log('Patient conditions seeded successfully!');
  } catch (error) {
    console.error('Error seeding patient conditions:', error);
  }
};

module.exports = {
  seedPatientCondition,
};
