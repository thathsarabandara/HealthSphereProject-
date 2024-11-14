const { now } = require("sequelize/lib/utils");
const { findUserID, Token } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Specialization } = require("../../models/healthcare/Specialization");
const { Op } = require('sequelize'); // Ensure to import Op for query operators
const moment = require('moment'); // Import moment for date manipulation
const Sequelize = require('sequelize');
const { Patient } = require("../../models/healthcare/Patient");
const { CartItem } = require("../../models/ecommerce/CartItem");
const { Cart } = require("../../models/ecommerce/Cart");

// Utility function to find user by token
exports.findUserByToken = async (token) => {
    try {
        if (!token) {
            throw { status: 401, message: 'User token not found' };
        }

        const isValidToken = await findUserID(token);

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

// Route handler function
exports.authHome = async (req, res) => {
    try {
        const token = req.cookies['token'];

        const user = await this.findUserByToken(token);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const patientData = await Patient.findOne({
            where: { user_id: user.id }
        });

        if (!patientData) {
            return res.status(404).json({ message: 'Patient data not found' });
        }        
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                name: user.username,
                email: user.email,
                id: patientData.id,
                first_name: patientData.first_name,
                last_name: patientData.last_name,
                date_of_birth: patientData.date_of_birth,
                gender: patientData.gender,
                phone_number: patientData.phone_number,
                address: patientData.address,
                profile_picture: patientData.profile_picture, // Assuming profile_picture is available
            }
        });
        
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};


exports.profileLoad = async (req, res) => {
    try {
        const token = req.cookies['token'];

        const user = await this.findUserByToken(token);

        const patientData = await Patient.findOne({where:
            {user_id: user.id}
        })
        if(!patientData){
            return res.status(404).json({message: 'Patient Datat not found'})
        }
        // Return user information if authentication and verification are successful
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                name: user.username,
                id: patientData.id,
                email: user.email,
                first_name: patientData.first_name,
                last_name : patientData.last_name,
                date_of_birth : patientData.date_of_birth,
                gender : patientData.gender,
                phone_number : patientData.phone_number,
                address : patientData.address,
                profile_picture: patientData.first_name,
                registrationDate: patientData.created_at,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'An internal error occurred' });
    }
};

exports.saveProfile = async (req, res) => {
    const { id, first_name, last_name, date_of_birth, gender, phone_number, address, profile_picture } = req.body.profileData;

    try {
        // Find the patient by ID and update their details
        const [updatedRows] = await Patient.update(
            {
                first_name,
                last_name,
                date_of_birth,
                gender,
                phone_number,
                address,
                profile_picture
            },
            {
                where: { id } // Update where patient ID matches
            }
        );

        // Check if any rows were updated
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Patient not found or no changes made' });
        }

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'An internal error occurred' });
    }
};

