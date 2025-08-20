const { Schedule } = require('../../models/healthcare/Schedule');
const { Reservation } = require('../../models/healthcare/Reservation');
const { Patient } = require('../../models/healthcare/Patient');
const { Review } = require('../../models/content/Review');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

// Helper function to get reservations for a doctor's active schedules
const getTotalReservations = async (doctorId) => {
  const schedules = await Schedule.findAll({
    where: {
      doctor_id: doctorId,
      status: { [Op.in]: ['available', 'completed'] }
    }
  });

  const scheduleIds = schedules.map(s => s.id);

  return await Reservation.findAll({
    where: {
      schedule_id: { [Op.in]: scheduleIds }
    }
  });
};

// @desc    Get all dashboard data
// @route   GET /api/doctor/dashboard-data
// @access  Private (Doctor)
exports.getDashboardData = asyncHandler(async (req, res) => {
  const doctorId = req.doctorID;

  try {
    // Reservations
    const reservations = await getTotalReservations(doctorId);
    const appointments = reservations.length;
    const consultations = reservations.filter(r => r.status === 'completed').length;

    // Cancelled Schedules
    const cancelledSchedules = await Schedule.findAll({
      where: {
        doctor_id: doctorId,
        status: { [Op.in]: ['cancelled', 'rejected'] }
      }
    });
    const cancelled = cancelledSchedules.length;

    // Income Calculation
    const completedReservations = reservations.filter(r => r.status === 'completed');
    const completedScheduleIds = completedReservations.map(r => r.schedule_id);

    const completedSchedules = await Schedule.findAll({
      where: { id: { [Op.in]: completedScheduleIds } }
    });

    const income = completedSchedules.reduce((sum, schedule) => sum + Number(schedule.fees), 0);

    // Gender Stats
    const patientIds = completedReservations.map(r => r.patient_id);
    const patients = await Promise.all(
      patientIds.map(id => Patient.findOne({ where: { id } }))
    );

    const genderCounts = { male: 0, female: 0 };
    patients.forEach(patient => {
      if (patient?.gender === 'Male') genderCounts.male++;
      else if (patient?.gender === 'Female') genderCounts.female++;
    });

    // Reviews
    const reviewList = await Review.findAll({
      where: { doctor_id: doctorId },
      limit: 5,
      order: [['created_at', 'DESC']]
    });

    const reviews = await Promise.all(
      reviewList.map(async review => {
        const user = await Patient.findOne({
          where: { id: review.patient_id },
          attributes: ['id', 'first_name', 'last_name', 'profilePictureLocation'],
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

    // Upcoming Schedules
    const now = new Date();
    const upcomingSchedules = await Schedule.findAll({
      where: {
        doctor_id: doctorId,
        status: 'available',
        schedule_date: { [Op.gte]: now }
      },
      order: [['schedule_date', 'ASC']]
    });

    const upcomingSchedule = upcomingSchedules[0] || null;

    // Upcoming Reservations (if any)
    let reservationList = [];
    if (upcomingSchedule) {
      reservationList = await Reservation.findAll({
        where: { schedule_id: upcomingSchedule.id }
      });
    }

    // Patient List for upcoming appointment
    const patientsList = await Promise.all(
      reservationList.map(async (reservation) => {
        const patient = await Patient.findOne({
          where: { id: reservation.patient_id },
          attributes: ['id', 'first_name', 'last_name', 'profilePictureLocation'],
        });
        return {
          id: patient.id,
          first_name: patient.first_name,
          last_name: patient.last_name,
          profilePictureLocation: patient.profilePictureLocation,
        };
      })
    );

    // Format upcoming schedules for display
    const formattedUpcomingSchedules = upcomingSchedules.map(schedule => ({
      schedule_date: schedule.schedule_date,
      schedule_time: schedule.schedule_time,
      room_number: schedule.room_number,
      fees: schedule.fees
    }));

    // Send Response
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
