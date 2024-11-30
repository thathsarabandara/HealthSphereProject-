import React, { useState, useEffect } from 'react';
import '../../styles/user/PatientProfile.css';
import emptyImage from '../../assets/images/emptyProfile.png';
import axios from 'axios'; // Import axios to make HTTP requests
import Loader from '../../components/common/Loader';
import ErrorPopup from '../../components/common/error popup/ErrorPopup';
import SuccessPopup from '../../components/common/success popup/SuccessPopup';
let pp;

function PatientProfile() {
  const [profileData, setProfileData] = useState({
    id: '',
    registrationDate: '',
    first_name: '',
    last_name: '',
    last_name: '',
    gender: '',
    email: '',
    address: '',
    profilePicture: '', // If you want to display a profile picture
  });

  const [loading, setLoading] = useState(true);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const handleErrorClose = () => setErrorVisible(false);
  const handleSuccessClose = () => setSuccessVisible(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/userprofile`, { withCredentials: true }); // Replace with your backend API
        if (response.status === 200) {
          const data = response.data.data;
  
          // Update the profilePicture path if it exists
          if (data?.profilePicture) {
            pp = `http://localhost:5000/uploads/storage/patient/${data.id}/profilepictures/${data?.profilePicture}`;
            data.profilePicture = '';
          }else{
            pp = emptyImage
          }
          setProfileData(data); 
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  if (loading) {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        pp = reader.result
        setProfileData({
          ...profileData,
          profilePicture: reader.result,  // For image preview (base64)
          fileObject: file,               // Keep the file object for upload
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', profileData.id)
    formData.append('first_name', profileData.first_name);
    formData.append('last_name', profileData.last_name);
    formData.append('phone_number', profileData.phone_number);
    formData.append('gender', profileData.gender);
    formData.append('date_of_birth', profileData.date_of_birth);
    formData.append('address', profileData.address);
  
    // Send the actual file
    if (profileData.fileObject) {
      formData.append('profilePicture', profileData.fileObject); 

    axios.put(`http://localhost:5000/userprofile/${profileData.id}`, formData)
         .then(res => {
          setSuccessVisible(true);
         })
         .catch(err => {
          setErrorVisible(true)
         });
      }
    }
  
  return (
    <div>
      <ErrorPopup show={errorVisible} onClose={handleErrorClose} title="Something Went Wrong!" message="Profile Update Failed Try again!" button='Okay' />
      <SuccessPopup show={successVisible} onClose={handleSuccessClose} title="Updated Success Fully " message="Profile Updated Successfully !" button='Okay' />
    <div className="container mt-5 mb-5">
      <div className="row gutters">
        {/* Profile Picture Section */}
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
      <div className="card h-100" style={{ background: '#ECE6E6' }}>
        <div className="card-body">
          <div className="account-settings">
            <div className="user-avatar">
              <img
                style={{
                  width: '30vh',
                  height: '30vh',
                  maxHeight: '250px',
                  borderRadius: '50%',
                  background: '#bebebe',
                }}
                src={pp || emptyImage}
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = emptyImage; // Use fallback image
                }}
              />
            </div>
            <div className="mt-3">
              <input
                type="file"
                id="profile-picture-upload"
                accept="image/*"
                style={{ display: 'none' }} // Hide the default input
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
                      name="id"
                      value={profileData.id}
                      onChange={handleInputChange}
                      placeholder="Enter Patient ID"
                      disabled
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="regDate"><b>Registration Date</b></label>
                    <input
                      type="text"
                      className="form-control"
                      id="regDate"
                      name="registrationDate"
                      value={profileData.registrationDate.split('T')[0]}
                      onChange={handleInputChange}
                      disabled
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
                      name="first_name"
                      value={profileData.first_name}
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
                      name="last_name"
                      value={profileData.last_name}
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
                      name="phone_number"
                      value={profileData.phone_number}
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

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="gender"><b>Date of birth</b></label>
                    <input
                      type="date"
                      className="form-control"
                      id="gender"
                      name="date_of_birth"
                      value={profileData.date_of_birth}
                      onChange={handleInputChange}

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
                      disabled
                    />
                  </div>
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="form-group mt-3">
                    <label htmlFor="address"><b>Address</b></label>
                    <textarea
                      className="form-control"
                      id="address"
                      name='address'
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
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>
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
    </div>
  );
}

export default PatientProfile;
