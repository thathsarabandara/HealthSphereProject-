const { Op } = require("sequelize");
const { Token } = require("../../models/auth/Token");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Patient } = require("../../models/healthcare/Patient");
const { User } = require("../../models/auth/User");
const { sendScheduleSubmissionEmail } = require('../../services/doctorEmailServices');

// Save a schedule
exports.saveSchedules = async (req, res) => {
  const { date, time, comment, fees } = req.body;

  try {
    
    // Fetch the doctor associated with the token
    const doctor = await Doctor.findOne({
      where: {
        user_id: req.userID,
      },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create a new schedule
    const newSchedule = await Schedule.create({
      doctor_id: doctor.id,
      schedule_date: date,
      schedule_time: time,
      status: 'pending',
      comment,
      fees,
    });

    // Get user email
    const user = await User.findByPk(req.userID);
    if (user) {
      await sendScheduleSubmissionEmail(user.email);
    }

    res.status(201).json({ message: 'Schedule requested successfully', schedule: newSchedule });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Error creating schedule', error });
  }
};

// Load schedules for the doctor
exports.loadSchedules = async (req, res) => {
    try {
      // Fetch the doctor associated with the token
      const doctor = await Doctor.findOne({
        where: {
          id: req.doctorID
        },
      });

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      // Fetch schedules for the doctor for today's date
      const schedules = await Schedule.findAll({
        where: {
          doctor_id: doctor.id,
          schedule_date: {
            [Op.gte]: new Date(), // Fetch schedules from today onwards
          },
        },
      });

      // Fetch reservations linked to these schedules
      const scheduleIds = schedules.map((schedule) => schedule.id);
      const reservations = await Reservation.findAll({
        where: {
          schedule_id: {
            [Op.in]: scheduleIds,
          },
        },
      });

      // Fetch the patients associated with the reservations
      const userIds = reservations.map((reservation) => reservation.patient_id);
      const patients = await Patient.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
      });

      // Create an object to group patients by reservation
      const patientMap = patients.reduce((map, patient) => {
        map[patient.id] = patient;
        return map;
      }, {});

      // Attach patients to reservations and create the structure we want to return
      const schedulesWithDetails = schedules.map((schedule) => {
        // Filter reservations for the current schedule
        const scheduleReservations = reservations.filter(
          (reservation) => reservation.schedule_id === schedule.id
        );
  
        // Get the number of reservations for this schedule
        const numberOfReservations = scheduleReservations.length;
  
        // Create a list of patients for the schedule
        const patientDetails = scheduleReservations.map((reservation) => {

          const patient = patientMap[reservation.patient_id];
          
          return {
            id: reservation.id,
            patient_id: patient.id,
            first_name: patient.first_name,
            last_name: patient.last_name,
            profile_picture: patient.profile_picture, // Assuming profile_picture is stored in the Patient model
          };
        });
  
        return {
          schedule_id: schedule.id,
          schedule_date: schedule.schedule_date,
          schedule_time: schedule.schedule_time,
          number_of_reservations: numberOfReservations,
          patients: patientDetails,
        };
      });
  
      res.json(schedulesWithDetails); // Return the modified schedule data with reservation and patient details
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ message: 'Error fetching schedules', error });
    }
  };