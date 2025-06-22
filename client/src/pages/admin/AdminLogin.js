import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import adminImage from '../../assets/images/emptyProfile.png'

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/login",
        { email, password },
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      setError("");
      setEmail("");
      setPassword("");
      
      // Navigate to dashboard on successful login
      navigate("/admin");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed. Please try again.");
      setSuccess("");
    }
  };

  // Inline styles
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '"Poppins", sans-serif',
    },
    leftPanel: {
      flex: 1,
      backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(3, 169, 244, 0.7)',
    },
    leftContent: {
      zIndex: 1,
      color: 'white',
      textAlign: 'center',
      padding: '0 20px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '600',
      marginBottom: '20px',
    },
    subtitle: {
      fontSize: '1.2rem',
      fontWeight: '300',
      maxWidth: '500px',
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    },
    loginContainer: {
      width: '100%',
      maxWidth: '400px',
    },
    logo: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    name: {
      fontWeight: '500',
      fontSize: '1.8rem',
      color: '#333',
      textAlign: 'center',
      marginBottom: '30px',
    },
    formField: {
      marginBottom: '25px',
    },
    input: {
      width: '100%',
      padding: '15px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      color: '#333',
      outline: 'none',
      transition: 'border-color 0.3s',
    },
    inputFocus: {
      borderColor: '#03A9F4',
    },
    button: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#03A9F4',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#0288d1',
    },
    alert: {
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    alertDanger: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      border: '1px solid #ffcdd2',
    },
    alertSuccess: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      border: '1px solid #c8e6c9',
    },
  };

  return (
    <div style={styles.container}>
      {/* Left Panel with Image */}
      <div style={styles.leftPanel}>
        <div style={styles.overlay}></div>
        <div style={styles.leftContent}>
          <h1 style={styles.title}>HealthSphere Admin Portal</h1>
          <p style={styles.subtitle}>Secure access to your healthcare management system</p>
        </div>
      </div>
      
      {/* Right Panel with Login Form */}
      <div style={styles.rightPanel}>
        <div style={styles.loginContainer}>
          <div style={styles.logo}>
            <img
              src={adminImage}
              alt="Administrator"
              style={{ width: '80px', height: '80px' }}
            />
          </div>
          <div style={styles.name}>Admin Login</div>

          {error && (
            <div style={{ ...styles.alert, ...styles.alertDanger }}>{error}</div>
          )}
          {success && (
            <div style={{ ...styles.alert, ...styles.alertSuccess }}>{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formField}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = '#03A9F4')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>
            <div style={styles.formField}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = '#03A9F4')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>
            <button
              style={styles.button}
              type="submit"
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#0288d1')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#03A9F4')}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
