import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function PatientManagement() {
  const navigate = useNavigate();
  const [searchBy, setSearchBy] = useState("Patient ID");
  const [searchValue, setSearchValue] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  useEffect(() => {
    if (patientData && patientData.patientID) {
      fetchPrescriptionHistory();
    }
  }, [patientData]);

  const fetchPrescriptionHistory = async () => {
    setLoadingPrescriptions(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/patientmanagement/loadprescription/${patientData.patientID}`,
        { withCredentials: true }
      );
      
      if (response.data) {
        setPrescriptions(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch prescription history:", err);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `http://localhost:5000/admin/patientmanagement/viewpatient`,
        {
            [searchBy === "Patient ID" ? "patientId" : "firstName"]: searchValue 
        },
        {
          withCredentials: true
        }
      );
      
      if (response.data && response.data.length > 0) {
        setPatientData(response.data[0]);
      } else {
        setError("No patient found with the provided criteria");
        setPatientData(null);
      }
    } catch (err) {
      setError("Failed to fetch patient data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDoctor = async (doctorId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/patientmanagement/viewdoctor/${doctorId}`,
        { withCredentials: true }
      );
      
      if (response.data) {
        navigate(`/admin/doctor/${doctorId}`, { state: { doctor: response.data } });
      }
    } catch (err) {
      console.error("Failed to fetch doctor profile:", err);
      setError("Could not load doctor profile");
    }
  };

  const handleViewPrescription = async (reservationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/patientmanagement/loadprescription/${reservationId}`,
        { withCredentials: true }
      );
      
      if (response.data) {
        navigate(`/admin/prescription/${reservationId}`, { 
          state: { prescription: response.data } 
        });
      }
    } catch (err) {
      console.error("Failed to fetch prescription:", err);
      setError("Could not load prescription details");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/admin/patientmanagement`,
        patientData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setError(null);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Failed to save profile changes");
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-secondary">Date and Time</button>
        <button className="btn btn-outline-secondary">Manage Admitted Patients</button>
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
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Searching...
              </>
            ) : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {patientData ? (
        <>
          <div className="row">
            {/* Profile Section */}
            <div className="col-lg-4 text-center">
              <div
                className="rounded-circle bg-secondary mb-3"
                style={{ width: "150px", height: "150px", margin: "auto" }}
              ></div>
              <button className="btn btn-outline-primary mb-3">Edit Profile Picture</button>
            </div>

            {/* Patient Info Section */}
            <div className="col-lg-8">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Patient ID</label>
                  <input type="text" className="form-control" value={patientData.patientID} readOnly />
                </div>
                <div className="col-md-6">
                  <label>Registration Date</label>
                  <input type="text" className="form-control" value={patientData.registrationDate} readOnly />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>First Name</label>
                  <input type="text" className="form-control" value={patientData.firstName} readOnly />
                </div>
                <div className="col-md-6">
                  <label>Last Name</label>
                  <input type="text" className="form-control" value={patientData.lastName} readOnly />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Phone Number</label>
                  <input type="text" className="form-control" value={patientData.phoneNumber} readOnly />
                </div>
                <div className="col-md-6">
                  <label>Gender</label>
                  <input type="text" className="form-control" value={patientData.gender} readOnly />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Email</label>
                  <input type="email" className="form-control" value={patientData.email} readOnly />
                </div>
                <div className="col-md-6">
                  <label>Address</label>
                  <textarea className="form-control" value={patientData.address} rows={2} readOnly />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button 
                  className="btn btn-primary me-2"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </button>
                <button className="btn btn-danger">Cancel</button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5>Prescription History</h5>
            {loadingPrescriptions ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : prescriptions.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Prescription ID</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr key={prescription.reservationid}>
                      <td>{prescription.date}</td>
                      <td>
                        <button 
                          className="btn btn-link p-0"
                          onClick={() => handleViewDoctor(prescription.doctorId)}
                        >
                          {prescription.doctorName}
                        </button>
                      </td>
                      <td>{prescription.prescriptionId}</td>
                      <td>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleViewPrescription(prescription.reservationid)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No prescription history found</p>
            )}
          </div>
        </>
      ) : !loading && (
        <div className="text-center p-4">
          <p>No patient data found. Please search for a patient.</p>
        </div>
      )}
    </div>
  );
}

export default PatientManagement;
