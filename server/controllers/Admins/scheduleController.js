const { Schedule } = require("../../models/healthcare/Schedule");
const { ScheduleCancel } = require("../../models/healthcare/ScheduleCancel");
const { Doctor } = require("../../models/healthcare/Doctor");

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

    // Get doctor names by querying Doctor model separately
    const doctorIds = rejectedSchedules.map(schedule => schedule.doctor_id);
    const doctors = await Doctor.findAll({
      where: {
        id: doctorIds,
      },
      attributes: ['id', 'first_name'], // Only fetching id and first_name
    });

    // Create a map for doctor names
    const doctorMap = {};
    doctors.forEach(doctor => {
      doctorMap[doctor.id] = doctor.first_name;
    });

    // Merge schedules with feedback and doctor names
    const rejectedSchedulesWithFeedbackAndDoctors = rejectedSchedules.map(schedule => ({
      ...schedule.toJSON(),
      admin_feedback: feedbackMap[schedule.id] || null,
      doctor_first_name: doctorMap[schedule.doctor_id] || null, // Add doctor first name
    }));

    // Return the schedules and merged data
    return res.status(200).json({
      requests: pendingSchedules,
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
        const schedule = await Schedule.findOne({ where: { id } });

        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        schedule.status = "available";
        await schedule.save();

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
        const { id } = req.params; 
        const { rejectReason } = req.body; 

        const schedule = await Schedule.findOne({ where: { id } });

        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        schedule.status = "rejected";
        await schedule.save();

        await ScheduleCancel.create({
            schedule_id: schedule.id,
            status:'rejected',
            admin_feedback: rejectReason,
            doctor_feedback: null,
        });

        return res.status(200).json({
            message: "Schedule rejected successfully",
            schedule: schedule,
        });

    } catch (error) {
        console.error("Error rejecting schedule:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
