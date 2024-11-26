const { Token } = require('../../models/auth/Token');
const { Patient } = require('../../models/healthcare/Patient');
const { PatientAllergy } = require('../../models/healthcare/PatientAllergy');
const { PatientBloodSugar } = require('../../models/healthcare/PatientBloodSugar');
const { PatientBMI } = require('../../models/healthcare/PatientBMI');
const { PatientCondition } = require('../../models/healthcare/PatientCondition');
const { PatientHeartRate } = require('../../models/healthcare/PatientHeartRate');

// Helper function to get patient by token
const getPatientByToken = async (token) => {
  const tokenRecord = await Token.findOne({ where: { token } });
  if (!tokenRecord) throw new Error('Invalid or missing token');

  const patient = await Patient.findOne({ where: { user_id: tokenRecord.user_id } });
  if (!patient) throw new Error('Patient not found');

  return patient;
};

// Generic Methods
const getData = async (model, patientId, res) => {
  try {
    const data = await model.findAll({
      where: { patient_id: patientId, status: 'active' },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Error fetching data`, error: error.message });
  }
};

const updateStatus = async (model, id, res) => {
  try {
    await model.update({ status: 'delete' }, { where: { id } });
    res.json({ message: 'Status updated to delete' });
  } catch (error) {
    res.status(500).json({ message: `Error updating status`, error: error.message });
  }
};

// Methods for Allergies
exports.getAllergies = async (req, res) => {
  try {
    const token = req.cookies['token'];
    const patient = await getPatientByToken(token);
    await getData(PatientAllergy, patient.id, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllergy = async (req, res) => {
  const { id } = req.body;
  await updateStatus(PatientAllergy, id, res);
};

exports.createAllergy = async (req, res) => {
    try {
      const token = req.cookies["token"];
      const patient = await getPatientByToken(token);
  
      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ message: "Invalid or missing data" });
      }
  
      // Prepare data for bulk insert, ensuring the `id` field is not included
      const dataWithPatientId = req.body.map((entry) => ({
        allergy_name: entry.allergy_name,
        allergy_type: entry.allergy_type,
        severity: entry.severity,
        description: entry.description,
        status: "active", // Default status
        patient_id: patient.id, // Attach patient_id
      }));
  
      // Use Sequelize bulkCreate method to insert data
      const createdData = await PatientAllergy.bulkCreate(dataWithPatientId, {
        returning: true, // Optional: returns the inserted rows
      });
  
      res.status(201).json({
        message: "Allergies created successfully",
        createdData,
      });
    } catch (error) {
      console.error("Error creating allergies:", error);
      res.status(500).json({
        message: "Error creating allergies",
        error: error.message,
      });
    }
  };
  

// Methods for Blood Sugar
exports.getBloodSugar = async (req, res) => {
  try {
    const token = req.cookies['token'];
    const patient = await getPatientByToken(token);
    await getData(PatientBloodSugar, patient.id, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBloodSugar = async (req, res) => {
  const { id } = req.body;
  await updateStatus(PatientBloodSugar, id, res);
};

exports.createBloodSugar = async (req, res) => {
    try {
      const token = req.cookies['token'];
      const patient = await getPatientByToken(token);
  
      // Ensure the body is an array and contains data
      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ message: "Invalid or missing data" });
      }
  
      // Add patient_id to each record and prepare data for bulk insert
      const bloodSugarData = req.body.map(entry => ({
        ...entry,
        patient_id: patient.id,  // Add patient_id to each entry
        status: 'active'          // Set default status
      }));
  
      // Insert the records into the database
      const createdBloodSugarRecords = await PatientBloodSugar.bulkCreate(bloodSugarData, {
        returning: true,
      });
  
      res.status(201).json({
        message: "Blood sugar records created successfully",
        data: createdBloodSugarRecords,
      });
    } catch (error) {
      console.error("Error creating blood sugar records:", error);
      res.status(500).json({
        message: "Error creating blood sugar records",
        error: error.message,
      });
    }
  };
  
  
  

// Methods for BMI
exports.getBmi = async (req, res) => {
  try {
    const token = req.cookies['token'];
    const patient = await getPatientByToken(token);
    await getData(PatientBMI, patient.id, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBmi = async (req, res) => {
  const { id } = req.body;
  await updateStatus(PatientBMI, id, res);
};

exports.createBmi = async (req, res) => {
    try {
      const token = req.cookies['token'];
      const patient = await getPatientByToken(token);
  
      // Ensure the body is an array and contains data
      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ message: "Invalid or missing data" });
      }
  
      // Process the array and calculate BMI for each entry
      const bmiData = req.body.map(entry => {
        let { height, weight, measurement_date, notes } = entry;
  
        // Parse height and weight to numbers (if they are strings or other formats)
        height = parseFloat(height);
        weight = parseFloat(weight);
  
        // Validate height and weight after parsing
        if (isNaN(height) || height <= 0) {
          throw new Error("Invalid height value");
        }
        if (isNaN(weight) || weight <= 0) {
          throw new Error("Invalid weight value");
        }
  
        // Calculate BMI using the formula: BMI = weight / (height * height)
        const bmi_value = weight / (height * height);
  
        // Validate measurement_date format
        if (!measurement_date || isNaN(Date.parse(measurement_date))) {
          throw new Error("Invalid measurement date");
        }
  
        // Optional: validate notes field (if provided)
        const notesText = typeof notes === 'string' ? notes : '';
  
        // Return prepared data with patient_id and default status
        return {
          bmi_value,
          height,
          weight,
          measurement_date,
          notes: notesText,
          patient_id: patient.id, // Attach patient_id to each record
          status: 'active'         // Set default status
        };
      });
  
      // Bulk insert data into the database
      const createdBmiRecords = await PatientBMI.bulkCreate(bmiData, {
        returning: true, // Optional: returns the inserted rows
      });
  
      res.status(201).json({
        message: "BMI records created successfully",
        data: createdBmiRecords,
      });
    } catch (error) {
      console.error("Error creating BMI records:", error);
      res.status(500).json({
        message: "Error creating BMI records",
        error: error.message,
      });
    }
  };
  
  

// Methods for Conditions
exports.getConditions = async (req, res) => {
  try {
    const token = req.cookies['token'];
    const patient = await getPatientByToken(token);
    await getData(PatientCondition, patient.id, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCondition = async (req, res) => {
  const { id } = req.body;
  await updateStatus(PatientCondition, id, res);
};

exports.createCondition = async (req, res) => {
    try {
      const token = req.cookies['token'];
      const patient = await getPatientByToken(token);
  
      // Ensure the body is an array and contains data
      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ message: "Invalid or missing data" });
      }
  
      // Process each entry in the array and prepare the data for bulk insert
      const conditionData = req.body.map(entry => {
        const { condition_name, severity, diagnosis_date, notes } = entry;
  
        // Validate condition_name and severity
        if (!condition_name || typeof condition_name !== 'string') {
          throw new Error("Invalid condition name");
        }
  
        if (!severity || typeof severity !== 'string') {
          throw new Error("Invalid severity");
        }
  
        // Validate diagnosis_date format (it should be a valid date string)
        if (!diagnosis_date || isNaN(Date.parse(diagnosis_date))) {
          throw new Error("Invalid diagnosis date");
        }
  
        // Optional: validate the notes field (it should be a string or empty)
        const notesText = typeof notes === 'string' ? notes : '';
  
        // Return the data to be saved, adding patient_id and status
        return {
          condition_name,
          severity,
          diagnosis_date,
          notes: notesText,
          patient_id: patient.id, // Attach patient_id
          status: 'active'         // Default status
        };
      });
  
      // Bulk insert data into the database
      const createdConditionRecords = await PatientCondition.bulkCreate(conditionData, {
        returning: true, // Optional: returns the inserted rows
      });
  
      res.status(201).json({
        message: "Condition records created successfully",
        data: createdConditionRecords,
      });
    } catch (error) {
      console.error("Error creating condition records:", error);
      res.status(500).json({
        message: "Error creating condition records",
        error: error.message,
      });
    }
  };
  
  

// Methods for Heart Rates
exports.getHeartRates = async (req, res) => {
  try {
    const token = req.cookies['token'];
    const patient = await getPatientByToken(token);
    await getData(PatientHeartRate, patient.id, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHeartRate = async (req, res) => {
  const { id } = req.body;
  await updateStatus(PatientHeartRate, id, res);
};

exports.createHeartRate = async (req, res) => {
    try {
      const token = req.cookies['token'];
      const patient = await getPatientByToken(token);
  
      // Ensure the body is an array and contains data
      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ message: "Invalid or missing data" });
      }
  
      // Process each entry in the array and prepare the data for bulk insert
      const heartRateData = req.body.map(entry => {
        // Parse heart_rate to a number
        let heart_rate = Number(entry.heart_rate);
        let measurement_time = entry.measurement_time;
        let notes = entry.notes;
  
        // Validate heart_rate: it should be a number and greater than 0
        if (!heart_rate || isNaN(heart_rate) || heart_rate <= 0) {
          throw new Error("Invalid heart rate. It should be a positive number.");
        }
  
        // Validate measurement_time: it should be a valid date string
        if (!measurement_time || isNaN(Date.parse(measurement_time))) {
          throw new Error("Invalid measurement time. It should be a valid date string.");
        }
  
        // Validate notes (optional): It should be a string or empty
        const notesText = typeof notes === 'string' ? notes : '';
  
        // Return the data to be saved, adding patient_id and status
        return {
          heart_rate,
          measurement_time,
          notes: notesText,
          patient_id: patient.id, // Attach patient_id
          status: 'active'         // Default status
        };
      });
  
      // Bulk insert data into the database
      const createdHeartRateRecords = await PatientHeartRate.bulkCreate(heartRateData, {
        returning: true, // Optional: returns the inserted rows
      });
  
      res.status(201).json({
        message: "Heart rate records created successfully",
        data: createdHeartRateRecords,
      });
    } catch (error) {
      console.error("Error creating heart rate records:", error);
      res.status(500).json({
        message: "Error creating heart rate records",
        error: error.message,
      });
    }
  };
  