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
    console.log(patientIds)
    const patients = await Promise.all(
      patientIds.map(id => Patient.findOne({ where: { id } }))
    );
    console.log(patients)
    const genderCounts = {
      male: 0,
      female: 0,
    };
    patients.forEach(patient => {
      if (patient.gender === 'Male') genderCounts.male++;
      else if (patient.gender === 'Female') genderCounts.female++;
    });

    // Reviews
    const reviewList = await Review.findAll({
      where: {
        doctor_id: doctorId
      },
      limit: 5 // Only get the latest 5 reviews
    });

    const reviews = await Promise.all(
      reviewList.map(async (review) => {
        const user = await Patient.findOne({
          where: { id: review.patient_id },
          attributes: ['id','first_name', 'last_name', 'profilePictureLocation'],
        });

        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at,
          userid: user?.id || null,
          patientName: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
          patientProfilePicture: user?.profilePictureLocation || null,
        };
      })
    );
    
    // Today's appointment patient list with name, id and status
    const now = new Date();
    const upcomingSchedules = await Schedule.findAll({
      where: {
        doctor_id: doctorId,
        status: 'available',
        schedule_date: { $gte: now }
      },
      order: [['schedule_date', 'ASC']]
    });
    
    const reservationList = await Reservation.findAll({
      where: {
        schedule_id: upcomingSchedules[0].id
      }
    })

    const patientsList = await Promise.all(
      reservationList.map(async (reservation) => {
        const patient = await Patient.findOne({
          where: { id: reservation.patient_id },
          attributes: ['id','first_name', 'last_name', 'profilePictureLocation'],
        });
        return {
          id: patient.id,
          first_name: patient.first_name,
          last_name: patient.last_name,
          profilePictureLocation: patient.profilePictureLocation,
        };
      })
    )
    // Map to only include required fields
    const formattedUpcomingSchedules = upcomingSchedules.map(schedule => ({
      schedule_date: schedule.schedule_date,
      schedule_time: schedule.schedule_time,
      room_number: schedule.room_number,
      fees: schedule.fees
    }));    
    
    res.json({
      dashboardStats: {
        appointments,
        consultations,
        cancelled,
        income
      },
      genderStats: genderCounts,
      reviews,
      upcomingSchedules: formattedUpcomingSchedules,
      patientList: patientsList
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});