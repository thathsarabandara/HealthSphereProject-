const { User } = require("../../models/auth/User");
const { Specialization } = require("../../models/healthcare/Specialization");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Doctor } = require("../../models/healthcare/Doctor");

exports.doctorDetails = async (req, res) => {
  try {
    console.log("Request received at doctorDetails function"); // Debugging log
    const { id } = req.query; // Doctor ID from the route parameter
    console.log("Received doctor ID:", id); // Debugging log

    if (!id) {
      console.log("Doctor ID is missing"); // Debugging log
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    // Fetch doctor details from the database
    const doctorData = await Doctor.findOne({
      where: { user_id: id },
    });

    if (!doctorData) {
      console.log("Doctor not found"); // Debugging log
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log("Doctor data retrieved:", doctorData); // Debugging log

    // Fetch user data for the doctor
    const userData = await User.findOne({
      where: { id: doctorData.user_id },
      attributes: ["email"], // Fetch only the email field
    });

    console.log("User data retrieved:", userData); // Debugging log

    // Fetch specialization data for the doctor
    const specializationData = await Specialization.findOne({
      where: { id: doctorData.specialization_id },
      attributes: ["name"], // Fetch only the specialization name
    });

    //fetch schedule data for the doctor
    const scheduleData = await Schedule.findOne({
      where: { doctor_id: doctorData.user_id },
      //   attributes: ["schedule_id"], // Fetch only the schedule ID
    });

    // Count the number of doctorData with a "pending" status
    const signupRequestCount = await Doctor.count({
      where: { status: "pending" }, // Assuming "status" field tracks approval
    });

    console.log("Specialization data retrieved:", specializationData); // Debugging log

    return res.status(200).json({
      message: "Doctor details retrieved successfully",
      doctorData: {
        profilePicture: doctorData.profilePictureLocation,
        id: doctorData.user_id,
        nationalID: doctorData.national_id,
        firstName: doctorData.first_name,
        lastName: doctorData.last_name,
        dateOfBirth: doctorData.date_of_birth,
        gender: doctorData.gender,
        specialization: specializationData ? specializationData.name : "",
        email: userData ? userData.email : "",
        phoneNumber: doctorData.phone_number,
        address: doctorData.address,
        medicalSchool: doctorData.medical_school_university,
        medicalLicenseNumber: doctorData.medical_license_number,
        yearsOfExperience: doctorData.years_of_experience,
        bio: doctorData.bio,
        scheduleId: scheduleData ? scheduleData.id : "",
        scheduleComment: scheduleData ? scheduleData.comment : "", // Include schedule ID if available
        scheduleDate: scheduleData ? scheduleData.schedule_date : "",
        scheduleTime: scheduleData ? scheduleData.time : "", // Include schedule if available

        signupRequestCount: signupRequestCount, // Include the count of pending signup requests
      },
    });
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    return res.status(500).json({ message: "An internal error occurred" });
  }
};

exports.getSignupRequests = async (req, res) => {
  try {
    // Fetch doctorData with a "pending" status
    const signupRequests = await Doctor.findAll({
      where: { status: "pending" }, // Assuming "status" field tracks approval
      attributes: ["user_id", "first_name", "last_name", "created_at"], // Fetch only necessary fields
      order: [["created_at", "DESC"]], // Order by signup date (most recent first)
    });

    if (!signupRequests || signupRequests.length === 0) {
      return res.status(404).json({ message: "No signup requests found" });
    }

    return res.status(200).json({
      message: "Signup requests retrieved successfully",
      requests: signupRequests.map((request) => ({
        id: request.user_id,
        name: `${request.first_name} ${request.last_name}`,
        date: request.created_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching signup requests:", error);
    return res.status(500).json({ message: "An internal error occurred" });
  }
};
exports.acceptSignupRequest = async (req, res) => {
  try {
    const { id } = req.body; // doctorData ID from the route parameter

    // Find the doctorData with the given ID
    const doctorData = await Doctor.findOne({
      where: { user_id: id }, // Ensure the doctorData is in "pending" status
    });

    console.log("doctorData:", doctorData); // Debugging log

    if (!doctorData) {
      return res.status(404).json({ message: "Signup request not found " });
    }

    if (doctorData.status == "approved") {
      return res.status(200).json({ message: "Already approved" });
    }

    // Update the doctorData's status to "approved"
    doctorData.status = "approved";
    await doctorData.save();

    return res.status(200).json({
      message: "Signup request approved successfully",
      doctorData: {
        id: doctorData.id,
        name: `${doctorData.first_name} ${doctorData.last_name}`,
        status: doctorData.status,
      },
    });
  } catch (error) {
    console.error("Error approving signup request:", error);
    return res.status(500).json({ message: "An internal error occurred" });
  }
};
exports.uploadPatientProfilePicture = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Update the doctor's profile picture location in the database
    const doctorData = await Doctor.findOne({
      where: { user_id: id },
    });

    if (!doctorData) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctorData.profilePictureLocation = `/uploads/storage/${id}/profilepictures/${req.file.filename}`;
    await doctorData.save();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: doctorData.profile_picture,
      profilePictureLocation: `http://localhost:5000${doctorData.profile_picture}`,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({ message: "An internal error occurred" });
  }
};
