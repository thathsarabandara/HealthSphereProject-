import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend  } from 'chart.js';
import { FaStar, FaUser, FaPhone, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaSpinner } from 'react-icons/fa';




// Register components with ChartJs
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

function Dashboard() {
  // Data for the salary line chart
  const salaryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Doctor Salary',
        data: [300, 500, 400, 600, 550, 700, 650, 800, 750, 850, 900, 950],
        fill: true,
        backgroundColor: 'rgba(173, 216, 230, 0.2)', // Light blue area fill
        borderColor: '#4B9CD3', // Blue line color
        tension: 0.3,
      },
    ],
  };

  // Options for salary chart
  const salaryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Data for the gender doughnut chart
  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Patient Gender',
        data: [4000, 1000],
        backgroundColor: ['#36A2EB', '#FF6384'], // Blue for Male, Pink for Female
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  // Options for gender chart
  const genderOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h4>Hello Dr.James! 👋,</h4>
          <p>Welcome James to Our Platform. Let's help patients to live a healthier and happier life</p>
        </div>
      </div>

      {/* Date and Time */}
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


      {/* Dashboard Content */}
      <div className="row">
        {/* Profile */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4 text-center">
            <h6>Profile</h6>
            <div className="bg-light rounded-circle" style={{ height: '80px', width: '80px', margin: '0 auto' }}></div>
            <h6 className="mt-3">Dr. James Smith</h6>
            <p>Cardiologist</p>
            <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
              {/* Rating with star icon */}
              <div className="d-flex align-items-center">
                <FaStar className="text-warning me-1" />
                <h6>4.5 Rating</h6>
              </div>
              {/* Patient count with user icon */}
              <div className="d-flex align-items-center">
                <FaUser className="me-1" />
                <h6>115 Patients</h6>
              </div>
            </div>
          </div>
        </div>
        

        {/* Duty Hour */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4">
            <h6>Duty Hour</h6>
            <p className="text-muted mb-0">Weekly</p>
            <div className="d-flex justify-content-between mt-3">
              <div className="d-flex gap-2">
                {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                  <div
                    key={index}
                    className={`text-center ${index === 2 ? 'bg-primary text-white rounded' : 'bg-light'}`}

                    style={{ width: '30px', height: '30px' }}
                  >
                    <small>{day}</small>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-primary mt-3">49 hours Avg Duty Hour</p>
          </div>
        </div>

        {/* Doctor Salary */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4">
            <h6>Doctor Salary</h6>
            <p className="text-muted">Yearly</p>
            <div style={{ height: '200px' }}>
              <Line data={salaryData} options={salaryOptions} />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <div>
                <strong>This Week</strong>
                <p className="text-primary">$259</p>
              </div>
              <div>
                <strong>This Month</strong>
                <p className="text-primary">$873</p>
              </div>
            </div>
          </div>
        </div>
        

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
        

        {/* Patient Files */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4">
            <h6>Patient Files</h6>
            <p className="text-muted mb-2">View All</p>
            <ul className="list-unstyled">
              {[
                { name: 'Linda Pres***', file: 'pdf' },
                { name: 'John Checkup', file: 'pdf' },
                { name: 'James Pres***', file: 'pdf' },
                { name: 'Nelly X-ray result', file: 'pdf' },
              ].map((file, index) => (
                <li key={index} className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>{file.name}</strong>
                  </div>
                  <span className="badge bg-secondary">{file.file.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>





        <div className="row g-4">
        
        {/* Total Patient Analysis Chart */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '12px', backgroundColor: '#f0f8ff' }}>
            <h5 className="fw-bold mb-3">Total Patient Analysis</h5>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#e6f7ff', borderRadius: '8px', position: 'relative' }}>
              {/* Placeholder for chart */}
              <span className="text-secondary fs-3">[Chart Here]</span>
            </div>
          </div>
        </div>

        {/* Today Patient Details Table */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '12px' }}>
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

        {/* Help Center */}
        <div className="col-lg-12 mt-4">
          <div className="card shadow-sm border-0 p-4 d-flex align-items-center justify-content-center" style={{ borderRadius: '12px', backgroundColor: '#e6f7ff' }}>
            <div className="bg-dark text-white rounded-circle p-3 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaPhone size="1.5em" />
            </div>
            <h5 className="fw-bold">Help Center</h5>
            <p className="text-muted mb-0">Need assistance? Contact our support team for help.</p>
          </div>
        </div>
        
      </div>




      </div>
    </div>
  );
}

export default Dashboard;
