const { where } = require('sequelize');
const { Doctor } = require('../../models/healthcare/Doctor');
const { Specialization } = require('../../models/healthcare/Specialization');
const { User } = require('../../models/auth/User');
const { sendWelcomeEmail, sendRejectionEmail } = require('../../services/doctorEmailServices');

const loadApprovedDoctors = async (req, res) => {
  try {
    const approvedDoctors = await Doctor.findAll({where:{status:'approved'}})
    res.json(approvedDoctors);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

const loadPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await Doctor.findAll({where:{ status: 'pending'} });
    res.json(pendingDoctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loadDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const specialization = await Specialization.findByPk(doctor.specialization_id);
    const user = await User.findByPk(doctor.user_id);

    res.json({
      ...doctor.get({ plain: true }),
      specialization: specialization ? specialization.name : null,
      email: user ? user.email : null,
      user_id: user ? user.id : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveDoctor = async (req, res) => {
  try {
    console.log(req.params.id);
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.status = 'approved';
    await doctor.save();

    // Find user to get email
    const user = await User.findByPk(doctor.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send welcome email
    await sendWelcomeEmail(user.email);

    res.json({ message: 'Doctor approved successfully. Welcome email sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const suspendDoctor = async (req, res) => {
  try {
    console.log(req.params.id);
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.status = 'suspended';
    await doctor.save();

    // Find user to get email
    const user = await User.findByPk(doctor.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send rejection email
    await sendRejectionEmail(user.email);

    res.json({ message: 'Doctor suspended successfully. Rejection email sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  loadApprovedDoctors,
  loadPendingDoctors,
  loadDoctorById,
  approveDoctor,
  suspendDoctor
};