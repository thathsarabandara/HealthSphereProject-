const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { Doctor } = require('../../models/healthcare/Doctor');
const { Schedule } = require('../../models/healthcare/Schedule'); // Assuming Schedule is defined as in your code

const seedSchedules = async () => {
    try {
        await sequelize.sync({ force: false });

        // Get the current date and add two weeks
        const currentDate = new Date();
        const twoWeeksFromNow = new Date(currentDate);
        twoWeeksFromNow.setDate(currentDate.getDate() + 14); // Add 14 days

        // Generate reservations for each doctor
        const doctors = await Doctor.findAll();

        const schedules = [];
        doctors.forEach(doctor => {
            for (let i = 0; i < 2; i++) { // Create two reservations
                const scheduleDate = new Date(twoWeeksFromNow); // Use two weeks from now
                scheduleDate.setDate(scheduleDate.getDate() + i); // Adjust date for second reservation

                schedules.push({
                    doctor_id: doctor.id,
                    schedule_date: scheduleDate.toISOString().split('T')[0], // Format to YYYY-MM-DD
                    schedule_time: '10:00:00', // Example time
                    status: 'available', // Set initial status
                    comment: `Reservation for ${doctor.first_name} ${doctor.last_name}`,
                    fees: 50.00, // Example fee
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
        });

        await Schedule.bulkCreate(schedules, { returning: true });
        console.log('Schedules seeded successfully!');
    } catch (error) {
        console.error('Error seeding schedules:', error);
    }
};

module.exports = {
    seedSchedules,
}
