import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../components/common/Loader";

function DoctorsAndStaffManagement() {
  const navigate = useNavigate();

  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const authResponse = await axios.get('http://localhost:5000/admin/home', { withCredentials: true });
        if (authResponse.status === 200) {
          await fetchDoctors();
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/loaddoctors",
          { withCredentials: true }
        );
        setDoctors(response.data || []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors data');
        toast.error('Failed to load doctors data', {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored"
        });
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (!doctors) return <div>Doctors not found</div>;

  const containerStyle = {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  };

  const tableHeaderStyle = {
    backgroundColor: "#112d4e",
    color: "white",
    padding: "10px",
    textAlign: "left",
  };

  const tableCellStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "4px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h4>Doctors and Staff Management</h4>
        <p
          style={{
            backgroundColor: "#bacae7",
            borderRadius: "10px",
            textAlign: "center",
            padding: "5px",
          }}
        >
          {" "}
          {dateTime}
        </p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div style={{ padding: "20px", backgroundColor: "#F4F6F8" }}>
            <h5>Sign up request</h5>
            <div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  color: "black",
                  fontSize: 20,
                  fontFamily: "Sansation",
                  fontWeight: "700",
                  wordWrap: "break-word",
                }}
              >
                No. of requests -
              </div>
              <div
                style={{ width: "100%", height: "100%", background: "#786262" }}
              />
            </div>
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
              onClick={() => navigate("/admin/doctorrequests")}
            >
              View
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div style={{ padding: "20px", backgroundColor: "#F4F6F8" }}>
            <h5>Total Staff</h5>
            <div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  color: "black",
                  fontSize: 20,
                  fontFamily: "Sansation",
                  fontWeight: "700",
                  wordWrap: "break-word",
                }}
              >
                Doctors -
              </div>
              <div
                style={{ width: "100%", height: "100%", background: "#786262" }}
              />
            </div>
            <div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  color: "black",
                  fontSize: 20,
                  fontFamily: "Sansation",
                  fontWeight: "700",
                  wordWrap: "break-word",
                }}
              >
                Nurse -
              </div>
              <div
                style={{ width: "100%", height: "100%", background: "#786262" }}
              />
            </div>
            <div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  color: "black",
                  fontSize: 20,
                  fontFamily: "Sansation",
                  fontWeight: "700",
                  wordWrap: "break-word",
                }}
              >
                Others -
              </div>
              <div
                style={{ width: "100%", height: "100%", background: "#786262" }}
              />
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
          {isLoading ? (
            <tr>
              <td colSpan={4} style={tableCellStyle}>
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} style={tableCellStyle}>
                {error}
              </td>
            </tr>
          ) : (
            doctors.map((row, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{row.id}</td>
                <td style={tableCellStyle}>{row.updated_at.split("T")[0]}</td>
                <td style={tableCellStyle}>
                  {row.first_name + " " + row.last_name}
                </td>
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
