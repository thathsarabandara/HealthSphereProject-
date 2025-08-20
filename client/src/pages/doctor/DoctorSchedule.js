import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ScheduleRequest() {
  const [schedules, setSchedules] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [comment, setComment] = useState('');
  const [fees, setFees] = useState('');
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [schedulesPerPage] = useState(5);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctor/schedule', { withCredentials: true });
        if (Array.isArray(response.data)) {
          setSchedules(response.data);
          toast.success('Schedule data loaded successfully');
        } else {
          setError('Unexpected data format received');
        }
      } catch (error) {
        setError('Error fetching schedules. Please try again.');
        console.error('Error fetching schedules:', error);
        toast.error('Failed to load schedule data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      fetchSchedules();
    }
  }, [isLoading]);

  const handlePatientProfile = (patientId) => {
    navigate(`/doctor/patientprofile/${patientId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    if (!date || !time || !fees || !seats) {
      setError('Please fill in all required fields.');
      setSaveLoading(false);
      return;
    }

    if (seats < 1 || seats > 50) {
      setError('Number of seats must be between 1 and 50');
      setSaveLoading(false);
      return;
    }

    // Check if the selected date is in the past (excluding today)
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const selectedDate = new Date(date);
    
    if (selectedDate < todayStart) {
      setError('Please select today or a future date');
      setSaveLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/doctor/schedule', 
        { date, time, comment, fees, seats }, 
        { withCredentials: true }
      );
      toast.success('Schedule requested successfully!');
      setDate('');
      setTime('');
      setComment('');
      setFees('');
      setSeats(1);
      window.location.reload();
    } catch (error) {
      setError('Error sending schedule request. Please try again.');
      console.error('Error sending schedule request:', error);
      toast.error('Failed to send schedule request');
    } finally {
      setSaveLoading(false);
    }
  };

  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f4f8',
          zIndex: 9999,
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ minHeight: '70vh' }}>
      <ToastContainer />
      <h3 className="mb-4">Request for Schedule</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <div className="input-group">
              <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
              <span className="input-group-text">
                <FaCalendarAlt />
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">Time</label>
            <div className="input-group">
              <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} />
              <span className="input-group-text">
                <FaClock />
              </span>
            </div>
          </div>
          <div className="col-md-2">
            <label className="form-label">Fees (LKR)</label>
            <input type="number" className="form-control" value={fees} onChange={(e) => setFees(e.target.value)} min="0" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Available Seats</label>
            <input 
              type="number" 
              className="form-control" 
              value={seats} 
              onChange={(e) => setSeats(parseInt(e.target.value) || 1)} 
              min="1" 
              max="50" 
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comments here"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-success"
          disabled={saveLoading}
        >
          {saveLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : 'Request'}
        </button>
      </form>

      <h3 className="mt-5">Upcoming Schedules</h3>

      {currentSchedules.length > 0 ? (
        currentSchedules.map((schedule, index) => (
          <div key={index} className="table-responsive mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-bordered">
              <thead className="text-white" style={{ backgroundColor: '#012A5C' }}>
                <tr>
                  <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle' }}>Schedule Details</th>
                  <th style={{ width: '75%', textAlign: 'center', verticalAlign: 'middle' }}>Reservation Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={schedule.patients?.length + 1 || 1}>
                    <div>
                      <strong>Schedule Date:</strong> {schedule.schedule_date}
                    </div>
                    <div>
                      <strong>Schedule Time:</strong> {schedule.schedule_time}
                    </div>
                    <div>
                      <strong>Platform:</strong> Physical / Online
                    </div>
                    <div>
                      <strong>No of Appointments:</strong> {schedule.number_of_reservations}
                    </div>
                    <button className="btn btn-danger btn-sm mt-2">Cancel schedule</button>
                  </td>
                  <td>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Appointment No</th>
                          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Patient Name</th>
                          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Profile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.patients?.length > 0 ? (
                          schedule.patients.map((patient, patientIndex) => (
                            <tr key={patientIndex}>
                              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{patient.id}</td>
                              <td>{patient.first_name + ' ' + patient.last_name}</td>
                              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                <button
                                  className="btn btn-sm"
                                  style={{ background: '#C8D8F6' }}
                                  onClick={() => handlePatientProfile(patient.patient_id)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No appointments available for this schedule</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No schedules available</p>
      )}
      <div className="pagination">
        {[...Array(Math.ceil(schedules.length / schedulesPerPage))].map((e, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ScheduleRequest;
