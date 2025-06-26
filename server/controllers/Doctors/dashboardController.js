const {Schedule} = require('../../models/healthcare/Schedule');
const {Reservation} = require('../../models/healthcare/Reservation');
const {Patient} = require('../../models/healthcare/Patient');
const {Review} = require('../../models/content/Review');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

// Helper function to get today's reservations for a doctor
const getTotalReservations = async (doctorId) => {
  // Find today's approved schedules for this doctor
  const schedules = await Schedule.findAll({
    where: {
      doctor_id: doctorId,
      status: 'available'|| 'completed'
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
    const reservations = await getTotalReservations(doctorId);
    // Dashboard stats
    const appointments = reservations.length; // Total appointments
    const consultations = reservations.filter(r => r.status === 'completed').length;
    const cancelledSchedules = await Schedule.findAll({
      where: {
        doctor_id: doctorId,
        status: 'cancelled' || 'rejected'
      }
    });
    const cancelled = cancelledSchedules.length || 0;
    const incomeReservations = reservations.filter(r => r.status === 'completed');

    const completedScheduleIds = incomeReservations.map(r => r.schedule_id);

    const completedSchedules = await Schedule.findAll({
      where: { id: { [Op.in]: completedScheduleIds } }
    });
    
    const income = completedSchedules.map(schedule => schedule.fees).reduce((a, b) => a + b, 0);
    // Gender stats
    const completedReservations = reservations.filter(r => r.status === 'completed');
    const patientIds = completedReservations.map(r => r.patient_id);
    const patients = await Promise.all(
      patientIds.map(id => Patient.findOne({ where: { id } }))
    );
    console.log(patients);
    const genderCounts = {
      male: 0,
      female: 0,
    };
    patients.forEach(patient => {
      if (patient.gender === 'Male') genderCounts.male++;
      else if (patient.gender === 'Female') genderCounts.female++;
    });
    console.log(genderCounts)
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
        if (!reservation.date) return false;
        
        try {
          const dateObj = new Date(reservation.date);
          if (isNaN(dateObj)) return false;
          
          const reservationDate = dateObj.toISOString().split('T')[0];
          return reservationDate === today;
        } catch (error) {
          console.error(`Invalid date format for reservation ${reservation.id}: ${reservation.date}`);
          return false;
        }
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