import React from 'react'
import { Line, Doughnut } from 'react-chartjs-2';
import ProfileImg from '../../assets/images/profileImg.png';
import { FaStar, FaUser, FaPhone, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaSpinner } from 'react-icons/fa';

// Import required data and options
const salaryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Doctor Salary',
        data: [300, 500, 400, 600, 550, 700, 650, 800, 750, 850, 900, 950],
        fill: true,
        backgroundColor: 'rgba(173, 216, 230, 0.2)',
        borderColor: '#4B9CD3',
        tension: 0.3,
      },
    ],
  };
  
  const salaryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: { y: { beginAtZero: true } },
  };
  
  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Patient Gender',
        data: [4000, 1000],
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


function DoctorDashboard1() {
  return (
    <div className="container py-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
            <div>
                <h2 className="font-weight-bold mb-0">Hello Dr.James! 👋,</h2>
                <p className="mb-0"><b>Welcome James to Our Platform. Let's help patients to live a healthier and happier life 🌟📊</b></p>
            </div>
        </div>

        {/* Main Content */}
        <div className="row">
        {/* Profile Section */}
            <div className="col-lg-3 col-md-12 mb-4">
                <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                    <img
                    src={ProfileImg}
                    alt="profile"
                    className="rounded-circle mb-3"
                    style={{ width: '150px', height: '150px' }}
                    />
                    <h5 className="mb-1">Jems Androw</h5>
                    
                    <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                    <p><strong>DOB:</strong>  </p>
                    <p><strong>Address:</strong> </p>
                    <p><strong>Contacts:</strong>   </p>
                    
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
                        <h5>2024/10/04</h5>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-3 bg-light text-center rounded">
                        <strong>Time:</strong>
                        <h5>12:00 P.M.</h5>
                        </div>
                  </div>
                </div>
          
                {/* Statistics */}
                <div className="row mb-4">
                  <div className="col-6 col-md-3 mb-3">
                    <div className="p-3 bg-secondary text-white text-center rounded">
                      <p>Appointments</p>
                      <h3>62</h3>
                      <small>Today</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="p-3 bg-secondary text-white text-center rounded">
                      <p>Consultations</p>
                      <h3>22</h3>
                      <small>Today</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="p-3 bg-secondary text-white text-center rounded">
                      <p>Cancelled</p>
                      <h3>03</h3>
                      <small>Today</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="p-3 bg-secondary text-white text-center rounded">
                      <p>Income</p>
                      <h3>$210</h3>
                      <small>Today</small>
                    </div>
                  </div>
                </div>

                
                <div className="row">
                    {/* Upcoming Appointments */}
                  <div className="col-md-4 mb-4">
                    <div className="card shadow-sm p-4">
                      <h6>Upcoming Appointments</h6>
                      <div>
                        {[
                          { name: 'Linda Brown', time: '08:00 AM', type: 'First Visit' },
                          { name: 'Nelly Dean', time: '09:00 AM', type: 'First Visit' },
                          { name: 'John Doe', time: '10:00 AM', type: 'First Visit' },
                          { name: 'James Vane', time: '10:45 AM', type: 'Consultation' },
                          { name: 'Mary Smith', time: '11:00 AM', type: 'Consultation' },
                        ].map((appointment, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <strong>{appointment.name}</strong>
                              <p className="text-muted mb-0">{appointment.type}</p>
                            </div>
                            <p className="mb-0">{appointment.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
          
                  {/* Patient Gender */}
                  <div className="col-md-4 mb-4">
                    <div className="card shadow-sm p-4">
                      <h6>Patient Gender</h6>
                      <p className="text-muted mb-2">View All</p>
                      <div style={{ height: '200px' }}>
                        <Doughnut data={genderData} options={genderOptions} />
                      </div>
                    </div>
                  </div>
                  
          
                  {/* Today Patient Details Table */}
                  <div className="col-md-4 mb-4">
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
                            <td>Linda Brown</td>
                            <td>P0001</td>
                            <td>08:00 AM</td>
                            <td>
                              <span className="badge bg-success d-flex align-items-center gap-1">
                                <FaCheckCircle /> Completed
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>John Doe</td>
                            <td>P0002</td>
                            <td>09:00 AM</td>
                            <td>
                              <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                                <FaHourglassHalf /> Pending
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>Mary Smith</td>
                            <td>P0003</td>
                            <td>10:30 AM</td>
                            <td>
                              <span className="badge bg-danger d-flex align-items-center gap-1">
                                <FaTimesCircle /> Cancelled
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>James Vane</td>
                            <td>P0004</td>
                            <td>11:15 AM</td>
                            <td>
                              <span className="badge bg-primary d-flex align-items-center gap-1">
                                <FaSpinner className="fa-spin" /> In Progress
                              </span>
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
                        <div className="d-flex align-items-center gap-3 mb-3">
                        <img
                            src={ProfileImg} // Replace with dynamic image source
                            alt="Reviewer"
                            className="rounded-circle"
                            style={{ width: '50px', height: '50px' }}
                        />
                        <div>
                            <strong>Thathsara Bandara</strong>
                            <p className="text-muted mb-1">⭐⭐⭐⭐⭐</p>
                            <p>Good Doctor</p>
                        </div>
                        </div>
                        <p className="text-muted">View All Reviews</p>
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
  )
}

export default DoctorDashboard1;
