import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdEvent, MdPayment, MdPerson, MdInfo } from 'react-icons/md';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    console.log(`Initiating checkout for reservation: ${reservationId}`);
    // Implement actual checkout functionality here.
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

  if (loading) {
    return <div className="text-center mt-5">Loading booking details...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return <div className="text-center mt-5">No bookings found.</div>;
  }

  return (
    <div className="container mt-5">
      {bookings.map((booking) => (
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
                <MdPayment /> <strong>Payment Status:</strong> {booking.reservation_status}
              </p>
              {booking.reservation_status === 'pending' && (
                <div className="d-flex gap-2">
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
      ))}
    </div>
  );
};

export default Bookings;
