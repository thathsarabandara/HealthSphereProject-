import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import Loader from '../../../components/common/Loader';

function DoctorDetails() {
  const { category } = useParams(); // Extract the category from URL parameters
  const [doctors, setDoctors] = useState([]); // State to hold doctor data
  const [isLoading, setLoading] = useState(false); // Correct initial state to boolean
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      fetchDoctors(category); // Fetch doctors based on the category
    } else {
      console.warn('No category found in URL.'); // Log a warning if the category is null
    }
  }, [category]);

  const fetchDoctors = async (category) => {
    setLoading(true); // Start loading before making the API call
    setError(null); // Reset error before fetching
    try {
      // Make the API call using Axios
      const response = await axios.get(`http://localhost:5000/finddoctor/${category}`);
      setDoctors(response.data); // Update state with fetched doctor data

    } catch (error) {
      console.error("Error fetching doctor data:", error);
      setError("Failed to load doctor data. Please try again later."); // Update error state
    } finally {
      setLoading(false); // Stop loading in both success and failure
    }
  };

  const handleReservation = async (id) => {
    navigate(`/finddoctors/${category}/reservation/${id}`);
  };

  const handleProfileView = async (id) => {
    navigate(`/profileDoctor/${id}`);
  };

  // Loader and error display
  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f4f8',
          zIndex: 9999,
        }}
      >
        <Loader />
      </div>
    );
  }

  // Main return block
  return (
    <div className="container" style={{minHeight: '70vh'}}>
      <h2 className="title">Channel A {category}</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} {/* Display error if any */}
      <table className="table">
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Doctor Profile</th>
            <th>Consultation Fee</th>
            <th>Book</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <tr key={doctor.id}> {/* Assuming each doctor has a unique 'id' */}
                <td>{doctor.doctor_id}</td>
                <td>{doctor.doctorname}</td>
                <td>{doctor.date}</td>
                <td>{doctor.time}</td>
                <td>
                  <button onClick={() => handleProfileView(doctor.doctor_id)}>View</button>
                </td>
                <td>Rs. {doctor.consultationFee}</td>
                <td>
                  <button onClick={() => handleReservation(doctor.schedule_id)}>Book</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No doctors available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorDetails;
