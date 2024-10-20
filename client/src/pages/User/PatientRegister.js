import React, { useState } from 'react';
import '../../styles/temp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PatientRegister() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validate if password and confirm password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                email,
                password,
            });
            setSuccess(response.data.message);
            setError('');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Redirect to verifyuser page after successful registration
            navigate('/verifyuser');

        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
            setSuccess('');
        }
    };

    return (
        <div className="login-container">
            <h2 className="text-center">Register</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}> {/* Add onSubmit handler */}
                
                {/* Username Input Field */}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                {/* Email Input Field */}
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Corrected to setEmail
                        required
                    />
                </div>

                {/* Password Input Field */}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Confirm Password Input Field */}
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirm-password"
                        placeholder="Confirm Password"
                        value={confirmPassword} // Bind value to confirmPassword state
                        onChange={(e) => setConfirmPassword(e.target.value)} // Handle confirm password input
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-block">
                    Register
                </button>
            </form>

            {/* Social Registration Section */}
            <div className="text-center my-3">
                <small>or register with</small>
            </div>
            <button className="btn btn-outline-primary btn-block social-btn">
                <i className="fab fa-facebook-f"></i> Register with Facebook
            </button>
            <button className="btn btn-outline-danger btn-block social-btn">
                <i className="fab fa-google"></i> Register with Google
            </button>

            {/* Footer Links */}
            <div className="footer-link">
                <p>
                    <a href="/login">Already have an account? Log in here</a>
                </p>
            </div>
        </div>
    );
}

export default PatientRegister;
