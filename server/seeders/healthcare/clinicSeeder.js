const sequelize = require('../../config/db');
const { Schedule } = require('../../models/healthcare/Schedule');

const seedSchedules = async () => {
  try {
    // Sync the database without forcing to avoid data loss
    await sequelize.sync({ force: false });

    // Array to hold all schedules
    const schedules = [];

    // Loop through each doctor (1-24) and create schedules
    for (let doctorId = 1; doctorId <= 24; doctorId++) {
      // Generate 3-4 schedules for each doctor
      for (let i = 0; i < 3 + Math.floor(Math.random() * 2); i++) {
        const scheduleDate = new Date();
        scheduleDate.setDate(scheduleDate.getDate() + Math.floor(Math.random() * 30)); // Schedule within the next 30 days
        const scheduleTime = `${Math.floor(Math.random() * 12) + 8}:00:00`; // Random time between 8 AM to 8 PM
        const fees = (Math.random() * (100 - 50) + 50).toFixed(2); // Random fees between 50.00 to 100.00
        schedules.push({
          doctor_id: doctorId,
          schedule_date: scheduleDate.toISOString().split('T')[0], // Format date to YYYY-MM-DD
          schedule_time: scheduleTime,
          status: 'available',
          comment: `Available Slot ${i + 1}`,
          fees: parseFloat(fees),
        });
      }
    }

    // Bulk create schedule records
    await Schedule.bulkCreate(schedules, { ignoreDuplicates: true });

    console.log('Schedule seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Schedule seeding failed:', err);
    process.exit(1);
  }
};

// Execute the seeding function
seedSchedules();

module.exports = {
  seedSchedules
};
