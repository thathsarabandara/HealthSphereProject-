const { Op, fn, col } = require('sequelize');
const { Payment } = require('../../models/transactions/Payment');
const { Refund } = require('../../models/transactions/Refund');
const { Schedule } = require('../../models/healthcare/Schedule');
const { ScheduleCancel } = require('../../models/healthcare/ScheduleCancel');
const { Doctor } = require('../../models/healthcare/Doctor');
const { Staff } = require('../../models/healthcare/Staff');

exports.generateMonthlyReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Total Revenue
    const totalRevenue = (await Payment.sum('amount', {
    where: {
    payment_date: { [Op.between]: [startDate, endDate] },
    payment_status: 'Completed',
    },
    })) * 0.2;


    // // Total Refunds
    const refundResult = await Refund.findOne({
      attributes: [[fn('SUM', col('Payment.amount')), 'totalRefunds']],
      include: [
        {
          model: Payment,
          attributes: [],
          required: true,
        },
      ],
      where: {
        created_at: { [Op.between]: [startDate, endDate] },
        refund_status: 'Approved',
      },
      raw: true,
    });

    const totalRefunds = parseFloat(refundResult?.totalRefunds || 0);

    // // Number of Patient Appointments
    const appointments = await Schedule.count({
      where: {
        schedule_date: { [Op.between]: [startDate, endDate] },
        status: 'available',
      },
    });

    // // Number of Canceled Appointments
    const canceledAppointments = await ScheduleCancel.count({
      where: {
        created_at: { [Op.between]: [startDate, endDate] },
        status: 'canceled',
      },
    });

    // // Number of Doctors Worked
    const doctorsWorked = await Doctor.count({
      where: {
        created_at: { [Op.between]: [startDate, endDate] },
      },
    });


      return res.status(200).json({
      period: { startDate, endDate },
      totalRevenue: totalRevenue || 0,
      totalRefunds,
      netRevenue: (totalRevenue || 0) - totalRefunds,
      appointments,
      canceledAppointments,
      doctorsWorked   
      });


  } catch (err) {
    console.error('Report Generation Error:', err);
    return res.status(500).json({ message: 'Failed to generate report' });
  }
};



// exports.getDoctorPayment = async (req, res) => {
//   try {
//     const { firstName, lastName, startDate, endDate } = req.body;

//     // 1. Find doctor
//     const doctor = await Doctor.findOne({
//       where: { first_name: firstName, last_name: lastName },
//     });
//     if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

//     // 2. Fetch payments for doctor
//     const payments = await Payment.findAll({
//       attributes: ['id', 'amount'],
//       include: [
//         {
//           model: Schedule,
//           attributes: [],
//           required: true,
//           where: { doctor_id: doctor.id },
//         },
//         {
//           model: Refund,
//           attributes: ['id'], // we only need to check existence
//           required: false,
//           where: { refund_status: 'Approved' },
//         },
//       ],
//       where: {
//         payment_date: { [Op.between]: [startDate, endDate] },
//         payment_status: 'Completed',
//       },
//       raw: true,
//       nest: true,
//     });

//     // 3. Calculate net total (ignore payments with refunds)
//     let netTotal = 0;
//     const refundedPaymentIds = payments
//       .filter(p => p.Refunds) // refunded ones
//       .map(p => p.id);

//     payments.forEach(p => {
//       if (!refundedPaymentIds.includes(p.id)) {
//         netTotal += parseFloat(p.amount);
//       }
//     });

//     // 4. Doctor's share = 80%
//     const doctorPayment = netTotal * 0.8;

//     // 5. Respond
//     return res.status(200).json({
//       period: { startDate, endDate },
//       doctor: `${doctor.first_name} ${doctor.last_name}`,
//       doctorId: doctor.id,
//       grossAmount: netTotal,
//       doctorPayment,
//     });

//   } catch (err) {
//     console.error('Doctor Payment Calculation Error:', err);
//     return res.status(500).json({ message: 'Failed to calculate doctor payment' });
//   }
// };
