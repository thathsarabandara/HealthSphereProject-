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

// @desc    Get all dashboard data
// @route   GET /api/doctor/dashboard-data
// @access  Private (Doctor)
exports.getDashboardData = asyncHandler(async (req, res) => {
  const doctorId = req.doctorID;
  
  try {
    // Get today's reservations
    const reservations = await getTodayReservations(doctorId);
    
    // Dashboard stats
    const appointments = reservations.length; // Total appointments
    const consultations = reservations.filter(r => r.status === 'completed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    const income = reservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.fees || 0), 0);
    
    // Gender stats
    const completedReservations = reservations.filter(r => r.status === 'completed');
    const patientIds = completedReservations.map(r => r.patient_id);
    const patients = await Patient.findAll({
      where: {
        id: { $in: patientIds }
      },
      attributes: ['gender']
    });
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
    
    // Reviews
    const reviews = await Review.findAll({
      where: {
        doctor_id: doctorId
      },
      limit: 5 // Only get the latest 5 reviews
    });
    
    // Upcoming appointments (today's appointments)
    const upcomingAppointments = reservations.slice(0, 4); // Only get the first 4
    
    // Today's appointment patient list with name, id and status
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = reservations
      .filter(reservation => {
        const reservationDate = new Date(reservation.date).toISOString().split('T')[0];
        return reservationDate === today;
      })
    const patientList = await Patient.findAll({
      where: {
        id: { $in: todayAppointments.map(appointment => appointment.patient_id) }
      }
    });

    res.json({
      dashboardStats: {
        appointments,
        consultations,
        cancelled,
        income
      },
      genderStats: genderCounts,
      reviews,
      upcomingAppointments,
      patientList
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});