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
    <div className="container mt-5 mb-5">
      <div className="row gutters">
        {/* Profile Picture Section */}
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12" >
          <div className="card h-100" style={{ background: '#ECE6E6'}}>
            <div className="card-body">
              <div className="account-settings">
                <div className="user-avatar">
                  <div style={{
                    width: '100%',
                    height: '250px',
                    background: '#BEBEBE',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1.2rem',
                    color: '#fff'
                  }}>
                    Add a photo
                  </div>
                </div>
                <div className="mt-3">
                  <button className="btn w-100" style={{background: '#112D4E', color: 'white'}}>Edit Profile Picture</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
          <div className="card h-100" style={{ background: '#ECE6E6'}}>
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3" onSubmit={handleSubmit}>
                    <label htmlFor="patientId"><b>Patient ID</b></label>
                    <input
                      type="text"
                      className="form-control"
                      id="patientId"
                      name="patientId"
                      value={profileData.patientId}
                      onChange={handleInputChange}
                      placeholder="Enter Patient ID"
                      
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="regDate"><b>Registration Date</b></label>
                    <input
                      type="date"
                      className="form-control"
                      id="regDate"
                      name="registrationDate"
                      value={profileData.registrationDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="firstName"><b>First Name</b></label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter First Name"
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="lastName"><b>Last Name</b></label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter Last Name"
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="phoneNumber"><b>Phone Number</b></label>
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Phone Number"
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="gender"><b>Gender</b></label>
                    <input
                      type="text"
                      className="form-control"
                      id="gender"
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      placeholder="Enter Gender"
                    />
                  </div>
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="email"><b>Email</b></label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email"
                    />
                  </div>
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="address"><b>Address</b></label>
                    <textarea
                      className="form-control"
                      id="address"
                      rows="3"
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder="Enter Address"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
