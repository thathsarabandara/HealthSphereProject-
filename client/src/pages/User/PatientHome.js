import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home1 from "../../assets/images/Rectangle 9 (3).svg";
import '../../styles/Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'typeface-anton';
import img1 from '../../assets/images/image-1.svg';
import img2 from '../../assets/images/img-2.svg';
import img3 from '../../assets/images/img-3.svg';
import Rectangle98 from '../../assets/images/Rectangle 98.svg';
import Img0 from '../../assets/images/img-1.svg';
import Img1 from '../../assets/images/img-1 (1).svg';
import Img2 from '../../assets/images/img-1 (2).svg';
import Img3 from '../../assets/images/img-1 (3).svg';
import Img4 from '../../assets/images/img-1 (4).svg';
import Img5 from '../../assets/images/img-1 (5).svg';
import Img6 from '../../assets/images/img-1 (6).svg';
import Img7 from '../../assets/images/img-1 (7).svg';
import Img8 from '../../assets/images/img-1 (8).svg';
import Img9 from '../../assets/images/img-1 (9).svg';
import Loader from '../../components/common/Loader';
import { Bar, Line } from 'react-chartjs-2';
import { FaClinicMedical, FaGift, FaHeartbeat, FaBalanceScale } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import PatientImg from '../../assets/images/profileImg.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


function PatientHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState('../../assets/images/profileImg.png');
  const [patientId, setPatientId] = useState(null);
  const [useremail, setEmail] = useState(null);
  const [patientFirstName, setPatientFirstName] = useState('----');
  const [patientLastName, setPatientLastName] = useState('----');
  const [patientDateOfBirth, setPatientDateOfBirth] = useState('----');
  const [patientGender, setPatientGender] = useState('----');
  const [patientPhoneNumber, setPatientPhoneNumber] = useState('----');
  const [patientAddress, setPatientAddress] = useState('----');
  const [allergies, setAllergies] = useState([]);
  const [bloodSugar, setBloodSugar] = useState([]);
  const [bmi, setBmi] = useState([]);
  const [heartRate, setHeartRate] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [medicalOffer, setOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/', { withCredentials: true });
        if (response.status === 200) {
          setAuthenticated(true);
          const profile = `http://localhost:5000/uploads/storage/patient/${response.data.data.id}/profilepictures/${response.data.data.profile_picture}`;
          const data =response.data.data
          setPatientId(data.id);
          setEmail(data.email);
          setPatientFirstName(data.first_name);
          setPatientLastName(data.last_name);
          setPatientDateOfBirth(data.date_of_birth);
          setPatientGender(data.gender);
          setPatientPhoneNumber(data.phone_number);
          setPatientAddress(data.address);
          setProfilePicture(profile);
          setAllergies(data.allergies);
          setBloodSugar(data.blood_sugar_levels);
          setBmi(data.bmi);
          setHeartRate(data.heart_rate);
          setConditions(data.conditions);
          setOffers(data.offer);
        }
      } catch (error) {
        if (error.response) {
          const statusCode = error.response.status;
          if(statusCode === 401){
            setAuthenticated(false);
          }else{
            setAuthenticated(false);
            setError(statusCode);
          }
        } else {
          setError(500);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

    // Sample data for Blood Sugar (Bar Chart)
    const bloodSugarData = {
      labels: bloodSugar.length > 0 ? bloodSugar.map(record => new Date(record.measurement_time).toLocaleDateString()) : ['No Data'],
      datasets: [
        {
          label: 'Blood Sugar',
          data: bloodSugar.length > 0 ? bloodSugar.map(record => record.blood_sugar_level).concat(Array(5 - bloodSugar.length).fill(0)) : [0],
          backgroundColor: bloodSugar.length > 0 ? bloodSugar.map(record => (record.blood_sugar_level > 100 ? '#e74c3c' : '#4a90e2')).concat(Array(5 - bloodSugar.length).fill('#e74c3c')) : ['#e74c3c'],
          borderRadius: 5,
        },
      ],
    };
  
    // Sample data for Heart Rate (Line Chart)
    const heartRateData = {
      labels: heartRate.length > 0 ? heartRate.map(record => new Date(record.measurement_time).toLocaleDateString()) : ['No Data'],
      datasets: [
        {
          label: 'Heart Rate',
          data: heartRate.length > 0 ? heartRate.map(record => record.heart_rate).concat(Array(5 - heartRate.length).fill(0)) : [0],
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.3)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  
    // Sample data for BMI (Bar Graph)
    const bmiData = {
      labels: bmi.length > 0 ? bmi.map(record => new Date(record.measurement_date).toLocaleDateString()) : ['No Data'],
      datasets: [
        {
          label: 'BMI',
          data: bmi.length > 0 ? bmi.map(record => record.bmi_value).concat(Array(5 - bmi.length).fill(0)) : [0],
          backgroundColor: bmi.length > 0 ? bmi.map(record => {
            const value = record.bmi_value;
            if (value < 18.5) return '#3498db'; // Underweight - Blue
            if (value >= 18.5 && value <= 24.9) return '#2ecc71'; // Normal - Green
            if (value >= 25 && value <= 29.9) return '#f1c40f'; // Overweight - Yellow
            return '#e74c3c'; // Obese - Red
          }).concat(Array(5 - bmi.length).fill('#e74c3c')) : ['#e74c3c'],
          borderRadius: 5,
        },
      ],
    };

  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth); // Convert to Date object
    const today = new Date(); // Current date
  
    // Calculate differences
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
  
    // Adjust if days are negative
    if (days < 0) {
      months--; // Borrow a month
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
      days += previousMonth.getDate();
    }
  
    // Adjust if months are negative
    if (months < 0) {
      years--; // Borrow a year
      months += 12;
    }
  
    return { years, months, days };
  }
  
  const age = calculateAge(patientDateOfBirth);

  useEffect(() => {
    if (error) {
      navigate(`/error/${error}`);
    }
  }, [error, navigate]);

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


  return (
    isAuthenticated ? (
      <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
        <div>
          <h2 className="font-weight-bold mb-0">Hello, {patientFirstName} {patientLastName}👋</h2>
          <p className="mb-0"><b>Welcome to your Healthsphere Dashboard! 🌟📊</b></p>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Profile Section */}
        <div className="col-lg-3 col-md-12 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <img
                src={profilePicture}
                alt="profile"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px' }}
              />
              <h5 className="mb-1">{patientId} - {patientFirstName} {patientLastName}</h5>
              <small className="text-muted">
                {patientGender} - Age {age.years} Years {age.months} Months  {age.days} Days
               </small>
              <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                <p><strong>DOB:</strong> {new Date(patientDateOfBirth).toLocaleDateString().split('T')[0]} </p>
                <p><strong>Address:</strong> {patientAddress}</p>
                <p><strong>Contacts:</strong> {useremail} |<br /> {patientPhoneNumber}</p>
                <p><strong>Active Conditions:</strong> {conditions.map(condition => condition.condition_name).join(', ')}</p>
                <p><strong>Allergies:</strong> {allergies.map(allergie => allergie.allergy_name).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-9 col-md-12">
          <div className="row">
            {/* Blood Sugar Section */}
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title font-weight-bold"><FaHeartbeat /> Blood Sugar</h5>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <h2 className="mb-0">50.0</h2>
                      <small className="text-muted">Recent Reading</small>
                    </div>
                    <div>
                      <h2 className="mb-0">89.1</h2>
                      <small className="text-muted">7 Day Average</small>
                    </div>
                    <button className="btn btn-outline-primary btn-sm">MG/DL</button>
                  </div>
                  <div className="mt-4" style={{ height: '150px' }}>
                    <Bar data={bloodSugarData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Heart Rate Section */}
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title font-weight-bold"><FaHeartbeat /> Heart Rate</h5>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <p className="mb-0">54-123 BPM</p>
                    <p className="text-muted mb-0">Heart Range</p>
                    <button className="btn btn-outline-primary btn-sm">Past Month</button>
                  </div>
                  <div className="mt-4" style={{ height: '150px' }}>
                    <Line data={heartRateData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Clinic Notification, BMI, and Offers Row */}
          <div className="row">
            {/* Upcoming Clinic Notification Section */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title font-weight-bold"><FaClinicMedical /> Upcoming Clinic Notifications</h5>
                  <p className="mt-3"><strong>Next Visit:</strong> Aug 15, 2024</p>
                  <p><strong>Location:</strong> City Health Clinic</p>
                  <p><strong>Specialist:</strong> Dr. Emma Thompson (Dermatology)</p>
                  <button className="btn btn-block" style={{background: '#2A5D9C', color: 'white'}}>View Details</button>
                </div>
              </div>
            </div>

            {/* BMI Section */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title font-weight-bold"><FaBalanceScale /> BMI Rate</h5>
                  <div style={{ height: '150px', marginBottom: '1rem' }}>
                    <Bar data={bmiData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <button className="btn btn-outline-secondary btn-sm">Learn More</button>
                </div>
              </div>
            </div>

            {/* Offers Section */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm bg-light">
                <div className="card-body">
                  {
                    medicalOffer && medicalOffer.length > 0 ? (
                      medicalOffer.map((offer, index) => (
                        <div key={index} className="offer-item">
                          <h5 className="card-title font-weight-bold"><FaGift /> {offer.title || "Exclusive Offers"}</h5>
                          <p className="mt-3"><strong>Discount:</strong> {offer.description}</p>
                          <p><strong>Expires:</strong> {new Date(offer.end_date).toLocaleDateString()}</p>
                          <button className="btn btn-success btn-block">Redeem Offer</button>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center' }}>No Offers</p>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Medical Conditions List */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header text-white" style={{ background: '#2A5D9C', color: 'white' }}>
            <h4 className="mb-0"><FaClinicMedical /> Medical Conditions</h4>
          </div>
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Severity</th>
                  <th>Date Diagnosed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {conditions.length > 0 ? (
                  conditions.map((condition, index) => (
                    <tr key={index}>
                      <td>{condition.condition_name}</td>
                      <td>
                        <span 
                            className={`badge 
                              ${condition.severity === 'mild' ? 'bg-success' : 
                                condition.severity === 'moderate' ? 'bg-warning' : 
                                condition.severity === 'severe' ? 'bg-danger' : ''}`}
                          >
                          {condition.severity}
                          </span>
                        </td>
                      <td>{new Date(condition.diagnosis_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${condition.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                          {condition.notes}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No medical conditions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Allergies List */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header text-white" style={{ background: '#2A5D9C', color: 'white' }}>
            <h4 className="mb-0"><FaClinicMedical /> Allergies</h4>
          </div>
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Allergy</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>description</th>
                </tr>
              </thead>
              <tbody>
                {allergies.length > 0 ? (
                  allergies.map((allergy, index) => (
                    <tr key={index}>
                      <td>{allergy.allergy_name}</td>
                      <td>
                        <span className='badge badge-secondary bg-info'>
                          {allergy.allergy_type}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`badge 
                            ${allergy.severity === 'mild' ? 'bg-success' : 
                            allergy.severity === 'moderate' ? 'bg-warning' : 
                            allergy.severity === 'severe' ? 'bg-danger' : ''}`}
                        >
                          {allergy.severity}
                        </span>
                      </td>
                      <td>
                        <span className='badge bg-warning'>
                          {allergy.description}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No allergies found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card mb-4 shadow-sm">
          <div className="card-header text-white" style={{background: '#2A5D9C', color: 'white'}}>
                <h4 className="mb-0"><FaClinicMedical /> My Appointments</h4>
              </div>
              <div className="card-body">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Doctor</th>
                      <th>Specialty</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>12 Nov 2024</td>
                    <td>Dr. Smith</td>
                    <td>Cardiology</td>
                    <td><span className="badge bg-warning">Upcoming</span></td>
                    <td><button className="btn btn-outline-primary btn-sm">View Details</button></td>
                  </tr>
                  <tr>
                    <td>8 Nov 2024</td>
                    <td>Dr. Lee</td>
                    <td>Dermatology</td>
                    <td><span className="badge bg-success">Completed</span></td>
                    <td><button className="btn btn-outline-primary btn-sm">View Details</button></td>
                 </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="newsletter-section my-4">
                <h3>HealthSphere NewsLetter</h3>
                <div className="row">
                  {[Img0, Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8, Img9].map((img, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                      <div className="card h-100">
                        <img src={img} className="card-img-top" alt={`News ${index}`} />
                        <div className="card-body">
                          <h5 className="card-title">HealthSphere News Title {index + 1}</h5>
                          <p className="card-text">Summary of the article goes here...</p>
                          <a href="/" className="btn btn-outline-primary">Read more</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
      </div>
    </div>
    ) : (
      <div className="container-fluid p-0 position-relative">
        {/* Background Image */}
        <div className="img-container">
          <img src={Home1} className="img-fluid w-100 min-vh-100" alt="Home" style={{ objectFit: 'cover' }} />
        </div>

        <div className="container position-absolute start-50 text-white" style={{ transform: 'translate(-50%, -80%)', marginTop: '-200px' }}>
          <div className="row xs-justify-content-center">
            {/* Upper Text */}
            <div className="col-12 col-md-8 ms-md-5 text-center text-md-start">
              <h6 className="text-black mb-3 fs-6 fs-md-5 fs-lg-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '5px' }}>
                Unlimited Health Experience with Health Code
              </h6>
            </div>

            {/* Main Heading */}
            <div className="col-12 col-lg-12 col-md-8 ms-md-5 text-center text-md-start">
              <h1 className="text-black display-5 display-md-4 display-lg-3 mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '5px' }}>
                Get Better Care For Your Health<br />
                with Health <span className="sphere text-white">Sphere</span>
              </h1>
            </div>

            {/* Buttons */}
            <div className="col-12 col-md-8 ms-md-5 d-flex flex-column flex-md-row justify-content-md-start justify-content-center gap-3 mb-4">
              <button className="btn btn-primary px-4 w-auto w-md-auto" style={{ background: '#C8D8F6', color: 'black' }}>Make Appointment</button>
              <button className="btn btn-outline-primary px-4 w-auto w-md-auto" style={{ background: '#C8D8F6', color: 'black' }}>Find Doctor</button>
            </div>

            {/* Social Media Icons */}
            <div className="col-12 col-md-8 ms-md-5 d-flex justify-content-center justify-content-md-start gap-3 mb-4">
              <a href="#"><i className="fab fa-facebook fa-2x text-black"></i></a>
              <a href="#"><i className="fab fa-twitter fa-2x text-black"></i></a>
              <a href="#"><i className="fab fa-instagram fa-2x text-black"></i></a>
            </div>
          </div>
        </div>

        {/* Lower Text */}
        <div className="position-absolute start-50 translate-middle text-center">
          <span className="middle text-white fs-1 fs-md-4 p-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '5px' }}>
            "Your Health is our Priority"
          </span>
        </div>

        {/* Section 1 */}
        <section className='section1 py-5'>
          <div className='container'>
            <div className='row text-center'>
              <div className="col-12 mt-3">
                <h1>Welcome to Health Code</h1>
                <h6>We Dedicated to You</h6>
                <h3>Compassion, Innovation & Excellence</h3>
              </div>
            </div>
            <div className='row text-center mt-3'>
              <div className='col-12 col-sm-4'>
                <img src={img1} alt="Doctor" className="img-fluid mb-3" style={{ borderRadius: '8px' }} />
              </div>
              <div className='col-sm-4'>
                <img src={img2} alt="Care" className="img-fluid mb-3" style={{ borderRadius: '8px' }} />
              </div>
              <div className='col-sm-4'>
                <img src={img3} alt="Surgery" className="img-fluid mb-3" style={{ borderRadius: '8px' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className='section2 py-5'>
          <div className='container'>
            <div className='row text-center'>
              <div className='col'>
                <div style={{ color: 'black', fontSize: 30, fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word' }}>
                  Why Patients Choose Us
                </div>
                <div style={{ width: '100%', color: 'black', fontSize: 20, fontFamily: 'Segoe UI', fontWeight: '400', wordWrap: 'break-word' }}>
                  Health Sphere partners with top healthcare professionals to deliver advanced, evidence-based treatments for complex diseases through our Centres of Excellence.<br/><br/>
                  We also provide comprehensive care for lifestyle-related conditions, preventive healthcare, and a full range of diagnostic services. All our hospitals are internationally accredited, ensuring exceptional standards of care.
                </div>
              </div>
              <div className='col'>
                <img src={Rectangle98} alt="image" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
              </div>
            </div>

            <div className="row text-center justify-content-center" style={{ color: 'white', background: '#112D4E', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 14, padding: '10px' }}>
              <div className="col-md-2 col-sm-4 stat-box">
                <div className="stat-number">35<span className="stat-plus">+</span></div>
                <div className="stat-label">Doctors</div>
              </div>
              <div className="col-md-2 col-sm-4 stat-box">
                <div className="stat-number">15<span className="stat-plus">+</span></div>
                <div className="stat-label">New Users</div>
              </div>
              <div className="col-md-2 col-sm-4 stat-box">
                <div className="stat-number">400<span className="stat-plus">+</span></div>
                <div className="stat-label">Consultations</div>
              </div>
              <div className="col-md-2 col-sm-4 stat-box">
                <div className="stat-number">300<span className="stat-plus">+</span></div>
                <div className="stat-label">Total Tests</div>
              </div>
              <div className="col-md-2 col-sm-4 stat-box">
                <div className="stat-number">5<span className="stat-plus">+</span></div>
                <div className="stat-label">Branches</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className='section3 py-5'>
          <div className='container text-center'>
            <div className='row'>
              <p className='text-black w-6 h-6' style={{ fontSize: 40, fontFamily: 'Aoboshi One', fontWeight: '500', wordWrap: 'break-word' }}>HealthSphere NewsLetter</p>
              <p className='text-black' style={{ fontSize: 23, fontFamily: 'Sansita', fontWeight: '400', wordWrap: 'break-word' }}>Check out For Latest News From HealthCode Hospitals</p>
            </div>
            <div className='row'>
              <div className='col col-xm-6 mb-4'><img src={Img0} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6 mb-4'><img src={Img1} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6 mb-4'><img src={Img2} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6 mb-4'><img src={Img3} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6 mb-4'><img src={Img4} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6'><img src={Img5} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6'><img src={Img6} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6'><img src={Img7} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6'><img src={Img8} style={{ borderRadius: '8px' }} /></div>
              <div className='col col-xm-6'><img src={Img9} style={{ borderRadius: '8px' }} /></div>
            </div>
          </div>
        </section>
      </div>
    )
  );
}

export default PatientHome;
