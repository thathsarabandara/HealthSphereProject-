const { now } = require("sequelize/lib/utils");
const { findUserID } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Specialization } = require("../../models/healthcare/Specialization");
const { Op } = require('sequelize'); // Ensure to import Op for query operators
const moment = require('moment'); // Import moment for date manipulation
const Sequelize = require('sequelize');

exports.authHome = async (req, res) => {
    try {
        const token = req.cookies['token'];

        if (!token) {
            return res.status(401).json({ message: 'User token not found' });
        }

        const isValidToken = await findUserID(token);

        if (!isValidToken) {
            return res.status(401).json({ message: 'Token expired or not a valid token' });
        }

        const user = await findUserById(isValidToken.user_id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'User is not verified!' });
        }

        // Return user information if authentication and verification are successful
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                name: user.username,
            }
        });
    } catch (error) {
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
    const { doctorName, specialization, sessionTime, date } = req.body.searchData;

    // Validate the search data
    if (!doctorName && !specialization && !sessionTime && !date) {
        return res.status(400).json({ message: 'At least one search criterion must be provided' });
    }

    // Build the search query object
    let query = {};

    // If doctor name is provided, search by first_name and/or last_name
    if (doctorName) {
        const doctorsByName = await Doctor.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { first_name: { [Sequelize.Op.like]: `%${doctorName}%` } },
                    { last_name: { [Sequelize.Op.like]: `%${doctorName}%` } }
                ]
            }
        });
        if (doctorsByName.length > 0) {
            query.doctor_id = { [Sequelize.Op.in]: doctorsByName.map(doc => doc.doctor_id) };
        } else {
            return res.status(404).json({ message: 'Doctor not found' });
        }
    }

    // If specialization is provided, find doctors by specialization
    if (specialization) {
        const doctorsBySpecialization = await Doctor.findAll({
            where: { specialization_id: specialization }
        });
        if (doctorsBySpecialization.length > 0) {
            query.doctor_id = { [Sequelize.Op.in]: doctorsBySpecialization.map(doc => doc.doctor_id) };
        } else {
            return res.status(404).json({ message: 'No doctors found with the given specialization' });
        }
    }

    // If session time is provided, add it to the query
    if (sessionTime) {
        query.schedule_time = sessionTime; // Adjust if necessary to match your data format
    }

    // If date is provided, add it to the query
    if (date) {
        query.schedule_date = date; // Adjust format if necessary
    }

    try {
        // Query the database for schedules based on the query object with JOIN to Doctor table
        const schedules = await Schedule.findAll({
            where: query,
            include: [{
                model: Doctor,
                as: 'doctor', // Make sure this alias matches your model association
                attributes: ['first_name', 'last_name'] // Include first_name and last_name
            }]
        });

        // If no schedules are found, return a message
        if (schedules.length === 0) {
            return res.status(404).json({ message: 'No doctors found for the given search criteria' });
        }

        // Construct the response data according to the frontend expectations
        const response = schedules.map(schedule => {
            const doctor = schedule.doctor ? schedule.doctor.first_name + ' ' + schedule.doctor.last_name : 'Unknown Doctor';
            
            return {
                doctor_id: schedule.doctor_id,
                doctorname: doctor,
                date: schedule.schedule_date,
                time: schedule.schedule_time,
                consultationFee: parseFloat(schedule.fees) + 500.00 // Adding hospital charges
            };
        });

        // Filter out schedules without valid doctor data
        const filteredResponse = response.filter(doc => doc.date && doc.time); // Ensure there are schedules present

        // Send the response
        res.status(200).json(filteredResponse);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while searching for doctors' });
    }
};
