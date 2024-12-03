import React, { useState, useEffect } from 'react';
import { Link, NavigationType, useNavigate } from 'react-router-dom';
import { MdEvent, MdPayment, MdPerson, MdInfo } from 'react-icons/md';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentid, setPaymentid] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('pending'); // Default filter: 'pending'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/reservations/all', { withCredentials: true });
        console.log('API Response:', response.data); // Debug API response
        setBookings(response.data.reservations || []);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };   

    fetchBookingData();
  }, []);

  const handleCheckout = async (reservationId) => {
    const response = await axios.get(`http://localhost:5000/bookings/${reservationId}/payment`, { withCredentials: true });
    console.log(response.data.paymentId)
    navigate(`/checkouts/${response.data.paymentId}`);
  };

  const handleCancel = async (reservationId) => {
    try {
      const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
      if (!confirmCancel) return;

      const response = await axios.get(`http://localhost:5000/cancelreservation/${reservationId}`, { withCredentials: true });
      console.log('Cancel Response:', response.data);

      // Update the bookings list after successful cancellation
      setBookings(bookings.filter((booking) => booking.reservation_id !== reservationId));
      alert('Booking canceled successfully.');
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert('Failed to cancel the booking. Please try again.');
    }
  };

  const filteredBookings = bookings.filter((booking) => booking.reservation_status === selectedStatus);

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
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5 d-flex">
      {/* Sidebar or Navigation for Filtering */}
      <div className="list-group me-3" style={{ width: '200px' }}>
        <button
          className={`list-group-item list-group-item-action ${selectedStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('pending')}
        >
          Pending
        </button>
        <button
          className={`list-group-item list-group-item-action ${selectedStatus === 'available' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('available')}
        >
          Available
        </button>
        <button
          className={`list-group-item list-group-item-action ${selectedStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('completed')}
        >
          Completed
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1">
        {filteredBookings.length === 0 ? (
          <div className="text-center mt-5">No bookings found for {selectedStatus} status.</div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.reservation_id} className="card shadow-lg border-0 rounded mb-4">
              <div className="card-header bg-primary text-white text-center">
                <h3>Your Booking Details</h3>
              </div>
              <div className="card-body">
                <div className="booking-info">
                  <h5 className="card-title">
                    <MdPerson /> Appointment with {booking.doctor_details.name}
                  </h5>
                  <p>
                    <MdEvent /> <strong>Schedule Date:</strong> {booking.schedule_date}
                  </p>
                  <p>
                    <MdEvent /> <strong>Schedule Time:</strong> {booking.schedule_time}
                  </p>
                  <p>
                    <MdEvent /> <strong>Amount:</strong> {booking.amount}
                  </p>
                  <p>
                    <MdPayment /> <strong>Payment Status:</strong> {booking.reservation_status}
                  </p>
                  {booking.reservation_status === 'pending' && (
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <button
                        className="btn btn-success btn-lg mt-3"
                        onClick={() => handleCheckout(booking.reservation_id)}
                      >
                        Checkout <MdPayment className="ms-2" />
                      </button>
                      <button
                        className="btn btn-danger btn-lg mt-3"
                        onClick={() => handleCancel(booking.reservation_id)}
                      >
                        Cancel <MdPayment className="ms-2" />
                      </button>
                    </div>
                  )}
                </div>
                <hr />
                <div className="doctor-info">
                  <h5 className="card-title">
                    <MdInfo /> Doctor Details
                  </h5>
                  <p>
                    <strong>Name:</strong> {booking.doctor_details.name}
                  </p>
                  <p>
                    <strong>Description:</strong> {booking.doctor_details.description}
                  </p>
                  <p>
                    <strong>Specializations:</strong> {booking.doctor_details.specialization}
                  </p>
                  <Link
                    to={`/profileDoctor/${booking.doctor_details.id}`}
                    className="btn btn-info btn-lg mt-3"
                  >
                    View Full Doctor Profile <MdInfo className="ms-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;
