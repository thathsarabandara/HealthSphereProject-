const sequelize = require('../config/db');
const { seedUsers } = require('./auth/userSeeders');
const { seedUserPasswords } = require('./auth/userPasswordsSeeder'); 
const { seedGroups } = require('./auth/groupSeeder'); 
const { seedPermissions } = require('./auth/permissionSeeder');
const { seedGroupPermissions } = require('./auth/groupPermissionSeeder'); 
const { seedUserGroups } = require('./auth/userGroupsSeeder'); 
const { seedSpecializations } = require('./healthcare/specializationSeeder'); 
const { seedDoctors } = require('./healthcare/doctorSeeder'); 
const { seedPatients } = require('./healthcare/patientSeeder'); 
const { seedSchedules } = require('./healthcare/scheduleSeeder'); 
const { seedCartItems } = require('./ecommerce/cartItemsSeeder'); 
const { seedPatientAllergies } = require('./healthcare/patientAllergySeeder'); 
const { seedPatientBloodSugar } = require('./healthcare/patientBloodSugarSeeder'); 
const { seedPatientBMI } = require('./healthcare/patientBMISeeder'); 
const { seedPatientCondition } = require('./healthcare/patientConditionSeeder'); 
const { seedPatientHeartRate } = require('./healthcare/patientHeartRateSeeder'); 
const { seedOffers } = require('./ecommerce/offerSeeder'); 

const seedDatabase = async () => {
    try {
        // Sync the database first (force: false so that it doesn't drop tables)
        await sequelize.sync({ force: false });
        console.log('Database synced successfully!');

        // Begin seeding
        // console.log('Seeding users...');
        // await seedUsers();
        // console.log('Users seeded successfully!');

        // console.log('Seeding user passwords...');
        // await seedUserPasswords();
        // console.log('User passwords seeded successfully!');

        // console.log('Seeding groups...');
        // await seedGroups();
        // console.log('Groups seeded successfully!');

        // console.log('Seeding permissions...');
        // await seedPermissions();
        // console.log('Permissions seeded successfully!');

        // console.log('Seeding group permissions...');
        // await seedGroupPermissions();
        // console.log('Group permissions seeded successfully!');

        // console.log('Seeding user groups...');
        // await seedUserGroups();
        // console.log('User groups seeded successfully!');

        // console.log('Seeding specializations...');
        // await seedSpecializations();
        // console.log('Specializations seeded successfully!');

        // console.log('Seeding doctors...');
        // await seedDoctors();
        // console.log('Doctors seeded successfully!');

        // console.log('Seeding patients...');
        // await seedPatients();
        // console.log('Patients seeded successfully!');

        // console.log('Seeding schedules...');
        // await seedSchedules();
        // console.log('Schedules seeded successfully!');

        // console.log('Seeding cart items...');
        // await seedCartItems();
        // console.log('Cart items seeded successfully!');

        // console.log('Seeding patient allergies...');
        // await seedPatientAllergies();
        // console.log('Patient allergies seeded successfully!');

        // console.log('Seeding patient blood sugar records...');
        // await seedPatientBloodSugar();
        // console.log('Patient blood sugar records seeded successfully!');

        // console.log('Seeding patient BMI records...');
        // await seedPatientBMI();
        // console.log('Patient BMI records seeded successfully!');

        // console.log('Seeding patient conditions...');
        // await seedPatientCondition();
        // console.log('Patient conditions seeded successfully!');

        // console.log('Seeding patient heart rate records...');
        // await seedPatientHeartRate();
        // console.log('Patient heart rate records seeded successfully!');

        // console.log('Seeding offers records...');
        // await seedOffers();
        // console.log('Offers records seeded successfully!');

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
       
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
