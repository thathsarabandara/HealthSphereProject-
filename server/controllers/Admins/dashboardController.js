const { Schedule } = require('../../models/healthcare/Schedule');
const { Patient } = require('../../models/healthcare/Patient');
const { Doctor } = require('../../models/healthcare/Doctor');
const { Reservation } = require('../../models/healthcare/Reservation');

const getDashboardMetrics = async (req, res) => {
  try {
    // Get current date
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Total Patients
    const totalPatients = await Patient.count();

    // Active Doctors (doctors with status 'approved')
    const activeDoctors = await Doctor.count({ where: { status: 'approved' } });

    // Today's Appointments
    const totalSchedules = await Schedule.count({ where: { status: 'available' } });

    // Total Appointments
    const totalAppointments = await Reservation.count({ where: { status: 'completed' } });

    res.status(200).json({
      totalPatients,
      activeDoctors,
      totalSchedules,
      totalAppointments
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getTopSchedules = async (req, res) => {
  try {
    const topSchedules = await Schedule.findAll({
      where: {
        status: 'available'
      },
      order: [['schedule_date', 'DESC']],
      limit: 4
    });

    const doctors = await Promise.all(
      topSchedules.map(schedule =>
        Doctor.findOne({
          where: { id: schedule.doctor_id }
        })
      )
    );

    const listSchedules = topSchedules.map((schedule, index) => {
      const doctor = doctors[index];
      return {
        doctorName: doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Unknown Doctor',
        schedule_date: schedule.schedule_date,
        schedule_time: schedule.schedule_time,
        room_number: schedule.room_number,
        fees: schedule.fees
      };
    });
    res.status(200).json(listSchedules);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardMetrics,
  getTopSchedules
};
