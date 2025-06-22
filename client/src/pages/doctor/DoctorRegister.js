import React, { useState , useEffect } from 'react';
import axios from 'axios';
import signup from '../../assets/images/Rectangle 84.svg';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  // Toast notification configuration
  const notifySuccess = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  if (isLoading) {
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

  const validateUsername = (value) => {
    if (value.length < 6 || value.length > 10) {
      setUsernameError('Username must be between 6 and 10 characters');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})/;
    if (!passwordRegex.test(value)) {
      setPasswordError('Password must contain at least one capital letter, one symbol, and be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateTerms = (value) => {
    if (!value) {
      setTermsError('Please accept the terms of use and privacy policy');
      return false;
    }
    setTermsError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateUsername(username) &&
                    validateEmail(email) &&
                    validatePassword(password) &&
                    validateConfirmPassword(confirmPassword) &&
                    validateTerms(termsAccepted);

    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/doctor/register', {
        email,
        username,
        password,
      }, { withCredentials: true });

      notifySuccess('Signup successful! Please verify your email.');
      // Clear the form
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setTermsAccepted(false);
      navigate('/doctor/verifyuser');
    } catch (err) {
      notifyError(err.response?.data?.message || 'Registration failed. Please try again.');
      setError('');
      setSuccess('');
    }
  };

  return (
    <div className="container p-3 my-5 h-custom">
      <div className="row" style={{ background: '#C8D8F6', borderRadius: 12 }}>
        <div className="col-md-1" />
        <div className="col-md-5 mt-5">
          <img src={signup} className="img-fluid" alt="Sample" />
        </div>

        <div className="col-md-5">
          <div className="d-flex flex-column align-items-center justify-content-center mb-4">
            <p className="lead fw-bold mb-0 me-3 mt-4">Sign Up</p>
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
              Sign up and Work as Consultant at Health Sphere
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <div className="mb-4">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <p style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>{usernameError}</p>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <p style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>{emailError}</p>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <p style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>{passwordError}</p>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <p style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>{confirmPasswordError}</p>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                required
              />
            </div>

            <div className="d-flex justify-content-between mb-4">
              <p style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>{termsError}</p>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    validateTerms(e.target.checked);
                  }}
                  required
                />
                <label className="form-check-label" htmlFor="terms">
                  Agree to Our Terms of use and Privacy Policy
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
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </form>
        </div>
        <div className="col-md-1" />
      </div>
    </div>
  );
}

export default App;
