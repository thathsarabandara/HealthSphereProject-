import React, { useState, useEffect, useRef } from 'react';
import { Link, NavigationType, useNavigate } from 'react-router-dom';
import { MdEvent, MdPayment, MdPerson, MdInfo, MdDownload } from 'react-icons/md';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import BookingReceipt from '../../../components/BookingReceipt';
import axios from 'axios';
import Loader from '../../../components/common/Loader';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentid, setPaymentid] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('pending'); // Default filter: 'pending'
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const receiptRefs = useRef({});
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

  const handleDownloadReceipt = async (booking) => {
    try {
      setIsGeneratingPDF(true);
      const ref = receiptRefs.current[booking.reservation_id];
      
      if (!ref || !ref.current) {
        console.error('Receipt element not found');
        alert('Failed to generate receipt. Please try again.');
        return;
      }

      // Add a small delay to ensure the component is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create a new canvas and set its dimensions
      const canvas = await html2canvas(ref.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: true, // Enable logging to debug
        backgroundColor: '#ffffff',
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit the PDF
      const imgWidth = 190; // A4 width in mm (210 - 10mm margin on each side)
      const pageHeight = 277; // A4 height in mm (297 - 10mm margin on each side)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10; // Start 10mm from top
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`HealthSphere_Receipt_${booking.reservation_id}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      alert(`Failed to generate receipt: ${error.message}. Please try again.`);
    } finally {
      setIsGeneratingPDF(false);
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
    <div className="container mt-5 d-flex" style={{ minHeight: '70vh' }}>
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
          filteredBookings.map((booking) => {
            // Create a ref for each receipt
            if (!receiptRefs.current[booking.reservation_id]) {
              receiptRefs.current[booking.reservation_id] = React.createRef();
            }
            
            return (
              <div key={booking.reservation_id} className="card shadow-lg border-0 rounded mb-4">
                <div className="card-header bg-primary text-white text-center">
                  <h3>Your Booking Details</h3>
                </div>
                <div className="card-body">
                  <div className="booking-info">
                    <h5 className="card-title">
                      <MdPerson /> Appointment with {booking.doctor_details?.name}
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
                      <strong>Name:</strong> {booking.doctor_details?.name}
                    </p>
                    <p>
                      <strong>Description:</strong> {booking.doctor_details?.description}
                    </p>
                    <p>
                      <strong>Specializations:</strong> {booking.doctor_details?.specialization}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <Link
                        to={`/profileDoctor/${booking.doctor_details?.id}`}
                        className="btn btn-info btn-lg mt-3"
                      >
                        View Full Doctor Profile <MdInfo className="ms-2" />
                      </Link>
                      
                      {/* Download Receipt Button */}
                      <button
                        className="btn btn-primary btn-lg mt-3"
                        onClick={() => handleDownloadReceipt(booking)}
                        disabled={isGeneratingPDF}
                      >
                        {isGeneratingPDF ? 'Generating...' : 'Download Receipt'} <MdDownload className="ms-2" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Hidden Receipt for PDF Generation */}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                  <div ref={receiptRefs.current[booking.reservation_id]}>
                    <BookingReceipt booking={booking} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Bookings;
