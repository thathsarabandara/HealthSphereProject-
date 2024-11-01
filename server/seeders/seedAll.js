const sequelize = require('../config/db'); // Adjust the path according to your structure
// const { seedUsers } = require('./auth/userSeeders'); // Adjust the path according to your structure
// const { seedUserPasswords } = require('./auth/userPasswordsSeeder'); // Adjust the path according to your structure
// const { seedGroups } = require('./auth/groupSeeder'); // Adjust the path according to your structure
// const { seedPermissions } = require('./auth/permissionSeeder'); // Adjust the path according to your structure
// const { seedGroupPermissions } = require('./auth/groupPermissionSeeder'); // Adjust the path according to your structure
// const { seedUserGroups } = require('./auth/userGroupsSeeder'); // Adjust the path according to your structure
// const { seedSpecializations } = require('./healthcare/specializationSeeder'); // Adjust the path according to your structure
// const { seedDoctors } = require('./healthcare/doctorSeeder'); // Adjust the path according to your structure
// const { seedPatients } = require('./healthcare/patientSeeder'); // Adjust the path according to your structure
// const { seedSchedules } = require('./healthcare/scheduleSeeder'); // Adjust the path according to your structure

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: false });

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

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
