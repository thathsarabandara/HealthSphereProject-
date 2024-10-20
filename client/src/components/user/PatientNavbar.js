import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Navbar.css'
import banner from '../../assets/images/banner-img.png'
import { MdAccountCircle } from "react-icons/md";

function PatientNavbar() {
  return (
    <nav className="navbar navbar-expand-lg ">
    <div className="container">
    
    
    <img src={banner} className='logo'/>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
    </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <Link to="/" className='nav-link active'>Home</Link>
            </li>
            <li className="nav-item">
                <Link to="/doctors" className='nav-link active'>Doctors</Link>
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
        
        </ul>
        <div className='btn'>
            <button className="btn1 btn-outline">
                <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link>
            </button>
            <button className="btn2 btn-outline">
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Log in</Link>
            </button>
        </div>
        <div className='icon'><MdAccountCircle className='account-icon'/></div>
      
        </div>
    </div>
    </nav>
  )
}

export default PatientNavbar