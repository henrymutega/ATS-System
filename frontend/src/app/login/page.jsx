"use client"
import React from 'react';
import { useState } from 'react';
import axiosInstance from '../../../utilis/axios';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/login", formData);

      if (response.data && response.data.token) {
        setSuccess("Login successful!");
        // Store the token
        localStorage.setItem("token", response.data.token);
        
        // Clear form
        setFormData({ email: "", password: "" });
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        switch (error.response.status) {
          case 400:
            setError("Please check your input and try again");
            break;
          case 401:
            setError("Invalid email or password");
            break;
          case 500:
            setError("Server error. Please try again later");
            break;
          default:
            setError("An error occurred during login");
        }
      } else if (error.request) {
        // Request was made but no response
        setError("No response from server. Please check your internet connection");
      } else {
        // Error setting up the request
        setError("Failed to make request. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        {success && <div className="success-message" style={{color: 'green', marginBottom: '10px'}}>{success}</div>}
        <div className="input-box">
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="input-box">
          <input 
            type="password" 
            name="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="input-box button">
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login Now"}
          </button>
        </div>
        <div className="text">
          <h3>Don't have an account? <a href="/signup">SignUp Now</a></h3>
        </div>
      </form>
    </div>
  );
};

export default Login;