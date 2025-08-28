import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

function PatientManagement() {
  const [searchBy, setSearchBy] = useState("Patient ID");
  const [searchValue, setSearchValue] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchByParam = params.get("searchBy");
    const searchValueParam = params.get("searchValue");
    if (searchByParam && searchValueParam) {
      setSearchBy(searchByParam);
      setSearchValue(searchValueParam);
      handleSearch(searchByParam, searchValueParam);
    }
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/home', { withCredentials: true });
        if (response.status === 200) {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error)
        navigate('/admin/login')
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [navigate]);

  const handleSearch = async (customSearchBy, customSearchValue) => {
    setLoading(true);
    setError(null);

    // Use passed-in values or current state
    const searchByToUse = customSearchBy || searchBy;
    const searchValueToUse = customSearchValue || searchValue;

    setPatientData(null);
    setEditForm({});
    setReservations([]);

    try {
      let query = "";
      if (searchByToUse === "Patient ID") {
        // Validate that searchValue is a positive integer
        const parsedValue = parseInt(searchValueToUse, 10);
        if (isNaN(parsedValue) || parsedValue <= 0) {
          setError("Please enter a valid positive integer for Patient ID.");
          setLoading(false);
          return;
        }
        query = `id=${parsedValue}`;
      } else if (searchByToUse === "Name") {
        if (!searchValueToUse.trim()) {
          setError("Please enter a name to search.");
          setLoading(false);
          return;
        }
        query = `name=${encodeURIComponent(searchValueToUse)}`;
      }

      const response = await axios.get(
        `http://localhost:5000/admin/patientmanagement/viewpatient?${query}`,
        { withCredentials: true }
      );
      setPatientData(response.data.patient);
      setReservations(response.data.reservations);

      // Update URL with search params only after search
      navigate(
        `?searchBy=${encodeURIComponent(
          searchByToUse
        )}&searchValue=${encodeURIComponent(searchValueToUse)}`,
        { replace: true }
      );
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
      first_name: patientData?.first_name || "",
      last_name: patientData?.last_name || "",
      date_of_birth: patientData?.date_of_birth || "",
      gender: patientData?.gender || "",
      phone_number: patientData?.phone_number || "",
      address: patientData?.address || "",
      email: patientData?.email || "",
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
      const response = await axios.put(
        "http://localhost:5000/admin/patientmanagement",
        {
          id: patientData.User_id,
          ...editForm,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Profile updated:", response.id);

      // Show success message
      alert("Profile updated successfully!");

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

  // View reservations details
  const handleViewPrescription = async (reservationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/patientmanagement/loadprescription/${reservationId}`,
        { withCredentials: true }
      );
      setPrescriptionDetails(response.data);
      setShowPrescriptionModal(true);
    } catch (err) {
      setError("Failed to load prescription details");
      setPrescriptionDetails(null);
      setShowPrescriptionModal(false);
      console.error("reservations error:", err);
    }
  };
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await axios.post(
        `http://localhost:5000/admin/patientmanagement/uploadprofilepicture/${patientData.User_id}`,
        formData,
        { withCredentials: true }
      );
      // Update the profile picture in the frontend
      setPatientData((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture, // Update with the new image URL
      }));
      console.log("Profile picture updated:", response.data.profilePicture);

      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      alert("Failed to upload profile picture. Please try again.");
    }
  };

  const handleViewDoctor = (doctorId) => {
    navigate(`/admin/doctor/${doctorId}`);
  };

  return (
    <div className="container my-4">
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
            <option value="Name">Name</option>
          </select>
          <input
            type="text"
            className="form-control me-2"
            style={{ width: "300px" }}
            placeholder={`Enter ${searchBy}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            autoComplete="off"
          />

          <button
            className="btn btn-primary"
            onClick={() => handleSearch()}
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
                backgroundImage:
                  `http://localhost:5000${patientData.profilePicture}`
                    ? `url(${patientData.profilePicture})`
                    : "",

                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <button
              className="btn btn-outline-primary mb-3"
              onClick={() => fileInputRef.current.click()} // Trigger file input
            >
              Edit Profile Picture
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef} // Reference to the file input
              onChange={handleProfilePictureChange} // Handle file selection
            />
          </div>

          {/* Patient Info Section */}
          <div className="col-lg-8">
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Patient ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={patientData.User_id || ""}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label>Registration Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={patientData.created_at || ""}
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
                    value={editForm.first_name || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.first_name || ""}
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
                    value={editForm.last_name || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.last_name || ""}
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
                    value={editForm.phone_number || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.phone_number || ""}
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
                    value={editForm.gender || ""}
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
                    value={patientData.gender || ""}
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
                    value={editForm.email || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="email"
                    className="form-control"
                    value={patientData.email || ""}
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
                    value={editForm.address || ""}
                    onChange={handleInputChange}
                    rows={2}
                  />
                ) : (
                  <textarea
                    className="form-control"
                    value={patientData.address || ""}
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
                    value={editForm.date_of_birth || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={patientData.date_of_birth || ""}
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
                <button
                  className="btn btn-primary me-2"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* reservations History */}
      <div className="mt-4">
        <h5>Reservation History</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor ID</th>
              <th>Doctor Name</th>
              <th>Profile View</th>
              <th>Doctor Schedule ID</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((reservations) => (
                <tr key={reservations.reservationId}>
                  <td>{reservations?.reservationId}</td>
                  <td>
                    {new Date(
                      reservations.reservationDate
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(
                      reservations.reservationTime
                    ).toLocaleTimeString()}
                  </td>
                  <td>{reservations.doctorId}</td>
                  <td>{reservations.doctorName}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewDoctor(reservations.doctorId)}
                    >
                      View
                    </button>
                  </td>
                  <td>{reservations.scheduleId}</td>
                  <td>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        handleViewPrescription(reservations.reservationId)
                      }
                    >
                      View Prescription
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No reservations history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showPrescriptionModal && prescriptionDetails && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Prescription Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPrescriptionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Patient Name:</strong>{" "}
                  {prescriptionDetails.patient_name}
                </p>
                <p>
                  <strong>Date Issued:</strong>{" "}
                  {prescriptionDetails.date_issued}
                </p>
                <p>
                  <strong>Details:</strong> {prescriptionDetails.details}
                </p>
                <p>
                  <strong>Special Comments:</strong>{" "}
                  {prescriptionDetails.special_comments}
                </p>
                {prescriptionDetails.prescription_photo &&
                  (prescriptionDetails.prescription_photo.endsWith(".pdf") ? (
                    <a
                      href={prescriptionDetails.prescription_photo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  ) : (
                    <img
                      src={prescriptionDetails.prescription_photo}
                      alt="Prescription"
                      style={{ maxWidth: "100%" }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientManagement;
