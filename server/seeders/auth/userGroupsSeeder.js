const sequelize = require('../../config/db');
const { UserGroup } = require('../../models/auth/UserGroup');

const seedUserGroups = async () => {
  try {
    // Sync the database (without forcing to avoid losing existing data)
    await sequelize.sync({ force: false });

    // Define user group associations
    const userGroups = [
      { user_id: 1, group_id: 1 }, // User ID 1 -> Group ID 1
      { user_id: 2, group_id: 1 }, // User ID 2 -> Group ID 1
      { user_id: 3, group_id: 3 }, // User ID 3 -> Group ID 3
      { user_id: 4, group_id: 4 }, // User ID 4 -> Group ID 4
      { user_id: 5, group_id: 5 }, // User ID 5 -> Group ID 5
      // User ID 6-25 all belong to Group ID 2
      { user_id: 6, group_id: 2 },
      { user_id: 7, group_id: 2 },
      { user_id: 8, group_id: 2 },
      { user_id: 9, group_id: 2 },
      { user_id: 10, group_id: 2 },
      { user_id: 11, group_id: 2 },
      { user_id: 12, group_id: 2 },
      { user_id: 13, group_id: 2 },
      { user_id: 14, group_id: 2 },
      { user_id: 15, group_id: 2 },
      { user_id: 16, group_id: 2 },
      { user_id: 17, group_id: 2 },
      { user_id: 18, group_id: 2 },
      { user_id: 19, group_id: 2 },
      { user_id: 20, group_id: 2 },
      { user_id: 21, group_id: 2 },
      { user_id: 22, group_id: 2 },
      { user_id: 23, group_id: 2 },
      { user_id: 24, group_id: 2 },
      { user_id: 25, group_id: 2 },
    ];

    // Insert user groups into the database
    await UserGroup.bulkCreate(userGroups, { ignoreDuplicates: true });

    console.log('UserGroup seeding complete!');
  } catch (err) {
    console.error('UserGroup seeding failed:', err);
  }
};

module.exports = {
  seedUserGroups
};
