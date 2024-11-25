const { Token } = require("../../models/auth/Token");
const { User } = require("../../models/auth/User");
const { Patient } = require("../../models/healthcare/Patient");

exports.loadUserData = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies['token'];

        if (!token) {
            return res.status(401).json({ message: 'Authentication token not found' });
        }

        // Verify the token exists in the database
        const isVerified = await Token.findOne({ where: { token } });

        if (!isVerified) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Extract user ID from the token (assumes the token maps to a user)
        const userId = isVerified.user_id; // Adjust based on your token schema

        // Fetch user data
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const patient = await Patient.findOne({ where: {
            user_id: user.id
        }})
        userdata = 
        {
            name: patient.first_name+' '+patient.last_name,
            address: patient.address,
            phone_number: patient.phone_number,
            email: user.email,
        }
        // Respond with user data
        return res.status(200).json({ data: userdata });
    } catch (error) {
        console.error('Error loading user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.saveReservation = (req,res) =>{
    const{name, address, phone_number, email} = req. body;
    const id = req.params.id;
    console.log(name);
    console.log(address);
    console.log(email);
    console.log(id);

    return res.status(200).json({message: name});
}
