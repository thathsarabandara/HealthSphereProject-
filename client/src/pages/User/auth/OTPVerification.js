import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../../../components/common/error popup/ErrorPopup';
import SuccessPopup from '../../../components/common/success popup/SuccessPopup';

function OTPVerification() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [verifyerrorVisible, setverifyErrorVisible] = useState(false);
    const [verifysuccessVisible, setverifySuccessVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleverifyErrorClose = () => setverifyErrorVisible(false);
    const handleverifySuccessClose = () => setverifySuccessVisible(false);  
    const handleErrorClose = () => setErrorVisible(false);
    const handleSuccessClose = () => setSuccessVisible(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await axios.post('http://localhost:5000/verifyuser', { otp }, { withCredentials: true }); 
            setSuccess(response.data.message);
            setError('');
            setOtp('');
            setverifySuccessVisible(true);
            navigate('/login');
        }catch(err){
            setError(err.response?.data?.error || 'OTP Verification failed');
            setSuccess('');
            setverifyErrorVisible(true)
        }finally{
            setLoading(false);
        }
    };
    const handleResendOTP = async (e) => {
        e.preventDefault(); // Prevent default anchor click behavior
        try {
            const response = await axios.get('http://localhost:5000/resendotp', { withCredentials: true });

            if (response.status === 200) {
                setSuccess(response.data.message);
                setError('');
                setOtp(''); // Clear the OTP input field if necessary
                setSuccessVisible(true)
            }
        } catch (err) {
            setError(err.response?.data?.error || 'OTP resend failed');
            setSuccess('');
            setErrorVisible(true);
            console.error('OTP resend error:', err.response ? err.response.data : err.message);
        }
    };
    
    return (
        <div style={{minHeight: '70vh', }}>
            <div className="login-container" style={{background: '#C8D8F6', }}>
            <ErrorPopup show={verifyerrorVisible} onClose={handleverifyErrorClose} title="Something Went Wrong!" message="OTP Verification Failed!" button='Okay' />
            <SuccessPopup show={verifysuccessVisible} onClose={handleverifySuccessClose} title="Verified Succesfully " message="OTP Verification Successfully Done!" button='Okay' />
            <ErrorPopup show={errorVisible} onClose={handleErrorClose} title="Something Went Wrong!" message="OTP Resend failed Try again!" button='Okay' />
            <SuccessPopup show={successVisible} onClose={handleSuccessClose} title="OTP Re-Sent Successfully " message="OTP Sent Successfully !" button='Okay' />
            <h2 className="text-center">Verify OTP</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="otp">Enter the OTP sent to your email/phone</label>
                    <input
                        type="text"
                        className="form-control mt-2 mb-4"
                        id="otp"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
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
                                Verifying...
                            </>
                        ) : 'Verify OTP'}
                    </button>
                </div>
            </form>

            <div className="text-center mt-3">
                <small>
                    Didn’t receive the OTP? 
                    <button class="resend-otp-button" onClick={handleResendOTP}>
                        Resend OTP
                    </button>
                </small>
            </div>

            <div className="footer-link">
                <p>
                    <a href="/login">Back to Login</a>
                </p>
            </div>
        </div>
        </div>
    );
}

export default OTPVerification;
