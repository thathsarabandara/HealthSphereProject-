const { findUserID, Token } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");

const { Offer } = require("../../models/ecommerce/Offer");
const { Doctor } = require("../../models/healthcare/Doctor");

exports.findUserByToken = async (token) => {
    try {
        if (!token) {
            throw { status: 401, message: 'User token not found' };
        }

        const isValidToken = await Token.findOne({
            where: {
              token,
            //   expires_at: {
            //     [Op.gt]: Date.now(), // Check if the token expiration time is greater than the current time
            //   },
            },
          });

        if (!isValidToken) {
            throw { status: 401, message: 'Token expired or not a valid token' };
        }

        const user = await findUserById(isValidToken.user_id);

        if (!user) {
            throw { status: 401, message: 'User not found' };
        }

        if (!user.isVerified) {
            throw { status: 401, message: 'User is not verified!' };
        }

        // Return user information if authentication and verification are successful
        return user;

    } catch (error) {
        // Pass error to the calling function
        throw error.status ? error : { status: 500, message: 'An internal error occurred' };
    }
};

exports.authHome = async (req, res) => {
    try {
        const token = req.cookies['doctoken'];

        const user = await this.findUserByToken(token);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const doctordata = await Doctor.findOne({
            where: { user_id: user.id }
        });

        if (!doctordata) {
            return res.status(404).json({ message: 'Patient data not found' });
        } 
        
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                name: user.username,
                email: user.email,
                id: doctordata.id,
                first_name: doctordata.first_name,
                last_name: doctordata.last_name,
                date_of_birth: doctordata.date_of_birth,
                gender: doctordata.gender,
                phone_number: doctordata.phone_number,
                address: doctordata.address,
            }
        });
        
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
