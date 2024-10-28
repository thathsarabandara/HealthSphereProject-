import React, { useState } from 'react';
import axios from 'axios';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [banner , setBanner] = useState('');
    
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
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
            // Reset the form
            setEmail('');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header text-center">
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
                                    <small className="form-text text-muted">We'll send you an email to reset your password.</small>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <a href="#" id="backToLogin">Back to Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
