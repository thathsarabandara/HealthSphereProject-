import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdEvent, MdPayment, MdPerson, MdInfo } from 'react-icons/md';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/reservations/all', { withCredentials: true });
        console.log('API Response:', response.data); // Debug API response
        setBookings(response.data.reservations || []); // Adjust based on response structure
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading booking details...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (!Array.isArray(bookings)) {
    return <div className="text-center mt-5">Invalid booking data format.</div>;
  }

  if (bookings.length === 0) {
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
                <button
                  className="btn btn-primary btn-lg mt-3"
                  onClick={() => console.log(`Checkout for ${booking.reservation_id}`)}
                >
                  Checkout <MdPayment className="ms-2" />
                </button>
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
                <strong>Specializations:</strong> {booking.doctor_details.specializations}
              </p>
              <Link
                to={`/doctor-details/${booking.doctor_details.name}`}
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
