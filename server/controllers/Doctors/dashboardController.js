const {Schedule} = require('../../models/healthcare/Schedule');
const {Reservation} = require('../../models/healthcare/Reservation');
const asyncHandler = require('express-async-handler');

// @desc    Get dashboard statistics
// @route   GET /api/doctor/dashboard
// @access  Private (Doctor)
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const doctorId = req.doctorID; // Assuming doctor id is in req.doctor from auth middleware
  console.log(doctorId);
  // Get today's date at start and end
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  console.log(todayStart);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  console.log(todayEnd);
  
  try {
    // Step 1: Find today's approved schedules for this doctor
    const schedules = await Schedule.findAll({
      where: {
        doctor_id: doctorId,
        schedule_date: { $gte: todayStart, $lte: todayEnd },
        status: 'approved'
      }
    });
    console.log(schedules);
    const scheduleIds = schedules.map(s => s.id);
    console.log(scheduleIds);
    
    // Step 2: Get reservations for these schedules
    const reservations = await Reservation.findAll({
      where: {
        schedule_id: scheduleIds,
        status: 'completed'
      }
    });
    console.log(reservations);
    // Step 3: Calculate counts
    const appointments = reservations.length; // Total appointments
    console.log(appointments);
    const consultations = reservations.filter(
      r => r.status === 'completed'
    ).length;
      console.log(consultations);
    const cancelled = reservations.filter(
      r => r.status === 'cancelled'
    ).length;
    console.log(cancelled);
    
    // Step 4: Calculate total income from completed appointments
    const income = reservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.fee || 0), 0);
    console.log(income);  
    res.json({
      appointments,
      consultations,
      cancelled,
      income
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
