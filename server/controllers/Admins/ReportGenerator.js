const { Schedule } = require('../../models/healthcare/Schedule');
const { Doctor } = require('../../models/healthcare/Doctor');
const { Reservation } = require('../../models/healthcare/Reservation');
const { Payment } = require('../../models/transactions/Payment');
const { Op } = require('sequelize');

/**
 * Generate a report of doctor schedules with reservation and payment details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateDoctorScheduleReport = async (req, res) => {
    console.log('Generating doctor schedule report...');
    
    try {
        const { startDate, endDate } = req.query;
        
        // Input validation
        if (!startDate || !endDate) {
            console.error('Missing required parameters');
            return res.status(400).json({ 
                success: false, 
                error: 'Start date and end date are required' 
            });
        }

        console.log(`Fetching schedules between ${startDate} and ${endDate}`);

        // 1. Fetch schedules within date range
        const schedules = await Schedule.findAll({
            where: {
                status: 'available',
                schedule_date: { [Op.between]: [startDate, endDate] }
            },
            raw: true
        });

        if (!schedules.length) {
            console.log('No schedules found for the selected date range');
            return res.json({
                success: true,
                data: [],
                message: 'No schedules found for the selected date range',
                startDate,
                endDate
            });
        }

        // 2. Get related data
        const scheduleIds = schedules.map(s => s.id);
        const doctorIds = [...new Set(schedules.map(s => s.doctor_id))];

        // First, get doctors and reservations
        const [doctors, reservations] = await Promise.all([
            Doctor.findAll({
                where: { id: { [Op.in]: doctorIds } },
                raw: true
            }),
            Reservation.findAll({
                where: { 
                    schedule_id: { [Op.in]: scheduleIds },
                    status: { [Op.in]: ['available', 'completed'] }
                },
                raw: true
            })
        ]);

        // Then get payments for the found reservations
        const paymentIds = reservations.map(r => r.id);
        const payments = paymentIds.length > 0 ? await Payment.findAll({
            where: {
                id: { [Op.in]: paymentIds },
                payment_status: 'completed'
            },
            raw: true
        }) : [];

        // 3. Process data
        const doctorMap = new Map(doctors.map(d => [d.id, d]));
        
        // Group payments by reservation_id
        const paymentsByReservation = payments.reduce((acc, payment) => {
            if (!acc[payment.reservation_id]) {
                acc[payment.reservation_id] = [];
            }
            acc[payment.reservation_id].push(payment);
            return acc;
        }, {});

        // Group reservations by schedule_id and include payments
        const reservationsBySchedule = reservations.reduce((acc, reservation) => {
            if (!acc[reservation.schedule_id]) {
                acc[reservation.schedule_id] = [];
            }
            // Add payments to reservation
            const reservationWithPayments = {
                ...reservation,
                payments: paymentsByReservation[reservation.id] || []
            };
            acc[reservation.schedule_id].push(reservationWithPayments);
            return acc;
        }, {});

        const reportData = schedules.map(schedule => {
            const doctor = doctorMap.get(schedule.doctor_id) || {};
            const scheduleReservations = reservationsBySchedule[schedule.id] || [];
            
            const totalRevenue = scheduleReservations.reduce((sum, r) => {
                const payment = r.payments?.[0];
                return sum + (payment ? parseFloat(payment.amount) : 0);
            }, 0);

            return {
                doctorName: `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim(),
                scheduleDate: schedule.schedule_date,
                scheduleTime: schedule.schedule_time,
                roomNumber: schedule.room_number,
                totalReservations: scheduleReservations.length,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                fees: parseFloat(schedule.fees) || 0
            };
        });

        console.log(`Successfully generated report with ${reportData.length} entries`);
        
        // 4. Send response
        res.json({
            success: true,
            data: reportData,
            startDate,
            endDate,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in generateDoctorScheduleReport:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate report',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    generateDoctorScheduleReport
};