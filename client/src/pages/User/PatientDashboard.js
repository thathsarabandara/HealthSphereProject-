import React from 'react';
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

// Register required chart components
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

const Dashboard = () => {
  // Sample data for Blood Sugar (Bar Chart)
  const bloodSugarData = {
    labels: ['Jul 24', 'Jul 27', 'Jul 30', 'Aug 3', 'Aug 6'],
    datasets: [
      {
        label: 'Blood Sugar',
        data: [50, 80, 120, 90, 60],
        backgroundColor: ['#4a90e2', '#4a90e2', '#e74c3c', '#4a90e2', '#4a90e2'],
        borderRadius: 5,
      },
    ],
  };

  // Sample data for Heart Rate (Line Chart)
  const heartRateData = {
    labels: ['Jul 24', 'Jul 27', 'Jul 30', 'Aug 3', 'Aug 6'],
    datasets: [
      {
        label: 'Heart Rate',
        data: [72, 75, 78, 80, 74],
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.3)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Sample data for BMI (Bar Graph)
  const bmiData = {
    labels: ['Jul 24', 'Jul 27', 'Jul 30', 'Aug 3', 'Aug 6'],
    datasets: [
      {
        label: 'BMI',
        data: [22, 23.5, 25, 24, 26],
        backgroundColor: bmi => {
          // Dynamic color based on BMI value
          const value = bmi.raw;
          if (value < 18.5) return '#3498db'; // Underweight - Blue
          if (value >= 18.5 && value <= 24.9) return '#2ecc71'; // Normal - Green
          if (value >= 25 && value <= 29.9) return '#f1c40f'; // Overweight - Yellow
          return '#e74c3c'; // Obese - Red
        },
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
        <div>
          <h2 className="font-weight-bold mb-0">Hello, Damien Smith! 👋</h2>
          <p className="mb-0"><b>Welcome to your Dashboard! 🌟📊</b></p>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Profile Section */}
        <div className="col-lg-3 col-md-12 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <img
                src={PatientImg}
                alt="Damien Smith"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px' }}
              />
              <h5 className="mb-1">Damien Smith</h5>
              <small className="text-muted">Male - 34 yrs 6 mos</small>

              <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                <p><strong>DOB:</strong> 17/02/1990</p>
                <p><strong>Address:</strong> 89/4, Maha Ambalangoda, Ambalangoda.</p>
                <p><strong>Contacts:</strong> damiensmith@gmail.com |<br /> +94 72 200 2000</p>
                <p><strong>Active Conditions:</strong> Hypertension, Asthma, Dermatitis</p>
                <p><strong>Allergies:</strong> Latex, Levaquin, Peanuts, Penicillin</p>
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
                  <h5 className="card-title font-weight-bold"><FaGift /> Exclusive Offers</h5>
                  <p className="mt-3"><strong>Discount:</strong> 20% off on next consultation</p>
                  <p><strong>Expires:</strong> Sep 15, 2024</p>
                  <button className="btn btn-success btn-block">Redeem Offer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
