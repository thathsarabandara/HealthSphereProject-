import React from 'react';


function Dashboard() {
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h4>Hello Doctor 👋,</h4>
          <p>Welcome to the Dashboard</p>
        </div>
      </div>

      {/* Date and Time */}
      <div className="row mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 bg-light text-center rounded">
            <strong>Date:</strong>
            <h5>2024/10/04</h5>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-light text-center rounded">
            <strong>Time:</strong>
            <h5>12:00 P.M.</h5>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-6 col-md-3 mb-3">
          <div className="p-3 bg-secondary text-white text-center rounded">
            <p>Appointments</p>
            <h3>62</h3>
            <small>Today</small>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="p-3 bg-secondary text-white text-center rounded">
            <p>Consultations</p>
            <h3>22</h3>
            <small>Today</small>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="p-3 bg-secondary text-white text-center rounded">
            <p>Cancelled</p>
            <h3>03</h3>
            <small>Today</small>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="p-3 bg-secondary text-white text-center rounded">
            <p>Income</p>
            <h3>$210</h3>
            <small>Today</small>
          </div>
        </div>
      </div>

      {/* Upcoming Schedules */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="p-4 bg-light text-center rounded">
            <h5>Upcoming Schedules</h5>
          </div>
        </div>
      </div>

      {/* Total Patients Analysis and Today's Patients Details */}
      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <div className="p-4 bg-light text-center rounded">
            <h5>Total Patients Analysis</h5>
          </div>
        </div>
        <div className="col-12 col-md-6 mb-4">
          <div className="p-4 bg-light text-center rounded">
            <h5>Today Patients Details</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
