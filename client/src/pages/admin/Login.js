import { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/temp.css';
import signin from '../../assets/images/Rectangle 84 (1).svg'

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic here
    if (email !== "admin@example.com" || password !== "admin123") {
      setError("Invalid email or password");
    } else {
      setError(null);
      // Redirect to admin dashboard
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="row w-100 g-0" style={{ background: '#C8D8F6', borderRadius: 12, maxWidth: '1000px' }}>
        
        <div className="col-lg-6 col-md-6 d-none d-md-block p-4">
          <img
            src={signin}
            className="img-fluid"
            alt="Sample"
            style={{ maxHeight: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 p-4">
          <div className="text-center">
            <p className="lead fw-normal mb-2">Admin Login</p>
            <p>Please enter your email and password to login</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
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

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
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

            <div className="d-flex justify-content-between mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="!#">Forgot password?</a>
            </div>

            <button type="submit" className="btn w-100 text-white" style={{ background: '#112D4E', borderRadius: 10 }}>
              Sign In
            </button>

            
          </form>
        </div>
      </div>
    </div>

  );
};

export default AdminLogin;
