import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import emptyImage from '../../assets/images/emptyProfile.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DoctorFullRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '', 
    last_name: '', 
    date_of_birth: '',
    phone_number: '', 
    gender: '',
    email: '',
    address: '',
    profile_description: '',
    medical_license_number: '',
    specialization: '',
    years_of_experience: '', 
    hospital_clinic_affiliation: '', 
    medical_school_university: '', 
    profilePicture: null,
    nationalId: null,
    medicalLicenseDoc: null,
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(emptyImage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
        zIndex: 9999
      }}>
        <Loader />
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result); // Update preview
      };
      reader.readAsDataURL(file);
    }
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const doctorData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {  // Ensure you're not appending null/undefined values
        doctorData.append(key, formData[key]);
      }
    });
    
    // Axios POST request wrapped in a Promise
    axios.post(`http://localhost:5000/doctor/fullregister/${id}`, doctorData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }, 
      withCredentials: true,
    })
    .then((response) => {
      console.log('Registration request submitted successfully:', response);
      notifySuccess('Registration request submitted successfully!');
      navigate('/doctor/login'); // Navigate to another page after submission
    })
    .catch((err) => {
      console.log(formData)
      console.error('Error submitting registration request:', err);
      notifyError('There was an error while submitting your registration. Please try again later.');
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="container p-4 mt-5 mb-5"
        style={{ maxWidth: '800px', borderRadius: '8px', backgroundColor: '#f5f5f5' }}
      >
      <div className="row mb-4">
        {/* Profile Picture and Edit Button */}
        <div className="col-12 col-md-4 text-center">
          <div style={{
            width: '100%',
            padding: '20px'
          }}>
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              margin: '0 auto',
              border: '3px solid #112D4E',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <img
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                src={profilePicturePreview}
                alt="profile"
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                opacity: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <input
                  type="file"
                  id="profile-picture-upload"
                  accept="image/*"
                  name="profilePicture"
                  onChange={handleFileChange}
                  style={{
                    display: 'none'
                  }}
                />
                <label htmlFor="profile-picture-upload" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}>
                  <i className="fas fa-camera" style={{
                    fontSize: '32px',
                    color: '#007bff'
                  }}></i>
                  <span style={{
                    fontWeight: 'bold',
                    color: '#007bff',
                    fontSize: '16px'
                  }}>Change Photo</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="col-12 col-md-8">
          <h5>Personal Information</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="first_name"  // Match with formData key
                className="form-control"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="last_name"  // Match with formData key
                className="form-control"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"  // Match with formData key
                className="form-control"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone_number"  // Match with formData key
                className="form-control"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                name="gender"  // Match with formData key
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                className="form-control"
                rows="2"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="row mb-4">
        <div className="col-12">
          <label className="form-label">Description of you</label>
          <textarea
            name="profile_description"  // Match with formData key
            className="form-control"
            rows="3"
            style={{ backgroundColor: '#ede7e3' }}
            value={formData.profile_description}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* Professional Information Section */}
      <h5>Professional Information</h5>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Medical License Number</label>
          <input
            type="text"
            name="medical_license_number"  // Match with formData key
            className="form-control"
            style={{ background: '#ECE6E6' }}
            value={formData.medical_license_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Specialization</label>
          <select
            name="specialization"
            className="form-control"
            style={{ background: '#ECE6E6' }}
            value={formData.specialization}
            onChange={handleChange}
            required
          >
            <option value="">Select Specialization</option>
            <option value="1">General Practitioner</option>
            <option value="2">Pediatrician</option>
            <option value="3">Cardiologist</option>
            <option value="4">Dermatologist</option>
            <option value="5">Neurologist</option>
            <option value="6">Oncologist</option>
            <option value="7">Psychiatrist</option>
            <option value="8">Endocrinologist</option>
            <option value="9">Gastroenterologist</option>
            <option value="10">Orthopedic Surgeon</option>
            <option value="11">Ophthalmologist</option>
            <option value="12">Pulmonologist</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Years of Experience</label>
          <input
            type="number"
            name="years_of_experience"  // Match with formData key
            className="form-control"
            style={{ background: '#ECE6E6' }}
            value={formData.years_of_experience}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label">Hospital/Clinic Affiliation</label>
          <input
            type="text"
            name="hospital_clinic_affiliation"  // Match with formData key
            className="form-control"
            style={{ background: '#ECE6E6' }}
            value={formData.hospital_clinic_affiliation}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Medical School/University</label>
          <input
            type="text"
            name="medical_school_university"  // Match with formData key
            className="form-control"
            style={{ background: '#ECE6E6' }}
            value={formData.medical_school_university}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Identification Documents Section */}
      <h5>Identification Documents</h5>
      <div className="mb-3">
        <label className="form-label">National ID/Passport</label>
        <input
          type="file"
          name="nationalId"  // Match with formData key
          className="form-control"
          style={{ background: '#ECE6E6' }}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Medical License Document</label>
        <input
          type="file"
          name="medicalLicenseDoc"  // Match with formData key
          className="form-control"
          style={{ background: '#ECE6E6' }}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button type="submit" className="btn btn-success btn-lg">
          Request for Registration
        </button>
      </div>
    </form>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </div>
  );
}

export default DoctorFullRegister;
