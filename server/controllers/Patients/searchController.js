const { Doctor } = require("../../models/healthcare/Doctor");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Specialization } = require("../../models/healthcare/Specialization");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Op } = require('sequelize');
const moment = require('moment'); 

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
        
        const response = doctors.map(doctor => {
            const doctorSchedules = schedules.filter(schedule => schedule.doctor_id === doctor.id);
            
            doctorSchedules.forEach(schedule => {
                const reservations = Reservation.findAll({ where: { schedule_id: schedule.id , status: 'available'}});
                const bookedSeats = reservations.length;
                schedule.bookedSeats = bookedSeats;
            });
            
            return doctorSchedules.map(schedule => ({
                doctor_id: doctor.id,
                schedule_id: schedule.id,
                doctorname: doctor.first_name +' '+ doctor.last_name,
                specialization: specialization.name,
                date: schedule.schedule_date,
                time: schedule.schedule_time,
                seats: schedule.seats,
                bookedSeats: schedule.bookedSeats,
                consultationFee: parseInt(schedule.fees) + 500.00
            }));
        }).flat();

        const filteredResponse = response.filter(doc => doc.date && doc.time);

        res.status(200).json(filteredResponse);
    } catch (error) {
        console.error("Error loading doctors:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.searchDoctors = async (req, res) => {
    const { doctorName, specialization, sessionTime, sessionDate } = req.body;

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

        // Prepare the schedule search filters
        let scheduleFilters = { doctor_id: { [Op.in]: doctorIds } };
        if (sessionTime) scheduleFilters.schedule_time = sessionTime;
        if (sessionDate) scheduleFilters.schedule_date = sessionDate;

        // Find matching schedules
        const schedules = await Schedule.findAll({ where: scheduleFilters });
        if (schedules.length === 0) {
            return res.status(404).json({ message: 'No schedules found matching the criteria' });
        }

        // Get the specialization names for the doctors
        const specializationIds = [...new Set(doctors.map(doc => doc.specialization_id))];
        const specializations = await Specialization.findAll({
            where: { id: specializationIds }
        });
        const specializationMap = {};
        specializations.forEach(spec => {
            specializationMap[spec.id] = spec.name;
        });

        // Construct and send the response
        const response = await Promise.all(schedules.map(async (schedule) => {
            const doctor = doctors.find(doc => doc.id === schedule.doctor_id);
            if (!doctor) return null;

            try {
                const reservations = await Reservation.findAll({ 
                    where: { 
                        schedule_id: schedule.id,
                        status: 'available' 
                    } 
                });
                const bookedSeats = reservations.length;

                return {
                    schedule_id: schedule.id,
                    doctor_id: doctor.id,
                doctorName: doctor.first_name + ' ' + doctor.last_name,
                    specialization: specializationMap[doctor.specialization_id],
                    date: schedule.schedule_date,
                    time: schedule.schedule_time,
                    seats: schedule.seats,
                    bookedSeats: bookedSeats,
                    consultationFee: (parseFloat(schedule.fees) || 0) + 500.00
                };
            } catch (error) {
                console.error('Error fetching reservations:', error);
                return null;
            }
        }));

        // Filter out any null entries
        const filteredResponse = response.filter(Boolean);

        res.status(200).json(filteredResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while searching for doctors' });
    }
};