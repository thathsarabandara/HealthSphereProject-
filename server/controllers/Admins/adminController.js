const {User} = require('../../models/auth/User');
const { UserGroup } = require('../../models/auth/UserGroup');
const { UserPassword } = require('../../models/auth/UserPassword');
const {hashPassword} = require('../../utils/hashpassword');
// Check if a user is a superadmin (group id 3)
async function isSuperAdmin(userId) {
  const group = await UserGroup.findOne({ where: { user_id: userId } });
  return group && group.group_id === 3;
}

// Create a new admin (only by superadmin)
exports.createAdmin = async (req, res) => {
  try {
    // Check if the requester is a superadmin (group id 3)
    const isSuperadmin = await isSuperAdmin(req.userID);
    if (!isSuperadmin) {
      return res.status(403).json({ message: 'Only superadmins can create admins' });
    }

    const { username, email, password } = req.body; 

    // Create the user
    const newUser = await User.create({
      username,
      email,
      isVerified: true
    });

    const hashedPassword = await hashPassword(password);

    await UserPassword.create({
      user_id: newUser.id,
      password_hash: hashedPassword
    });

    // Assign the user to admin group (id 4)
    await UserGroup.create({
      user_id: newUser.id,
      group_id: 4
    })

    res.status(201).json({ message: 'Admin created successfully', user: { id: newUser.id, username, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating admin' });
  }
};

// Get all admins (users in group 4)
exports.getAdmins = async (req, res) => {
  try {
    const isSuperadmin = await isSuperAdmin(req.userID);
    if (!isSuperadmin) {
      return res.status(403).json({ message: 'Only superadmins can create admins' });
    }
    const adminIds = await UserGroup.findAll({ where: { group_id: 4 } });
    const userIds = adminIds.map(admin => admin.user_id);
    const admins = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "username", "email", "isVerified"]
    });
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
};

// Toggle admin block status (only by superadmin)
exports.toggleAdminBlock = async (req, res) => {
  try {
    // Check if the requester is a superadmin (group id 3)
    const isSuperadmin = await isSuperAdmin(req.userID);
    if (!isSuperadmin) {
      return res.status(403).json({ message: 'Only superadmins can create admins' });
    }

    const { id } = req.params;
    const admin = await User.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    admin.isVerified = !admin.isVerified;
    await admin.save();

    res.status(200).json({ 
      message: `Admin ${admin.isVerified ? 'unblocked' : 'blocked'} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error toggling admin block status' });
  }
};
