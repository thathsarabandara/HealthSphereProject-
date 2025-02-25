import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { FaClinicMedical, FaGift, FaHeartbeat, FaBalanceScale } from 'react-icons/fa';
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

// Data and chart configuration (example)
const PatientDashboard = ({
  profilePicture,
  patientId,
  patientFirstName,
  patientLastName,
  age,
  patientGender,
  patientDateOfBirth,
  patientAddress,
  useremail,
  patientPhoneNumber,
  conditions,
  allergies,
  bloodSugarData,
  heartRateData,
  bmiData,
  medicalOffer
}) => (
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
);

export default PatientDashboard;
