import React, { useState , useEffect } from 'react';
import axios from 'axios';
import signup from '../../assets/images/Rectangle 84.svg';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';

function App() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/doctor/register', {
        email,
        username,
        password,
      }, { withCredentials: true });

      setSuccess('Signup successful!');
      setError('');
      // Clear the form (optional)
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      navigate('/doctor/verifyuser');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
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
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username"
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
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
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
            </div>
          </form>
        </div>
        <div className="col-md-1" />
      </div>
    </div>
  );
}

export default App;
