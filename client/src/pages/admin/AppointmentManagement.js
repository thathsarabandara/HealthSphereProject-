import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppointmentManagement() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState({});

  // Search states for pending requests
  const [searchPending, setSearchPending] = useState({
    id: '',
    doctorId: '',
    name: '',
    date: ''
  });

  // Search states for cancelled requests
  const [searchCancelled, setSearchCancelled] = useState({
    id: '',
    doctorId: '',
    name: '',
    date: ''
  });

  // For pending requests table
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [itemsPerPagePending] = useState(5);

  // For cancelled requests table
  const [currentPageCancelled, setCurrentPageCancelled] = useState(1);
  const [itemsPerPageCancelled] = useState(5);

  // Filter pending requests based on search criteria
  const filteredPendingRequests = doctorRequests.filter(request => {
    const matchesId = searchPending.id === '' || 
      request.id.toString().includes(searchPending.id.toLowerCase());
    const matchesDoctorId = searchPending.doctorId === '' || 
      request.doctor_id.toString().includes(searchPending.doctorId.toLowerCase());
    const matchesName = searchPending.name === '' || 
      `${request.doctor_first_name} ${request.doctor_last_name}`.toLowerCase().includes(searchPending.name.toLowerCase());
    const matchesDate = searchPending.date === '' || 
      request.schedule_date === searchPending.date;
    
    return matchesId && matchesDoctorId && matchesName && matchesDate;
  });

  // Filter cancelled requests based on search criteria
  const filteredCancelledRequests = cancelledRequests.filter(request => {
    const matchesId = searchCancelled.id === '' || 
      request.id.toString().includes(searchCancelled.id.toLowerCase());
    const matchesDoctorId = searchCancelled.doctorId === '' || 
      request.doctor_id.toString().includes(searchCancelled.doctorId.toLowerCase());
    const matchesName = searchCancelled.name === '' || 
      `${request.doctor_first_name} ${request.doctor_last_name}`.toLowerCase().includes(searchCancelled.name.toLowerCase());
    const matchesDate = searchCancelled.date === '' || 
      request.schedule_date === searchCancelled.date;
    
    return matchesId && matchesDoctorId && matchesName && matchesDate;
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/home', { withCredentials: true });
        if (response.status === 200) {
          fetchRequests();
        }
      } catch (error) {
        console.log(error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/schedules", {
          withCredentials: true,
        });
        setDoctorRequests(response.data.requests || []);
        setCancelledRequests(response.data.rejectedSchedules || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error('Failed to fetch appointments',
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleAcceptClick = async (requestId) => {
    setAcceptLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(`http://localhost:5000/admin/acceptschedule/${requestId}`, {room: selectedRoom} , {withCredentials: true});
      setDoctorRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
      toast.success('Appointment accepted successfully!',
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error('Failed to accept appointment',
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
    setAcceptLoading(prev => ({ ...prev, [requestId]: false }));
  };

  const handleSendReason = async () => {
    setRejectLoading(true);
    if (!rejectReason.trim()) {
      alert("Please enter a reason!");
      setRejectLoading(false);
      return;
    }

    try {
      await axios.post(`http://localhost:5000/admin/rejectschedule/${selectedRequest.id}`, {
        reason: rejectReason,
      }, {withCredentials:true});

      setDoctorRequests((prevRequests) => prevRequests.filter((req) => req.id !== selectedRequest.id));
      setCancelledRequests((prev) => [...prev, { ...selectedRequest, reason: rejectReason }]);
      
      setShowModal(false);
      setRejectReason("");
      toast.success('Appointment rejected successfully!',
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error('Failed to reject appointment',
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
    setRejectLoading(false);
  };

  const roomOptions = ["-", 1, 2, 3, 4, 5, 6, 7, 8];

  // Calculate pagination for pending requests
  const indexOfLastPending = currentPagePending * itemsPerPagePending;
  const indexOfFirstPending = indexOfLastPending - itemsPerPagePending;
  const currentPendingRequests = filteredPendingRequests.slice(indexOfFirstPending, indexOfLastPending);

  // Calculate pagination for cancelled requests
  const indexOfLastCancelled = currentPageCancelled * itemsPerPageCancelled;
  const indexOfFirstCancelled = indexOfLastCancelled - itemsPerPageCancelled;
  const currentCancelledRequests = filteredCancelledRequests.slice(indexOfFirstCancelled, indexOfLastCancelled);

  // Change page for pending
  const paginatePending = (pageNumber) => {
    setCurrentPagePending(pageNumber);
    window.scrollTo(0, 0);
  };

  // Change page for cancelled
  const paginateCancelled = (pageNumber) => {
    setCurrentPageCancelled(pageNumber);
    window.scrollTo(0, document.getElementById('cancelled-requests').offsetTop - 20);
  };

  // Handle search input changes for pending requests
  const handlePendingSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchPending(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPagePending(1);
  };

  // Handle search input changes for cancelled requests
  const handleCancelledSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCancelled(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPageCancelled(1);
  };

  // Clear all search filters for pending requests
  const clearPendingFilters = () => {
    setSearchPending({
      id: '',
      doctorId: '',
      name: '',
      date: ''
    });
  };

  // Clear all search filters for cancelled requests
  const clearCancelledFilters = () => {
    setSearchCancelled({
      id: '',
      doctorId: '',
      name: '',
      date: ''
    });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Search input component
  const SearchInput = ({ name, value, onChange, placeholder, type = 'text' }) => (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-control form-control-sm"
      style={{
        width: '100%',
        maxWidth: '150px',
        display: 'inline-block',
        marginRight: '10px',
        marginBottom: '5px'
      }}
    />
  );

  // Search section component
  const SearchSection = ({ 
    title, 
    searchState, 
    onSearchChange, 
    onClear, 
    type = 'pending' 
  }) => (
    <div className="mb-3 p-3 bg-light rounded">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">{title}</h5>
        <button 
          onClick={onClear}
          className="btn btn-sm btn-outline-secondary"
        >
          Clear Filters
        </button>
      </div>
      <div className="d-flex flex-wrap align-items-center">
        <div className="me-3 mb-2">
          <small className="text-muted d-block">Schedule ID</small>
          <SearchInput
            name="id"
            value={searchState.id}
            onChange={onSearchChange}
            placeholder="ID..."
          />
        </div>
        <div className="me-3 mb-2">
          <small className="text-muted d-block">Doctor ID</small>
          <SearchInput
            name="doctorId"
            value={searchState.doctorId}
            onChange={onSearchChange}
            placeholder="Doctor ID..."
          />
        </div>
        <div className="me-3 mb-2">
          <small className="text-muted d-block">Doctor Name</small>
          <SearchInput
            name="name"
            value={searchState.name}
            onChange={onSearchChange}
            placeholder="Name..."
          />
        </div>
        <div className="mb-2">
          <small className="text-muted d-block">Date</small>
          <SearchInput
            name="date"
            type="date"
            value={searchState.date}
            onChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Appointment Management</h4>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>
      </div>
      
      <h5 className="mb-3">Pending Requests</h5>
      <table className="table table-bordered table-responsive">
        <thead className="table-dark">
          <tr>
            <th>Schedule Id</th>
            <th>Doctor Id</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Room</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPendingRequests.length > 0 ? (
            currentPendingRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.doctor_id}</td>
                <td>{request.doctor_first_name+ " " + request.doctor_last_name}</td>
                <td>{request.schedule_date}</td>
                <td>{request.schedule_time}</td>
                <td>
                  <select className="form-select" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                    {roomOptions.map((room) => (
                      <option key={room} value={room}>
                        Room {room}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button 
                    className="btn btn-success btn-sm me-2" 
                    onClick={() => handleAcceptClick(request.id)}
                    disabled={acceptLoading[request.id]}
                  >
                    {acceptLoading[request.id] ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    Accept
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRejectClick(request)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No pending requests found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4">
        <Pagination
          itemsPerPage={itemsPerPagePending}
          totalItems={filteredPendingRequests.length}
          currentPage={currentPagePending}
          paginate={paginatePending}
        />
      </div>
      
      <div className="mt-5" id="cancelled-requests">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Cancelled Requests</h5>
          <small className="text-muted">
            Showing {currentCancelledRequests.length} of {filteredCancelledRequests.length} records
          </small>
        </div>
        
        <SearchSection
          title="Search Cancelled Requests"
          searchState={searchCancelled}
          onSearchChange={handleCancelledSearchChange}
          onClear={clearCancelledFilters}
          type="cancelled"
        />
        <table className="table table-bordered table-responsive">
          <thead className="table-dark">
            <tr>
              <th>Schedule Id</th>
              <th>Doctor Id</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {currentCancelledRequests.length > 0 ? (
              currentCancelledRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.doctor_id}</td>
                  <td>{request.doctor_first_name+ " " + request.doctor_last_name}</td>
                  <td>{request.schedule_date}</td>
                  <td>{request.schedule_time}</td>
                  <td>{request.admin_feedback}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No cancelled requests found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-3">
          <Pagination
            itemsPerPage={itemsPerPageCancelled}
            totalItems={filteredCancelledRequests.length}
            currentPage={currentPageCancelled}
            paginate={paginateCancelled}
          />
        </div>
      </div>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Reject Request</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Provide a reason for rejecting the request from <strong>{selectedRequest?.name}</strong>:</p>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleSendReason}
                  disabled={rejectLoading}
                >
                  {rejectLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

// Pagination component
const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPageNumbers = 5; // Maximum page numbers to show at once
  
  // Calculate the range of page numbers to display
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
  
  // Adjust startPage if we're near the end
  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(1, endPage - maxPageNumbers + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <p className="text-muted">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </p>
      </div>
      <nav>
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              onClick={() => paginate(1)} 
              className="page-link"
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              onClick={() => paginate(currentPage - 1)} 
              className="page-link"
              disabled={currentPage === 1}
            >
              &lsaquo;
            </button>
          </li>
          
          {startPage > 1 && (
            <li className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          )}
          
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button 
                onClick={() => paginate(number)} 
                className="page-link"
              >
                {number}
              </button>
            </li>
          ))}
          
          {endPage < totalPages && (
            <li className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          )}
          
          <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
            <button 
              onClick={() => paginate(currentPage + 1)} 
              className="page-link"
              disabled={currentPage === totalPages || totalPages === 0}
            >
              &rsaquo;
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
            <button 
              onClick={() => paginate(totalPages)} 
              className="page-link"
              disabled={currentPage === totalPages || totalPages === 0}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AppointmentManagement;
