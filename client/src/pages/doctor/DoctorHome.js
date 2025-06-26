import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaPlus, FaEnvelope, FaCalendarAlt, FaFileMedical } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Home1 from "../../assets/images/Rectangle 9 (3).svg"
import '../../styles/Home.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'typeface-anton';
import img1 from '../../assets/images/image-1.svg'
import img2 from '../../assets/images/img-2.svg'
import img3 from '../../assets/images/img-3.svg'
import Rectangle98 from '../../assets/images/Rectangle 98.svg'
import Img0 from '../../assets/images/img-1.svg'
import Img1 from '../../assets/images/img-1 (1).svg'
import Img2 from '../../assets/images/img-1 (2).svg'
import Img3 from '../../assets/images/img-1 (3).svg'
import Img4 from '../../assets/images/img-1 (4).svg'
import Img5 from '../../assets/images/img-1 (5).svg'
import Img6 from '../../assets/images/img-1 (6).svg'
import Img7 from '../../assets/images/img-1 (7).svg' 
import Img8 from '../../assets/images/img-1 (8).svg'
import Img9 from '../../assets/images/img-1 (9).svg' 
import emptyImage from '../../assets/images/emptyProfile.png';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend  } from 'chart.js';
import { FaStar, FaUser, FaPhone, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaSpinner } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);


function DoctorHome() {
const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [loading, setLoading] = useState(true);
const [profileData, setProfileData] = useState({});
const [statsData, setStatsData] = useState({});
const [patientList, setPatientList] = useState([]);
const [appointments, setAppointments] = useState([]);
const [upcomingSchedules, setUpcomingSchedules] = useState([]);
const [genderStats, setGenderStats] = useState({});
const [reviews, setReviews] = useState([]);
const [currentDateTime, setCurrentDateTime] = useState(new Date());
const [dashboardLoading, setDashboardLoading] = useState(true);
const [currentAppointmentIndex, setCurrentAppointmentIndex] = useState(0);

  // Fetch user data (authentication)
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/doctor/', { withCredentials: true });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setLoading(false);
        setProfileData(response.data.data); // Assuming 'data' contains the profile info
      } else {
        setIsAuthenticated(false);
        setProfileData(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsAuthenticated(false);
      setLoading(false)
      setProfileData(null);
    }
  };

  // Fetch all dashboard data in one go
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/doctor/dashboard', {
        withCredentials: true
      });
      const data = response.data;
      setStatsData(data.dashboardStats);
      setGenderStats(data.genderStats);
      setReviews(data.reviews);
      setAppointments(data.upcomingSchedules);
      console.log(data.upcomingSchedules)
      console.log(appointments[0])
      setPatientList(data.patientList);
      setDashboardLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    // Function to load data
    const loadData = async () => {
      setDashboardLoading(true);
      try {
        await fetchDashboardData();
        await fetchUserData();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadData();

    // Set up the current time interval
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []); // Run only on mount

  // Effect for the reviews interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % (reviews.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews]); // Restart interval when reviews change

const currentReview = reviews[currentReviewIndex];

// Gender Data for Doughnut Chart
const genderData = {
  labels: ['Male', 'Female'],
  datasets: [
    {
      label: 'Patient Gender',
      data: [genderStats.male || 0, genderStats.female || 0],
      backgroundColor: ['#36A2EB', '#FF6384'],
      hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      borderWidth: 1,
    },
  ],
};

const genderOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' },
  },
};

