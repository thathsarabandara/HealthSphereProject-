import React, { useState ,useEffect } from 'react';
import signup from '../../../assets/images/Rectangle 84.svg';
import '../../../styles/temp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../../components/common/Loader';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [policyChecked, setPolicyChecked] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  const usernameRegex = /^.{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleUsernameChange = (e) => {
      const value = e.target.value;
      setUsername(value);
      setErrors((prev) => ({
        ...prev,
        username: usernameRegex.test(value) ? '' : 'Username must be at least 8 characters.'
      }));
  };

   const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: emailRegex.test(value) ? '' : 'Invalid email format.'
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: passwordRegex.test(value)
        ? ''
        : 'Password must be at least 8 characters, with one uppercase letter and one symbol.'
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: value === password ? '' : 'Passwords do not match.'
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      errors.username ||
      errors.email ||
      errors.password ||
      errors.confirmPassword ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        form: 'Please fix the errors in the form before submitting.'
      }));
      return;
    }

    if (!policyChecked) {
      setErrors((prev) => ({
        ...prev,
        policy: 'You must agree to the policy regulations.'
      }));
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
        <div className="col-md-5">
          <img 
            src={signup} className="img-fluid" 
            alt="Sample image"
            style={{ marginTop: '150px' , borderRadius: '15px'}}
          />
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
                marginTop: '0px',
              }}
            >
              Enter a username and email to register as a new patient.
            </p>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="name" className="form-label">
                UserName
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter your full name"
                value={username}
                onChange={handleUsernameChange}
                required
              />
              {errors.username && <div style={{ color: 'red' }}>{errors.username}</div>}
            </div>

            <div className="mb-2">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
            </div>

            <div className="mb-2">
              <label htmlFor="confirm_password" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword}</div>}
            </div>

            <div className="d-flex justify-content-between mb-2">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" checked={policyChecked} onChange={(e) => setPolicyChecked(e.target.checked)}/>
                <label className="form-check-label" htmlFor="rememberMe">
                  Agree to Our Terms of Use and Privacy Policy
                </label>
              </div>
              {errors.policy && <div style={{ color: 'red' }}>{errors.policy}</div>}
            </div>

            <div className="text-center text-md-start mt-2 pt-2">
              <button
                type="submit"
                className="btn mt-1 w-100 mb-2"
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
          <button className="btn btn-outline-primary btn-block social-btn ms-5">
            <i className="fab fa-facebook-f"></i> Register with Facebook
          </button>
          <button className="btn btn-outline-danger btn-block social-btn ms-3">
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

export default Register;

