const { Payment } = require("../../models/transactions/Payment");
const { Refund } = require("../../models/transactions/Refund");

exports.loadRefunds = async (req, res) => {
    try {
      
      // Fetch all completed payments for the patient
      const payments = await Payment.findAll({
        where: {
          patient_id: req.patientID,
          payment_status: 'Completed',
        },
        attributes: ['id', 'amount', 'payment_date'], // Fetch necessary fields
      });
  
      // If no payments are found, return a 404 response
      if (!payments.length) {
        return res.status(404).json({ message: 'No completed payments found for this patient.' });
      }
  
      // Extract payment IDs from the payments list
      const paymentIds = payments.map(payment => payment.id);
  
      // Fetch all refunds associated with the payment IDs
      const refunds = await Refund.findAll({
        where: {
          payment_id: paymentIds, // Fetch refunds for the list of payment IDs
        },
        attributes: ['id', 'payment_id', 'refund_reason', 'refund_status', 'created_at'], // Refund fields
      });
  
      // If no refunds are found, return a 404 message
      if (!refunds.length) {
        return res.status(404).json({ message: 'No refunds found for the completed payments.' });
      }
  
      // Prepare the refund data by including payment info like date and amount
      const result = refunds.map(refund => {
        const payment = payments.find(p => p.id === refund.payment_id);
        
        // Extract date and time from payment and refund created_at
        const paymentDate = payment.payment_date;
        const paymentTime = payment.payment_date;
        const refundDate = refund.created_at;
        const refundTime = refund.created_at;
  
        return {
          paymentId: payment.id,
          paymentDate,
          paymentTime,
          paymentAmount: payment.amount,
          refundId: refund.id,
          refundRequestDate: refundDate,
          refundRequestTime: refundTime,
          refundReason: refund.refund_reason,
          refundStatus: refund.refund_status,
        };
      });
  
      // Return the refund data in the response
      return res.status(200).json(result);
    } catch (error) {
      // Log the error and send a 500 response with a generic message
      console.error('Error loading refunds:', error);
      return res.status(500).json({ message: 'An error occurred while loading refunds.' });
    }
  };
  
  

exports.makeRefunds = async (req, res) => {
    try {
      // Destructure paymentID and reason from the request body
      const { paymentID, reason } = req.body;
  
      // Validate inputs
      if (!paymentID || !reason) {
        return res.status(400).json({ message: 'Payment ID and reason are required.' });
      }
  
      // Check if the payment exists
      const payment = await Payment.findOne({ where: { id: paymentID } });
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found.' });
      }
  
      // Check if a refund has already been created for this payment
      const existingRefund = await Refund.findOne({ where: { payment_id: paymentID } });
      if (existingRefund) {
        return res.status(400).json({ message: 'A refund request has already been made for this payment.' });
      }
  
      // Create a new refund
      const newRefund = await Refund.create({
        payment_id: paymentID,
        refund_reason: reason,
        refund_status: 'pending',
      });
  
      // Return the newly created refund object
      return res.status(201).json({
        message: 'Refund request successfully created.',
        refund: newRefund,
      });
    } catch (error) {
      console.error('Error creating refund:', error);
      return res.status(500).json({ message: 'An error occurred while processing the refund request.' });
    }
  };
  