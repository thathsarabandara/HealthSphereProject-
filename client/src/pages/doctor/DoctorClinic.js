import React, { useState, useEffect } from 'react';
import Loader from '../../components/common/Loader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DoctorClinic() {
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isLoadingPast, setIsLoadingPast] = useState(true);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [pastSchedules, setPastSchedules] = useState([]);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('upcoming'); // For tab control
  const [currentPage, setCurrentPage] = useState(1);
  const [schedulesPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctor/clinic', { withCredentials: true });
        if (Array.isArray(response.data)) {
          setUpcomingSchedules(response.data);
        } else {
          setError('Unexpected data format received');
        }
      } catch (error) {
        setError('Error fetching upcoming schedules. Please try again.');
        console.error('Error fetching upcoming schedules:', error);
      } finally {
        setIsLoadingUpcoming(false);
      }
    };

    const fetchPastSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctor/pastclinic', { withCredentials: true });
        if (Array.isArray(response.data)) {
          setPastSchedules(response.data);
        } else {
          setError('Unexpected data format received');
        }
      } catch (error) {
        setError('Error fetching past schedules. Please try again.');
        console.error('Error fetching past schedules:', error);
      } finally {
        setIsLoadingPast(false);
      }
    };

    fetchUpcomingSchedules();
    fetchPastSchedules();
  }, []);

  const handlePatientProfile = (patientId) => {
    navigate(`/doctor/patientprofile/${patientId}`);
  };

  const handlePrescription = (patient_id, reservation_id) => {
    navigate(`/doctor/clinic/${reservation_id}/prescription/${patient_id}`);
  };

  const handelviewPrescription = (patient_id, reservation_id) => {
    navigate(`/doctor/clinic/${reservation_id}/viewprescription/${patient_id}`);
  };

  if (isLoadingUpcoming || isLoadingPast) {
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
  }

  const renderScheduleTable = (schedules) => {
    const indexOfLastSchedule = currentPage * schedulesPerPage;
    const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
    const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

    return (
      currentSchedules.length > 0 ? (
        currentSchedules.map((schedule, index) => (
          <div key={index} className="table-responsive mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-bordered">
              <thead className="text-white" style={{ backgroundColor: '#012A5C' }}>
                <tr>
                  <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle' }}>Clinic Details</th>
                  <th style={{ width: '75%', textAlign: 'center', verticalAlign: 'middle' }}>Patient Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={schedule.patients?.length + 1 || 1}>
                    <div><strong>Schedule Date:</strong> {schedule.schedule_date}</div>
                    <div><strong>Schedule Time:</strong> {schedule.schedule_time}</div>
                    <div><strong>Platform:</strong> Physical / Online</div>
                    <div><strong>No of Appointments:</strong> {schedule.number_of_reservations}</div>
                  </td>
                  <td>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Appointment No</th>
                          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Patient Name</th>
                          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Profile</th>
                          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            {selectedTab === 'upcoming' ? 'Add Prescription' : 'View Prescription'}
                          </th>
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
                              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                {selectedTab === 'upcoming' ? (
                                  <button
                                    className="btn btn-sm"
                                    style={{ background: '#C8D8F6' }}
                                    onClick={() => handlePrescription(patient.patient_id, patient.id)}
                                  >
                                    Add
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-sm"
                                    style={{ background: '#C8D8F6' }}
                                    onClick={() => handelviewPrescription(patient.patient_id, patient.id)}
                                  >
                                    View
                                  </button>
                                )}
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
      )
    );
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5" style={{ minHeight: '70vh' }}>
      <h3 className="mt-5">Doctor Clinic Schedules</h3>

      <div className="mt-3">
        <label htmlFor="scheduleTab" className="mr-3">Select Schedule Type:</label>
        <select
          id="scheduleTab"
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
          className="form-control w-auto"
        >
          <option value="upcoming">Upcoming Clinics</option>
          <option value="past">Past Clinics</option>
        </select>
      </div>

      {selectedTab === 'upcoming' ? (
        <div>
          <h4 className="mt-5">Upcoming Clinics</h4>
          {renderScheduleTable(upcomingSchedules)}
          <div className="pagination">
            {[...Array(Math.ceil(upcomingSchedules.length / schedulesPerPage))].map((e, i) => (
              <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h4 className="mt-5">Past Clinics</h4>
          {renderScheduleTable(pastSchedules)}
          <div className="pagination">
            {[...Array(Math.ceil(pastSchedules.length / schedulesPerPage))].map((e, i) => (
              <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorClinic;
