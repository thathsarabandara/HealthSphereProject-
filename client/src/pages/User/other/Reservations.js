import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../components/common/Loader';

function Reservations() {
  const navigate = useNavigate();
  const { scheduleid } = useParams('id');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch default data from the backend
  useEffect(() => {
    const fetchDefaultData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reservation', { withCredentials: true });
        if (response.status === 200) {
          setFormData(response.data.data);
          toast.success('Reservation data loaded successfully!');
        } else {
          toast.error('Failed to fetch reservation data');
          if (response.status === 401) {
            navigate('/login');
          } else {
            navigate(`/error/${response.status}`);
          }
        }
      } catch (error) {
        const status = error.response?.status || 500;
        toast.error(`An error occurred: ${error.message}`);
        if (status === 401) {
          navigate('/login');
        } else {
          navigate(`/error/${status}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Include the schedule_id from the route parameters
      const dataToSend = {
        ...formData,
        schedule_id: scheduleid
      };
      const response = await axios.post(`http://localhost:5000/reservation/${scheduleid}`, dataToSend, {
        withCredentials: true,
      });
      toast.success('Reservation submitted successfully!');
        setFormData({
          name: '',
          address: '',
          phone_number: '',
          email: '',
        });
        navigate('/bookings');
    } catch (err) {
      toast.error('Failed to submit reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

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
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="container mt-4" style={{ minHeight: '70vh' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Your Reservations</h2>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Back to Doctors
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Enter your phone number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : 'Submit Reservation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservations;
