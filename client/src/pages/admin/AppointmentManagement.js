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

  // For pending requests table
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [itemsPerPagePending] = useState(5);

  // For cancelled requests table
  const [currentPageCancelled, setCurrentPageCancelled] = useState(1);
  const [itemsPerPageCancelled] = useState(5);

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
  const currentPendingRequests = doctorRequests.slice(indexOfFirstPending, indexOfLastPending);

  // Calculate pagination for cancelled requests
  const indexOfLastCancelled = currentPageCancelled * itemsPerPageCancelled;
  const indexOfFirstCancelled = indexOfLastCancelled - itemsPerPageCancelled;
  const currentCancelledRequests = cancelledRequests.slice(indexOfFirstCancelled, indexOfLastCancelled);

  // Change page for pending
  const paginatePending = (pageNumber) => setCurrentPagePending(pageNumber);

  // Change page for cancelled
  const paginateCancelled = (pageNumber) => setCurrentPageCancelled(pageNumber);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h5 className="mb-3">Doctor Requests</h5>
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
      <Pagination
        itemsPerPage={itemsPerPagePending}
        totalItems={doctorRequests.length}
        currentPage={currentPagePending}
        paginate={paginatePending}
      />
      <div className="mt-5" />
      
      <div className="mt-5">
        <h5 className="mb-3">Cancelled Requests</h5>
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
        <Pagination
          itemsPerPage={itemsPerPageCancelled}
          totalItems={cancelledRequests.length}
          currentPage={currentPageCancelled}
          paginate={paginateCancelled}
        />
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
                <div className="mb-3">
                  <label>Select Room:</label>
                  <select 
                    className="form-select"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                  >
                    <option value="">Select a room</option>
                    {roomOptions.map((room) => (
                      <option key={room} value={room}>
                        Room {room}
                      </option>
                    ))}
                  </select>
                </div>
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

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AppointmentManagement;
