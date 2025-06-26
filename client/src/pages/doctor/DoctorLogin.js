import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/temp.css';
import signin from '../../assets/images/patient/login.webp'
import Loader from '../../components/common/Loader';

function Login() {
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(true);
const [loading, setLoading] = useState(false);

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

const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const response = await axios.post('http://localhost:5000/doctor/login', { email, password }, { withCredentials: true });

          setSuccess(response.data.message);
          setError('');
          setEmail('');
          setPassword('');
          // Navigate to the desired route after successful login
          navigate('/doctor/'); // Change this to your desired route
      } catch (err) {
          setError(err.response?.data?.error || 'Login failed. Please try again.');
          setSuccess('');
      }
      setLoading(false);
};
return (
  <div className="container p-3 my-5 h-custom">
    <div className="row mt-3 mb-3" style={{background: '#C8D8F6', borderRadius: 12, overflow: 'hidden'}}>
      <div className="col-md-6 p-0">
        <img
          src={signin}
          className="img-fluid"
          alt="Sample image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px 0 0 12px'
          }}
        />
      </div>

      <div className="col-md-6 mx-auto px-5">
        <div className="d-flex flex-row align-items-center justify-content-center mt-4">
          <p className="lead fw-normal mb-0 me-3">Sign in </p>
      </div>
      <p className='mt-3'>Please enter your email and password to login</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
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

          <div className="d-flex justify-content-between mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="/doctor/resetpasswordRequest">Forgot password?</a>
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <button 
              type="submit" 
              className="btn w-100 text-white" 
              style={{ background: '#112D4E' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : 'Login'}
            </button>
          </div>
        </form>
        <div className="text-center my-3">
            <small>or Login with</small>
          </div>
          <button className="btn btn-outline-secondary w-100" style={{ border: '1px solid #ddd', background: 'white', color: '#333' }}>
            <i className="fab fa-google me-2"></i> Continue with Google
          </button>

          {/* Footer Links */}
          <div className="footer-link">
            <p>
              <a href="/doctor/register">Don't have an account? Register here</a>
            </p>
          </div>
      </div>
    </div>
  </div>
);
}

export default Login;