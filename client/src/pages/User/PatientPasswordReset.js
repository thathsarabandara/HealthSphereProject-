import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PatientPasswordReset = () => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Extract token from query parameters
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    console.log(token)

    useEffect(() => {
        // Validate the token with the backend
        const validateToken = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/resetpassword/validate?token=${token}`);
                if (response.status === 200) {
                    setIsValidToken(true);
                }
            } catch (err) {
                setError('Invalid or expired token. Please request a new password reset.');
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Send new password to backend
            const response = await axios.post('http://localhost:5000/resetpassword', { password });
            if (response.status === 200) {
                setSuccessMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        }
    };

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

export default PatientPasswordReset;
