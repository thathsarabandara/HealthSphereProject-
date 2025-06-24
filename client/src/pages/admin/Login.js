import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signin from '../../assets/images/patient/login.webp';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/login",
        { email, password },
        { withCredentials: true }
      );
      toast.success(response.data.message,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      setEmail("");
      setPassword("");
      
      // Navigate to dashboard on successful login
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  return (
    <div className="container p-3 my-5 h-custom" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="row mt-3 mb-3" style={{background: '#C8D8F6', borderRadius: 12, overflow: 'hidden', width: '100%', maxWidth: '1000px', height: '600px' }}>
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

        <div className="col-md-6 mx-auto px-5 d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex flex-row align-items-center justify-content-center mt-4">
            <p className="lead fw-normal mb-0 me-3">Admin Sign in </p>
          </div>
          <p className='mt-3'>Please enter your email and password to login</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control w-100"
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
              <a href="/admin/resetpasswordRequest">Forgot password?</a>
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                  Sign In
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
