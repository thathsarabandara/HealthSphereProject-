const { Patient } = require("../../models/healthcare/Patient");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Payment } = require("../../models/transactions/Payment");
const { Op } = require("sequelize");

exports.makePaymentId = async (req, res) => {
    try {
        const { reservationId, amount } = req.params;
        const token = req.cookies['token'];

        // Check if token is present
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        // Validate the token
        const tokenRecord = await Token.findOne({
            where: {
                token,
                expires_at: { [Op.gt]: new Date() } // Check token validity
            }
        });

        if (!tokenRecord) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Retrieve the patient associated with the token
        const patient = await Patient.findOne({
            where: { user_id: tokenRecord.user_id }
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Generate a unique receipt number
        const receiptNumber = `${Date.now()}-${amount}-${patient.id}`;

        // Create a new payment record
        const newPayment = await Payment.create({
            patient_id: patient.id,
            amount,
            payment_method: null,
            payment_date: new Date(), // Current timestamp
            payment_status: 'pending',
            receipt_number: receiptNumber
        });

        // Update reservation status
        const updatedReservation = await Reservation.update(
            { status: 'available' },
            { where: { id: reservationId } }
        );

        if (updatedReservation[0] === 0) {
            return res.status(404).json({ message: 'Reservation not found or could not be updated' });
        }

        // Respond with the newly created payment details
        return res.status(200).json({ paymentId: newPayment.id });

    } catch (error) {
        console.error('Error creating payment:', error);
        return res.status(500).json({ message: 'An error occurred while processing the payment' });
    }
};



exports.loadPayment = (req, res) =>{

}

exports.loadCheckout = (req,res) =>{

}

exports.loadRefund = (req, res) =>{
     
}