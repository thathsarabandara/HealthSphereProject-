import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function DoctorDetails() {
  const { category } = useParams(); // Extract the category from URL parameters
  const [doctors, setDoctors] = useState([]); // State to hold doctor data
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      fetchDoctors(category); // Fetch doctors based on the category
    } else {
      console.warn('No category found in URL.'); // Log a warning if the category is null
    }
  }, [category]);

  const fetchDoctors = async (category) => {
    try {
      // Make the API call using Axios
      const response = await axios.get(`http://localhost:5000/finddoctor/${category}`); // Corrected URL
      setDoctors(response.data); // Update state with fetched doctor data
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      // Optionally, you can handle specific error messages or state updates here
    }
  };

  const handleReservation = async (id) => {
    navigate(`/finddoctors/${category}/reservation/${id}`);
  }

  return (
    <div className="container">
      <h2 className="title">Channel A {category}</h2>

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
            doctors.map(doctor => (
              <tr key={doctor.id}> {/* Assuming each doctor has a unique 'id' */}
                <td>{doctor.doctor_id}</td>
                <td>{doctor.doctorname}</td>
                <td>{doctor.date}</td>
                <td>{doctor.time}</td>
                <td><a href={doctor.profileLink}>View</a></td> {/* Assuming profileLink is available */}
                <td>Rs. {doctor.consultationFee}</td>
                <td><button onClick={() => handleReservation(doctor.schedule_id)}>Book</button></td>
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
