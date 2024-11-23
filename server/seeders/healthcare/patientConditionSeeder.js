const sequelize = require('../../config/db');
const { PatientCondition } = require('../../models/healthcare/PatientCondition');

const seedPatientCondition = async () => {
  try {
    // Sync database (ensure it's up-to-date)
    await sequelize.sync({ force: false });

    const conditions = [
      // Conditions for patient 5 (patient_id: 5)
      { patient_id: 5, condition_name: 'Hypertension', severity: 'moderate', diagnosis_date: '2024-06-15T08:00:00', notes: 'Patient diagnosed with moderate hypertension.' },
      { patient_id: 5, condition_name: 'Type 2 Diabetes', severity: 'severe', diagnosis_date: '2024-07-10T09:00:00', notes: 'Patient has severe Type 2 Diabetes, requires regular monitoring.' },
      { patient_id: 5, condition_name: 'Asthma', severity: 'mild', diagnosis_date: '2024-08-01T10:00:00', notes: 'Patient experiences mild asthma symptoms, controlled with medication.' },
      { patient_id: 5, condition_name: 'Chronic Back Pain', severity: 'moderate', diagnosis_date: '2024-09-05T14:00:00', notes: 'Patient reports chronic back pain, requires physical therapy.' },
      { patient_id: 5, condition_name: 'Depression', severity: 'severe', diagnosis_date: '2024-10-25T16:00:00', notes: 'Patient diagnosed with severe depression, therapy and medication recommended.' }
    ];

    // Insert condition records for patient 5 into the database
    await PatientCondition.bulkCreate(conditions, { returning: true });
    console.log('Patient conditions for patient 5 seeded successfully!');
  } catch (error) {
    console.error('Error seeding patient conditions for patient 5:', error);
  }
};

module.exports = {
  seedPatientCondition,
};
