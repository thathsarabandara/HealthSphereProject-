import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppointmentManagement() {
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/schedules", {
          withCredentials: true,
        });
        console.log(response.data)
        setDoctorRequests(response.data.requests || []);
        setCancelledRequests(response.data.rejectedSchedules || []);
        console.log(cancelledRequests)
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
    
    fetchRequests();
  }, []);

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleAcceptClick = async (requestId) => {
    try {
      await axios.post(`http://localhost:5000/admin/acceptschedule/${requestId}`, {} , {withCredentials: true});
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
  };

  const handleSendReason = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter a reason!");
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
  };

  const roomOptions = ["-", 1, 2, 3, 4, 5, 6, 7, 8];

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
          {doctorRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.doctor_id}</td>
              <td>{request.doctor_first_name+ " " + request.doctor_last_name}</td>
              <td>{request.schedule_date}</td>
              <td>{request.schedule_time}</td>
              <td>
                <select className="form-select">
                  {roomOptions.map((room) => (
                    <option key={room} value={room}>
                      Room {room}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleAcceptClick(request.id)}>
                  Accept
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleRejectClick(request)}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="mt-5 mb-3">Cancelled Requests</h5>
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
          {cancelledRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.doctor_id}</td>
              <td>{request.doctor_first_name+ " " + request.doctor_last_name}</td>
              <td>{request.schedule_date}</td>
              <td>{request.schedule_time}</td>
              <td>{request.admin_feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
                <button type="button" className="btn btn-danger" onClick={handleSendReason}>
                  Send
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

export default AppointmentManagement;
