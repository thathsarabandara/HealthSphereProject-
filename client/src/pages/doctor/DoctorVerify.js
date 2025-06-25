import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DoctorVerify() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [id, setID] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:5000/doctor/verifyuser', { otp }, { withCredentials: true }); // This is important for sending cookies

            setSuccess(response.data.message);
            setID(response.data.data.id);
            console.log(id);
            setError('');
            setOtp('');
        }catch(err){
            setError(error.response?.data?.error || 'OTP Verification failed');
            setSuccess('');
        }
    };

    useEffect(() => {
        if (id) {
          console.log('User ID:', id); // Now this will log the correct `id`
          navigate(`/doctor/fullregister/${id}`); // Navigate after `id` has been set
        }
      }, [id, navigate]); // The effect will run whenever `id` changes

    const handleResendOTP = async (e) => {
        e.preventDefault(); // Prevent default anchor click behavior
        try {
            const response = await axios.get('http://localhost:5000/doctor/resendotp', { withCredentials: true });

            if (response.status === 200) {
                setSuccess(response.data.message);
                setError('');
                setOtp(''); // Clear the OTP input field if necessary
            }
        } catch (err) {
            setError(err.response?.data?.error || 'OTP resend failed');
            setSuccess('');
            console.error('OTP resend error:', err.response ? err.response.data : err.message);
        }
    };
  return (
        <div className='container' style={{minHeight: '70vh'}}>
        <div className="login-container" style={{background: '#C8D8F6'}}>
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
                    <button type="submit" className="btn btn-block text-white" style={{ background: '#112D4E' }}>
                        Verify OTP
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
  )
}

export default DoctorVerify