import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../../components/common/Loader';

const PasswordReset = () => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

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
                    } else {
                        setError('Invalid or expired token. Please request a new password reset.');
                    }
                } catch (err) {
                    setError('Invalid or expired token. Please request a new password reset.');
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

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Send new password to backend
            const response = await axios.post('http://localhost:5000/resetpassword', { password }, { withCredentials: true });
            if (response.status === 200) {
                setSuccessMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        }
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
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            {isValidToken ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Reset Password</button>
                </form>
            ) : (
                <p>Validating token...</p>
            )}
        </div>
    );
};

export default PasswordReset;
