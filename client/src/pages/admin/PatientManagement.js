import React, { useState } from "react";


function PatientManagement() {
  const [searchBy, setSearchBy] = useState("Patient ID");
  const [searchValue, setSearchValue] = useState("");
  const [patientData, setPatientData] = useState({
    patientID: "P001",
    registrationDate: "2022-09-19",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "1234567890",
    gender: "Male",
    email: "john.doe@example.com",
    address: "123 Street, City, Country",
  });

  const handleSearch = () => {
    console.log(`Searching by ${searchBy}: ${searchValue}`);
    // Add logic to fetch and filter patient data based on the search criteria
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
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

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
            <button className="btn btn-primary me-2">Edit</button>
            <button className="btn btn-danger">Cancel</button>
          </div>
        </div>
      </div>

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
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td>{patientData.patientID}</td>
                <td>2022.09.19</td>
                <td>18:00:00</td>
                <td>D001</td>
                <td>John</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm">View</button>
                </td>
                <td>PR001</td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientManagement;

