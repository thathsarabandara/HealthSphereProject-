import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if reCAPTCHA is verified
        if (!recaptchaValue) {
            alert('Please complete the CAPTCHA.');
            return;
        }

        // Here, you would typically send the email and recaptchaValue to your server
        console.log(`Reset link sent to: ${email}`);
        console.log(`reCAPTCHA Value: ${recaptchaValue}`);

        alert('A reset link has been sent to your email address.');
        // Reset the form
        setEmail('');
        setCaptcha('');
        setRecaptchaValue(null);
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
                                <ReCAPTCHA
                                    sitekey="6LfqpWwqAAAAAIZ_g-Wv85lVrgMAC5kwRm4PRhDY"  // Replace with your actual Site Key
                                    onChange={(value) => setRecaptchaValue(value)}
                                />
                                <button type="submit" className="btn btn-primary btn-block">Send Reset Link</button>
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
