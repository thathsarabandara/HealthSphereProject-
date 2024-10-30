const sequelize = require('../../config/db');
const { Admin } = require('../../models/auth/Admin');

const seedAdmins = async () => {
  try {
    await sequelize.sync({ force: false });

    await Admin.bulkCreate([
      { user_id: 1, name: 'John Doe', description: 'Super Admin with full access' },
      { user_id: 2, name: 'Jane Smith', description: 'Admin with limited permissions' },
      { user_id: 3, name: 'Emma Johnson', description: 'Admin responsible for managing user accounts' },
    ]);

    console.log('Admin seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Admin seeding failed:', err);
    process.exit(1);
  }
};

seedAdmins();

module.exports = {
  seedAdmins
};
