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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page

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

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const formattedCategory = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Main return block
  return (
    <div className="container mt-4" style={{ minHeight: '70vh' }}>
      <h2 className="mb-3">Channel a {formattedCategory}</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
          Back to Doctors
        </button>
        <div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(number)}>
                    {number}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-striped table-hover">
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
                {currentDoctors.map((doctor) => (
                  <tr key={doctor.id}> {/* Assuming each doctor has a unique 'id' */}
                    <td>{doctor.doctor_id}</td>
                    <td>{doctor.doctorname}</td>
                    <td>{doctor.date}</td>
                    <td>{doctor.time}</td>
                    <td>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleProfileView(doctor.doctor_id)}
                      >
                        View
                      </button>
                    </td>
                    <td>Rs. {doctor.consultationFee}</td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReservation(doctor.schedule_id)}
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDetails;
