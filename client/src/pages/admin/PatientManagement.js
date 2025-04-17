import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function PatientManagement() {
  const [searchBy, setSearchBy] = useState("Patient ID");
  const [searchValue, setSearchValue] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Fetch patient data when search is performed
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      if (searchBy === "Patient ID") {
        // Call patientDetails endpoint
        const response = await axios.get(
          "http://localhost:5000/patientDetails/viewpatient",
          {
            params: { id: searchValue },
            withCredentials: true,
          }
        );
        console.log("Patient data:", response.data);

        setPatientData(response.data.data);

        // If you have a way to get prescriptions for this patient, add that here
        // For example:
        // const presResponse = await axios.get(`/patientPrescriptions/${response.data.data.patientId}`);
        // setPrescriptions(presResponse.data);
      } else {
        // Implement search by first name if needed
        // This would require a new endpoint in your backend
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch patient data");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = () => {
    setEditing(true);
    setEditForm({
      first_name: patientData?.patientFirstName || "",
      last_name: patientData?.patientLastName || "",
      date_of_birth: patientData?.patientDateOfBirth || "",
      gender: patientData?.patientGender || "",
      phone_number: patientData?.patientPhoneNumber || "",
      address: patientData?.patientAddress || "",
      email: patientData?.patientemail || "",
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile updates
  const handleSaveProfile = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/saveProfile",
        {
          id: patientData.patientId,
          ...editForm,
        },
        {
          withCredentials: true,
        }
      );

      // Refresh patient data
      await handleSearch();
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Update error:", err);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditing(false);
  };

  // View prescription details
  const handleViewPrescription = async (reservationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/loadPrescription/${reservationId}`,
        {
          withCredentials: true,
        }
      );
      // You might want to display this in a modal
      alert(`Prescription Details:\n${response.data.details}`);
    } catch (err) {
      setError("Failed to load prescription details");
      console.error("Prescription error:", err);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-secondary">Date and Time</button>
        <button className="btn btn-outline-secondary">
          Manage Admitted Patients
        </button>
      </div>

      {/* Search Section */}
      <div className="card p-3 mb-3">
        <h5>Search Patients</h5>
        <div className="d-flex align-items-center">
          <label className="me-2">Search By:</label>
          <select
            className="form-select me-2"
            style={{ width: "200px" }}
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="Patient ID">Patient ID</option>
            <option value="First Name">First Name</option>
          </select>
          <input
            type="text"
            className="form-control me-2"
            style={{ width: "300px" }}
            placeholder={`Enter ${searchBy}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>

      {loading && (
        <div className="text-center my-4">Loading patient data...</div>
      )}

      {patientData && (
        <div className="row">
          {/* Profile Section */}
          <div className="col-lg-4 text-center">
            <div
              className="rounded-circle bg-secondary mb-3"
              style={{
                width: "150px",
                height: "150px",
                margin: "auto",
                backgroundImage: patientData.profilePicture
                  ? `url(${patientData.profilePicture})`
                  : undefined,
                backgroundSize: "cover",
              }}
            ></div>
            <button className="btn btn-outline-primary mb-3">
              Edit Profile Picture
            </button>
          </div>

          {/* Patient Info Section */}
          <div className="col-lg-8">
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Patient ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={patientData.patientId}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label>Registration Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={patientData.reservationDate}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>First Name</label>
                {editing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    value={editForm.first_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.patientFirstName}
                    readOnly
                  />
                )}
              </div>
              <div className="col-md-6">
                <label>Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    value={editForm.last_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.patientLastName}
                    readOnly
                  />
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Phone Number</label>
                {editing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="phone_number"
                    value={editForm.phone_number}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.patientPhoneNumber}
                    readOnly
                  />
                )}
              </div>
              <div className="col-md-6">
                <label>Gender</label>
                {editing ? (
                  <select
                    className="form-control"
                    name="gender"
                    value={editForm.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.patientGender}
                    readOnly
                  />
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Email</label>
                {editing ? (
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="email"
                    className="form-control"
                    value={patientData.patientemail}
                    readOnly
                  />
                )}
              </div>
              <div className="col-md-6">
                <label>Address</label>
                {editing ? (
                  <textarea
                    className="form-control"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    rows={2}
                  />
                ) : (
                  <textarea
                    className="form-control"
                    value={patientData.patientAddress}
                    rows={2}
                    readOnly
                  />
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Date of Birth</label>
                {editing ? (
                  <input
                    type="date"
                    className="form-control"
                    name="date_of_birth"
                    value={editForm.date_of_birth}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.patientDateOfBirth}
                    readOnly
                  />
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end">
              {editing ? (
                <>
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleSaveProfile}
                  >
                    Save
                  </button>
                  <button className="btn btn-danger" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger">Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prescription History */}
      <div className="mt-4">
        <h5>Prescription History</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor ID</th>
              <th>Doctor Name</th>
              <th>Profile View</th>
              <th>Prescription ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td>{patientData?.patientId}</td>
                  <td>
                    {new Date(prescription.date_issued).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(prescription.date_issued).toLocaleTimeString()}
                  </td>
                  <td>{prescription.doctorId}</td>
                  <td>{prescription.doctorName}</td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm">
                      View
                    </button>
                  </td>
                  <td>{prescription.id}</td>
                  <td>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        handleViewPrescription(prescription.reservation_id)
                      }
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No prescription history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientManagement;
