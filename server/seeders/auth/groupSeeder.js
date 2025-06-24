const { Group } = require('../../models/auth/Group'); // Adjust the path according to your structure

const groups = [
    { name: 'patients', description: 'Patients Only' },
    { name: 'doctor', description: 'Doctors Only' },
    { name: 'superadmin', description: 'Admins Only' },
    { name: 'admin', description: 'Admins Only' },
    { name: 'developer', description: 'Developers with access to development tools and resources' },
    { name: 'owner', description: 'Owners with the highest level of control and management' },
];

const seedGroups = async () => {
    try {
        // Seed new groups
        await Group.bulkCreate(groups, { ignoreDuplicates: true });
        console.log('Groups seeded successfully!');
    } catch (error) {
        console.error('Error seeding groups:', error);
    }
};

module.exports = {
    seedGroups,
};
