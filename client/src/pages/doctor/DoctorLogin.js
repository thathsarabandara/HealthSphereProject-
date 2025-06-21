import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/temp.css';
import { Link } from 'react-router-dom';
import signin from '../../assets/images/Rectangle 84 (1).svg'
import Loader from '../../components/common/Loader';

function Login() {
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
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

const handleSubmit = async (e) => {
      e.preventDefault();
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
};
return (
  <div className="container p-3 my-5 h-custom">
    <div className="row g-0" style={{background: '#C8D8F6', borderRadius: 12}}>
      <div className='col-md-1'/>
      <div className="col-md-5 no-gap" >
        <img
          src={signin}
          className="img-fluid mt-5"
          alt="Sample image"
        />
      </div>

      <div className="col-md-5 no-gap ">
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
            <a href="!#">Forgot password?</a>
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }} type='submit'>
              <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                Sign In
              </span>
            </button>

            {/* Social Login Section */}
            <div className="text-center my-3">
                <small>or login with</small>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
              <a href="http://localhost:5000/auth/google?group=doctor" target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none' }}>
                <button type="button" style={{ background: '#4285F4', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 20px', fontWeight: 'bold', width: 250 }}>Login with Google</button>
              </a>
            </div>
            
            <p className="small fw-bold mt-2 pt-1 mb-2 mb-4">
              Don't have an account? <Link to="/signup" className="link-danger">Register</Link>
            </p>
          </div>
        </form>
      </div>
      <div className='col-md-1'/>
    </div>
  </div>
);
}

export default Login;