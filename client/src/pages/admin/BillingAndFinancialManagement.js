import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const refundRequests = [
  { id: "D001", name: "Nathasha", receipt: "RC001", amount: "Rs. 2000.00", date: "2024/10/04", time: "11:00 P.M." },
  { id: "D002", name: "Alex", receipt: "RC002", amount: "Rs. 1500.00", date: "2024/10/05", time: "02:30 P.M." },
  { id: "D003", name: "Sophia", receipt: "RC003", amount: "Rs. 2500.00", date: "2024/10/06", time: "09:15 A.M." },
  { id: "D004", name: "John", receipt: "RC004", amount: "Rs. 1800.00", date: "2024/10/07", time: "05:45 P.M." },
];

const revenueData = [
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

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleSendReason = () => {
    if (!rejectReason.trim()) {
      alert("Please enter a reason!");
      return;
    }
    alert(`Rejection reason sent for ${selectedRequest.name}: ${rejectReason}`);
    setShowModal(false);
    setRejectReason("");
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
          <h5 className="text-secondary">Refund Requests</h5>
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
                {refundRequests.map((req, index) => (
                  <tr key={index}>
                    <td>{req.id}</td>
                    <td>{req.name}</td>
                    <td>{req.receipt}</td>
                    <td>{req.amount}</td>
                    <td>{req.date}</td>
                    <td>{req.time}</td>
                    <td>
                      <button className="btn btn-success me-2">Accept</button>
                      <button className="btn btn-danger" onClick={() => handleRejectClick(req)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleSendReason}>Send</button>
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
