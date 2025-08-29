const { Schedule } = require("../../models/healthcare/Schedule");
const { ScheduleCancel } = require("../../models/healthcare/ScheduleCancel");
const { Doctor } = require("../../models/healthcare/Doctor");
const { User } = require("../../models/auth/User");
const { sendScheduleApprovalEmail, sendScheduleRejectionEmail } = require('../../services/doctorEmailServices');

exports.getScheduleRequest = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Fetch pending schedules
    const pendingSchedules = await Schedule.findAll({
      where: {
        status: "pending",
      },
    });

    // Fetch rejected schedules
    const rejectedSchedules = await Schedule.findAll({
      where: {
        status: "rejected",
      },
    });

    // Fetch cancelled schedule reasons
    const rejectedScheduleIds = rejectedSchedules.map(schedule => schedule.id);
    const scheduleCancellations = await ScheduleCancel.findAll({
      where: {
        schedule_id: rejectedScheduleIds,
      },
      attributes: ["schedule_id", "admin_feedback"],
    });

    const feedbackMap = {};
    scheduleCancellations.forEach(cancel => {
      feedbackMap[cancel.schedule_id] = cancel.admin_feedback;
    });

    // Get doctor names by querying Doctor model separately for pending schedules
    const pendingDoctorIds = pendingSchedules.map(schedule => schedule.doctor_id);
    const rejectedDoctorIds = rejectedSchedules.map(schedule => schedule.doctor_id);
    const allDoctorIds = [...new Set([...pendingDoctorIds, ...rejectedDoctorIds])];
    
    const doctors = await Doctor.findAll({
      where: {
        id: allDoctorIds,
      },
      attributes: ['id', 'first_name', 'last_name'],
    });

    // Create a map for doctor names
    const doctorMap = {};
    doctors.forEach(doctor => {
      doctorMap[doctor.id] = {
        first_name: doctor.first_name,
        last_name: doctor.last_name
      };
    });

    // Merge schedules with feedback and doctor names
    const pendingSchedulesWithDoctors = pendingSchedules.map(schedule => ({
      ...schedule.toJSON(),
      doctor_first_name: doctorMap[schedule.doctor_id] ? doctorMap[schedule.doctor_id].first_name : null,
      doctor_last_name: doctorMap[schedule.doctor_id] ? doctorMap[schedule.doctor_id].last_name : null
    }));

    const rejectedSchedulesWithFeedbackAndDoctors = rejectedSchedules.map(schedule => ({
      ...schedule.toJSON(),
      admin_feedback: feedbackMap[schedule.id] || null,
      doctor_first_name: doctorMap[schedule.doctor_id] ? doctorMap[schedule.doctor_id].first_name : null,
      doctor_last_name: doctorMap[schedule.doctor_id] ? doctorMap[schedule.doctor_id].last_name : null
    }));

    // Return the schedules and merged data
    return res.status(200).json({
      requests: pendingSchedulesWithDoctors,
      rejectedSchedules: rejectedSchedulesWithFeedbackAndDoctors,
    });

  } catch (error) {
    console.error("Error fetching schedule requests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.makeAcceptScheduleRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { room } = req.body; // Extract room from request body

    if (!room) {
      return res.status(400).json({ error: "Room number is required" });
    }

    const schedule = await Schedule.findOne({ 
      where: { id }
    });

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    const doctor = await Doctor.findOne({
      where: { id: schedule.doctor_id }
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    } 
    const user = await User.findOne({
      where: { id: doctor.user_id }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }     

    // Assign the room number
    schedule.room_number = room;
    schedule.status = "available";
    await schedule.save();

    // Send approval email
    if (user) {
      await sendScheduleApprovalEmail(user.email, {
        id: schedule.id,
        date: schedule.schedule_date,
        time: schedule.schedule_time,
        room: room
      });
    }

    return res.status(200).json({
      message: "Schedule accepted successfully",
      schedule: schedule,
    });

  } catch (error) {
    console.error("Error accepting schedule:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.makeRejectScheduleRequest = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params; 
    const { rejectReason } = req.body; 

    const schedule = await Schedule.findOne({ 
      where: { id },
    });

    const doctor = await Doctor.findOne({
      where: { id: schedule.doctor_id }
    });

    const user = await User.findOne({
      where: { id: doctor.user_id }
    });

    if (!schedule) {
      console.log("Schedule not found");
      return res.status(404).json({ error: "Schedule not found" });
    }

    schedule.status = "rejected";
    await schedule.save();
    console.log(schedule);

    await ScheduleCancel.create({
      schedule_id: schedule.id,
      status:'rejected',
      admin_feedback: rejectReason,
      doctor_feedback: null,
    });

    // Send rejection email
    if (user) {
      await sendScheduleRejectionEmail(user.email, {
        id: schedule.id,
        date: schedule.schedule_date,
        time: schedule.schedule_time
      }, rejectReason);
    }

    return res.status(200).json({
      message: "Schedule rejected successfully",
      schedule: schedule,
    });

  } catch (error) {
    console.error("Error rejecting schedule:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
