import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdEvent, MdPayment, MdPerson, MdInfo } from 'react-icons/md';
import axios from 'axios'; // Axios for API requests

const Bookings = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/reservations/all', {withCredentials: true}); // Adjust the endpoint to match your API
        const bookingData = response.data.reservations[0]; // Assuming the API returns an array of reservations
        setBooking(bookingData);
      } catch (err) {
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  const handleCheckout = () => {
    // Redirect to checkout page or show checkout modal
    console.log('Redirecting to checkout...');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading booking details...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded">
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
              <MdPayment /> <strong>Payment Status:</strong> {booking.payment_status ? 'Paid' : 'Pending'}
            </p>
            {!booking.payment_status && (
              <button className="btn btn-primary btn-lg mt-3" onClick={handleCheckout}>
                Checkout <MdPayment className="ms-2" />
              </button>
            )}
          </div>

          <hr />

          <div className="doctor-info">
            <h5 className="card-title">
              <MdInfo /> Doctor Details
            </h5>
            <p><strong>Name:</strong> {booking.doctor_details.name}</p>
            <p><strong>Description:</strong> {booking.doctor_details.description}</p>
            <p><strong>Specializations:</strong> {booking.doctor_details.specializations}</p>
            <p><strong>Experience:</strong> {booking.doctor_details.experience}</p>

            <Link to={`/doctor-details/${booking.doctor_details.name}`} className="btn btn-info btn-lg mt-3">
              View Full Doctor Profile <MdInfo className="ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
