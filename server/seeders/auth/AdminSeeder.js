const sequelize = require("../../config/db");
const { Admin } = require("../../models/auth/Admin");

const seedAdmins = async () => {
  try {
    await sequelize.sync({ force: false });

    await Admin.bulkCreate([{ User_id: 3, description: "super" }]);

    console.log("Admin seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Admin seeding failed:", err);
    process.exit(1);
  }
};

module.exports = {
  seedAdmins,
};
