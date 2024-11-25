const Allergy = require('../models/Allergy');  // Assuming you have models for each section
const BloodSugar = require('../models/BloodSugar');
const Bmi = require('../models/Bmi');
const Condition = require('../models/Condition');
const HeartRate = require('../models/HeartRate');

// Get Allergies
exports.getAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.find();
    res.json(allergies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching allergies', error });
  }
};

// Update Allergies
exports.updateAllergies = async (req, res) => {
  try {
    const updatedAllergies = await Allergy.updateMany(
      { _id: { $in: req.body.map(item => item._id) } },
      { $set: req.body.reduce((acc, curr) => {
          acc[`$${curr._id}`] = curr;  // Dynamically map the updates
          return acc;
      }, {}) }
    );
    res.json(updatedAllergies);
  } catch (error) {
    res.status(500).json({ message: 'Error updating allergies', error });
  }
};

// Get Blood Sugar
exports.getBloodSugar = async (req, res) => {
  try {
    const bloodSugar = await BloodSugar.find();
    res.json(bloodSugar);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blood sugar data', error });
  }
};

// Update Blood Sugar
exports.updateBloodSugar = async (req, res) => {
  try {
    const updatedBloodSugar = await BloodSugar.updateMany(
      { _id: { $in: req.body.map(item => item._id) } },
      { $set: req.body.reduce((acc, curr) => {
          acc[`$${curr._id}`] = curr;
          return acc;
      }, {}) }
    );
    res.json(updatedBloodSugar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blood sugar', error });
  }
};

// Get BMI
exports.getBmi = async (req, res) => {
  try {
    const bmiRecords = await Bmi.find();
    res.json(bmiRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching BMI data', error });
  }
};

// Update BMI
exports.updateBmi = async (req, res) => {
  try {
    const updatedBmi = await Bmi.updateMany(
      { _id: { $in: req.body.map(item => item._id) } },
      { $set: req.body.reduce((acc, curr) => {
          acc[`$${curr._id}`] = curr;
          return acc;
      }, {}) }
    );
    res.json(updatedBmi);
  } catch (error) {
    res.status(500).json({ message: 'Error updating BMI data', error });
  }
};

// Get Conditions
exports.getConditions = async (req, res) => {
  try {
    const conditions = await Condition.find();
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conditions data', error });
  }
};

// Update Conditions
exports.updateConditions = async (req, res) => {
  try {
    const updatedConditions = await Condition.updateMany(
      { _id: { $in: req.body.map(item => item._id) } },
      { $set: req.body.reduce((acc, curr) => {
          acc[`$${curr._id}`] = curr;
          return acc;
      }, {}) }
    );
    res.json(updatedConditions);
  } catch (error) {
    res.status(500).json({ message: 'Error updating conditions data', error });
  }
};

// Get Heart Rates
exports.getHeartRates = async (req, res) => {
  try {
    const heartRates = await HeartRate.find();
    res.json(heartRates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching heart rate data', error });
  }
};

// Update Heart Rates
exports.updateHeartRates = async (req, res) => {
  try {
    const updatedHeartRates = await HeartRate.updateMany(
      { _id: { $in: req.body.map(item => item._id) } },
      { $set: req.body.reduce((acc, curr) => {
          acc[`$${curr._id}`] = curr;
          return acc;
      }, {}) }
    );
    res.json(updatedHeartRates);
  } catch (error) {
    res.status(500).json({ message: 'Error updating heart rate data', error });
  }
};
