const { Patient } = require("../../models/healthcare/Patient");
const { Prescription } = require("../../models/healthcare/Prescription");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Schedule } = require("../../models/healthcare/Schedule");
const { User } = require("../../models/auth/User");
const { Op } = require("sequelize");

async function getPatientByIdOrName(id, name) {
  if (id) {
    return await Patient.findOne({ where: { User_id: id } });
  } else if (name) {
    return await Patient.findOne({
      where: {
        [Op.or]: [
          { first_name: { [Op.like]: `%${name}%` } },
          { last_name: { [Op.like]: `%${name}%` } },
        ],
      },
    });
  }
  return null;
}

exports.patientDetails = async (req, res) => {
  try {
    const { id, name } = req.query;
    console.log("frontend request:", req.query);

    const patientData = await getPatientByIdOrName(id, name);

    if (!patientData) {
      return res.status(404).json({ message: "Patient data not found" });
    }

    // Fetch user data for the patient
    const userData = await User.findOne({
      where: { id: patientData.User_id },
      attributes: ["email"],
    });
    if (!userData) {
      return res.status(404).json({ message: "related User data not found" });
    }

    // Fetch all reservations for the patient
    const reservationData = await Reservation.findAll({
      where: { patient_id: patientData.id },
      order: [["reservation_date", "DESC"]],
    });
    let reservationMessage = "Reservations retrieved successfully";
    if (!reservationData || reservationData.length === 0) {
      reservationMessage = "No reservations found for this patient";
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
      patient: {
        ...patientData.toJSON(),
        email: userData.email,
        profilePicture: patientData.profilePictureLocation
          ? `http://localhost:5000/uploads/storage/patient/${patientData.User_id}/profilepictures/${patientData.profilePictureLocation}`
          : null,
      },
      reservations: reservationsWithDetails,
      reservationMessage,
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
    name,
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone_number,
    address,
  } = req.body;
  const profilePictureLocation = req.profile_picture;

  try {
    const patientData = await getPatientByIdOrName(id, name);
    if (!patientData) {
      return res.status(404).json({ message: "Patient not found" });
    }

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
      where: { User_id: patientData.User_id },
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

  try {
    // Retrieve the prescription based on the reservation ID
    const prescription = await Prescription.findOne({
      where: {
        reservation_id: reservationid,
      },
    });

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Retrieve the patient based on the patient ID
    const patient = await Patient.findOne({
      where: {
        id: prescription.patient_id,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Build the prescription file URL if it exists
    let prescriptionPhotoUrl = null;
    if (prescription.prescription_photo) {
      prescriptionPhotoUrl = `http://localhost:5000/uploads/storage/patient/${patient.User_id}/prescription/${prescription.reservation_id}/${prescription.prescription_photo}`;
    }

    return res.status(200).json({
      patient_name: patient.first_name + " " + patient.last_name,
      date_issued: prescription.created_at,
      details: prescription.details,
      special_comments: prescription.special_comments,
      prescription_photo: prescriptionPhotoUrl,
    });
  } catch (error) {
    console.error("Error loading prescription:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  const patientId = req.params.id;
  const patientName = req.body.name;
  const filename = req.profile_picture; // set by the middleware
  console.log("Uploaded file:", filename); // Debugging

  if (!filename) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const patientData = await getPatientByIdOrName(patientId, patientName);
    if (!patientData) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update the patient's profile picture in the database
    await Patient.update(
      { profilePictureLocation: filename },
      { where: { User_id: patientData.User_id } }
    );
    return res
      .status(200)
      .json({ message: "Profile picture uploaded successfully", filename });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile picture",
      error: error.message,
    });
  }
};
