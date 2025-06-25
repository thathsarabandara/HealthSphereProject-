const { Token } = require("../../models/auth/Token");
const { User } = require("../../models/auth/User");
const { Patient } = require("../../models/healthcare/Patient");
const { Op } = require('sequelize');
const { Schedule } = require("../../models/healthcare/Schedule");
const { Reservation } = require("../..//models/healthcare/Reservation");
const { Specialization } = require("../../models/healthcare/Specialization");
const { Doctor } = require("../../models/healthcare/Doctor");
const { sendReservationConfirmationEmail, sendReservationCancellationEmail } = require('../../services/emailServices');

exports.loadUserData = async (req, res) => {
    try {
        const user = await User.findOne({where:{
            id: req.userID
        }})
        const patient = await Patient.findOne({ where: {
            user_id: req.userID
        }})
        userdata = 
        {
            name: patient.first_name+' '+patient.last_name,
            address: patient.address,
            phone_number: patient.phone_number,
            email: user.email,
        }
        return res.status(200).json({ data: userdata });
    } catch (error) {
        console.error('Error loading user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.saveReservation = async (req, res) => {
    try {
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
            patient_id: req.patientID,
            reservation_name,
            reservation_address,
            reservation_phonenumber,
            reservation_email,
            reservation_date,
            reservation_time,
            status,
        });

        const reservation = newReservation.toJSON();
        
        // Get schedule details including doctor
        const scheduleDetails = await Schedule.findByPk(schedule_id, {
          include: [
            {
              model: Doctor,
              include: [User]
            }
          ]
        });
        
        if (scheduleDetails && scheduleDetails.Doctor && scheduleDetails.Doctor.User) {
          await sendReservationConfirmationEmail(reservation_email, {
            id: reservation.id,
            doctorName: scheduleDetails.Doctor.User.username,
            room: scheduleDetails.room_number,
            date: scheduleDetails.schedule_date,
            time: scheduleDetails.schedule_time,
            paymentStatus: 'pending'
          });
        }

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

const findReservationsByUserId = async (patientID) => {
    return await Reservation.findAll({
        where: { patient_id: patientID },
        attributes: ['id', 'status', 'schedule_id', 'reservation_date', 'reservation_time'], // Only fetch required fields
    });
};

exports.loadReservations = async (req, res) => {
    try {
        const reservations = await findReservationsByUserId(req.patientID);

        if (reservations.length === 0) {
            return res.status(404).json({ message: 'No reservations found' });
        }

        const scheduleIds = reservations.map((reservation) => reservation.schedule_id);

        const schedules = await findSchedulesByIds(scheduleIds);

        const doctorIds = schedules.map((schedule) => schedule.doctor_id);

        const doctors = await findDoctorsByIds(doctorIds);

        const specializationIds = [...new Set(doctors.map((doctor) => doctor.specialization_id))];

        const specializations = await Specialization.findAll({
            where: { id: specializationIds },
            attributes: ['id', 'name'],
        });

        const specializationMap = specializations.reduce((map, specialization) => {
            map[specialization.id] = specialization.name;
            return map;
        }, {});

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
    const { id } = req.params; 

    const isValidReservation = await Reservation.findOne({
      where: {
        user_id: req.userID,
        id: id,
        status: { [Op.ne]: 'canceled'} 
      }
    });

    if (!isValidReservation) {
      return res.status(404).json({ error: 'Reservation not found or already canceled.' });
    }

    // Get reservation email before updating
    const reservation = isValidReservation.toJSON();

    await Reservation.update(
      { status: 'canceled' },
      { where: { id: id } }
    );

    // Send cancellation email
    await sendReservationCancellationEmail(reservation.reservation_email, {
      id: reservation.id
    });

    return res.status(200).json({ message: 'Reservation canceled successfully.' });
  } catch (error) {
    console.error('Error canceling reservation:', error);
    return res.status(500).json({ error: 'An error occurred while canceling the reservation.' });
  }
};
