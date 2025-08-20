import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../../components/common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
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
        setLoading(true);
        setMessage('');

        try {
            // Send email to the server
            const response = await axios.post('http://localhost:5000/resetpasswordRequest', {
                email,
            }, { withCredentials: true });
            
            setMessage(response.data.message);
            toast.success('Password reset successful!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
            toast.error('Password reset failed.');
        } finally {
            setLoading(false);
            // Reset the form
            setEmail('');
        }
    };

    return (
        <div className="container mt-5 mb-5" style={{ minHeight: '70vh' }}>
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow" style={{background: '#C8D8F6'}}>
                        <div className=" text-center mt-4">
                        
                            <h4>Reset Your Password</h4>
                        </div>
                        <div className="card-body">
                            <p className="text-muted">Enter your email address to receive a password reset link.</p>
                            {message && <div className="alert alert-info">{message}</div>}
                            <form id="resetPasswordForm" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <small className="form-text text-muted mt-4">We'll send you an email to reset your password.</small>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <button 
                                      type="submit" 
                                      className="btn btn-primary" 
                                      disabled={loading}
                                    >
                                      {loading ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                          Resetting...
                                        </>
                                      ) : 'Reset Password'}
                                    </button>
                                </div>
                                
                            </form>
                            <div className="text-center mt-3">
                                <a href="/login" id="backToLogin">Back to Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
