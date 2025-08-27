import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Default revenue data (will be replaced with actual data from backend)
const defaultRevenueData = [
  { month: "Jan", revenue: 500 },
  { month: "Feb", revenue: 400 },
  { month: "Mar", revenue: 600 },
  { month: "Apr", revenue: 650 },
  { month: "May", revenue: 700 },
  { month: "Jun", revenue: 800 },
];

function BillingAndFinancialManagement() {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refundRequests, setRefundRequests] = useState([]);
  const [revenueData, setRevenueData] = useState(defaultRevenueData);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch refund requests and revenue data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch refund requests
        const refundsResponse = await axios.get("http://localhost:5000/api/admins/refunds", {
          withCredentials: true
        });
        
        if (refundsResponse.data.success) {
          setRefundRequests(refundsResponse.data.data);
        }

        // TODO: Uncomment and implement when revenue endpoint is available
        // const revenueResponse = await axios.get("http://localhost:5000/api/admins/revenue");
        // if (revenueResponse.data.success) {
        //   setRevenueData(revenueResponse.data.data);
        // }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Update time every second
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleApproveRefund = async (requestId) => {
    try {
      setIsProcessing(true);
      const response = await axios.put(
        `http://localhost:5000/api/admins/refunds/${requestId}/approve`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Refund approved successfully!");
        // Update local state to remove the approved request
        setRefundRequests(prev => prev.filter(req => req.id !== requestId));
      }
    } catch (error) {
      console.error("Error approving refund:", error);
      toast.error(error.response?.data?.message || "Failed to approve refund");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleSendReason = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Please enter a reason for rejection");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await axios.put(
        `http://localhost:5000/api/admins/refunds/${selectedRequest.id}/reject`,
        { reason: rejectReason },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Refund request rejected successfully!");
        // Update local state to remove the rejected request
        setRefundRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
        setShowModal(false);
        setRejectReason("");
      }
    } catch (error) {
      console.error("Error rejecting refund:", error);
      toast.error(error.response?.data?.message || "Failed to reject refund");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-fluid p-3" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h4 className="text-primary fw-bold">Billing & Financial Management</h4>
        <p className="bg-light p-2 rounded border text-center">{dateTime}</p>
      </div>

      {/* Revenue Chart */}
      <div className="row mb-4">
        <div className="col-12 col-md-8 mx-auto">
          <div className="border p-3 bg-white shadow rounded">
            <h5 className="text-center text-secondary">Revenue Overview</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#007bff" strokeWidth={2} />
                <ReferenceLine y={700} label="Target" stroke="red" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Refund Requests Table */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-secondary mb-0">Refund Requests</h5>
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={() => window.location.reload()}
              disabled={isLoading || isProcessing}
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading refund requests...</p>
            </div>
          ) : refundRequests.length === 0 ? (
            <div className="alert alert-info">No pending refund requests found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered text-center shadow">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Receipt No</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {refundRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.patientId || 'N/A'}</td>
                      <td>{req.name || 'N/A'}</td>
                      <td>{req.receipt || 'N/A'}</td>
                      <td>Rs. {req.amount || '0.00'}</td>
                      <td>{req.date || 'N/A'}</td>
                      <td>{req.time || 'N/A'}</td>
                      <td>
                        <button 
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleApproveRefund(req.id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : 'Approve'}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleRejectClick(req)}
                          disabled={isProcessing}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
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
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleSendReason}
                  disabled={!rejectReason.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : 'Send'}
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

export default BillingAndFinancialManagement;