if (dashboardLoading) {
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
    <div>
      {isAuthenticated ? (
                <div className="container py-4">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4 bg-light p-3 rounded">
                    <div>
                      <h2 className="font-weight-bold mb-0">Hello Dr. {profileData.first_name} {profileData.last_name} 👋,</h2>
                      <p className="mb-0 text-muted">Welcome to Our Platform. Let's help patients live healthier and happier lives 🌟📊</p>
                    </div>
                    <div className="position-relative">
                      <button className="btn btn-light position-relative">
                        <FaBell size={24} />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          3
                        </span>
                      </button>
                    </div>
                </div>
        
                {/* Main Content */}
                <div className="row">
                {/* Profile Section */}
                    <div className="col-lg-3 col-md-12 mb-4">
                        <div className="card h-100 shadow-sm border-0">
                        <div className="card-body text-center p-4">
                            <img
                              src={`http://localhost:5000/uploads/storage/doctor/${profileData?.userid}/profiledocuments/${profileData.profileImg}` || emptyImage }
                              alt="profile"
                              className="rounded-circle mb-4 border border-3 border-primary"
                              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h5 className="mb-3 fw-bold">{profileData.first_name} {profileData.last_name}</h5>
                            <div className="text-start">
                              <p className="mb-2"><strong>First Name:</strong> {profileData.first_name}</p>
                              <p className="mb-2"><strong>Last Name:</strong> {profileData.last_name}</p>
                              <p className="mb-2"><strong>Date Of Birth:</strong> {profileData.date_of_birth?.split('T')[0]}</p>
                              <p className="mb-2"><strong>Gender:</strong> {profileData.gender}</p>
                              <p className="mb-2"><strong>Email:</strong> {profileData.email}</p>
                              <p className="mb-2"><strong>Phone Number:</strong> {profileData.phone_number}</p>
                              <p className="mb-2"><strong>Address:</strong> {profileData.address}</p>
                              <p className="mb-2"><strong>Medical License:</strong> {profileData.medicalLicense}</p>
                              <p className="mb-2"><strong>Specialization:</strong> {profileData.specialization}</p>
                              <p className="mb-2"><strong>Experience:</strong> {profileData.experience}</p>
                              <p className="mb-2"><strong>Hospital:</strong> {profileData.hospital}</p>
                              <p className="mb-2"><strong>Medical School:</strong> {profileData.medicalSchool}</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="col-lg-9 col-md-12">
                        <div className="row mb-4">
                            <div className="col-6 col-md-3 mb-3">
                                <div className="card border-0 bg-primary bg-opacity-10 p-3 text-center rounded">
                                <strong className="d-block mb-1">Date</strong>
                                <h5 className="mb-0">
                                  {currentDateTime.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </h5>
                                </div>
                            </div>
                            <div className="col-6 col-md-3 mb-3">
                                <div className="card border-0 bg-primary bg-opacity-10 p-3 text-center rounded">
                                <strong className="d-block mb-1">Time</strong>
                                <h5 className="mb-0">
                                  {currentDateTime.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </h5>
                                </div>
                          </div>
                        </div>
                  
                        {/* Statistics */}
                        <div className="row mb-4">
                          <div className="col-6 col-md-3 mb-3">
                            <div className="card border-light shadow-sm h-100">
                              <div className="card-body text-center py-4">
                                <h2 className="fw-bold">{statsData.appointments || '00'}</h2>
                                <p className="text-muted mb-1">Appointments</p>
                                <small className="text-muted">Total</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mb-3">
                            <div className="card border-light shadow-sm h-100">
                              <div className="card-body text-center py-4">
                                <h2 className="fw-bold">{statsData.consultations || '00'}</h2>
                                <p className="text-muted mb-1">Consultations</p>
                                <small className="text-muted">Total</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mb-3">
                            <div className="card border-light shadow-sm h-100">
                              <div className="card-body text-center py-4">
                                <h2 className="fw-bold">{statsData.cancelled || '00'}</h2>
                                <p className="text-muted mb-1">Cancelled</p>
                                <small className="text-muted">Total</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mb-3">
                            <div className="card border-light shadow-sm h-100">
                              <div className="card-body text-center py-4">
                                <h2 className="fw-bold">{statsData.income || '00'}</h2>
                                <p className="text-muted mb-1">Income</p>
                                <small className="text-muted">Total</small>
                              </div>
                            </div>
                          </div>
                        </div>
        
                        
                        <div className="row">
                          {/* Patient Gender */}
                          <div className="col-md-6 mb-4">
                            <div className="card shadow-sm border-0 h-100">
                              <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Patient Gender Distribution</h5>
                                {genderStats ? (
                                  <div style={{ height: '250px' }}>
                                  <Doughnut data={genderData} options={genderOptions} />
                                </div>
                                ) : (
                                  <p className="text-muted">No data available</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                  
                          {/* Today Patient Details Table */}
                          <div className="col-md-6 mb-4">
                            <div className="card shadow-sm border-0 h-100">
                              <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Today's Appointments</h5>
                                <div className="table-responsive">
                                  <table className="table table-borderless align-middle">
                                    <thead>
                                      <tr className="bg-light">
                                        <th>ID</th>
                                        <th>Patient</th>
                                        <th>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {patientList.slice(0,4).map((patient, index) => (
                                        <tr key={index}>
                                          <td>{patient?.id || '--'}</td>
                                          <td>{(patient?.first_name || '') + " " + (patient?.last_name || '') || '----'}</td>
                                          <td>
                                            <span className="badge bg-success d-flex align-items-center gap-1">
                                              <FaCheckCircle /> Available
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
        
                        </div>
        
                        <div className="row">
                            {/* Reviews Card */}
                            <div className="col-md-6 mb-4">
                              <div className="card shadow-sm border-0 h-100">
                                <div className="card-body p-4">
                                  <h5 className="fw-bold mb-4">Recent Reviews</h5>
                                  {reviews && reviews.length > 0 ? (
                                    <div>
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="flex-shrink-0">
                                          <img
                                            src={`http://localhost:5000/uploads/storage/patient/${reviews[currentReviewIndex].userid}/profilepictures/${reviews[currentReviewIndex].patientProfilePicture}`|| emptyImage}
                                            alt="Reviewer"
                                            className="rounded-circle"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                          />
                                        </div>
                                        <div>
                                          <strong>{reviews[currentReviewIndex]?.patientName || 'Anonymous'}</strong>
                                          <div className="text-warning mb-2">
                                            {"⭐".repeat(reviews[currentReviewIndex]?.rating || 0)}
                                          </div>
                                          <p className="mb-0">{reviews[currentReviewIndex]?.comment || 'No comment'}</p>
                                        </div>
                                      </div>
                                      <div className="d-flex justify-content-between mt-3">
                                        <button 
                                          className="btn btn-outline-primary" 
                                          onClick={() => setCurrentReviewIndex(prev => (prev > 0 ? prev - 1 : reviews.length - 1))}
                                          disabled={reviews.length <= 1}
                                        >
                                          Previous
                                        </button>
                                        <button 
                                          className="btn btn-outline-primary" 
                                          onClick={() => setCurrentReviewIndex(prev => (prev < reviews.length - 1 ? prev + 1 : 0))}
                                          disabled={reviews.length <= 1}
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-muted">No reviews available</p>
                                  )}
                                </div>
                              </div>
                            </div>
        
                            {/* Upcoming Clinic Date Card */}
                            <div className="col-md-6 mb-4">
                              <div className="card shadow-sm border-0 h-100">
                                <div className="card-body p-4">
                                  <h5 className="fw-bold mb-4">Upcoming Appointments</h5>
                                  {appointments && appointments.length > 0 ? (
                                    <div>
                                      <div className="d-flex align-items-start gap-3">
                                        <div>
                                          <p className="mb-1"><strong>Date:</strong> {appointments[currentAppointmentIndex]?.schedule_date || '--'}</p>
                                          <p className="mb-1"><strong>Time:</strong> {appointments[currentAppointmentIndex]?.schedule_time || '--'}</p>
                                          <p className="mb-1"><strong>Status:</strong> {appointments[currentAppointmentIndex]?.status || 'Pending'}</p>
                                          <p className="mb-1"><strong>Room:</strong> {appointments[currentAppointmentIndex]?.room_number || '--'}</p>
                                        </div>
                                      </div>

                                      {/* Navigation buttons */}
                                      <div className="d-flex justify-content-between mt-3">
                                        <button 
                                          className="btn btn-outline-primary"
                                          onClick={() => setCurrentAppointmentIndex(prev => (prev > 0 ? prev - 1 : appointments.length - 1))}
                                          disabled={appointments.length <= 1}
                                        >
                                          Previous
                                        </button>
                                        <button 
                                          className="btn btn-outline-primary"
                                          onClick={() => setCurrentAppointmentIndex(prev => (prev < appointments.length - 1 ? prev + 1 : 0))}
                                          disabled={appointments.length <= 1}
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-muted">No Appointments Available</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
        
                    </div>
                </div>
            ) : (
              <div className="container-fluid p-0 position-relative">
              {/* Background Image */}
              
              <div className="img-container">
                <img src={Home1} className="img-fluid w-100" alt="Home" style={{ objectFit: 'cover', height: 'auto', maxHeight: '100vh' }} />
              </div>
        
              {/* Content overlaying the image */}
              <div className="container position-absolute  start-50 text-white" style={{ transform: 'translate(-50%, -80%)',  marginTop: '-200px'}}>
                <div className="row">
                  {/* Upper Text */}
                  <div className="col-12 col-md-8 ms-md-5 text-center text-md-start">
                    <h6 className="text-black mb-3 fs-6 fs-md-5 fs-lg-4">
                    Unlimited Health Experience with Health Sphere
                    </h6>
                  </div>
        
                  {/* Main Heading */}
                  <div className="col-12 col-md-8 ms-md-5 text-center text-md-start">
                    <h1 className="text-black display-5 display-md-4 display-lg-3 mb-3">
                    Empowering Doctors to Provide<br />
                    Better Care with Health <span className="sphere text-white">Sphere</span>
                    </h1>
                  </div>
        
                  {/* Buttons */}
                  <div className="col-12 col-md-8 ms-md-5 d-flex flex-column flex-md-row justify-content-md-start justify-content-center gap-3 mb-4">
                    {/*<button className="btn btn-primary px-4 w-100 w-md-auto">Register First</button>*/}
                    <button className='btn2 btn-outline' style={{background: '#91aad8', color: "black"}}>
                            <Link to='/doctor/register' style={{ textDecoration: 'none', color: 'inherit' }}>Register First</Link>
                          </button>
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
                    <span className="middle text-white fs-3 p-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        “ You're Never Alone in Your Healthcare Journey - We're Here to Assist You Every Step of the Way ”
                    </span>
                </div>
        
        
        
              
              
              <section className='section1 py-5'>
                <div className='container'>
                  <div className='row text-center'>
                  <div className="col-12 mt-3">
                    <h1>Welcome to Health Sphere</h1>
                    <h6>We Dedicated to You</h6>
                    <h3>Compassion , Innovation & Excellence</h3>
                  </div>
                    
                  </div>
                  <div className='row text-center mt-3 '>
                    <div className='col-12 col-sm-4'>
                      <img src={img1} alt="Doctor" className="img-fluid mb-3"/>
                    </div>
                    <div className='col-sm-4'>
                      <img src={img2} alt="Care" className="img-fluid mb-3"/>
                    </div>
                    <div className='col-sm-4'>
                      <img src={img3} alt="Surgery" className="img-fluid mb-3"/>
                    </div>
                  </div>
                </div>
              </section>
        
              <section className='section2 py-5' >
                <div className='container'>
                  <div className='row text-center'>
                    <div className='col'>
                      <div style={{color: 'black', fontSize: 30, fontFamily: 'Sansation', fontWeight: '700', wordWrap: 'break-word'}}>Why Patients Choose Us</div>
                      <div style={{width: '100%', height: '100%', color: 'black', fontSize: 20, fontFamily: 'Segoe UI', fontWeight: '400', wordWrap: 'break-word'}}>Health Sphere partners with top healthcare professionals to deliver advanced, evidence-based treatments for complex diseases through our Centres of Excellence. <br/><br/>We also provide comprehensive care for lifestyle-related conditions, preventive healthcare, and a full range of diagnostic services. All our hospitals are internationally accredited, ensuring exceptional standards of care.</div>
                    </div>
                    <div className='col'>
                      <img src={Rectangle98} alt="image" style={{width: '100%', height: '100%'}}/>
                    </div>
                  </div>
                  
        
                  <div className="row text-center justify-content-center" style={{width: '100%', height: '100%', color: 'white', background: '#112D4E', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 14}}>
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
        
        
              <section className='section3 py-5 '>
                <div className='container text-center'>
                  <div className='row'>
                    <p className='text-black w-6 h-6' style={{fontSize: 40 ,fontFamily: 'Aoboshi One' , fontWeight: '500', wordWrap: 'break-word'}}>HealthSphere NewsLetter</p>
                    <p className='text-black' style={{fontSize: 23, fontFamily: 'Sansita', fontWeight: '400', wordWrap: 'break-word'}}>Check out For Latest News From HealthCode Hospitals</p>
                  </div>
                  <div className='row'>
                    <div className='col col-xm-6 mb-4'><img src={Img0} /></div>
                    <div className='col col-xm-6 mb-4'><img src={Img1}/></div>
                    <div className='col col-xm-6 mb-4'><img src={Img2}/></div>
                    <div className='col col-xm-6 mb-4'><img src={Img3}/></div>
                    <div className='col col-xm-6 mb-4' ><img src={Img4}/></div>
                  
                
                    <div className='col col-xm-6'><img src={Img5} /></div>
                    <div className='col col-xm-6'><img src={Img6} /></div>
                    <div className='col col-xm-6'><img src={Img7} /></div>
                    <div className='col col-xm-6'> <img src={Img8} /></div>
                    <div className='col col-xm-6'><img src={Img9} /></div>
                  </div>
                </div>
              </section>
            </div>
            )}
    </div>
    
     
  )
}

export default DoctorHome
