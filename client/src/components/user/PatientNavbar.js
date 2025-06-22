import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';
import banner from '../../assets/images/banner-img.png';
import { MdAccountCircle, MdEvent, MdShoppingCart } from "react-icons/md"; // Import cart icon
import emptyImage from '../../assets/images/emptyProfile.png';
import axios from 'axios';

function PatientNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAuthenticated') === 'true');
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const formatUserName = (name) => {
    if (!name) return 'User';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0];
    
    const lastName = nameParts.pop();
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join('.');
    return `${initials}. ${lastName}`;
  };

  // Fetch user authentication status and profile data from the backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/', { withCredentials: true });
      
      if (response.status === 200) {
        setIsAuthenticated(true);
        sessionStorage.setItem('isAuthenticated', 'true');
  
        const fetchedUser = response.data.data;
  
        // Check if the profile picture exists and update its URL
        if (fetchedUser.profile_picture) {
          fetchedUser.profile_picture = `http://localhost:5000/uploads/storage/patient/${fetchedUser.id}/profilepictures/${fetchedUser.profile_picture}`;
        }
  
        // Now update the user state with the correct profile picture URL
        setUser(fetchedUser);
      } else {
        setIsAuthenticated(false);
        sessionStorage.removeItem('isAuthenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsAuthenticated(false);
      sessionStorage.removeItem('isAuthenticated');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // Fetch user data on mount
    fetchUserData();

    // Listen for login event
    const handleLoginEvent = () => {
      fetchUserData();
    };
    window.addEventListener("userLogin", handleLoginEvent);

    // Clean up event listener on unmount
    return () => window.removeEventListener("userLogin", handleLoginEvent);
  }, []);

  // Function to handle outside clicks
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
        sessionStorage.removeItem('isAuthenticated');
        setUser(null);
        window.location.href = '/login'; // Redirect to login page after logout
      }
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
    }
  };



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
              <Link to="/" className='nav-link active'>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/finddoctors" className='nav-link active'>Doctors</Link>
            </li>
            <li className="nav-item">
              <Link to="/packages" className='nav-link active'>Packages</Link>
            </li>
            <li className='nav-item'>
              <Link to="/pharmacy" className='nav-link active'>Pharmacy</Link>
            </li>
            <li className='nav-item'>
              <Link to="/laboratory" className='nav-link active'>Laboratory</Link>
            </li>
            <li className='nav-item'>
              <Link to="/about" className='nav-link active'>About Us</Link>
            </li>

            {/* Cart Icon, placed after other nav items */}
            <li className='nav-item'>
              <Link to="/cart" className="nav-link active">
                <MdShoppingCart className="cart-icon" />
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/bookings" className="nav-link active">
                <MdEvent className="booking-icon" />
              </Link>
            </li>
          </ul>

          <div className='header'>
            {isAuthenticated ? (
              <div className='user-section'>
                 <div className='profile-name d-flex flex-column'>
                    <h4 className='hello'>Welcome to the Healthsphere,</h4>
                    <h5 className='name'>{user ? user.name : 'User'}</h5> {/* Added check here */}
                  </div>
                <div className='profile-container'>
                  <img
                    src={user?.profile_picture || emptyImage }
                    alt='Profile'
                    className='profile-photo'
                    onClick={toggleDropdown}
                  />
                  {showDropdown && (
                    <div className='profile-dropdown' ref={dropdownRef}>
                      <Link to='/userprofile' className='dropdown-item'>Profile</Link>
                      <Link to='/medicalcondions' className='dropdown-item'>Conditions</Link>
                      <Link to='/prescriptionhistory' className='dropdown-item'>Prescriptions</Link>
                      <Link to='/paymenthistory' className='dropdown-item'>Payments</Link>
                      <Link to='/refund' className='dropdown-item'>Refund</Link>
                      <Link to="#" className='dropdown-item' onClick={handleLogout}>Logout</Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='btn-container ms-5'>
                <button className='btn1 btn-outline'>
                  <Link to='/register' style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link>
                </button>
                <button className='btn2 btn-outline'>
                  <Link to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>Log in</Link>
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

export default PatientNavbar;
