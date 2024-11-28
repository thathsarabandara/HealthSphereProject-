import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import emptyImage from '../../assets/images/emptyProfile.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

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
      alert('Registration request submitted successfully!');
      navigate('doctor/login'); // Navigate to another page after submission
    })
    .catch((err) => {
      console.log(formData)
      console.error('Error submitting registration request:', err);
      alert('There was an error while submitting your registration. Please try again later.');
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container p-4 mt-5 mb-5"
      style={{ maxWidth: '800px', borderRadius: '8px', backgroundColor: '#f5f5f5' }}
    >
      <div className="row mb-4">
        {/* Profile Picture and Edit Button */}
        <div className="col-12 col-md-4 text-center">
          <img
            className="d-inline-block"
            style={{ width: '180px', height: '180px', borderRadius: '50%' }}
            src={profilePicturePreview}
            alt="profile"
          />
          <div className="mt-2">
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              style={{ display: 'none' }}
              name="profilePicture"
              onChange={handleFileChange}
            />
            <label
              htmlFor="profile-picture-upload"
              className="btn w-100"
              style={{
                background: '#112D4E',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Edit Profile Picture
            </label>
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
          <input
            type="text"
            name="specialization"  // Match with formData key
            className="form-control"
            style={{ background: '#ECE6E6' }}
            value={formData.specialization}
            onChange={handleChange}
            required
          />
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
  );
}

export default DoctorFullRegister;