exports.loadDoctors = async (req, res) => {
    try {
        // Step 1: Get the specialization from URL parameters
        const categoryName = req.params.specialization;
        
        // Step 2: Find the specialization in the database
        const specialization = await Specialization.findOne({ where: { name: categoryName } });
        
        if (!specialization) {
            return res.status(404).json({ message: 'Specialization not found' });
        }

        // Step 3: Find all doctors with the found specialization
        const doctors = await Doctor.findAll({ 
            where: { 
                specialization_id: specialization.id // Use the specialization ID
            }
        });

        if (!Array.isArray(doctors) || doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found for this specialization' });
        }

        // Step 4: Get today's date for filtering schedules
        const today = moment().toDate();

        // Step 5: Find all approved schedules for the doctors found
        const schedules = await Schedule.findAll({ 
            where: { 
                doctor_id: doctors.map(doctor => doctor.id), // Filter schedules by doctor IDs
                schedule_date: { [Op.gte]: today }, // Get schedules for today and future dates
                status: 'available' // Only approved schedules
            } 
        });

        // Step 6: Construct the response data according to the frontend expectations
        const response = doctors.map(doctor => {
            const doctorSchedules = schedules.filter(schedule => schedule.doctor_id === doctor.id); // Get schedules for each doctor

            return doctorSchedules.map(schedule => ({
                doctor_id: doctor.id,
                doctorname: doctor.first_name +' '+ doctor.last_name,
                date: schedule.schedule_date,
                time: schedule.schedule_time,
                consultationFee: parseInt(schedule.fees) + 500.00 // Adding hospital charges
            }));
        }).flat(); // Flatten the array to get a single array of doctor-schedule objects

        // Step 7: Remove doctors without schedules
        const filteredResponse = response.filter(doc => doc.date && doc.time); // Ensure there are schedules present

        // Step 8: Send the response
        res.status(200).json(filteredResponse);
    } catch (error) {
        console.error("Error loading doctors:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.searchDoctors = async (req, res) => {
    const { doctorName, specialization, sessionTime, sessionDate } = req.body.searchData;

    // Validate the search data
    if (!doctorName && !specialization && !sessionTime && !sessionDate) {
        return res.status(400).json({ message: 'At least one search criterion must be provided' });
    }

    try {
        // Prepare the doctor search filters
        let doctorFilters = {};

        if (doctorName) {
            doctorFilters[Op.or] = [
                { first_name: { [Op.like]: `%${doctorName}%` } },
                { last_name: { [Op.like]: `%${doctorName}%` } }
            ];
        }
        if (specialization) {
            doctorFilters.specialization_id = specialization;
        }

        // Find matching doctors
        const doctors = await Doctor.findAll({ where: doctorFilters });
        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found matching the criteria' });
        }

        // Extract doctor IDs for schedule search
        const doctorIds = doctors.map(doc => doc.id);
        console.log(doctorIds);

        // Prepare the schedule search filters
        let scheduleFilters = { doctor_id: { [Op.in]: doctorIds } };
        if (sessionTime) scheduleFilters.schedule_time = sessionTime;
        if (sessionDate) scheduleFilters.schedule_date = sessionDate;

        // Find matching schedules
        const schedules = await Schedule.findAll({ where: scheduleFilters });
        if (schedules.length === 0) {
            return res.status(404).json({ message: 'No schedules found matching the criteria' });
        }

        // Construct and send the response
        const response = schedules.map(schedule => {
            const doctor = doctors.find(doc => doc.id === schedule.doctor_id);
            if (!doctor) return null; // If doctor is not found, skip this entry

            return {
                doctor_id: doctor.id,
                doctorName: doctor.first_name + ' ' + doctor.last_name,
                date: schedule.schedule_date,
                time: schedule.schedule_time,
                consultationFee: parseFloat(schedule.fees) + 500.00 // Adding hospital charges
            };
        }); // Filter out any null entries

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while searching for doctors' });
    }
};

exports.addItems = async (req, res) => {
    try {
        const token = req.cookies['token'];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not found in cookies' });
        }

        const itemID = req.params.id;

        // Check if the item is already in the cart
        const cartRow = await Cart.findOne({ where: { cart_item_id: itemID } });
        if (cartRow) {
            return res.status(400).json({ message: 'Item is already added to the cart' });
        }

        // Find the user associated with the token
        const user = await Token.findOne({ where: { token: token } });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Find the item details from CartItem
        const item = await CartItem.findOne({ where: { id: itemID } });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Create a new cart entry
        const cartSuccess = await Cart.create({
            user_id: user.user_id,
            cart_item_id: itemID,
            unit_price: item.price,
            quantity: 1,
            total_price: item.price * 1,
            status: 'Pending',
        });

        return res.status(201).json({ message: 'Item added to the cart', cart: cartSuccess });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

exports.loadCart = async (req, res) => {
    try {
        const token = req.cookies['token'];

        // Validate token and retrieve user
        const userToken = await Token.findOne({ where: { token: token } });
        if (!userToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch all cart items for the user
        const userCartItems = await Cart.findAll({
            where: { user_id: userToken.user_id, status: 'pending' },
            attributes: ['id', 'cart_item_id', 'unit_price', 'quantity', 'total_price', 'status', 'created_at']
        });

        // Extract the cart_item_ids from the user's cart items
        const cartItemIds = userCartItems.map(item => item.cart_item_id);

        // Fetch product names from CartItem using the cart_item_ids
        const cartItemsDetails = await CartItem.findAll({
            where: { id: cartItemIds },
            attributes: ['id', 'product_name']
        });

        // Create a mapping of cart_item_id to product_name for easy lookup
        const productNamesMap = cartItemsDetails.reduce((map, item) => {
            map[item.id] = item.product_name;
            return map;
        }, {});

        // Format the response with associated product data
        const cartDetails = userCartItems.map(userCartItem => ({
            id: userCartItem.id,
            productName: productNamesMap[userCartItem.cart_item_id] || 'Unknown',  // Get product_name from map
            unitPrice: userCartItem.unit_price,
            quantity: userCartItem.quantity,
            totalPrice: userCartItem.total_price,
            status: userCartItem.status,
            createdAt: userCartItem.created_at,
        }));

        return res.status(200).json({ cart: cartDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      console.log(itemId);
      const token = req.cookies['token'];
  
      // Validate token and retrieve user
      const userToken = await Token.findOne({ where: { token } });
      if (!userToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Find the cart item for the user
      const cartItem = await CartItem.findOne({
        where: { id: itemId, user_id: userToken.user_id },
      });
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      // Update the status to 'deleted' instead of deleting the item
      cartItem.status = 'deleted';
      await cartItem.save();
  
      return res.status(200).json({ message: 'Cart item marked as deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  };
  

exports.loadPrescription =(req,res) =>{

}

exports.loadPayment= (req,res) => {

}

exports.loadCheckout = (req,res) =>{

}

exports.loadRefund = (req,res) =>{

}

