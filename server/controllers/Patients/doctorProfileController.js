const { User } = require("../../models/auth/User");
const { Review } = require("../../models/content/Review");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Patient } = require("../../models/healthcare/Patient");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Specialization } = require("../../models/healthcare/Specialization");

exports.loadDoctorProfile = async (req, res) => {
  const { doctorid } = req.params;

  try {
      // Fetch doctor details, including specialization name
      const doctor = await Doctor.findOne({
          where: { id: doctorid },
          attributes: ['id', 'first_name', 'last_name', 'bio', 'years_of_experience' , 'date_of_birth', 'gender' , 'phone_number',  'specialization_id', 'profile_picture','user_id'],
      });

      if (!doctor) {
          return res.status(404).json({ error: 'Doctor not found' });
      }

      const specialization = await Specialization.findOne({
          where: { id: doctor.specialization_id },
          attributes: ['name'],
      });

      // Fetch available schedule details
      const schedule = await Schedule.findAll({
          where: { doctor_id: doctorid, status: 'available' },
          attributes: ['schedule_date', 'schedule_time', 'fees'],
      });

      // Fetch reviews for the doctor
      const reviewsData = await Review.findAll({
          where: { doctor_id: doctorid },
          attributes: ['id', 'rating', 'comment', 'created_at', 'patient_id'],
      });

      // Enrich reviews with patient details
      const reviews = await Promise.all(
          reviewsData.map(async (review) => {
              const user = await Patient.findOne({
                  where: { id: review.patient_id },
                  attributes: ['id','first_name', 'last_name', 'profilePictureLocation'],
              });

              return {
                  id: review.id,
                  rating: review.rating,
                  comment: review.comment,
                  createdAt: review.created_at,
                  userid: user?.id || null,
                  patientName: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
                  patientProfilePicture: user?.profilePictureLocation || null,
              };
          })
      );

      // Combine data into the response
      const response = {
          profile: {
              id: doctor.id,
              userid: doctor.user_id,
              firstName: doctor.first_name,
              lastName: doctor.last_name,
              contact: doctor.phone_number,
              dateOfBirth: doctor.date_of_birth,
              gender: doctor.gender,
              bio: doctor.bio,
              experience: doctor.years_of_experience,
              specialization: specialization?.name || 'Unknown',
              profilePicture: doctor.profile_picture,
          },
          schedule: schedule.map((slot) => ({
              date: slot.schedule_date,
              time: slot.schedule_time,
              amount: slot.fees,
          })),
          reviews,
      };
      // Send the combined data as response
      res.status(200).json(response);
  } catch (error) {
      console.error('Error fetching doctor details:', error);
      res.status(500).json({ error: 'An error occurred while fetching doctor details.' });
  }
};
