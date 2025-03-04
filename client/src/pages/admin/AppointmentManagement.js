import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function AppointmentManagement() {
  const [doctorRequests, setDoctorRequests] = useState([
    { id: "DOO1", name: "J.W.N.F. Silva", date: "2024/10/04", time: "11:00 P.M." },
    { id: "DOO1", name: "J.W.N.F. Silva", date: "2024/10/04", time: "11:00 P.M." },
    { id: "DOO1", name: "J.W.N.F. Silva", date: "2024/10/04", time: "11:00 P.M." },
    { id: "DOO1", name: "J.W.N.F. Silva", date: "2024/10/04", time: "11:00 P.M." },
  ]);

  const [cancelledRequests, setCancelledRequests] = useState([
    { id: "DOO1", name: "J.W.N.F. Silva", date: "2024/10/04", time: "11:00 P.M." },
    { id: "DOO1", name: "J.W.N.F. Silva", date: "2024/10/04", time: "11:00 P.M." },
    { id: "DOO1", name: "J.W.N.F. Silva", date: "2024/10/04", time: "11:00 P.M." },
    { id: "DOO1", name: "J.W.N.F. Silva", date: "2024/10/04", time: "11:00 P.M." },
  ]);

  const roomOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className="container mt-4">
      <h5 className="mb-3">Doctor Requests</h5>
      <table className="table table-bordered table-responsive" >
        <thead className="table-dark">
          <tr>
            <th>Doctor Id</th>
            <th>First Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Room</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctorRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.id}</td>
              <td>{request.name}</td>
              <td>{request.date}</td>
              <td>{request.time}</td>
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
                <button className="btn btn-success btn-sm me-2">Accept</button>
                <button className="btn btn-danger btn-sm">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="mt-5 mb-3">Cancelled Requests</h5>
      <table className="table table-bordered table-responsive">
        <thead className="table-dark">
          <tr>
            <th>Doctor Id</th>
            <th>First Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Room</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {cancelledRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.id}</td>
              <td>{request.name}</td>
              <td>{request.date}</td>
              <td>{request.time}</td>
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter reason"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentManagement
