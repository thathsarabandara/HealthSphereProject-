import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/common/Loader';

function DoctorRequestPage() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [acceptLoading, setAcceptLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor requests from backend
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/loadpendingdoctors', {withCredentials:true});
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

  const handleViewProfile = (id) => {
    console.log(`Viewing profile for doctor ID: ${id}`);
    // Implement profile viewing logic
    window.open(`/doctor-profile/${id}`, '_blank');
  };

  const handleAccept = async (id) => {
    setAcceptLoading(prev => ({ ...prev, [id]: true }));
    console.log(`Accepting request for doctor ID: ${id}`);
    // Update status in UI
    setPendingDoctors(pendingDoctors.map(request => 
      request.id === id ? { ...request, status: 'Accepted' } : request
    ));
    // Implement API call to backend
    try {
      await axios.put(`http://localhost:5000/admin/doctor/approve/${id}`, {}, {withCredentials:true});
      toast.success('Doctor approved successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error accepting doctor request:', error);
      toast.error('Failed to approve doctor!');
    }
    setAcceptLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleReject = async (id) => {
    setRejectLoading(prev => ({ ...prev, [id]: true }));
    console.log(`Rejecting request for doctor ID: ${id}`);
    // Update status in UI
    setPendingDoctors(pendingDoctors.map(request => 
      request.id === id ? { ...request, status: 'Rejected' } : request
    ));
    // Implement API call to backend
    try {
      await axios.put(`http://localhost:5000/admin/doctor/suspend/${id}`, {}, {withCredentials:true} );
      toast.success('Doctor rejected successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting doctor request:', error);
      toast.error('Failed to reject doctor!');
    }
    setRejectLoading(prev => ({ ...prev, [id]: false }));
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingDoctors.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const paginationButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <ToastContainer />
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
      
      {currentItems.length > 0 ? (
        <>
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
              {currentItems.map((request) => (
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
                      disabled={acceptLoading[request.id]}
                    >
                      {acceptLoading[request.id] ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : null}
                      Accept
                    </button>
                    <button 
                      style={rejectButtonStyle}
                      onClick={() => handleReject(request.id)}
                      disabled={rejectLoading[request.id]}
                    >
                      {rejectLoading[request.id] ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : null}
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              style={paginationButtonStyle}
            >
              Previous
            </button>
            <p style={{ margin: '0 10px', lineHeight: '35px' }}>Page {currentPage}</p>
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={indexOfLastItem >= pendingDoctors.length}
              style={paginationButtonStyle}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No pending doctor requests.</p>
      )}
    </div>
  );
}

export default DoctorRequestPage;