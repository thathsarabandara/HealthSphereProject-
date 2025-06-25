const {Schedule} = require('../../models/healthcare/Schedule');
const {Reservation} = require('../../models/healthcare/Reservation');
const {Patient} = require('../../models/healthcare/Patient');
const {Review} = require('../../models/content/Review');
const asyncHandler = require('express-async-handler');

// Helper function to get today's reservations for a doctor
const getTodayReservations = async (doctorId) => {
  // Get today's date at start and end
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  // Find today's approved schedules for this doctor
  const schedules = await Schedule.findAll({
    where: {
      doctor_id: doctorId,
      schedule_date: { $gte: todayStart, $lte: todayEnd },
      status: 'approved'
    }
  });
  const scheduleIds = schedules.map(s => s.id);
  
  // Get reservations for these schedules
  const reservations = await Reservation.findAll({
    where: {
      schedule_id: scheduleIds
    }
  });
  
  return reservations;
};

// @desc    Get dashboard statistics
// @route   GET /api/doctor/dashboard
// @access  Private (Doctor)
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const doctorId = req.doctorID;
  
  try {
    const reservations = await getTodayReservations(doctorId);
    
    // Calculate counts
    const appointments = reservations.length; // Total appointments
    
    const consultations = reservations.filter(
      r => r.status === 'completed'
    ).length;
    
    const cancelled = reservations.filter(
      r => r.status === 'cancelled'
    ).length;
    
    // Calculate total income from completed appointments
    const income = reservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.fees || 0), 0);
    
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

exports.getGenderStats = asyncHandler(async (req, res) => {
  const doctorId = req.doctorID;
  
  try {
    const reservations = await getTodayReservations(doctorId);
    
    // Filter completed reservations
    const completedReservations = reservations.filter(r => r.status === 'completed');
    
    // Extract patient IDs
    const patientIds = completedReservations.map(r => r.patient_id);
    
    // Get patients' genders
    const patients = await Patient.findAll({
      where: {
        id: { $in: patientIds }
      },
      attributes: ['gender']
    });
    
    // Count genders
    const genderCounts = {
      male: 0,
      female: 0,
      other: 0
    };
    
    patients.forEach(patient => {
      if (patient.gender === 'male') genderCounts.male++;
      else if (patient.gender === 'female') genderCounts.female++;
      else genderCounts.other++;
    });
    
    res.json(genderCounts);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

exports.getReviews = asyncHandler(async (req, res) => {
  const doctorId = req.doctorID;
  
  try {
    const reviews = await Review.findAll({
      where: {
        doctor_id: doctorId
      }
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

exports.getUpcomingAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.doctorID;
  
  try {
    const reservations = await getTodayReservations(doctorId);
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
  