import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OTPVerification() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:5000/verifyuser', {
                otp,
            });
            setSuccess(response.data.message);
            setError('');
            setOtp('');

            navigate('/login');
        }catch(err){
            setError(error.response?.data?.error || 'OTP Verification failed');
            setSuccess('');
        }
    };

    return (
        <div className="login-container">
            <h2 className="text-center">Verify OTP</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="otp">Enter the OTP sent to your email/phone</label>
                    <input
                        type="text"
                        className="form-control"
                        id="otp"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                    Verify OTP
                </button>
            </form>

            <div className="text-center mt-3">
                <small>
                    Didn’t receive the OTP? 
                    <a href="/resend-otp"> Resend OTP</a>
                </small>
            </div>

            <div className="footer-link">
                <p>
                    <a href="/login">Back to Login</a>
                </p>
            </div>
        </div>
    );
}

export default OTPVerification;
