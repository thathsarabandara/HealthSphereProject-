import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/common/Loader';

function AdminDashboard() {
  const [messages, setMessages] = useState([
    { sender: "Dr. Shah", time: "10:00 AM", content: "Patient reports updated." },
    { sender: "Admin", time: "10:15 AM", content: "Please confirm appointment slots." },
    { sender: "Nurse", time: "10:30 AM", content: "Surgery preparations complete." },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [schdules, setSchedules] = useState([])
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    activeDoctors: 0,
    todaysAppointments: 0,
    bedOccupancy: '0%',
    availableBeds: 0
  });

  useEffect(() => {
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

    const fetchDashboardMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/dashboard', {
          withCredentials:true
        });
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      }
    };

    const fetchSchdule = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/dashboard/schdules', {
          withCredentials:true
        });
        setSchedules(response.data)
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      }
    };
    fetchData();
    fetchDashboardMetrics();
    fetchSchdule();
  }, [navigate]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { sender: "You", time: new Date().toLocaleTimeString(), content: newMessage },
      ]);
      setNewMessage("");
    }
  };

  if (isLoading) {
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

  return (
    <div style={{ padding: "20px", backgroundColor: "#F4F6F8" }}>
      <h2 className="m-3">Dashboard</h2>
      <div className="container-fluid">
        {/* Hospital Metrics Cards */}
        
        <div className="row">
          {[
            { title: "Total Patients", value: metrics.totalPatients, color: "#E3FCEF", percentage: "Total" },
            { title: "Total Doctors", value: metrics.activeDoctors, color: "#E3F2FD", percentage: "Total" },
            { title: "Total Appointments", value: metrics.totalAppointments, color: "#FFEBEE", percentage: "Total" },
            { title: "Total Schdules", value: metrics.totalSchedules, color: "#FFF8E1", percentage: 'Total' },
          ].map((card, index) => (
            <div key={index} className="col-md-3 col-sm-6 mb-4">
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h5 style={{ color: "#555", fontWeight: 500 }}>{card.title}</h5>
                <h2 style={{ margin: "10px 0", color: "#333", fontWeight: 600 }}>{card.value}</h2>
                <p style={{ color: "#666", fontSize: "14px" }}>{card.percentage}</p>
              </div>
            </div>
          ))}
        </div>

      <div className="row">{/* Hospital Status Section */}
        <div className="row mb-4">
          <div className="col-md-6 mb-4">
            <div style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            }}>
              <h5>Today's Schedule</h5>

              {schdules && schdules.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                  {schdules.map((schedule, index) => (
                    <li key={index} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                      <strong>{schedule.doctorName}</strong> - {schedule.schedule_date} - {schedule.schedule_time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No Data Found</p>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            }}>
              <h5>Hospital Status</h5>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  <strong>ICU Beds:</strong> 8 occupied, 2 available
                </li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  <strong>Emergency Room:</strong> 5 patients waiting
                </li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  <strong>Staff On Duty:</strong> 15 doctors, 25 nurses
                </li>
                <li style={{ padding: "8px 0" }}>
                  <strong>Medication Stock:</strong> All normal
                </li>
              </ul>
            </div>
          </div>

        </div>
        </div>
      </div>
        {/* Recent Admissions */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        }}>
          <h5>Recent Patient Admissions</h5>
          <table className="table">
            <thead style={{ backgroundColor: "#F8F9FA" }}>
              <tr>
                <th>Patient Name</th>
                <th>Admission Date</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>2023-10-01</td>
                <td>Cardiology</td>
                <td><span className="badge bg-success">Stable</span></td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>2023-10-02</td>
                <td>Orthopedics</td>
                <td><span className="badge bg-warning">Observation</span></td>
              </tr>
              <tr>
                <td>Robert Brown</td>
                <td>2023-10-02</td>
                <td>ICU</td>
                <td><span className="badge bg-danger">Critical</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default AdminDashboard;
