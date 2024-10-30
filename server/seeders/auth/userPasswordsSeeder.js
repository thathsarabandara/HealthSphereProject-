const { UserPassword } = require('../../models/auth/UserPassword'); // Adjust the path according to your structure
const { hashPassword } = require('../../utils/hashpassword'); // Adjust the path according to your structure

const userPasswords = [
    { user_id: 1, password: 'password123' }, // Adjust user IDs to match your User records
    { user_id: 2, password: 'mypassword' },
    { user_id: 3, password: 'securepassword' },
];

const seedUserPasswords = async () => {
    try {
        // Clear existing user passwords (optional)
        await UserPassword.destroy({ where: {}, truncate: true });

        for (const userPassword of userPasswords) {
            const hashedPassword = await hashPassword(userPassword.password); // Hash the password before saving
            await UserPassword.create({
                user_id: userPassword.user_id,
                password_hash: hashedPassword,
                isActive: true,
            });
        }
        
        console.log('User passwords seeded successfully!');
    } catch (error) {
        console.error('Error seeding user passwords:', error);
    }
};

module.exports = seedUserPasswords;
