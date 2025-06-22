import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClinicMedical } from 'react-icons/fa'; // Ensure react-icons is installed
import { useParams } from 'react-router-dom';
import Loader from '../../components/common/Loader';

function DoctorPatientProfile() {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/doctor/patientProfile/${id}`, { withCredentials: true });
        setPatientData(response.data.data);
        console.log(response.data.data); // Debugging: API response
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const lastMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += lastMonthDays;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
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
  if (error) return <div>Error: {error.message}</div>;
  if (!patientData) return <div>No patient data available</div>;

  const {
    profilePicture,
    patientId,
    patientFirstName,
    patientLastName,
    patientGender,
    patientDateOfBirth,
    patientAddress,
    useremail,
    patientPhoneNumber,
    conditions = [],
    blood_sugar_levels = [],
    bmi =[],
    heart_rate =[],
    allergies = [],
  } = patientData;

  const age = calculateAge(patientDateOfBirth);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Patient Profile Section */}
        <div className="col-lg-3 col-md-12 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="profile-image-container">
                <img
                  src={`http://localhost:5000/uploads/storage/patient/${patientId}/profilepictures/${profilePicture}`}
                  alt="profile"
                  className="img-fluid rounded-circle"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    margin: '0 auto 1rem',
                    border: '3px solid #112D4E',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
              <h5 className="mb-1">
                {patientFirstName} {patientLastName}
              </h5>
              <small className="text-muted">
                {patientGender} - Age {age.years} Years {age.months} Months {age.days} Days
              </small>
              <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                <p><strong>DOB:</strong> {new Date(patientDateOfBirth).toLocaleDateString()}</p>
                <p><strong>Address:</strong> {patientAddress}</p>
                <p><strong>Contacts:</strong> {patientPhoneNumber}</p>
                <p><strong>Active Conditions:</strong> {conditions.map(condition => condition.condition_name).join(', ')}</p>
                <p><strong>Allergies:</strong> {allergies.map(allergie => allergie.allergy_name).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Conditions and Allergies */}
        <div className="col-lg-9 col-md-12">
          {/* Medical Conditions Table */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header text-white bg-primary">
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
                  {conditions.length ? (
                    conditions.map((condition, index) => (
                      <tr key={index}>
                        <td>{condition.condition_name}</td>
                        <td>
                          <span
                            className={`badge ${
                              condition.severity === 'mild'
                                ? 'bg-success'
                                : condition.severity === 'moderate'
                                ? 'bg-warning'
                                : 'bg-danger'
                            }`}
                          >
                            {condition.severity}
                          </span>
                        </td>
                        <td>{new Date(condition.diagnosis_date).toLocaleDateString()}</td>
                        <td>{condition.notes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No conditions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allergies Table */}
          <div className="card shadow-sm">
            <div className="card-header text-white bg-primary">
              <h4 className="mb-0"><FaClinicMedical /> Allergies</h4>
            </div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Allergy</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {allergies.length ? (
                    allergies.map((allergy, index) => (
                      <tr key={index}>
                        <td>{allergy.allergy_name}</td>
                        <td>{allergy.allergy_type}</td>
                        <td>
                          <span
                            className={`badge ${
                              allergy.severity === 'mild'
                                ? 'bg-success'
                                : allergy.severity === 'moderate'
                                ? 'bg-warning'
                                : 'bg-danger'
                            }`}
                          >
                            {allergy.severity}
                          </span>
                        </td>
                        <td>{allergy.description}</td>
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
        </div>
      </div>

      {/* Health Metrics */}
      <div className="row mt-4 mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-secondary text-center">
            <div className="card-body">
              <h5>Blood Sugar</h5>
              <h3>{blood_sugar_levels[0]?.blood_sugar_level || 'N/A'}</h3>
              <small>{blood_sugar_levels[0]?.measurement_time.split('T')[0] || 'N/A'}</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-secondary text-center">
            <div className="card-body">
              <h5>Heart Rate</h5>
              <h3>{heart_rate[0]?.heart_rate || 'N/A'}</h3>
              <small>{heart_rate[0]?.measurement_time.split('T')[0] || 'N/A'}</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-secondary text-center">
            <div className="card-body">
              <h5>BMI</h5>
              <h3>{bmi[0].bmi_value || 'N/A'}</h3>
              <small>{bmi[0].measurement_date.split('T')[0] || 'N/A'}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorPatientProfile;
