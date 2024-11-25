const sequelize = require('../../config/db');
const { PatientAllergy } = require('../../models/healthcare/PatientAllergy');

const seedPatientAllergies = async () => {
  try {
    // Sync the database schema (ensures tables exist)
    await sequelize.sync({ force: false });

    const allergies = [
      {
        patient_id: 3,
        allergy_name: 'Peanuts',
        allergy_type: 'food',
        severity: 'severe',
        status: 'active',
        description: 'Severe allergic reaction to peanuts',
      },
      {
        patient_id: 3,
        allergy_name: 'Penicillin',
        allergy_type: 'medication',
        severity: 'moderate',
        status: 'active',
        description: 'Mild allergic reaction to penicillin',
      },
      {
        patient_id: 3,
        allergy_name: 'Dust',
        allergy_type: 'environmental',
        severity: 'mild',
        status: 'active',
        description: 'Sneezing and watery eyes due to dust',
      },
      {
        patient_id: 3,
        allergy_name: 'Shellfish',
        allergy_type: 'food',
        severity: 'severe',
        status: 'active',
        description: 'Anaphylaxis risk from shellfish',
      },
      {
        patient_id: 3,
        allergy_name: 'Latex',
        allergy_type: 'other',
        severity: 'moderate',
        status: 'active',
        description: 'Allergic rash from latex gloves',
      },
    ];

    // Insert the allergies into the database
    await PatientAllergy.bulkCreate(allergies, { returning: true });

    console.log('Patient allergies seeded successfully!');
  } catch (error) {
    console.error('Error seeding patient allergies:', error);
  }
};

module.exports = {
  seedPatientAllergies,
};

