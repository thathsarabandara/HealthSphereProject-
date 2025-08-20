const sequelize = require('../../config/db');
const { User } = require('../../models/auth/User');

const seedUsers = async () => {
  try {
    // Sync database (without forcing to avoid losing existing data)
    await sequelize.sync({ force: false });

    // Define the users' data
    const users = [
      { id: 1, username: 'johnydoe', email: 'johnydoe@example.com', isVerified: true },
      { id: 2, username: 'janedoe', email: 'janedoe@example.com', isVerified: true },
      { id: 3, username: 'Admin', email: 'stromprojects47@gmail.com', isVerified: true },
      { id: 4, username: 'alicejohnson', email: 'alicej@example.com', isVerified: true },
      { id: 5, username: 'Developer', email: 'developer@gmail.com', isVerified: true },
      { id: 6, username: 'JohnDoe', email: 'johndoe@example.com', isVerified: true },
      { id: 7, username: 'JaneSmith', email: 'janesmith@example.com', isVerified: true },
      { id: 8, username: 'EmilyJohnson', email: 'emilyjohnson@example.com', isVerified: true },
      { id: 9, username: 'MichaelBrown', email: 'michaelbrown@example.com', isVerified: true },
      { id: 10, username: 'SarahDavis', email: 'sarahdavis@example.com', isVerified: true },
      { id: 11, username: 'DavidWilson', email: 'davidwilson@example.com', isVerified: true },
      { id: 12, username: 'JessicaMartinez', email: 'jessicamartinez@example.com', isVerified: true },
      { id: 13, username: 'DanielRodriguez', email: 'danielrodriguez@example.com', isVerified: true },
      { id: 14, username: 'WilliamGarcia', email: 'williambarcia@example.com', isVerified: true },
      { id: 15, username: 'OliviaLee', email: 'oliviale@example.com', isVerified: true },
      { id: 16, username: 'JamesWhite', email: 'jameswhite@example.com', isVerified: true },
      { id: 17, username: 'SophiaHarris', email: 'sophiaclaris@example.com', isVerified: true },
      { id: 18, username: 'AlexanderClark', email: 'alexanderclark@example.com', isVerified: true },
      { id: 19, username: 'MiaLewis', email: 'mialewis@example.com', isVerified: true },
      { id: 20, username: 'BenjaminYoung', email: 'benjaminyoung@example.com', isVerified: true },
      { id: 21, username: 'GraceHall', email: 'gracehall@example.com', isVerified: true },
      { id: 22, username: 'NoahAllen', email: 'noahallen@example.com', isVerified: true },
      { id: 23, username: 'EllaWright', email: 'ellawright@example.com', isVerified: true },
      { id: 24, username: 'LoganKing', email: 'loganking@example.com', isVerified: true },
      { id: 25, username: 'AvaScott', email: 'avascott@example.com', isVerified: true },
    ];

    // Insert the users into the database
    await User.bulkCreate(users, { ignoreDuplicates: true });

    console.log('User seeding complete!');
  } catch (err) {
    console.error('User seeding failed:', err);
  }
};

module.exports = {
  seedUsers
};
