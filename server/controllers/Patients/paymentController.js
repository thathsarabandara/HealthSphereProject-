const { Cart } = require("../../models/ecommerce/Cart");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Schedule } = require("../../models/healthcare/Schedule");
const { BankReceipt } = require("../../models/transactions/BankReciept");
const { BillingDetails } = require("../../models/transactions/BillingDetails");
const { CardDetails } = require("../../models/transactions/CardDetails");
const { CartPayments } = require("../../models/transactions/CartPayment");
const { Payment } = require("../../models/transactions/Payment");
const { ReservationPayment } = require("../../models/transactions/ReservationPayment");
const { sendPaymentSuccessEmail } = require('../../services/emailServices');
const { Patient } = require("../../models/healthcare/Patient");
const { User } = require("../../models/auth/User");
const { sendReservationPaymentSuccessEmail } = require('../../services/emailServices');

// Helper function to mask card number
function maskCardNumber(cardNumber) {
    if (typeof cardNumber !== 'string' && typeof cardNumber !== 'number') {
        return cardNumber;
    }
    const cardStr = cardNumber.toString();
    const cleaned = cardStr.replace(/\D/g, ''); // Remove non-digits
    if (cleaned.length < 7) {
        return cardStr; // Not enough digits, return original
    }
    const last6 = cleaned.slice(-6);
    return '*'.repeat(cleaned.length - 6) + last6;
}

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
    
    // Mask the card number
    const maskedCardNumber = maskCardNumber(cardNumber);
    
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
                cardNumber: maskedCardNumber, // Use masked card number
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

        const patient = await Patient.findByPk(req.patientID);

        const user = await User.findByPk(patient.user_id);
        
        if (patient && user) {
          // Fetch cart items with details
          const cartItems = await Cart.findAll({
            where: {
              patient_id: req.patientID,
              status: 'completed', // Now completed
            },
            include: [{
              model: MedicalItem,
              attributes: ['name', 'price']
            }]
          });
          
          const items = cartItems.map(item => ({
            name: item.MedicalItem.name,
            price: item.MedicalItem.price
          }));
          
          // Send payment success email
          await sendPaymentSuccessEmail(patient.User.email, {
            id: payment.id,
            amount: payment.amount
          }, items);
        }

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
    
    // Mask the card number
    const maskedCardNumber = maskCardNumber(cardNumber);
    
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
        console.log(payment)

        if (!payment) {
            console.log('Payment not found or already completed')
            return res.status(404).json({ message: 'Payment not found or already completed' });
        }

        const billing = await BillingDetails.create({
            fullName: fullName,
            address: address,
            phoneNumber:phoneNumber,
            email: email,
            payment_id: payment.id,
        });
        console.log(billing)
        
        if (paymentMethod === 'Online Payment') {
            const cardDetails = await CardDetails.create({
                payment_id: payment.id,
                cardNumber: maskedCardNumber, // Use masked card number
                cardHolderName: cardHolder,
                validDate: expiryDate,
                csv,
            }); 
            console.log(cardDetails)
        } else if (paymentMethod === 'Bank Deposit' && bankReceipt) {
            const bankReceipt = await BankReceipt.create({
                payment_id: payment.id,
                receiptLocation: bankReceipt,
            });
            console.log(bankReceipt)
        } else {
            return res.status(400).json({ message: 'Invalid payment method or missing receipt' });
        }

        // Update the payment status
        const paymentUpdate = await payment.update({ payment_status: 'completed', payment_method: paymentMethod });
        console.log(paymentUpdate);

        // Find the reservation payment record
        const reservationPaymentRecord = await ReservationPayment.findOne({
          where: { payment_id: payment.id, status: 'pending' }
        });
        
        if (!reservationPaymentRecord) {
          console.log('Reservation payment record not found');
          return res.status(404).json({ message: 'Reservation payment record not found' });
        }
        
        // Update the reservation payment status
        const reservationPaymentUpdate = await reservationPaymentRecord.update({ status: 'completed' });
        console.log(reservationPaymentUpdate);

        // Update the reservation status using the reservation ID from the reservation payment record
        const reservationUpdate = await Reservation.update(
          { status: 'available' },
          { where: { id: reservationPaymentRecord.reservation_id, status: 'pending' } }
        );
        console.log(reservationUpdate)

        const patient = await Patient.findByPk(req.patientID);
        console.log(patient)
        const user = await User.findByPk(patient.User_id);
        console.log(user)
        
        if (patient && user) {
          // Send reservation payment success email
          await sendReservationPaymentSuccessEmail(user.email, {
            id: reservationPaymentRecord.id,
            date: reservationPaymentRecord.reservation_date,
            time: reservationPaymentRecord.reservation_time
          }, {
            id: payment.id,
            amount: payment.amount
          });
        }

        return res.status(200).json({ message: 'Payment successful', paymentId: payment.id });
    } catch (error) {
        console.error('Error processing payment:', error);

        
        if (payment) { // Use the payment object from try block
            await payment.update({ payment_status: 'failed' }); // Update the payment status to 'failed'
        }

        if (reservationPaymentRecord) { // Ensure patient exists before trying to rollback CartPayments
            await ReservationPayment.update(
                { status: 'failed' },
                { where: { reservation_id: reservationPaymentRecord ? reservationPaymentRecord.id : null, status: 'pending' } } // Ensure we are targeting the correct payment_id
            );
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};



exports.loadPayment = async (req, res) => {
    try {
      // Fetch all payments for the patient
      const payments = await Payment.findAll({
        where: {
          patient_id: req.patientID,
          payment_status: 'completed',
        },
      });
  
      if (!payments.length) {
        return res.status(404).json({ message: 'No payments found for the patient.' });
      }
  
      // Use Promise.all to fetch related data for all payments concurrently
      const paymentDetails = await Promise.all(
        payments.map(async (payment) => {
          const reservationPayment = await ReservationPayment.findOne({
            where: {
              payment_id: payment.id,
            },
          });
  
          if (!reservationPayment) {
            return null;
          }
  
          const reservation = await Reservation.findOne({
            where: {
              id: reservationPayment.reservation_id,
            },
          });
  
          if (!reservation) {
            return null;
          }
  
          const schedule = await Schedule.findOne({
            where: {
              id: reservation.schedule_id,
            },
          });
  
          if (!schedule) {
            return null;
          }
  
          const doctor = await Doctor.findOne({
            where: {
              id: schedule.doctor_id,
            },
          });
          
          if (!doctor) {
            return null;
          }
  
          // Calculate refund eligibility
          const currentDate = new Date();
          const scheduleDate = new Date(schedule.schedule_date); // Assuming `schedule.date` is a valid date field
          const isEligibleForRefund = currentDate < scheduleDate;
  
          return {
            paymentID: payment.id,
            amount: payment.amount,
            datetime: payment.payment_date, 
            reservationID: reservation.id,
            doctorName: `${doctor.first_name} ${doctor.last_name}`,
            isEligibleForRefund,
          };
        })
      );
      const filteredPaymentDetails = paymentDetails.filter((details) => details !== null);      
      return res.status(200).json(filteredPaymentDetails);
    } catch (error) {
      console.error('Error loading payments:', error);
      return res.status(500).json({ message: 'An error occurred while loading payments.' });
    }
  };
  
