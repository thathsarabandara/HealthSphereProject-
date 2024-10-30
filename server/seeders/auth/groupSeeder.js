const { Group } = require('../../models/auth/Group'); // Adjust the path according to your structure

const groups = [
    { name: 'user', description: 'Users Only' },
    { name: 'doctor', description: 'Doctors Only' },
    { name: 'admin', description: 'Admins Only' },
    { name: 'developer', description: 'Developers with access to development tools and resources' },
    { name: 'super admin', description: 'Super Admins with full access to all resources and settings' },
    { name: 'owner', description: 'Owners with the highest level of control and management' },
];

const seedGroups = async () => {
    try {
        // Clear existing groups (optional)
        await Group.destroy({ where: {}, truncate: true });

        // Seed new groups
        await Group.bulkCreate(groups, { ignoreDuplicates: true });
        console.log('Groups seeded successfully!');
    } catch (error) {
        console.error('Error seeding groups:', error);
    }
};

module.exports = seedGroups;
