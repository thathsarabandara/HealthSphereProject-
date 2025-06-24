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
    try {
      const response = await axios.post(`http://localhost:5000/reservation/${scheduleid}`, formData, {withCredentials: true});
      if (response.status === 200 || response.status === 201) {
        toast.success('Reservation submitted successfully!');
        setFormData({ name: '', address: '', phone_number: '', email: '' });
        navigate('/'); // Navigate back to the home page after successful submission
      } else {
        toast.error('Failed to submit the reservation. Please try again.');
      }
    } catch (error) {
      const status = error.response?.status || 500;
      toast.error(`An error occurred: ${error.message}`);
      if (status === 401) {
        navigate('/login');
      } else {
        navigate(`/error/${status}`);
      }
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
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Background color for the header */}
      <div className="container-fluid" style={{ padding: 0, margin: 0 }}>
        <div style={{ width: '100%', height: '100px', background: '#756A6A' }} />
      </div>

      {/* Form container */}
      <div
        className="container mt-5 mb-5"
        style={{
          marginTop: '-50px',
          padding: '20px',
          background: '#F4F4F4',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="row">
          <h4>
            <input type="checkbox" style={{ marginRight: '10px' }} />
            Reservations Details
          </h4>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit}>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-9">
              <div style={{ marginBottom: '15px' }}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#ECECEC',
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#ECECEC',
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Enter your phone number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#ECECEC',
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#ECECEC',
                  }}
                />
              </div>
            </div>

            {/* Button column */}
            <div className="col-3" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="submit"
                className="btn"
                style={{
                  width: '100%',
                  background: '#007802',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '10px',
                }}
              >
                Book
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reservations;
