import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DoctorsAndStaffManagement() {
  const [searchValue, setSearchValue] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [signupRequests, setSignupRequests] = useState([]);
  const [error, setError] = useState(null);
  const [showSignupRequests, setShowSignupRequests] = useState(false); // Toggle for signup requests
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentView, setCurrentView] = useState(""); // Tracks the active view: "searched" or "pending"
  const [pendingDoctorData, setPendingDoctorData] = useState(""); // Pending doctor data
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch new signup requests
  useEffect(() => {
    const fetchSignupRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/doctorAndStaffManagement/getSignupRequests",
          { withCredentials: true }
        );
        setSignupRequests(response.data.requests);
      } catch (err) {
        console.error("Error fetching signup requests:", err);
        setError("Failed to fetch signup requests.");
      }
    };

    fetchSignupRequests();
  }, []);
  //view pending doctor
  const handleViewPendingDoctorProfile = async (doctorId) => {
    setError(null); // Reset error message
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/doctorAndStaffManagement/viewdoctor?id=${doctorId}`,
        { withCredentials: true }
      );
      setPendingDoctorData(response.data.doctorData); // Set pending doctor data
      setCurrentView("pending"); // Set the current view to "pending"
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
      setError("Failed to fetch doctor profile.");
    }
  };

  // Update current date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Handle search for a doctor by ID
  const handleSearch = async () => {
    setDoctorData(null); // Reset doctor data on new search
    setError(null); // Reset error message
    setCurrentView(""); // Reset current view

    if (!searchValue.trim()) {
      setError("Please enter a valid doctor ID.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/admin/doctorAndStaffManagement/viewdoctor?id=${searchValue}`,
        { withCredentials: true }
      );
      setDoctorData(response.data.doctorData);
      console.log("Doctor Data:", response.data.doctorData); // Debugging log
      setError(null);
      setCurrentView("searched"); // Set the current view to "searched"
    } catch (err) {
      console.error("Error fetching doctor data:", err);
      setError("Failed to fetch doctor data.");
    }
  };

  // Handle accepting a doctor
  const handleAcceptDoctor = async (doctorId) => {
    try {
      await axios.put(
        `http://localhost:5000/admin/doctorAndStaffManagement/acceptdoctor`,
        { id: doctorId },
        { withCredentials: true }
      );
      alert("Doctor accepted successfully!");
      setSignupRequests(
        (prev) => prev.filter((request) => request.id !== doctorId) // Remove from pending list
      );
    } catch (err) {
      console.error("Error accepting doctor:", err);
      setError("Failed to accept doctor.");
    }
  };

  // handle ProfilePictureChange
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) return;

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("profilePicture", file); // Append the file to the FormData object

    //send the profile picture to the server
    try {
      const response = await axios.put(
        `http://localhost:5000/admin/doctorAndStaffManagement/upload-profile-picture/${doctorData.id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      //update the profile picture in the frontend
      setDoctorData((prev) => ({
        ...prev,
        profile_picture: response.data.profilePicture,
      }));
      console.log("Profile picture uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError("Failed to upload profile picture.");
    }
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
              className="btn btn-outline-primary mb-3 w-50"
              onClick={() => fileInputRef.current.click()} // Trigger file input
            >
              Edit Profile Picture
            </button>

            {/* Doctor Information */}
            <div className="col-md-9" style={{ marginLeft: "30px" }}>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Doctor ID:</strong> {doctorData.id}
                  </p>
                  <p>
                    <strong>First Name:</strong> {doctorData.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {doctorData.lastName}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {doctorData.phoneNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {doctorData.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {doctorData.gender}
                  </p>
                  <p>
                    <strong>Address:</strong> {doctorData.address}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Registration Date:</strong>{" "}
                    {new Date(doctorData.registrationDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(doctorData.dateOfBirth).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Specialization:</strong> {doctorData.specialization}
                  </p>
                  <p>
                    <strong>Medical School:</strong> {doctorData.medicalSchool}
                  </p>
                  <p>
                    <strong>Medical License Number:</strong>{" "}
                    {doctorData.medicalLicenseNumber}
                  </p>
                  <p>
                    <strong>Years of Experience:</strong>{" "}
                    {doctorData.yearsOfExperience}
                  </p>
                  <p>
                    <strong>Bio:</strong> {doctorData.bio}
                  </p>
                </div>
              </div>
            </div>
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
      )}

      {/* Signup Requests Table */}
      {showSignupRequests && (
        <div className="card p-3 mb-3">
          <h5>New Signup Requests</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Profile View</th>
              </tr>
            </thead>
            <tbody>
              {signupRequests.length > 0 ? (
                signupRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.name}</td>
                    <td>{new Date(request.date).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          handleViewPendingDoctorProfile(request.id)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No signup requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DoctorsAndStaffManagement;
