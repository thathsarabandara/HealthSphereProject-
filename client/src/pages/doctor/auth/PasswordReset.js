import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../../components/common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasswordReset = () => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    // Extract token from query parameters
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    useEffect(() => {
        // Simulate loading timeout
        const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);

        // Validate token once loading is complete
        if (!isLoading && token) {
            const validateToken = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/resetpassword/validate?token=${token}`);
                    if (response.status === 200) {
                        setIsValidToken(true);
                        toast.success('Token is valid. You can reset your password.');
                    } else {
                        setError('Invalid or expired token. Please request a new password reset.');
                        toast.error('Token is invalid or expired.');
                    }
                } catch (err) {
                    setError('Invalid or expired token. Please request a new password reset.');
                    toast.error('Token is invalid or expired.');
                }
            };
            validateToken();
        } else if (!token) {
            setError('Token is missing from the URL. Please request a new password reset.');
        }

        return () => clearTimeout(loadingTimeout);
    }, [isLoading, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            // Send new password to backend
            const response = await axios.post('http://localhost:5000/resetpassword', { password }, { withCredentials: true });
            if (response.status === 200) {
                setSuccessMessage('Password reset successfully! Redirecting to login...');
                toast.success('Password reset successful!');
                setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
            toast.error('Password reset failed.');
        }
        setLoading(false);
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
    }

    return (
        <div className="container mt-5" style={{ minHeight: '70vh' }}>
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Reset Password</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    {isValidToken ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn w-100 text-white" 
                                style={{ background: '#112D4E' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Resetting...
                                    </>
                                ) : 'Reset Password'}
                            </button>
                        </form>
                    ) : (
                        <p>Validating token...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
