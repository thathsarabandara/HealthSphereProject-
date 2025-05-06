const{Patient}= require("../../models/healthcare/Patient");
const{Prescription}= require("../../models/healthcare/Prescription");
const{Reservation}= require("../../models/healthcare/Reservation");
const {Doctor} = require("../../models/healthcare/Doctor");
const{Schedule}= require("../../models/healthcare/Schedule");

exports.patientDetails = async(req,res)=>{
   //onsole.log(`accessed`);
    try{
        const {id} = req.query; //query id from the request

        // Validate if the ID is a valid positive integer using regex
        if (!id) {
            return res.status(400).json({ message: 'Patient ID is required.' });
        }
        const isValidId = /^\d+$/.test(id);
        if(!isValidId){
            return res.status(400).json({ message: 'Invalid patient ID. ID must be a positive integer.' });}
        


        const patientData = await Patient.findOne({
            where: { id:id }
        });

        if (!patientData) {
            return res.status(404).json({ message: 'Patient data not found' });
        } 

        console.log(`patientData: ${JSON.stringify(patientData, null, 2)}`);// data comes until here

        const reservationData = await Reservation.findOne({
            where: {patient_id:id}
        });

        if (!reservationData) {
            return res.status(404).json({ message: 'Reservation data not found' });
        } 
        // Log reservation data
        console.log(`reservationData: ${JSON.stringify(reservationData, null, 2)}`);

        const scheduleData =await Schedule.findOne({
            where: {id:reservationData.schedule_id}
        });

        // Log schedule data
        console.log(`scheduleData: ${JSON.stringify(scheduleData, null, 2)}`);

        const doctorData = await Doctor.findOne({
            where: {id:scheduleData.doctor_id}
        });

        // Log doctor data
        console.log(`doctorData: ${JSON.stringify(doctorData, null, 2)}`);



        return res.status(200).json({
            message: 'User authenticated successfully Reservation data found',
            
            data: {
                patientId: patientData.id,
                patientFirstName: patientData.first_name,
                patientLastName: patientData.last_name,
                patientDateOfBirth: patientData.date_of_birth,
                patientGender: patientData.gender,
                patientPhoneNumber: patientData.phone_number,
                patientAddress: patientData.address,
                profilePicture: patientData.profilePictureLocation,
                patientemail: patientData.email,

                reservationId: reservationData.schedule_id,
                reservationDate: reservationData.reservation_date,
                reservationTime: reservationData.reservation_time,
                
                doctorId:scheduleData.doctor_id,
                doctorFirstName:doctorData.first_name,
                doctorLastName: doctorData.last_name,
            
            }
        });
        
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}
exports.loadDoctortProfile = async(req,res)=>{
    try{
        const {id} = req.params;

        const doctorProfileData = await Doctor.findOne({
            where: { id:id }
        });

        console.log(`doctorProfileData: ${JSON.stringify(doctorProfileData, null, 2)}`);// data comes until here

        if (!doctorProfileData) {
            return res.status(404).json({ message: 'Doctor data not found' });
        }
        console.log(`doctorProfileData: ${JSON.stringify(doctorProfileData, null, 2)}`);// data comes until here

      
        return res.status(200).json({
            message: 'Doctor data found successfully',
            data: {
                doctorId:doctorProfileData.id,
                doctorFirstName:doctorProfileData.first_name,
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
                doctorHospitalClinicAffiliation: doctorProfileData.hospital_clinic_affiliation,
                doctorCreatedAt: doctorProfileData.created_at,
                doctorUpdatedAt: doctorProfileData.updated_at,
                doctorProfilePicture: doctorProfileData.profilePictureLocation, 
            }
        });
        
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

exports.saveProfile = async (req, res) => {
    const { id, first_name, last_name, date_of_birth, gender, phone_number, address } = req.body;
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

        // Check if any rows were updated
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Patient not found or no changes made' });
        }

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'An internal error occurred' });
    }
};

exports.loadPrescription = async (req, res) => {
    const { reservationid } = req.params;

    console.log('reservationid:', reservationid); // Debugging

    try {
      // Retrieve the prescription based on the reservation ID and patient ID
      const prescription = await Prescription.findOne({
        where: {
          reservation_id: reservationid,
        },
      });
  
      // If prescription doesn't exist, return an error
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
  
      // Retrieve the patient based on the patient ID
      const patient = await Patient.findOne({
        where: {
          id: prescription.patient_id
        },
      });
  
      // If patient doesn't exist, return an error
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      console.log(`prescription: ${JSON.stringify(prescription, null, 2)}`);// data comes until here
  
      // Respond with the prescription details
      return res.status(200).json({
        patient_name: patient.first_name + ' ' + patient.last_name,
        date_issued: prescription.created_at,
        details: prescription.details,
        special_comments: prescription.special_comments,
        prescription_photo: prescription.prescription_photo,
      });
     
    } catch (error) {
      // Return a server error if there's an issue
      console.error('Error loading prescription:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
