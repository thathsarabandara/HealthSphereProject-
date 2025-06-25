const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

const transporter = nodemailer.createTransport(emailConfig)

exports.sendOTPEmail = async (toEmail, otp) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '🔒 Verify Your Account with OTP – HealthSphere Hospitals 🏥',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f2f2f2;">
            <!-- Header -->
            <div style="text-align: center; padding: 20px; background-color: #007BFF; color: white; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                <h1 style="margin: 0;">HealthSphere</h1>
                <p style="margin: 5px 0;">Your Trusted Healthcare Service</p>
                <img src="https://drive.google.com/uc?export=view&id=1n-3QGEs8Vvgcln1Oo_dDPOhylkSx2v5B" alt="HealthSphere Logo" style="margin: 10px 0; height: 50px; width: 150px;"/>
            </div>
            
            <!-- Email Body -->
            <div style="background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <img src="https://drive.google.com/uc?export=view&id=1BrkMgx7nzjZST11AnyVrs2QbQyR8npoc" alt="HealthSphere Logo" style="margin: 10px; height: 300px; width: 580px;"/>
              <div style="text-align: center; padding: 20px;">
                    <h2>Your OTP Code</h2>
                    <p>Hello,</p>
                    <p>Your one-time password (OTP) is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #FF4500;">${otp}</p>
                    <p>This code will expire in 10 minutes.</p>
                    <p>Thank you for using our service!</p>
                    <img src="https://drive.google.com/uc?export=view&id=1WPwLg2QwLQXeT_vv_udV4XYtBOXXjz2L" alt="Health Matters" style="margin: 20px 0; border-radius: 5px; height: 220px; width: 400px;"/>
                </div>
                <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                    <p style="font-size: 12px; text-align: center; color: #888;">If you did not request this OTP, please contact our support team immediately.</p>
                    <p style="font-size: 12px; text-align: center; color: #888;">Developed by Dev Squad <sup>TM</sup></p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; background-color: #007BFF; color: white; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; margin-top: 20px;">
                <p style="margin: 0;">&copy; 2024 HealthSphere. All rights reserved.</p>
                <p style="margin: 5px 0;">Follow us on:</p>
                <a href="https://facebook.com" style="color: white; text-decoration: none; margin: 0 10px;">Facebook</a> |
                <a href="https://twitter.com" style="color: white; text-decoration: none; margin: 0 10px;">Twitter</a> |
                <a href="https://instagram.com" style="color: white; text-decoration: none; margin: 0 10px;">Instagram</a>
            </div>
          </div>`
    };
    await transporter.sendMail(mailOptions);
  };

  exports.sendWelcomeEmail = async (toEmail) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '👋 Welcome to HealthSphere – A New Journey Begins! 🏥',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background-color: #f9f9f9; padding: 20px;">
          <!-- Header -->
          <div style="background-color: #007BFF; color: white; padding: 20px; text-align: center;">
              <h1>Welcome to HealthSphere!</h1>
              <p>Your Healthcare Journey Begins Here</p>
          </div>
          <!-- Email Body -->
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <p>Hi there,</p>
              <p>We’re thrilled to welcome you to HealthSphere! To help you get started, here’s a quick overview:</p>
              <ul style="padding-left: 20px;">
                  <li>📄 <a href="#">Setting Up Your Profile</a></li>
                  <li>📅 <a href="#">Managing Appointments and Schedules</a></li>
                  <li>💬 <a href="#">Connecting with Patients</a></li>
              </ul>
              <p>Make sure to complete your profile and explore the resources available to you. If you have questions, don’t hesitate to reach out to us.</p>
              <p style="font-weight: bold;">Welcome aboard!</p>
          </div>
          <!-- Footer -->
          <div style="background-color: #007BFF; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
              &copy; 2024 HealthSphere | Follow us: 
              <a href="#" style="color: white; text-decoration: none; margin: 0 5px;">Facebook</a> | 
              <a href="#" style="color: white; text-decoration: none; margin: 0 5px;">Twitter</a> | 
              <a href="#" style="color: white; text-decoration: none; margin: 0 5px;">Instagram</a>
          </div>
        </div>`
    };
    await transporter.sendMail(mailOptions);
  };
  
  exports.sendPasswordResetEmail = async (toEmail, resetLink) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '🔒 Password Reset Request – HealthSphere Hospitals',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background-color: #f9f9f9; padding: 20px;">
          <!-- Header -->
          <div style="background-color: #FF6F61; color: white; padding: 20px; text-align: center;">
              <h1>Password Reset Requested</h1>
              <p>Stay Secure with HealthSphere</p>
          </div>
          <!-- Email Body -->
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <p style="text-align: center;">
                  <a href="${resetLink}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </p>
              <p>For security, the link will expire in 1 hour.</p>
              <p>If you didn’t request this, you can safely ignore this email or contact support.</p>
          </div>
          <!-- Footer -->
          <div style="background-color: #FF6F61; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
              &copy; 2024 HealthSphere. All rights reserved.
          </div>
        </div>`
    };
    await transporter.sendMail(mailOptions);
  };
  
  exports.sendSecurityAlertEmail = async (toEmail, alertDetails) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '⚠️ Security Alert – HealthSphere Account Activity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background-color: #f9f9f9; padding: 20px;">
          <!-- Header -->
          <div style="background-color: #ff5722; color: white; padding: 20px; text-align: center;">
              <h1>Security Alert</h1>
              <p>Suspicious Activity Detected on Your Account</p>
          </div>
          <!-- Email Body -->
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <p>Hello,</p>
              <p>We noticed some unusual activity on your account:</p>
              <p><strong>Details:</strong> ${alertDetails}</p>
              <p>If this was not you, please log in and update your password or <a href="#">contact support</a> for assistance.</p>
          </div>
          <!-- Footer -->
          <div style="background-color: #ff5722; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
              &copy; 2024 HealthSphere. All rights reserved.
          </div>
        </div>`
    };
    await transporter.sendMail(mailOptions);
  };
  
  exports.sendAccountApprovalEmail = async (toEmail) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '🎉 Your HealthSphere Account is Now Active!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background-color: #f9f9f9; padding: 20px;">
          <!-- Header -->
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
              <h1>Account Approved!</h1>
              <p>Welcome to HealthSphere</p>
          </div>
          <!-- Email Body -->
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <p>Hello,</p>
              <p>Your HealthSphere account has been approved by the admin. You’re now all set to start managing your schedule and connecting with patients.</p>
              <p><a href="#">Log In</a> to explore the features we offer!</p>
              <p>Thanks for joining us.</p>
          </div>
          <!-- Footer -->
          <div style="background-color: #28a745; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
              &copy; 2024 HealthSphere. All rights reserved.
          </div>
        </div>`
    };
    await transporter.sendMail(mailOptions);
  };

  exports.sendRejectionEmail = async (toEmail) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '❌ Application Update - HealthSphere Hospitals',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background-color: #f9f9f9; padding: 20px;">
          <!-- Header -->
          <div style="background-color: #FF6F61; color: white; padding: 20px; text-align: center;">
              <h1>Application Update</h1>
              <p>HealthSphere Hospitals</p>
          </div>
          <!-- Email Body -->
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <p>Hello,</p>
              <p>We regret to inform you that your application to join HealthSphere has not been approved at this time.</p>
              <p>Our team reviewed your application carefully, but we've decided to move forward with other candidates.</p>
              <p>We appreciate your interest in HealthSphere and encourage you to apply again in the future.</p>
              <p>Thank you for your understanding.</p>
          </div>
          <!-- Footer -->
          <div style="background-color: #FF6F61; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
              &copy; 2024 HealthSphere. All rights reserved.
          </div>
        </div>`
    };
    await transporter.sendMail(mailOptions);
  };