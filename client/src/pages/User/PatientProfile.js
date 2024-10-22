import React, { useState, useEffect } from 'react';
import '../../styles/user/PatientProfile.css';
import axios from 'axios'; // Import axios to make HTTP requests

function PatientProfile() {
  const [profileData, setProfileData] = useState({
    patientId: '',
    registrationDate: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    email: '',
    address: '',
    profilePicture: '', // If you want to display a profile picture
  });
  
  const [loading, setLoading] = useState(true);

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = "123"; // Replace with dynamic user ID, if needed.
        const response = await axios.get(`http://localhost:5000/api/user-profile/${userId}`); // Replace with your backend API
        if (response.status === 200) {
          setProfileData(response.data); // Assuming the API returns data in the required format
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make an API call to save the profile data (e.g., POST or PUT request)
      const response = await axios.put(`http://localhost:5000/api/user-profile/${profileData.patientId}`, profileData);
      if (response.status === 200) {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Profile Picture Section */}
        <div className="col-md-4 d-flex flex-column align-items-center">
          <div className="profile-picture-wrapper mb-3">
            <div className="profile-picture d-flex align-items-center justify-content-center">
              <img 
                src={profileData.profilePicture || '/path/to/default-image.png'} 
                alt="Profile" 
                className="profile-picture-img" 
              />
            </div>
          </div>
          <button className="btn btn-primary">Edit Profile Picture</button>
        </div>

        {/* Form Section */}
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="patientId" className="form-label">Patient ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="patientId"
                  name="patientId"
                  value={profileData.patientId}
                  onChange={handleInputChange}
                  disabled // Patient ID should not be editable
                />
              </div>
              <div className="col">
                <label htmlFor="registrationDate" className="form-label">Registration Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="registrationDate"
                  name="registrationDate"
                  value={profileData.registrationDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  className="form-control"
                  id="gender"
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                rows="3"
                value={profileData.address}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
