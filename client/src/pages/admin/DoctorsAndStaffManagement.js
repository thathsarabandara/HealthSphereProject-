import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';

function DoctorsAndStaffManagement() {

  const navigate = useNavigate();

  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/loaddoctors', {withCredentials:true});
        console.log(response.data)
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setLoading(false)
        navigate('/admin/login')
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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
  if (!doctors) return <div>Doctors not found</div>;

  const containerStyle = {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  };

  const tableHeaderStyle = {
    backgroundColor: '#112d4e',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
  };

  const tableCellStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  };

  const buttonStyle = {
    padding: '5px 10px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h4>Doctors and Staff Management</h4>

      {/* Current Date and Time */}
      <div className="text-end mb-3">
        <strong>Current Date and Time:</strong>{" "}
        {currentDateTime.toLocaleDateString()}{" "}
        {currentDateTime.toLocaleTimeString()}
      </div>

      {/* Signup Requests and Total Staff Section */}
      <div className="d-flex justify-content-between mb-4">
        {/* Signup Requests Card */}
        <div
          className="card text-center me-3" // Add margin to the right for spacing
          style={{
            width: "200px",
            padding: "20px",
            backgroundColor: "#e8f4ff",
            borderRadius: "8px",
          }}
        >
          <h6>Sign Up Requests</h6>
          <p>No. of requests: {signupRequests.length}</p>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowSignupRequests(!showSignupRequests)}
          >
            View
          </button>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef} // Reference to the file input
            onChange={handleProfilePictureChange} // Handle file selection
          />
        </div>

        {/* Total Staff Card */}
        <div
          className="card text-center"
          style={{
            width: "200px",
            padding: "20px",
            backgroundColor: "#e8f4ff",
            borderRadius: "8px",
          }}
        >
          <h6>Total Staff</h6>
          <p>Doctors: 50</p>
          <p>Nurses: 30</p>
          <p>Other: 20</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="card p-3 mb-3">
        <h5>Search Doctor by ID</h5>
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Enter Doctor ID"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>

      {/* Doctor Details */}
      {doctorData && currentView === "searched" && (
        <div className="card p-3 mb-3">
          <div className="row">
            {/* Profile Picture */}
            <div
              className="rounded-circle bg-secondary "
              style={{
                width: "150px",
                height: "150px",
                marginRight: "40px",
                marginLeft: "50px",
                backgroundImage: doctorData.profile_picture
                  ? `url(${doctorData.profile_picture})`
                  : "",

                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <button
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#7B61FF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => navigate('/admin/doctorrequests')}
            >
              View
            </button>
          </div>
        </div>
      )}
      {/* Pending Doctor View */}
      {pendingDoctorData && currentView === "pending" && (
        <div className="card p-3 mb-3">
          <h5>Pending Doctor Details</h5>
          <div className="row">
            <div className="col-md-3 text-center">
              <img
                src={pendingDoctorData.profilePicture || "default-profile.png"}
                alt="Doctor Profile"
                className="img-fluid rounded-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Doctor ID:</strong> {pendingDoctorData.id}
                  </p>
                  <p>
                    <strong>First Name:</strong> {pendingDoctorData.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {pendingDoctorData.lastName}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {pendingDoctorData.phoneNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {pendingDoctorData.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {pendingDoctorData.gender}
                  </p>
                  <p>
                    <strong>Address:</strong> {pendingDoctorData.address}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Registration Date:</strong>{" "}
                    {new Date(
                      pendingDoctorData.registrationDate
                    ).toLocaleString()}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(
                      pendingDoctorData.dateOfBirth
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Specialization:</strong>{" "}
                    {pendingDoctorData.specialization}
                  </p>
                  <p>
                    <strong>Medical School:</strong>{" "}
                    {pendingDoctorData.medicalSchool}
                  </p>
                  <p>
                    <strong>Medical License Number:</strong>{" "}
                    {pendingDoctorData.medicalLicenseNumber}
                  </p>
                  <p>
                    <strong>Years of Experience:</strong>{" "}
                    {pendingDoctorData.yearsOfExperience}
                  </p>
                  <p>
                    <strong>Bio:</strong> {pendingDoctorData.bio}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-success mt-3"
                onClick={() => handleAcceptDoctor(pendingDoctorData.id)}
              >
                Accept Doctor
              </button>
            </div>
          </div>
        </div>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Doctor ID</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Doctor Name</th>
            <th style={tableHeaderStyle}>Profile View</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} style={tableCellStyle}>Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} style={tableCellStyle}>{error}</td>
            </tr>
          ) : (
            doctors.map((row, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{row.id}</td>
                <td style={tableCellStyle}>{row.updated_at.split('T')[0]}</td>
                <td style={tableCellStyle}>{row.first_name + " " + row.last_name}</td>
                <td style={tableCellStyle}>
                  <Link to={`/admin/doctor/${row.id}`} style={buttonStyle}>
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorsAndStaffManagement;
