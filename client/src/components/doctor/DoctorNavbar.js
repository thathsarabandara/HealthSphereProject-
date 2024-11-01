import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';
import banner from '../../assets/images/banner-img.png';
import { MdAccountCircle } from "react-icons/md";
import emptyImage from '../../assets/images/emptyProfile.png';
import axios from 'axios';

function DoctorNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user authentication status and profile data from the backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/', { withCredentials: true });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on mount
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/logout', null, { withCredentials: true });
      
      if (response.status === 200) {
        console.log('Logout successful:', response.data.message);
        setIsAuthenticated(false);
        setUser(null);
        // Redirect to the homepage or login page
        window.location.href = '/login'; // Adjust as necessary
      }
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
      // Handle error (e.g., show a notification)
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state while data is being fetched
  }

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <img src={banner} className='logo' alt="Logo" />

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/doctor/home" className='nav-link active'>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/doctor/about" className='nav-link active'>About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/doctor/dashboard" className='nav-link active'>Dashboard</Link>
            </li>
            <li className='nav-item'>
              <Link to="/schedule" className='nav-link active'>Schedule</Link>
            </li>
            <li className='nav-item'>
              <Link to="/doctor/videoconsultation" className='nav-link active'>Video Consultation</Link>
            </li>
            <li className='nav-item'>
              <Link to="/doctor/clinic" className='nav-link active'>Clinic</Link>
            </li>
            <li className='nav-item'>
              <Link to="/doctor/profile" className='nav-link active'>Profile</Link>
            </li>
          </ul>

          <div className='header'>
            {isAuthenticated ? (
                <div className='user-section'>
                  <div className='profile-name d-flex flex-column'>
                    <h4 className='hello'>Welcome to the Healthsphere,</h4>
                    <h5 className='name'>Dear, {user ? user.name : 'User'}</h5> {/* Added check here */}
                  </div>
                  <div className='profile-container'>
                      <img
                        src={user?.profilePicture || emptyImage} // Use optional chaining here
                        alt='Profile'
                        className='profile-photo'
                        onClick={toggleDropdown}
                      />
                      {showDropdown && (
                        <div className='profile-dropdown'>
                          <Link to='/userprofile' className='dropdown-item'>Profile</Link>
                          <Link to='/user_prescription' className='dropdown-item'>User Prescriptions</Link>
                          <Link to='/user_payments' className='dropdown-item'>User Payments</Link>
                          <Link to="#" className='dropdown-item' onClick={handleLogout}>Logout</Link>
                        </div>
                      )}
                  </div>
                </div>
            ) : (
                <div className='btn-container ms-5'>
                  <button className='btn1 btn-outline'>
                    <Link to='/doctor/register' style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link>
                  </button>
                  <button className='btn2 btn-outline'>
                    <Link to='/doctor/login' style={{ textDecoration: 'none', color: 'inherit' }}>Log in</Link>
                  </button>
                  <div className='icon'>
                    <MdAccountCircle className='account-icon' />
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DoctorNavbar