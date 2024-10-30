const sequelize = require('../../config/db');
const { Specialization } = require('../../models/auth/Specialization');

const seedSpecializations = async () => {
  try {
    // Sync database (without forcing to avoid losing existing data)
    await sequelize.sync({ force: false });

    // Seed data into the specializations table
    await Specialization.bulkCreate([
      { name: "General Practitioner", description: "Provides comprehensive healthcare, including routine check-ups, preventive care, and treatment for a variety of illnesses and injuries across all ages." },
      { name: "Pediatrician", description: "Focuses on the physical, emotional, and social health of children from birth to adolescence, including preventive health care and the diagnosis and treatment of acute and chronic diseases." },
      { name: "Cardiologist", description: "Diagnoses and treats heart and cardiovascular conditions such as heart attacks, heart failure, hypertension, and arrhythmias, and provides preventive care to maintain heart health." },
      { name: "Dermatologist", description: "Specializes in the treatment of skin, hair, and nail conditions such as acne, eczema, psoriasis, skin infections, and skin cancer, as well as cosmetic issues like aging skin." },
      { name: "Neurologist", description: "Diagnoses and treats disorders of the nervous system, including the brain, spinal cord, nerves, and muscles, such as epilepsy, multiple sclerosis, migraines, and neurodegenerative diseases." },
      { name: "Oncologist", description: "Specializes in the diagnosis, treatment, and management of cancer using methods such as chemotherapy, radiation therapy, and surgery, and provides supportive care and symptom management." },
      { name: "Psychiatrist", description: "Diagnoses, treats, and helps prevent mental, emotional, and behavioral disorders, using a combination of medication, psychotherapy, and other treatments tailored to individual patient needs." },
      { name: "Endocrinologist", description: "Focuses on hormone-related diseases and disorders, including diabetes, thyroid diseases, metabolic disorders, osteoporosis, and reproductive health issues." },
      { name: "Gastroenterologist", description: "Diagnoses and treats disorders of the digestive system, including the stomach, intestines, liver, pancreas, and gallbladder, such as IBS, Crohn's disease, hepatitis, and ulcers." },
      { name: "Orthopedic Surgeon", description: "Specializes in the diagnosis, treatment, and surgical repair of conditions related to the musculoskeletal system, including bones, joints, ligaments, tendons, and muscles." },
      { name: "Ophthalmologist", description: "Provides medical and surgical care for eye conditions, including vision problems, cataracts, glaucoma, macular degeneration, and eye injuries." },
      { name: "Pulmonologist", description: "Diagnoses and treats diseases of the respiratory system, including chronic conditions like asthma, COPD, lung infections, and sleep-related breathing disorders." },
    ], { ignoreDuplicates: true });

    console.log('Specialization seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Specialization seeding failed:', err);
    process.exit(1);
  }
};

// Execute the seeding function
seedSpecializations();

module.exports = {
  seedSpecializations
};