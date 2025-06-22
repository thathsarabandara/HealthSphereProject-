import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useEffect } from "react";
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/home', { withCredentials: true });
        if (response.status === 200) {
          setIsLoading(false);
        }
      } catch (error) {
        const errorCode = error.response?.status;
        setError(errorCode);
  
        if (errorCode === 401) {
          navigate('/admin/login');
        } else if (errorCode) {
          navigate(`/error/${errorCode}`);
        } else {
          navigate('/error/500');  // Fallback for unknown/network errors
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
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

  const events = [
    {
      title: "Dr. Shah Appointment",
      start: new Date(2023, 8, 9, 11, 0),
      end: new Date(2023, 8, 9, 12, 0),
      type: "Appointment",
    },
    {
      title: "Dr. Pande Surgery",
      start: new Date(2023, 8, 9, 11, 0),
      end: new Date(2023, 8, 9, 17, 0),
      type: "Surgery",
    },
    {
      title: "Dr. Sawant Appointment",
      start: new Date(2023, 8, 9, 10, 0),
      end: new Date(2023, 8, 9, 12, 0),
      type: "Appointment",
    },
  ];

  const localizer = momentLocalizer(moment);

  const customStyles = {
    calendarHeader: {
      backgroundColor: "#007BFF",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      textAlign: "center",
    },
    dayLabels: {
      backgroundColor: "#DFF3FF",
      color: "#007BFF",
      padding: "5px 0",
    },
    event: {
      backgroundColor: "#FFD54F",
      color: "#333",
      borderRadius: "5px",
      padding: "2px 5px",
    },
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#F4F6F8" }}>
      <h2 className="m-3">Dashboard</h2>
      <div className="container-fluid">
        {/* Dashboard Cards */}
        <div className="row">
          {[
            { title: "New Patients", value: "890", color: "#E3FCEF", percentage: "+40%" },
            { title: "OPD Patients", value: "360", color: "#E3F2FD", percentage: "+30%" },
            { title: "Lab Tests", value: "980", color: "#FFEBEE", percentage: "+60%" },
            { title: "Total Earnings", value: "$98,000", color: "#FFF8E1", percentage: "+20%" },
          ].map((card, index) => (
            <div key={index} className="col-md-3 col-sm-6 mb-4">
              <div
                style={{
                  backgroundColor: card.color,
                  borderRadius: "15px",
                  padding: "20px",
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h5>{card.title}</h5>
                <h2>{card.value}</h2>
                <p style={{ color: "green" }}>{card.percentage} this month</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="row mb-4" style={{ padding: "20px", backgroundColor: "#F4F6F8" }}>
          {[
            { label: "Appointments", value: 639, color: "#fbebff" },
            { label: "Doctors", value: 83, color: "#fbebff" },
            { label: "Staff", value: 296, color: "#fbebff" },
            { label: "Operations", value: 49 , color: "#fbebff"},
            ].map((metric, index) => (
              <div key={index} className="col-md-3 col-sm-6 mb-3">
                  <div
                    style={{
                      backgroundColor: metric.color,
                      borderRadius: "10px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <h5>{metric.label}</h5>
                    <h2>{metric.value}</h2>
                  </div>
              </div>
          ))}
        </div>


{/*........................................................................*/}

        <div style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <div className="container-fluid">
            {/* Dashboard Metrics */}
            <div className="row mb-4">
              {[
                { label: "Rooms Occupied", value: 20 },
                { label: "Rooms Free", value: 10 },
                { label: "Beds Occupied (ICU)", value: 8 },
                { label: "Beds Free (ICU)", value: 2 },
              ].map((metric, index) => (
                <div key={index} className="col-md-3 col-sm-6 mb-3">
                  <div
                    style={{
                      backgroundColor: "#bacae7",
                      borderRadius: "10px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <h5>{metric.label}</h5>
                    <h2>{metric.value}</h2>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Schedules */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h5>Upcoming Schedules</h5>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li>8:00 AM - OPD (Dr. Ravimal)</li>
                    <li>11:00 AM - Eye (Dr. Deepita)</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h5>Today's Staff</h5>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li>Doctors: 15</li>
                    <li>Nurses: 25</li>
                    <li>Other Staff: 10</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Appointments and Feedback */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h5>Appointments</h5>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li>Patients Checked In: 50</li>
                    <li>Appointments Due: 10</li>
                    <li>Appointments Canceled: 5</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h5>Feedback</h5>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li>Doctors: Positive</li>
                    <li>Patients: Mixed</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>


{/*.........................................................................*/}



        {/* Main Section */}
        <div className="row">
          {/* Calendar Section */}
          <div className="col-lg-6 mb-4">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={customStyles.calendarHeader}>December 2024</div>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 250 }}
                views={{ month: true }}
                components={{
                  toolbar: () => null,
                  month: {
                    header: () => null,
                    dateHeader: ({ label }) => (
                      <div style={customStyles.dayLabels}>{label}</div>
                    ),
                  },
                  event: ({ event }) => (
                    <span style={customStyles.event}>{event.title}</span>
                  ),
                }}
              />
              <div style={{ marginTop: "20px" }}>
                <h6>Activity Details</h6>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {events.map((event, index) => (
                    <li key={index}>
                      <strong>{event.title}</strong> - {moment(event.start).format("hh:mm A")} - {moment(event.end).format("hh:mm A")}
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#7B61FF",
                    color: "white",
                    border: "none", borderRadius: "5px",cursor: "pointer",
                  }}
                >
                  Add New
                </button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="col-lg-6 mb-4">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                height: "450px",
              }}
            >
              <h5>Chat</h5>
              <div
                style={{
                  height: "300px",
                  overflowY: "scroll",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: "#F9FAFB",
                }}
              >
                {messages.map((message, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <strong>{message.sender}</strong>{" "}
                    <span style={{ fontSize: "12px", color: "#888" }}>{message.time}</span>
                    <p>{message.content}</p>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                  }}
                  placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} style={{backgroundColor: "#7B61FF",color: "white",padding: "10px 20px",border: "none",borderRadius: "5px",marginLeft: "10px",}}> Send</button>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h5>Patients Activities</h5>
          <table className="table">
            <thead style={{ backgroundColor: "#F1F3F4" }}>
              <tr>
                <th>Bed No.</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Admitted Date</th>
                <th>Operations</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>101</td>
                <td>Sibi Mathew</td>
                <td>35</td>
                <td>10/01/2023</td>
                <td>Hand Surgery</td>
                <td>10:00 AM</td>
                <td>
                  <span className="badge bg-success">Successful</span>
                </td>
                <td>-</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
}

export default AdminDashboard;
