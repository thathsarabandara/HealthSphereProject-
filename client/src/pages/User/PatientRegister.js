import React, { useState } from 'react';
import signup from '../../assets/images/Rectangle 84.svg';
import '../../styles/temp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/register',
        { username, email, password },
        { withCredentials: true }
      );

      setSuccess(response.data.message);
      setErrorMessage('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to verifyuser page after successful registration
      navigate('/verifyuser');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="container p-3 my-5 h-custom">
      <div className="row mt-3 mb-3" style={{ background: '#C8D8F6', borderRadius: 12 }}>
        <div className="col-md-1" />
        <div className="col-md-5 mt-5">
          <img src={signup} className="img-fluid" alt="Sample image" />
        </div>

        <div className="col-md-5">
          <div className="d-flex flex-column align-items-center justify-content-center mb-4">
            <p className="lead fw-bold mb-0 me-3 mt-4">Register</p>
            <p
              style={{
                color: '#112D4E',
                fontSize: '12px',
                fontFamily: 'Sansation, sans-serif',
                fontWeight: 700,
                lineHeight: '18px',
                wordWrap: 'break-word',
                marginTop: '10px',
              }}
            >
              Enter a username and email to register as a new patient.
            </p>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter your full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirm_password" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errorMessage && <small className="text-danger">{errorMessage}</small>}
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">
                  Agree to Our Terms of Use and Privacy Policy
                </label>
              </div>
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn mt-1 w-100 mb-4"
                style={{ background: '#112D4E', borderRadius: 10 }}
              >
                <span
                  className="text-white"
                  style={{
                    fontSize: 15,
                    fontFamily: 'Sansation',
                    fontWeight: 400,
                  }}
                >
                  Sign Up
                </span>
              </button>
            </div>
          </form>

          {/* Social Registration Section */}
          <div className="text-center my-3">
            <small>or register with</small>
          </div>
          <button className="btn btn-outline-primary btn-block social-btn">
            <i className="fab fa-facebook-f"></i> Register with Facebook
          </button>
          <button className="btn btn-outline-danger btn-block social-btn">
            <i className="fab fa-google"></i> Register with Google
          </button>

          {/* Footer Links */}
          <div className="footer-link">
            <p>
              <a href="/login">Already have an account? Log in here</a>
            </p>
          </div>
        </div>
        <div className="col-md-1" />
      </div>
    </div>
  );
}

export default App;

