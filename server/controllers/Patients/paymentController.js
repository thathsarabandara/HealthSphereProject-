const { Cart } = require("../../models/ecommerce/Cart");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Schedule } = require("../../models/healthcare/Schedule");
const { BankReceipt } = require("../../models/transactions/BankReciept");
const { BillingDetails } = require("../../models/transactions/BillingDetails");
const { CardDetails } = require("../../models/transactions/CardDetails");
const { CartPayments } = require("../../models/transactions/CartPayment");
const { Payment } = require("../../models/transactions/Payment");
const { ReservationPayment } = require("../../models/transactions/ReservationPayment");

exports.makePaymentId = async (req, res) => {
    try {
        const { reservationId} = req.params;

        const reservation = await Reservation.findOne({where:{
            id: reservationId,
            status: 'pending'
        }});

        if (reservation[0] === 0) {
            return res.status(404).json({ message: 'Reservation not found or could not be updated' });
        }

        const schedule = await Schedule.findOne({where:{id: reservation.schedule_id}});
        // Generate a unique receipt number
        const receiptNumber = `${Date.now()}-${schedule.fees}-${req.patientID}`;

        // Create a new payment record
        const newPayment = await Payment.create({
            patient_id: req.patientID,
            amount: parseFloat(schedule.fees) + 500,
            payment_method: null,
            payment_date: new Date(), // Current timestamp
            payment_status: 'pending',
            receipt_number: receiptNumber
        });

        const updateReservationPayments = await ReservationPayment.create({
            payment_id: newPayment.id,
            reservation_id: reservationId,
            price: newPayment.amount,
            status: 'pending',
        });

        // Respond with the newly created payment details
        return res.status(200).json({ paymentId: newPayment.id });

    } catch (error) {
        console.error('Error creating payment:', error);
        return res.status(500).json({ message: 'An error occurred while processing the payment' });
    }
};

exports.loadCheckout = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the payment record associated with the patient and the specified payment ID
        const payment = await Payment.findOne({
            where: {
                id,
                patient_id: req.patientID,
                payment_status: 'pending', // Ensure the payment is pending
            },
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found or not in a pending state' });
        }

        // Return the payment amount
        return res.status(200).json({ amount: payment.amount });
    } catch (error) {
        console.error('Error loading checkout:', error);
        return res.status(500).json({ message: 'An internal server error occurred' });
    }
};


exports.makeCheckout = async (req, res) => {
    try {
        const { amount } = req.params;
        // Validate required parameters
        if (!amount) {
            return res.status(400).json({ error: "Patient ID and amount are required." });
        }

        // Create a new payment
        const payment = await Payment.create({
            patient_id: req.patientID,
            amount: parseFloat(amount),
            payment_method: null,
            payment_date: new Date(),
            payment_status: 'pending',
        });

        // Fetch pending cart items for the patient
        const cartItems = await Cart.findAll({
            where: {
                patient_id: req.patientID,
                status: 'pending',
            },
            attributes: ['id'], // Include only necessary attributes
        });

        // Link each cart item with the payment
        for (const cartItem of cartItems) {
            await CartPayments.create({
                cart_id: cartItem.id,
                payment_id: payment.id,
                status: 'pending',
            });
        }

        // Send a success response with the payment ID
        return res.status(200).json({
            message: "Checkout loaded successfully.",
            paymentId: payment.id,
        });

    } catch (error) {
        // Log and return error response
        console.error("Error in loadCheckout:", error);
        return res.status(500).json({
            error: "An error occurred while loading the checkout.",
            details: error.message,
        });
    }
};

