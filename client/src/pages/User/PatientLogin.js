import React from 'react';
import '../../styles/temp.css';

function Login() {
    return (
        <div className="login-container">
            <h2 className="text-center">Login</h2>
            <form>
                {/* Email Input Field */}
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
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
