import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/common/Loader';
import ErrorPopup from '../../components/common/error popup/ErrorPopup';
import SuccessPopup from '../../components/common/success popup/SuccessPopup';

function DoctorsProfile() {
  const { id } = useParams(); // Get doctor ID from params
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const handleErrorClose = () => setErrorVisible(false);
  const handleSuccessClose = () => setSuccessVisible(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/doctorprofile/${id}`, { withCredentials: true });
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddReview = async () => {
    if (!newReview.rating || !newReview.comment) {
      setReviewError('Please provide both a rating and a comment.');
      return;
    }
    try {
      setReviewError(null);
      const response = await axios.post(
        `http://localhost:5000/doctorprofile/${id}/addreview`,
        newReview,
        { withCredentials: true }
      );
      setSuccessVisible(true)
      setNewReview({ rating: 0, comment: '' }); // Reset the form
      setData((prevData) => ({
        ...prevData,
        reviews: [...prevData.reviews, response.data], // Update reviews dynamically
      }));
    } catch (err) {
      setErrorVisible(true)
    }
  };

  if (loading) {
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
  if (error) return <p>{error}</p>;

  const { profile, schedule, reviews } = data || {};

  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth); // Convert to Date object
    const today = new Date(); // Current date
  
    // Calculate differences
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
  
    // Adjust if days are negative
    if (days < 0) {
      months--; // Borrow a month
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
      days += previousMonth.getDate();
    }
  
    // Adjust if months are negative
    if (months < 0) {
      years--; // Borrow a year
      months += 12;
    }
  
    return { years, months, days };
  }
  
  const age = calculateAge(profile.dateOfBirth);

  return (
    <div className='container mt-5 mb-5'>
      <ErrorPopup show={errorVisible} onClose={handleErrorClose} title="Something Went Wrong!" message="Failed to add review. Please try again later." button='Okay' />
      <SuccessPopup show={successVisible} onClose={handleSuccessClose} title="Updated Success Fully " message="Review added successfully!" button='Okay' />
      <div className="row">
      {/* Profile Section */}
      <div className="col-lg-3 col-md-12 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body text-center">
            <img
              src={`http://localhost:5000/uploads/storage/doctor/${profile?.userid}/profiledocuments/${profile?.profilePicture}` || '/default-profile.png'}
              alt="profile"
              className="rounded-circle mb-3"
              style={{ width: '150px', height: '150px' }}
            />
            <h5 className="mb-1">{profile?.id} - {profile?.firstName} {profile?.lastName}</h5>
            <small className="text-muted">
              {profile?.gender} - Age {age.years} Years 
            </small>
            <div style={{ textAlign: 'left', marginTop: '1rem' }}>
              <p><strong>Email:</strong> {profile?.contact}</p>
              <p><strong>Bio:</strong> {profile?.bio}</p>
              <p><strong>Experience:</strong> {profile?.experience} Years</p>
              <p><strong>Specialization:</strong> {profile?.specialization}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="col-lg-9 col-md-12 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Schedule</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Booking</th>
                </tr>
              </thead>
              <tbody>
                {schedule?.map((slot, index) => (
                  <tr key={index}>
                    <td>{slot.date}</td>
                    <td>{slot.time}</td>
                    <td>${slot.amount}</td>
                    <td><a href={slot.bookingLink} className="btn btn-primary btn-sm">Book Now</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="col-lg-6 col-md-12 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Reviews</h5>
            {reviews?.map((review, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex align-items-center">
                  <img
                    src={`http://localhost:5000/uploads/storage/patient/${review?.userid}/profilepictures/${review?.patientProfilePicture}` || '/default-profile.png'}
                    alt="patient"
                    className="rounded-circle"
                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                  />
                  <div>
                    <h6 className="mb-0">{review.patientName}</h6>
                    <small className="text-muted">{review.date}</small>
                  </div>
                </div>
                <p className="mt-2 mb-1">{Array(review.rating).fill('⭐').join(' ')}</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Review Section */}
      <div className="col-lg-6 col-md-12 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Add a Review</h5>
            {reviewError && <p className="text-danger">{reviewError}</p>}
            {reviewSuccess && <p className="text-success">{reviewSuccess}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddReview();
              }}
            >
              <div className="mb-3">
                <label htmlFor="rating" className="form-label">Rating</label>
                <select
                  id="rating"
                  className="form-control"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                >
                  <option value={0}>Select Rating</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">Comment</label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows="3"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default DoctorsProfile;
