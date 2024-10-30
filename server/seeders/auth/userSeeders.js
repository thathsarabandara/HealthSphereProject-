const sequelize = require('../../config/db');
const { User } = require('../../models/auth/User');

const seedUsers = async () => {
  try {
    // Sync database (without forcing to avoid losing existing data)
    await sequelize.sync({ force: false });

    // Define the users' data
    const users = [
      // 1 to 24 Users for doctors
      { username: 'john_doe', email: 'john@example.com', isVerified: true },
      { username: 'jane_doe', email: 'jane@example.com', isVerified: true },
      { username: 'alice_smith', email: 'alice@example.com', isVerified: true },
      { username: 'bob_jones', email: 'bob@example.com', isVerified: true },
      { username: 'charlie_brown', email: 'charlie@example.com', isVerified: true },
      { username: 'diana_prince', email: 'diana@example.com', isVerified: true },
      { username: 'edward_elric', email: 'edward@example.com', isVerified: true },
      { username: 'fiona_glenanne', email: 'fiona@example.com', isVerified: true },
      { username: 'george_clooney', email: 'george@example.com', isVerified: true },
      { username: 'hannah_montana', email: 'hannah@example.com', isVerified: true },
      { username: 'irene_adler', email: 'irene@example.com', isVerified: true },
      { username: 'jack_ryan', email: 'jack@example.com', isVerified: true },
      { username: 'karen_smith', email: 'karen@example.com', isVerified: true },
      { username: 'liam_neeson', email: 'liam@example.com', isVerified: true },
      { username: 'mia_thermopolis', email: 'mia@example.com', isVerified: true },
      { username: 'nathan_drake', email: 'nathan@example.com', isVerified: true },
      { username: 'olivia_pope', email: 'olivia@example.com', isVerified: true },
      { username: 'paul_atreides', email: 'paul@example.com', isVerified: true },
      { username: 'quinn_fabray', email: 'quinn@example.com', isVerified: true },
      { username: 'ryan_gosling', email: 'ryan@example.com', isVerified: true },
      { username: 'sophia_loren', email: 'sophia@example.com', isVerified: true },
      { username: 'tom_hanks', email: 'tom@example.com', isVerified: true },
      { username: 'uma_thurman', email: 'uma@example.com', isVerified: true },
      { username: 'vin_diesel', email: 'vin@example.com', isVerified: true },
    ];

    // Insert the users into the database
    await User.bulkCreate(users, { ignoreDuplicates: true });

    console.log('User seeding complete!');
  } catch (err) {
    console.error('User seeding failed:', err);
  }
};

// Execute the seeding function
seedUsers();

module.exports = {
  seedUsers
};