exports.makePayment = async (req, res) => {
    const { id } = req.params;
    const bankReceipt = req.bankrecipt;
    const { fullName, address, phoneNumber, email, paymentMethod, cardNumber, cardHolder, expiryDate, csv } = req.body;
    let patient; 
    let payment; 

    try {
        payment = await Payment.findOne({
            where: {
                id,
                patient_id: req.patientID,
                payment_status: 'pending',
            },
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found or already completed' });
        }

        const billing = await BillingDetails.create({
            fullName: fullName,
            address: address,
            phoneNumber:phoneNumber,
            email: email,
            payment: id,
        });

        
        if (paymentMethod === 'Online Payment') {
            await CardDetails.create({
                payment_id: payment.id,
                cardNumber,
                cardHolderName: cardHolder,
                validDate: expiryDate,
                csv,
            });
        } else if (paymentMethod === 'Bank Deposit' && bankReceipt) {
            await BankReceipt.create({
                payment_id: payment.id,
                receiptLocation: bankReceipt,
            });
        } else {
            return res.status(400).json({ message: 'Invalid payment method or missing receipt' });
        }

        await payment.update({ payment_status: 'completed', payment_method: paymentMethod });
        await CartPayments.update(
            { status: 'completed' },
            { where: { payment_id: payment.id, status: 'pending' } }
        );
        await Cart.update(
            { status: 'completed' },
            { where: { patient_id: req.patientID, status: 'pending' } }
        );

        return res.status(200).json({ message: 'Payment successful', paymentId: payment.id });
    } catch (error) {
        console.error('Error processing payment:', error);

        
        if (payment) { // Use the payment object from try block
            await payment.update({ payment_status: 'failed' }); // Update the payment status to 'failed'
        }

        if (patient) { // Ensure patient exists before trying to rollback CartPayments
            await CartPayments.update(
                { status: 'failed' },
                { where: { payment_id: payment ? payment.id : null, status: 'pending' } } // Ensure we are targeting the correct payment_id
            );
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.makePayments = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const bankReceipt = req.bankrecipt;
    const { fullName, address, phoneNumber, email, paymentMethod, cardNumber, cardHolder, expiryDate, csv } = req.body;
    let reservation ; 
    let payment; 

    try {
        payment = await Payment.findOne({
            where: {
                id,
                patient_id: req.patientID,
                payment_status: 'pending',
            },
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found or already completed' });
        }

        reservation = await ReservationPayment.findOne({
            where:{
                payment_id: payment.id,
                status: 'pending'
            }
        });

        if (!reservation) {
            console.log('hi')
            return res.status(404).json({ message: 'Reservation not found or already completed' });
        }

        const billing = await BillingDetails.create({
            fullName: fullName,
            address: address,
            phoneNumber:phoneNumber,
            email: email,
            payment: id,
        });

        
        if (paymentMethod === 'Online Payment') {
            await CardDetails.create({
                payment_id: payment.id,
                cardNumber,
                cardHolderName: cardHolder,
                validDate: expiryDate,
                csv,
            });
        } else if (paymentMethod === 'Bank Deposit' && bankReceipt) {
            await BankReceipt.create({
                payment_id: payment.id,
                receiptLocation: bankReceipt,
            });
        } else {
            return res.status(400).json({ message: 'Invalid payment method or missing receipt' });
        }

        await payment.update({ payment_status: 'completed', payment_method: paymentMethod });

        const reservationPayment = await ReservationPayment.update(
            { status: 'completed' },
            { where: { payment_id: payment.id, status: 'pending' } }
        );

        await Reservation.update(
            { status: 'available' },
            { where: { id: reservationPayment , status: 'pending' } }
        );

        return res.status(200).json({ message: 'Payment successful', paymentId: payment.id });
    } catch (error) {
        console.error('Error processing payment:', error);

        
        if (payment) { // Use the payment object from try block
            await payment.update({ payment_status: 'failed' }); // Update the payment status to 'failed'
        }

        if (reservation) { // Ensure patient exists before trying to rollback CartPayments
            await ReservationPayment.update(
                { status: 'failed' },
                { where: { reservation_id: reservation ? reservation.id : null, status: 'pending' } } // Ensure we are targeting the correct payment_id
            );
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};



exports.loadPayment = (req, res) =>{

}

exports.loadRefund = (req, res) =>{
     
}