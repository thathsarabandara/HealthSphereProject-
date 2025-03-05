import React, { useState } from "react";
import "../../styles/admin/AdminLogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="wrapper">
      <div className="logo">
        <img
          width="48"
          height="48"
          src="https://img.icons8.com/fluency/48/administrator-male.png"
          alt="Administrator"
        />
      </div>
      <div className="text-center mt-5 name">Healthsphere Admins</div>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {success && <div className="alert alert-success text-center">{success}</div>}

      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="text"
            id="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="password"
            name="password"
            id="pwd"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn mt-3" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
