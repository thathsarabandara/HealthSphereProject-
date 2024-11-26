import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdEvent, MdPayment, MdPerson, MdInfo } from 'react-icons/md';
// import '../../styles/user/Bookings.css'; // Import the custom CSS for styling

const Bookings = () => {
  // Sample booking data (you can fetch from an API or pass as props)
  const [booking, setBooking] = useState({
    doctorName: 'Dr. John Doe',
    appointmentDate: '2024-11-30 10:00 AM',
    paymentStatus: false, // false means not paid, true means paid
    doctorDetails: {
      bio: 'Dr. John Doe is a specialist in cardiology with over 10 years of experience.',
      qualifications: 'MD, FACC',
      experience: '10 years',
    },
  });

  useEffect(() => {
    // Fetch booking data if needed
  }, []);

  const handleCheckout = () => {
    // Redirect to checkout page or show checkout modal
    console.log('Redirecting to checkout...');
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded">
        <div className="card-header bg-primary text-white text-center">
          <h3>Your Booking Details</h3>
        </div>
        <div className="card-body">
          <div className="booking-info">
            <h5 className="card-title">
              <MdPerson /> Appointment with {booking.doctorName}
            </h5>
            <p>
              <MdEvent /> <strong>Appointment Date:</strong> {booking.appointmentDate}
            </p>
            <p>
              <MdPayment /> <strong>Payment Status:</strong> {booking.paymentStatus ? 'Paid' : 'Pending'}
            </p>
            {!booking.paymentStatus && (
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
            <p><strong>Name:</strong> {booking.doctorName}</p>
            <p><strong>Bio:</strong> {booking.doctorDetails.bio}</p>
            <p><strong>Qualifications:</strong> {booking.doctorDetails.qualifications}</p>
            <p><strong>Experience:</strong> {booking.doctorDetails.experience}</p>

            <Link to={`/doctor-details/${booking.doctorName}`} className="btn btn-info btn-lg mt-3">
              View Full Doctor Profile <MdInfo className="ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
