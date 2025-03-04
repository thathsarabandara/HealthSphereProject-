const { Op, where } = require("sequelize");
const { Token } = require("../../models/auth/Token");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Patient } = require("../../models/healthcare/Patient");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Prescription } = require("../../models/healthcare/Prescription");

exports.loadClinics = async (req, res) => {
    try {
      const doctor = await Doctor.findOne({where:{
        id: req.doctorID
      }})
      // Fetch schedules for the doctor for today's date
      const schedules = await Schedule.findAll({
        where: {
          doctor_id: doctor.id,
          schedule_date: {
            [Op.gte]: new Date(), // Fetch schedules from today onwards
          },
          status: 'available',
        },
      });

      // Fetch reservations linked to these schedules
      const scheduleIds = schedules.map((schedule) => schedule.id);
      const reservations = await Reservation.findAll({
        where: {
          schedule_id: {
            [Op.in]: scheduleIds,
          },
          status: 'available',
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
  
  exports.loadPastClinics = async (req, res) =>{
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
    
        // Fetch schedules for the doctor for today's date
        const schedules = await Schedule.findAll({
          where: {
            doctor_id: doctor.id,
            schedule_date: {
              [Op.gte]: new Date(), // Fetch schedules from today onwards
            },
            status: 'available',
          },
        });
  
        // Fetch reservations linked to these schedules
        const scheduleIds = schedules.map((schedule) => schedule.id);
        const reservations = await Reservation.findAll({
          where: {
            schedule_id: {
              [Op.in]: scheduleIds,
            },
            status: 'completed',
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

  exports.savePrescription = async (req, res) => {
    try {
      const { diseaseDetails, specialComments } = req.body;
      const { reservationid, patientid } = req.params;
  
      // Validate required inputs
      if (!diseaseDetails || !specialComments || !req.filePath) {
        return res.status(400).json({ error: 'Disease details, special comments, and a prescription file are required.' });
      }
  
      // Create a new prescription record
      const newPrescription = await Prescription.create({
        patient_id: patientid,
        reservation_id: reservationid,
        details: diseaseDetails,
        special_comments: specialComments,
        prescription_photo: req.filePath,
      });
  
      // Update reservation status
      const updatedReservation = await Reservation.update(
        { status: 'completed' },
        { where: { id: reservationid } }
      );
  
      if (!updatedReservation[0]) {
        return res.status(404).json({ error: 'Reservation not found or already completed.' });
      }
  
      res.status(201).json({
        message: 'Prescription saved successfully!',
        data: newPrescription,
      });
    } catch (error) {
      console.error('Error saving prescription:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.loadPrescription = async (req, res) => {
    const { reservationid, patientid } = req.params;
  
    try {
      // Retrieve the prescription based on the reservation ID and patient ID
      const prescription = await Prescription.findOne({
        where: {
          reservation_id: reservationid,
          patient_id: patientid,
        },
      });
  
      // If prescription doesn't exist, return an error
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
  
      // Retrieve the patient based on the patient ID
      const patient = await Patient.findOne({
        where: {
          id: patientid,
        },
      });
  
      // If patient doesn't exist, return an error
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      // Respond with the prescription details
      return res.status(200).json({
        patient_name: patient.first_name + ' ' + patient.last_name,
        date_issued: prescription.created_at,
        details: prescription.details,
        special_comments: prescription.special_comments,
        prescription_photo: prescription.prescription_photo,
      });
    } catch (error) {
      // Return a server error if there's an issue
      console.error('Error loading prescription:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  