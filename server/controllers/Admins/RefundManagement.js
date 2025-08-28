const { Refund } = require('../../models/transactions/Refund');
const { Payment } = require('../../models/transactions/Payment');
const { Patient } = require('../../models/healthcare/Patient');
const { Op } = require('sequelize');

// Get all refund requests
exports.getRefundRequests = async (req, res) => {
  try {
    const requests = await Refund.findAll({
      where: { refund_status: 'pending' },
    });
    console.log(requests)

    res.json({
      success: true,
      data: requests.map(req => ({
        id: req.id,
        payment_id: req.payment_id,
        patientId: req.Payment?.Patient?.id,
        name: req.Payment?.Patient ? 
          `${req.Payment.Patient.first_name} ${req.Payment.Patient.last_name}`.trim() : 'N/A',
        receipt: req.Payment?.id,
        amount: req.Payment?.amount,
        date: req.Payment?.createdAt?.toISOString().split('T')[0],
        time: req.Payment?.createdAt?.toTimeString().split(' ')[0],
        status: req.refund_status,
        reason: req.refund_reason
      }))
    });
  } catch (error) {
    console.error('Error fetching refund requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch refund requests' });
  }
};

// Approve a refund request
exports.approveRefund = async (req, res) => {
  try {
    const { id } = req.params;
    
    const refund = await Refund.findByPk(id);

    if (!refund) {
      return res.status(404).json({ success: false, message: 'Refund request not found' });
    }

    // Update payment status to refunded
    await refund.Payment.update({ status: 'refunded' });
    
    // Update refund status
    await refund.update({ 
      refund_status: 'approved',
      updated_at: new Date()
    });

    // TODO: Add logic to process actual refund through payment gateway

    res.json({ 
      success: true, 
      message: 'Refund approved successfully',
      data: refund
    });
  } catch (error) {
    console.error('Error approving refund:', error);
    res.status(500).json({ success: false, message: 'Failed to approve refund' });
  }
};

// Reject a refund request
exports.rejectRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const refund = await Refund.findByPk(id);

    if (!refund) {
      return res.status(404).json({ success: false, message: 'Refund request not found' });
    }

    await refund.update({ 
      refund_status: 'rejected',
      refund_reason: reason,
      updated_at: new Date()
    });

    // TODO: Send rejection email to patient

    res.json({ 
      success: true, 
      message: 'Refund request rejected',
      data: refund
    });
  } catch (error) {
    console.error('Error rejecting refund:', error);
    res.status(500).json({ success: false, message: 'Failed to reject refund' });
  }
};