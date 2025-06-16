const staff = require('../../models/healthcare/Staff');
const User = require('../../models/auth/User');

// Get all sign-up requests
const getSignupRequests = async (req, res) => {
    try {
        const requests = await User.find({ 
            role: { $in: ['doctor', 'nurse', 'staff'] },
            status: 'pending' 
        }).select('-password');
        
        res.json({ 
            success: true, 
            count: requests.length,
            requests 
        });
    } catch (error) {
        console.error('Error fetching signup requests:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get staff counts by category
const getStaffCounts = async (req, res) => {
    try {
        const [doctors, nurses, staff] = await Promise.all([
            Staff.countDocuments({ role: 'doctor', status: 'active' }),
            Staff.countDocuments({ role: 'nurse', status: 'active' }),
            Staff.countDocuments({ role: 'staff', status: 'active' })
        ]);

        res.json({
            success: true,
            counts: {
                doctors,
                nurses,
                others: staff
            }
        });
    } catch (error) {
        console.error('Error fetching staff counts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all staff members
const getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find({ status: 'active' })
            .select('staffId name role department joinDate email phone')
            .sort({ joinDate: -1 });

        res.json({
            success: true,
            staff
        });
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update staff status (approve/reject)
const updateStaffStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.status = status;
        await user.save();

        // If approved, create staff record
        if (status === 'approved') {
            const staff = new Staff({
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                joinDate: new Date(),
                status: 'active'
            });
            await staff.save();
        }

        res.json({ 
            success: true, 
            message: `User ${status} successfully` 
        });
    } catch (error) {
        console.error('Error updating staff status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getSignupRequests,
    getStaffCounts,
    getAllStaff,
    updateStaffStatus
};
