const { Patient } = require("../../models/healthcare/Patient");
const { Prescription } = require("../../models/healthcare/Prescription");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Schedule } = require("../../models/healthcare/Schedule");
exports.patientDetails = async (req, res) => {
  try {
    const { id } = req.query;

    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: "Patient ID is required." });
    }
    const isValidId = /^\d+$/.test(id);
    if (!isValidId) {
      return res.status(400).json({
        message: "Invalid patient ID. ID must be a positive integer.",
      });
    }

    // Fetch patient data
    const patientData = await Patient.findOne({
      where: { id: id },
    });
    if (!patientData) {
      return res.status(404).json({ message: "Patient data not found" });
    }

    // Fetch all reservations for the patient
    const reservationData = await Reservation.findAll({
      where: { patient_id: id },
      order: [["reservation_date", "DESC"]], // Order by last updated time
    });

    if (!reservationData || reservationData.length === 0) {
      return res
        .status(404)
        .json({ message: "No reservations found for this patient" });
    }

    // Fetch schedule and doctor data for each reservation
    const reservationsWithDetails = await Promise.all(
      reservationData.map(async (reservation) => {
        const scheduleData = await Schedule.findOne({
          where: { id: reservation.schedule_id },
        });

        const doctorData = await Doctor.findOne({
          where: { id: scheduleData.doctor_id },
        });

        return {
          reservationId: reservation.id,
          reservationDate: reservation.reservation_date,
          reservationTime: reservation.reservation_time,
          doctorId: doctorData.id,
          doctorName: doctorData.first_name + " " + doctorData.last_name,
          scheduleId: scheduleData.id,
          scheduleDate: scheduleData.date,
          scheduleTime: scheduleData.time,
        };
      })
    );

    return res.status(200).json({
      message: "Patient and reservation data retrieved successfully",
      patient: patientData,
      reservations: reservationsWithDetails, // Return reservations with schedule and doctor details
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return res.status(500).json({ message: "An internal error occurred" });
  }
};
exports.loadDoctortProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const doctorProfileData = await Doctor.findOne({
      where: { id: id },
    });

    console.log(
      `doctorProfileData: ${JSON.stringify(doctorProfileData, null, 2)}`
    ); // data comes until here

    if (!doctorProfileData) {
      return res.status(404).json({ message: "Doctor data not found" });
    }
    console.log(
      `doctorProfileData: ${JSON.stringify(doctorProfileData, null, 2)}`
    ); // data comes until here

    return res.status(200).json({
      message: "Doctor data found successfully",
      data: {
        doctorId: doctorProfileData.id,
        doctorFirstName: doctorProfileData.first_name,
        doctorLastName: doctorProfileData.last_name,
        doctorDateOfBirth: doctorProfileData.date_of_birth,
        doctorGender: doctorProfileData.gender,
        doctorPhoneNumber: doctorProfileData.phone_number,
        doctorAddress: doctorProfileData.address,
        profilePicture: doctorProfileData.profilePictureLocation,
        doctoremail: doctorProfileData.email,
        doctorSpecialization: doctorProfileData.specialization,
        doctorMedicalLicenseNumber: doctorProfileData.medical_license_number,
        doctorBio: doctorProfileData.bio,
        doctorYearsOfExperience: doctorProfileData.years_of_experience,
        doctorHospitalClinicAffiliation:
          doctorProfileData.hospital_clinic_affiliation,
        doctorCreatedAt: doctorProfileData.created_at,
        doctorUpdatedAt: doctorProfileData.updated_at,
        doctorProfilePicture: doctorProfileData.profilePictureLocation,
      },
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};
exports.saveProfile = async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone_number,
    address,
  } = req.body;
  const profilePictureLocation = req.profile_picture;

  try {
    // Set the fields to be updated, with or without profile picture
    const updateFields = {
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone_number,
      address,
    };

    // Add the profile picture field if available
    if (profilePictureLocation) {
      updateFields.profilePictureLocation = profilePictureLocation;
    }

    // Update the patient's profile
    const [updatedRows] = await Patient.update(updateFields, {
      where: { id },
    });
    console.log(`Update fields: ${JSON.stringify(updateFields, null, 2)}`); // Log the updated fields for debugging

    // Check if any rows were updated
    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "Patient not found or no changes made" });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "An internal error occurred" });
  }
};

exports.loadPrescription = async (req, res) => {
  const { reservationid } = req.params;

  console.log("reservationid:", reservationid); // Debugging

  try {
    // Retrieve the prescription based on the reservation ID and patient ID
    const prescription = await Prescription.findOne({
      where: {
        reservation_id: reservationid,
      },
    });

    // If prescription doesn't exist, return an error
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Retrieve the patient based on the patient ID
    const patient = await Patient.findOne({
      where: {
        id: prescription.patient_id,
      },
    });

    // If patient doesn't exist, return an error
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    console.log(`prescription: ${JSON.stringify(prescription, null, 2)}`); // data comes until here

    // Respond with the prescription details
    return res.status(200).json({
      patient_name: patient.first_name + " " + patient.last_name,
      date_issued: prescription.created_at,
      details: prescription.details,
      special_comments: prescription.special_comments,
      prescription_photo: prescription.prescription_photo,
    });
  } catch (error) {
    // Return a server error if there's an issue
    console.error("Error loading prescription:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
