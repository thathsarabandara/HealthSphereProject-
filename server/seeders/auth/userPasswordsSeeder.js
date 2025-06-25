const { UserPassword } = require('../../models/auth/UserPassword'); // Adjust the path according to your structure
const { hashPassword } = require('../../utils/hashpassword'); // Adjust the path according to your structure

const userPasswords = [
    { user_id: 1, password: 'johnydoe123' },
    { user_id: 2, password: 'janedoe456' },
    { user_id: 3, password: 'Admin2002@' },
    { user_id: 4, password: 'alicej101' },
    { user_id: 5, password: 'Developer2002@' },
    { user_id: 6, password: 'johndoe123' },
    { user_id: 7, password: 'janesmith123' },
    { user_id: 8, password: 'emilyjohnson123' },
    { user_id: 9, password: 'michaelbrown123' },
    { user_id: 10, password: 'sarahdavis123' },
    { user_id: 11, password: 'davidwilson123' },
    { user_id: 12, password: 'jessicamartinez123' },
    { user_id: 13, password: 'danielrodriguez123' },
    { user_id: 14, password: 'williambarcia123' },
    { user_id: 15, password: 'oliviale123' },
    { user_id: 16, password: 'jameswhite123' },
    { user_id: 17, password: 'sophiaclaris123' },
    { user_id: 18, password: 'alexanderclark123' },
    { user_id: 19, password: 'mialewis123' },
    { user_id: 20, password: 'benjaminyoung123' },
    { user_id: 21, password: 'gracehall123' },
    { user_id: 22, password: 'noahallen123' },
    { user_id: 23, password: 'ellawright123' },
    { user_id: 24, password: 'loganking123' },
    { user_id: 25, password: 'avascott123' },
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
                isActive: true, // Set isActive to true
            });
        }

        console.log('User passwords seeded successfully!');
    } catch (error) {
        console.error('Error seeding user passwords:', error);
    }
};

module.exports = {
    seedUserPasswords,
};
