import React, { useState, useEffect } from 'react';
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
const [appointments, setAppointments] = useState([]);
const [genderStats, setGenderStats] = useState({});
const [reviews, setReviews] = useState([]);
const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  // Fetch statistics data (appointments, consultations, income, etc.)
  const fetchStatsData = async () => {
    try {
      const response = await axios.get('', { withCredentials: true });
      if (response.status === 200) {
        setStatsData(response.data); // Assuming 'data' contains the stats info
      }
    } catch (error) {
      console.error('Error fetching stats data:', error);
    }
  };

  // Fetch appointments data
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('', { withCredentials: true });
      if (response.status === 200) {
        setAppointments(response.data); // Assuming 'data' contains the appointments info
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Fetch gender stats data
  const fetchGenderStats = async () => {
    try {
      const response = await axios.get('', { withCredentials: true });
      if (response.status === 200) {
        setGenderStats(response.data); // Assuming 'data' contains the gender stats info
      }
    } catch (error) {
      console.error('Error fetching gender stats:', error);
    }
  };

  // Fetch reviews data
  const fetchReviews = async () => {
    try {
      const response = await axios.get('', { withCredentials: true });
      if (response.status === 200) {
        setReviews(response.data); // Assuming 'data' contains the reviews info
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };


  useEffect(() => {
    fetchUserData();
    fetchStatsData();
    fetchAppointments();
    fetchGenderStats();
    fetchReviews();
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length); // Loop through reviews
    }, 5000); // 5000ms = 5 seconds per review

    return () => {
      clearInterval(timer);
      clearInterval(interval); // Cleanup the intervals when the component unmounts
    };
  }, [reviews]); // Re-run effect when reviews change

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

  return (
    <div>
      {isAuthenticated ? (
                <div className="container py-4">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                    <div>
                      <h2 className="font-weight-bold mb-0">Hello Dr. {profileData.first_name} {profileData.last_name} 👋,</h2>
                      <p className="mb-0"><b>Welcome to Our Platform. Let's help patients live healthier and happier lives 🌟📊</b></p>
                    </div>
                </div>
        
                {/* Main Content */}
                <div className="row">
                {/* Profile Section */}
                    <div className="col-lg-3 col-md-12 mb-4">
                        <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <img
                              src={`http://localhost:5000/uploads/storage/doctor/${profileData?.userid}/profiledocuments/${profileData.profileImg}` || emptyImage }
                              alt="profile"
                              className="rounded-circle mb-3"
                              style={{ width: '150px', height: '150px' }}
                            />
                            <h5 className="mb-1">{profileData.first_name} {profileData.last_name}</h5>
                            <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                              <p><strong>First Name:</strong> {profileData.first_name}</p>
                              <p><strong>Last Name:</strong> {profileData.last_name}</p>
                              <p><strong>Date Of Birth:</strong> {profileData.date_of_birth.split('T')[0]}</p>
                              <p><strong>Gender:</strong> {profileData.gender}</p>
                              <p><strong>Email:</strong> {profileData.email}</p>
                              <p><strong>Phone Number:</strong> {profileData.phone_number}</p>
                              <p><strong>Address:</strong> {profileData.address}</p>
                              <p><strong>Medical License Number:</strong> {profileData.medicalLicense}</p>
                              <p><strong>Specialization:</strong> {profileData.specialization}</p>
                              <p><strong>Experience:</strong> {profileData.experience}</p>
                              <p><strong>Hospital Affiliation:</strong> {profileData.hospital}</p>
                              <p><strong>Medical School:</strong> {profileData.medicalSchool}</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="col-lg-9 col-md-12">
                        <div className="row mb-4">
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-light text-center rounded">
                                <strong>Date:</strong>
                                <h5>{currentDateTime.toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'numeric',
                                      day: 'numeric',
                                    })}
                                </h5>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-light text-center rounded">
                                <strong>Time:</strong>
                                <h5>{currentDateTime.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                    })}
                                </h5>
                                </div>
                          </div>
                        </div>
                  
                        {/* Statistics */}
                        <div className="row mb-4">
                          <div className="col-6 col-md-3 mb-3">
                            <div className="p-3 bg-secondary text-white text-center rounded">
                              <p>Appointments</p>
                              <h3>{statsData.appointments || '00' }</h3>
                              <small>Today</small>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mb-3">
                            <div className="p-3 bg-secondary text-white text-center rounded">
                              <p>Consultations</p>
                              <h3>{statsData.consultations || '00' }</h3>
                              <small>Today</small>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mb-3">
                            <div className="p-3 bg-secondary text-white text-center rounded">
                              <p>Cancelled</p>
                              <h3>{statsData.cancelled || '00' }</h3>
                              <small>Today</small>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mb-3">
                            <div className="p-3 bg-secondary text-white text-center rounded">
                              <p>Income</p>
                              <h3>{statsData.income || '00' }</h3>
                              <small>Today</small>
                            </div>
                          </div>
                        </div>
        
                        
                        <div className="row">
                          {/* Patient Gender */}
                          <div className="col-md-6 mb-4">
                            <div className="card shadow-sm p-4">
                              <h6 style={{ height: '200px' }}>Patient Gender</h6>
                              {genderStats? (
                                <p>No Data found</p>
                              ):(
                                <div style={{ height: '200px' }}>
                                    <Doughnut data={genderData} options={genderOptions} />
                                </div>
                              )}
                            </div>
                          </div>
                          
                  
                          {/* Today Patient Details Table */}
                          <div className="col-md-6 mb-4">
                            <div className="card shadow-sm  p-4" style={{ borderRadius: '12px' }}>
                              <h5 className="fw-bold mb-3">Today Patient Details</h5>
                              <table className="table table-borderless align-middle">
                                <thead className="table-light" style={{ borderRadius: '8px' }}>
                                  <tr>
                                    <th>Patient Name</th>
                                    <th>Patint ID</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>{appointments[0]?.patient_name || '---- ----'}</td>
                                    <td>{appointments[0]?.patient_id || '--'}</td>
                                    <td>{appointments[0]?.patient_datetime || '--------- / -------'}</td>
                                    <td>
                                      {appointments[0]?.status === 'available' ? (
                                        <span className="badge bg-success d-flex align-items-center gap-1">
                                          <FaCheckCircle /> Available
                                        </span>
                                      ) : appointments[0]?.status === 'danger' ? (
                                        <span className="badge bg-danger d-flex align-items-center gap-1">
                                          <FaTimesCircle /> Cancelled
                                        </span>
                                      ) : appointments[0]?.status === 'pending' ? (
                                        <span className="badge bg-warning d-flex align-items-center gap-1">
                                          <FaHourglassHalf /> Pending
                                        </span>
                                      ) : (
                                        <p>None</p>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{appointments[1]?.patient_name || '---- ----'}</td>
                                    <td>{appointments[1]?.patient_id || '--'}</td>
                                    <td>{appointments[1]?.patient_datetime || '--------- / -------'}</td>
                                    <td>
                                      {appointments[1]?.status === 'available' ? (
                                        <span className="badge bg-success d-flex align-items-center gap-1">
                                          <FaCheckCircle /> Available
                                        </span>
                                      ) : appointments[1]?.status === 'danger' ? (
                                        <span className="badge bg-danger d-flex align-items-center gap-1">
                                          <FaTimesCircle /> Cancelled
                                        </span>
                                      ) : appointments[1]?.status === 'pending' ? (
                                        <span className="badge bg-warning d-flex align-items-center gap-1">
                                          <FaHourglassHalf /> Pending
                                        </span>
                                      ) : (
                                        <p>None</p>
                                      )}
                                    </td>                          
                                  </tr>
                                  <tr>
                                    <td>{appointments[2]?.patient_name || '---- ----'}</td>
                                    <td>{appointments[2]?.patient_id || '--'}</td>
                                    <td>{appointments[2]?.patient_datetime || '--------- / -------'}</td>
                                    <td>
                                      {appointments[2]?.status === 'available' ? (
                                        <span className="badge bg-success d-flex align-items-center gap-1">
                                          <FaCheckCircle /> Available
                                        </span>
                                      ) : appointments[2]?.status === 'danger' ? (
                                        <span className="badge bg-danger d-flex align-items-center gap-1">
                                          <FaTimesCircle /> Cancelled
                                        </span>
                                      ) : appointments[2]?.status === 'pending' ? (
                                        <span className="badge bg-warning d-flex align-items-center gap-1">
                                          <FaHourglassHalf /> Pending
                                        </span>
                                      ) : (
                                        <p>None</p>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{appointments[3]?.patient_name || '---- ----'}</td>
                                    <td>{appointments[3]?.patient_id || '--'}</td>
                                    <td>{appointments[3]?.patient_datetime || '--------- / -------'}</td>
                                    <td>
                                      {appointments[3]?.status === 'available' ? (
                                        <span className="badge bg-success d-flex align-items-center gap-1">
                                          <FaCheckCircle /> Available
                                        </span>
                                      ) : appointments[3]?.status === 'danger' ? (
                                        <span className="badge bg-danger d-flex align-items-center gap-1">
                                          <FaTimesCircle /> Cancelled
                                        </span>
                                      ) : appointments[3]?.status === 'pending' ? (
                                        <span className="badge bg-warning d-flex align-items-center gap-1">
                                          <FaHourglassHalf /> Pending
                                        </span>
                                      ) : (
                                        <p>None</p>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
        
                        </div>
        
                        <div className="row">
                            {/* Reviews Card */}
                            <div className="col-md-6 mb-4">
                              <div className="card shadow-sm p-4">
                                <h6>Reviews</h6>
                                {reviews ? (
                                  <div className="d-flex align-items-center gap-3 mb-3">
                                  <img
                                    src={currentReview?.img || emptyImage} // Replace with dynamic image source
                                    alt="Reviewer"
                                    className="rounded-circle"
                                    style={{ width: '50px', height: '50px' }}
                                  />
                                  <div>
                                    <strong>{currentReview?.name}</strong>
                                    <p className="text-muted mb-1">{"⭐".repeat(currentReview?.rating)}</p>
                                    <p>{currentReview?.comment}</p>
                                  </div>
                                </div>
                                ):(
                                  <p>No Review found </p>
                                )}
                                
                              </div>
                            </div>
        
                            {/* Upcoming Clinic Date Card */}
                            <div className="col-md-6 mb-4">
                            <div className="card shadow-sm p-4">
                                <h6>Upcoming Clinic Date</h6>
                                <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p><strong>Date:</strong> 2024/12/01</p>
                                    <p><strong>Time:</strong> 10:00 A.M.</p>
                                    <p><strong>Location:</strong> Room 07</p>
                                </div>
                                <div>
                                    <button className="btn btn-primary">View Details</button>
                                </div>
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
