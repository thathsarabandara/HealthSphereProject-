import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function DoctorRequestPage() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor requests from backend
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/loadpendingdoctors');
        console.log(response.data)
        setPendingDoctors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor requests:', error);
        setError('Failed to fetch pending doctors');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Styles
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#F4F6F8',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const tableHeaderStyle = {
    backgroundColor: '#f4f6f8',
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    fontWeight: '600',
  };

  const tableCellStyle = {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
  };

  const buttonStyle = {
    padding: '6px 12px',
    marginRight: '5px',
    backgroundColor: '#03A9F4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const acceptButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336',
  };

  const handleViewProfile = (id) => {
    console.log(`Viewing profile for doctor ID: ${id}`);
    // Implement profile viewing logic
    window.open(`/doctor-profile/${id}`, '_blank');
  };

  const handleAccept = async (id) => {
    console.log(`Accepting request for doctor ID: ${id}`);
    // Update status in UI
    setPendingDoctors(pendingDoctors.map(request => 
      request.id === id ? { ...request, status: 'Accepted' } : request
    ));
    // Implement API call to backend
    try {
      await axios.put(`http://localhost:5000/admin/doctor/approve/${id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error accepting doctor request:', error);
    }
  };

  const handleReject = async (id) => {
    console.log(`Rejecting request for doctor ID: ${id}`);
    // Update status in UI
    setPendingDoctors(pendingDoctors.map(request => 
      request.id === id ? { ...request, status: 'Rejected' } : request
    ));
    // Implement API call to backend
    try {
      await axios.put(`http://localhost:5000/admin/doctor/suspend/${id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting doctor request:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <button 
        onClick={() => navigate('/admin/doctorsandstaffManagement')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        &larr; Back to Doctors & Staff
      </button>
      <h2>Doctor Registration Requests</h2>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Doctor ID</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Doctor Name</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Profile View</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingDoctors.map((request) => (
            <tr key={request.id}>
              <td style={tableCellStyle}>{request.id}</td>
              <td style={tableCellStyle}>{request.updated_at.split('T')[0]}</td>
              <td style={tableCellStyle}>{request.first_name + " " + request.last_name}</td>
              <td style={tableCellStyle}>{request.status}</td>
              <td style={tableCellStyle}>
                <Link to={`/admin/doctor/${request.id}`} style={buttonStyle}>View Profile</Link>
              </td>
              <td style={tableCellStyle}>
                <button 
                  style={acceptButtonStyle}
                  onClick={() => handleAccept(request.id)}
                >
                  Accept
                </button>
                <button 
                  style={rejectButtonStyle}
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorRequestPage;