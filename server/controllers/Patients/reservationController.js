const { Token } = require("../../models/auth/Token");
const { User } = require("../../models/auth/User");
const { Patient } = require("../../models/healthcare/Patient");
const { Op } = require('sequelize');
const { Schedule } = require("../../models/healthcare/Schedule");
const { Reservation } = require("../..//models/healthcare/Reservation");
const { Specialization } = require("../../models/healthcare/Specialization");
const { Doctor } = require("../../models/healthcare/Doctor");

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

exports.saveReservation = async (req, res) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies['token'];

        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        // Find token in the database
        const tokenRecord = await Token.findOne({
            where: {
                token,
                expires_at: {
                    [Op.gt]: new Date(), // Check if token is still valid
                },
            },
        });

        if (!tokenRecord) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const user_id = tokenRecord.user_id;

        // Extract data from request body
        const {
            name: reservation_name,
            address: reservation_address,
            phone_number: reservation_phonenumber,
            email: reservation_email,
        } = req.body;

        const schedule_id = req.params.id;

        // Automatically set current date and time for reservation
        const reservation_date = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const reservation_time = new Date().toISOString().split('T')[1].split('.')[0]; // Format as HH:MM:SS
        const status = 'pending';

        // Validate required fields
        if (
            !reservation_name ||
            !reservation_address ||
            !reservation_phonenumber ||
            !reservation_email ||
            !status
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the schedule exists
        const schedule = await Schedule.findByPk(schedule_id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Create a new reservation
        const newReservation = await Reservation.create({
            schedule_id,
            user_id,
            payment_id: null, // Assuming payment is not yet linked
            reservation_name,
            reservation_address,
            reservation_phonenumber,
            reservation_email,
            reservation_date,
            reservation_time,
            status,
        });

        // Send success response
        res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const findDoctorsByIds = async (doctorIds) => {
    return await Doctor.findAll({
        where: { id: doctorIds },
        attributes: ['id', 'first_name', 'last_name', 'medical_license_number', 'bio', 'specialization_id'], // Only fetch required fields
    });
};

const findSpecializationByID = async (specializationID) => {
    return await Specialization.findAll({
        where: { id: specializationID },
        attributes: ['name'], // Only fetch required fields
    });
};
const findSchedulesByIds = async (scheduleIds) => {
    return await Schedule.findAll({
        where: { id: scheduleIds },
        attributes: ['id', 'schedule_date', 'schedule_time', 'doctor_id', 'fees'], // Only fetch required fields
    });
};

const findReservationsByUserId = async (userId) => {
    return await Reservation.findAll({
        where: { user_id: userId },
        attributes: ['id', 'status', 'schedule_id', 'reservation_date', 'reservation_time'], // Only fetch required fields
    });
};

exports.loadReservations = async (req, res) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies['token'];

        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        // Find the token in the database
        const tokenRecord = await Token.findOne({
            where: {
                token,
                expires_at: {
                    [Op.gt]: new Date(), // Check if token is still valid
                },
            },
        });

        if (!tokenRecord) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const userId = tokenRecord.user_id;

        // Fetch reservations
        const reservations = await findReservationsByUserId(userId);

        if (reservations.length === 0) {
            return res.status(404).json({ message: 'No reservations found' });
        }

        // Extract schedule IDs
        const scheduleIds = reservations.map((reservation) => reservation.schedule_id);

        // Fetch schedules
        const schedules = await findSchedulesByIds(scheduleIds);

        // Extract doctor IDs
        const doctorIds = schedules.map((schedule) => schedule.doctor_id);

        // Fetch doctors
        const doctors = await findDoctorsByIds(doctorIds);

        // Extract specialization IDs
        const specializationIds = [...new Set(doctors.map((doctor) => doctor.specialization_id))];

        // Fetch specializations
        const specializations = await Specialization.findAll({
            where: { id: specializationIds },
            attributes: ['id', 'name'],
        });

        // Map specializations for easy lookup
        const specializationMap = specializations.reduce((map, specialization) => {
            map[specialization.id] = specialization.name;
            return map;
        }, {});

        // Merge data manually
        const formattedReservations = reservations.map((reservation) => {
            const schedule = schedules.find((sch) => sch.id === reservation.schedule_id);
            const doctor = doctors.find((doc) => doc.id === schedule?.doctor_id);

            return {
                reservation_id: reservation.id,
                reservation_status: reservation.status,
                schedule_date: schedule?.schedule_date || 'N/A',
                schedule_time: schedule?.schedule_time || 'N/A',
                amount: parseFloat(schedule?.fees) + 500 || 'N/A',
                doctor_details: doctor
                    ? {
                          id: doctor.id,
                          name: doctor.first_name + ' ' + doctor.last_name,
                          description: doctor.bio,
                          specialization: specializationMap[doctor.specialization_id] || 'N/A',
                      }
                    : 'N/A',
            };
        });

        res.status(200).json({
            message: 'Reservations loaded successfully',
            reservations: formattedReservations,
        });
    } catch (error) {
        console.error('Error loading reservations:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params; // Extract reservation ID from params
    const token = req.cookies['token']; // Extract the token from cookies

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized access. Token is missing.' });
    }

    // Find the user associated with the token
    const tokenRecord = await Token.findOne({
      where: { token }
    });

    if (!tokenRecord) {
      return res.status(401).json({ error: 'Unauthorized access. Invalid token.' });
    }

    // Validate that the reservation belongs to the user
    const isValidReservation = await Reservation.findOne({
      where: {
        user_id: tokenRecord.user_id,
        id: id,
        status: { [Op.ne]: 'canceled'} // Ensure it's not already canceled
      }
    });

    if (!isValidReservation) {
      return res.status(404).json({ error: 'Reservation not found or already canceled.' });
    }

    // Update the reservation status to 'canceled'
    await Reservation.update(
      { status: 'canceled' },
      { where: { id: id } }
    );

    return res.status(200).json({ message: 'Reservation canceled successfully.' });
  } catch (error) {
    console.error('Error canceling reservation:', error);
    return res.status(500).json({ error: 'An error occurred while canceling the reservation.' });
  }
};
