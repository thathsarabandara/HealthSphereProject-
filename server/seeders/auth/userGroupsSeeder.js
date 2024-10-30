const sequelize = require('../../config/db');
const { UserGroup } = require('../../models/auth/UserGroup');

const seedUserGroups = async () => {
  try {
    // Sync the database (without forcing to avoid losing existing data)
    await sequelize.sync({ force: false });

    // Define user group associations
    const userGroups = [
      // Example associations (assuming group IDs are 1 for Doctors, 2 for Patients)
      { user_id: 1, group_id: 1 }, // john_doe -> Doctor
      { user_id: 2, group_id: 1 }, // jane_doe -> Doctor
      { user_id: 3, group_id: 1 }, // alice_smith -> Doctor
      { user_id: 4, group_id: 1 }, // bob_jones -> Doctor
      { user_id: 5, group_id: 1 }, // charlie_brown -> Doctor
      { user_id: 6, group_id: 1 }, // diana_prince -> Doctor
      { user_id: 7, group_id: 2 }, // edward_elric -> Patient
      { user_id: 8, group_id: 2 }, // fiona_glenanne -> Patient
      { user_id: 9, group_id: 2 }, // george_clooney -> Patient
      { user_id: 10, group_id: 2 }, // hannah_montana -> Patient
      { user_id: 11, group_id: 2 }, // irene_adler -> Patient
      { user_id: 12, group_id: 2 }, // jack_ryan -> Patient
      { user_id: 13, group_id: 2 }, // karen_smith -> Patient
      { user_id: 14, group_id: 2 }, // liam_neeson -> Patient
      { user_id: 15, group_id: 2 }, // mia_thermopolis -> Patient
      { user_id: 16, group_id: 2 }, // nathan_drake -> Patient
      { user_id: 17, group_id: 2 }, // olivia_pope -> Patient
      { user_id: 18, group_id: 2 }, // paul_atreides -> Patient
      { user_id: 19, group_id: 2 }, // quinn_fabray -> Patient
      { user_id: 20, group_id: 2 }, // ryan_gosling -> Patient
      { user_id: 21, group_id: 2 }, // sophia_loren -> Patient
      { user_id: 22, group_id: 2 }, // tom_hanks -> Patient
      { user_id: 23, group_id: 2 }, // uma_thurman -> Patient
      { user_id: 24, group_id: 2 }, // vin_diesel -> Patient
    ];

    // Insert user groups into the database
    await UserGroup.bulkCreate(userGroups, { ignoreDuplicates: true });

    console.log('UserGroup seeding complete!');
  } catch (err) {
    console.error('UserGroup seeding failed:', err);
  }
};

// Execute the seeding function
seedUserGroups();

module.exports = {
  seedUserGroups
};
