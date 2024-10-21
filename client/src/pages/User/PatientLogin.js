import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/temp.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password }, { withCredentials: true });

            setSuccess(response.data.message);
            setError('');
            setEmail('');
            setPassword('');

            // Navigate to the desired route after successful login
            navigate('/'); // Change this to your desired route
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="login-container">
            <h2 className="text-center">Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                {/* Email Input Field */}
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-block">
                    Log In
                </button>
            </form>

            {/* Social Login Section */}
            <div className="text-center my-3">
                <small>or login with</small>
            </div>
            <button className="btn btn-outline-primary btn-block social-btn">
                <i className="fab fa-facebook-f"></i> Login with Facebook
            </button>
            <button className="btn btn-outline-danger btn-block social-btn">
                <i className="fab fa-google"></i> Login with Google
            </button>

            {/* Footer Links */}
            <div className="footer-link">
                <p>
                    <a href="/forgot-password">Forgot password?</a>
                </p>
                <p>
                    <a href="/register">Don't have an account? Register here</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
