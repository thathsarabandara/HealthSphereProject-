import React, { useState, useEffect } from 'react';
import '../../../styles/user/PatientProfile.css';
import emptyImage from '../../../assets/images/emptyProfile.png';
import axios from 'axios';
import Loader from '../../../components/common/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const [profileData, setProfileData] = useState({
    id: '',
    registrationDate: '',
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    address: '',
    profilePicture: '',
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);

  const [pp, setPp] = useState(emptyImage);

  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/userprofile`, { withCredentials: true });
        if (response.status === 200) {
          const data = response.data.data;

          // Update profile picture preview
          if (data?.profilePicture) {
            setPp(`http://localhost:5000/uploads/storage/patient/${data.id}/profilepictures/${data.profilePicture}`);
          } else {
            setPp(emptyImage);
          }

          setProfileData(data);
          setOriginalData(data);
          toast.success('Profile data loaded successfully!', {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored"
          } );
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data!', {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored"
        });
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPp(reader.result);
        setProfileData({
          ...profileData,
          profilePicture: reader.result,
          fileObject: file,
        });
      };
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
  
    const formData = new FormData();
  
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== originalData[key] && key !== 'fileObject') {
        formData.append(key, profileData[key]);
      }
    });
  
    if (profileData.fileObject) {
      formData.append('profilePicture', profileData.fileObject);
    }
  
    if ([...formData.keys()].length === 0) {
      console.log('No changes made.');
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/userprofile/${profileData.id}`, formData);
      if (response.status === 200) {
        const data = response.data.data;
        
        // Update profile picture preview
        if (data?.profilePicture) {
          setPp(`http://localhost:5000/uploads/storage/patient/${data.id}/profilepictures/${data.profilePicture}`);
        } else {
          setPp(emptyImage);
        }
        
        setProfileData(data);
        setOriginalData(data);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile!');
    } finally {
      setSaveLoading(false);
    }
  };
  
  
  const hasChanges = Object.keys(profileData).some(
    (key) => profileData[key] !== originalData[key]
  );

  return (
    <div>
        <div className="container mt-5 mb-5">
      <div className="row gutters">
        {/* Profile Picture */}
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
          <div className="card h-100" style={{ background: '#ECE6E6' }}>
            <div className="card-body">
              <div className="account-settings">
                <div className="user-avatar">
                   <div className="profile-picture-container">
                     <div className="profile-picture-wrapper">
                       <img
                         src={pp || emptyImage}
                         alt="profile"
                         onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = emptyImage;
                         }}
                         style={{ 
                           width: '100%', 
                           height: '100%', 
                           objectFit: 'cover',
                           borderRadius: '50%',
                           border: pp ? '2px solid white' : 'none'
                         }}
                       />
                     </div>
                   </div>
                </div>
                <div className="mt-3">
                  <input type="file" id="profile-picture-upload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                  <label htmlFor="profile-picture-upload" className="btn w-100" style={{ background: '#112D4E', color: 'white', cursor: 'pointer', textAlign: 'center' }}>
                    Edit Profile Picture
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
          <div className="card h-100" style={{ background: '#ECE6E6' }}>
            <div className="card-body">
              <div className="row gutters">
                {/* ID */}
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label><b>Patient ID</b></label>
                    <input type="text" className="form-control" value={profileData.id} disabled />
                  </div>
                </div>

                {/* Registration Date */}
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label><b>Registration Date</b></label>
                    <input type="text" className="form-control" value={profileData.registrationDate?.split('T')[0]} disabled />
                  </div>
                </div>

                {/* First Name */}
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label><b>First Name</b></label>
                    <input type="text" className="form-control" name="first_name" value={profileData.first_name} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Last Name */}
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label><b>Last Name</b></label>
                    <input type="text" className="form-control" name="last_name" value={profileData.last_name} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label><b>Phone Number</b></label>
                    <input type="text" className="form-control" name="phone_number" value={profileData.phone_number} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Gender */}
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label><b>Gender</b></label>
                    <select className="form-control" name="gender" value={profileData.gender} onChange={handleInputChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group mt-3">
                    <label><b>Date of Birth</b></label>
                    <input type="date" className="form-control" name="date_of_birth" value={profileData.date_of_birth ? profileData.date_of_birth.split('T')[0] : ''} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Email */}
                <div className="col-12">
                  <div className="form-group mt-3">
                    <label><b>Email</b></label>
                    <input type="email" className="form-control" value={profileData.email} disabled />
                  </div>
                </div>

                {/* Address */}
                <div className="col-12">
                  <div className="form-group mt-3">
                    <label><b>Address</b></label>
                    <textarea className="form-control" name="address" rows="3" value={profileData.address} onChange={handleInputChange}></textarea>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary">Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  disabled={saveLoading}
                  onClick={handleSubmit}
                >
                  {saveLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Profile;
