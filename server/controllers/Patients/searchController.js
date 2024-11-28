const { findUserID, Token } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Specialization } = require("../../models/healthcare/Specialization");
const { Op } = require('sequelize');
const moment = require('moment'); 

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
                schedule_id: schedule.id,
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