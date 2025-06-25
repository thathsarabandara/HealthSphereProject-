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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendWelcomeEmail = async (toEmail) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '👋 Welcome to HealthSphere – HealthSphere Hospitals 🏥 | @2024 – DEV Squad ⚡️ [Do Not Reply]',
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
              <h2>Welcome to HealthSphere!</h2>
              <p>Hello,</p>
              <p>We’re thrilled to welcome you to HealthSphere! To help you get started, here’s a quick overview:</p>
              <ul style="padding-left: 20px; text-align: left;">
                <li>📄 <a href="#" style="color: #007BFF;">Setting Up Your Profile</a></li>
                <li>📅 <a href="#" style="color: #007BFF;">Managing Appointments and Schedules</a></li>
                <li>💬 <a href="#" style="color: #007BFF;">Connecting with Patients</a></li>
              </ul>
              <p>Make sure to complete your profile and explore the resources available to you. If you have questions, don’t hesitate to reach out to us.</p>
              <p style="font-weight: bold;">Welcome aboard!</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, feel free to contact our support team.</p>
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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendPasswordResetEmail = async (toEmail, resetLink) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '🔒 Password Reset Request – HealthSphere Hospitals 🏥 | @2024 – DEV Squad ⚡️ [Do Not Reply]',
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
              <h2>Password Reset Requested</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #007BFF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px;">Reset Password</a>
              </p>
              <p>For security, the link will expire in 1 hour.</p>
              <p>If you didn’t request this, you can safely ignore this email or contact support.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 12px; text-align: center; color: #888;">If you did not request this, please contact our support team immediately.</p>
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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };
  
  exports.sendSecurityAlertEmail = async (toEmail, alertDetails) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '⚠️ Security Alert – HealthSphere Hospitals 🏥 | @2024 – DEV Squad ⚡️ [Do Not Reply]',
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
              <h2>Security Alert</h2>
              <p>Hello,</p>
              <p>We noticed some unusual activity on your account:</p>
              <p><strong>Details:</strong> ${alertDetails}</p>
              <p>If this was not you, please log in and update your password or contact support for assistance.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, feel free to contact our support team.</p>
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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendAccountApprovalEmail = async (toEmail) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '🎉 Account Approved – HealthSphere Hospitals 🏥 | @2024 – DEV Squad ⚡️ [Do Not Reply]',
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
              <h2>Account Approved!</h2>
              <p>Hello,</p>
              <p>Your HealthSphere account has been approved by the admin. You’re now all set to start managing your schedule and connecting with patients.</p>
              <p><a href="#" style="color: #007BFF;">Log In</a> to explore the features we offer!</p>
              <p>Thanks for joining us.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, feel free to contact our support team.</p>
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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendRejectionEmail = async (toEmail) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '❌ Application Update – HealthSphere Hospitals 🏥 | @2024 – DEV Squad ⚡️ [Do Not Reply]',
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
              <h2>Application Update</h2>
              <p>Hello,</p>
              <p>We regret to inform you that your application to join HealthSphere has not been approved at this time.</p>
              <p>Our team reviewed your application carefully, but we've decided to move forward with other candidates.</p>
              <p>We appreciate your interest in HealthSphere and encourage you to apply again in the future.</p>
              <p>Thank you for your understanding.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, feel free to contact our support team.</p>
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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendLoginAttemptEmail = async (toEmail, deviceInfo) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '⚠️ New Login Attempt – HealthSphere Hospitals 🏥 | @2024 – DEV Squad ⚡️ [Do Not Reply]',
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
              <h2>New Login Attempt Detected</h2>
              <p>Hello,</p>
              <p>We detected a new login attempt to your HealthSphere account:</p>
              <p><strong>Device:</strong> ${deviceInfo}</p>
              <p>If this was you, you can ignore this email.</p>
              <p>If you don't recognize this activity, please secure your account immediately.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #007BFF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px;">Secure Account</a>
              </p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 12px; text-align: center; color: #888;">If you did not request this, please contact our support team immediately.</p>
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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendApplicationSubmissionEmail = async (toEmail) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '📝 Application Submitted - HealthSphere',
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
            <img src="https://drive.google.com/uc?export=view&id=1BrkMgx7nzjZST11AnyVrs2QbQyR8npoc" alt="Application Submitted" style="margin: 10px; height: 300px; width: 580px;"/>
            <div style="text-align: center; padding: 20px;">
                  <h2>Application Submitted</h2>
                  <p>Hello,</p>
                  <p>Thank you for completing your HealthSphere doctor application!</p>
                  <p>Your application is now under review by our team. We will carefully evaluate your qualifications and experience.</p>
                  <p>You'll receive another email once your application has been approved.</p>
                  <p>We appreciate your patience during this process.</p>
              </div>
              <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                  <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, please contact our support team.</p>
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

    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendScheduleSubmissionEmail = async (toEmail) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '📅 Schedule Submitted - HealthSphere',
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
            <img src="https://drive.google.com/uc?export=view&id=1BrkMgx7nzjZST11AnyVrs2QbQyR8npoc" alt="Schedule Submitted" style="margin: 10px; height: 300px; width: 580px;"/>
            <div style="text-align: center; padding: 20px;">
                  <h2>Schedule Submitted</h2>
                  <p>Hello,</p>
                  <p>Your schedule request has been successfully submitted to HealthSphere!</p>
                  <p>Our team will review your schedule and notify you once it's approved.</p>
                  <p>You can view your schedule status in your doctor dashboard at any time.</p>
                  <p>Thank you for using HealthSphere.</p>
              </div>
              <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                  <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, please contact our support team.</p>
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

    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendScheduleApprovalEmail = async (toEmail, scheduleDetails) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '✅ Schedule Approved - HealthSphere',
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
            <img src="https://drive.google.com/uc?export=view&id=1BrkMgx7nzjZST11AnyVrs2QbQyR8npoc" alt="Schedule Approved" style="margin: 10px; height: 300px; width: 580px;"/>
            <div style="text-align: center; padding: 20px;">
              <h2>Schedule Approved!</h2>
              <p>Hello,</p>
              <p>Your schedule request has been approved by HealthSphere!</p>
              <p><strong>Schedule ID:</strong> ${scheduleDetails.id}</p>
              <p><strong>Date:</strong> ${scheduleDetails.date}</p>
              <p><strong>Time:</strong> ${scheduleDetails.time}</p>
              <p><strong>Room Number:</strong> ${scheduleDetails.room || 'TBD'}</p>
              <p>You can now accept appointments for this time slot.</p>
              <p>Thank you for using HealthSphere.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, please contact our support team.</p>
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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  exports.sendScheduleRejectionEmail = async (toEmail, scheduleDetails, rejectReason) => {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: toEmail,
      subject: '❌ Schedule Rejected - HealthSphere',
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
            <img src="https://drive.google.com/uc?export=view&id=1BrkMgx7nzjZST11AnyVrs2QbQyR8npoc" alt="Schedule Rejected" style="margin: 10px; height: 300px; width: 580px;"/>
            <div style="text-align: center; padding: 20px;">
              <h2>Schedule Rejected</h2>
              <p>Hello,</p>
              <p>We regret to inform you that your schedule request has been rejected.</p>
              <p><strong>Schedule ID:</strong> ${scheduleDetails.id}</p>
              <p><strong>Date:</strong> ${scheduleDetails.date}</p>
              <p><strong>Time:</strong> ${scheduleDetails.time}</p>
              <p><strong>Reason:</strong> ${rejectReason}</p>
              <p>Please review your schedule and submit a new request if needed.</p>
              <p>Thank you for your understanding.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 12px; text-align: center; color: #888;">If you have any questions, please contact our support team.</p>
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
    try {
      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email sending timed out')), 30000)
        )
      ]);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };