"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '../../../utilis/axios';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "", 
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validation
      if (!formData.firstname.trim() || !formData.lastname.trim()) {
        setError("First name and last name are required");
        return;
      }
      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const response = await axiosInstance.post("/signup", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Sign up successful...");
      
      // Clear form data
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      if (error.response) {
        // Server responded with an error
        switch (error.response.status) {
          case 400:
            setError("Please check your input and try again");
            break;
          case 409:
            setError("This email is already registered");
            break;
          case 500:
            setError("Server error. Please try again later");
            break;
          default:
            setError("An error occurred during signup");
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
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        {success && <div className="success-message" style={{color: 'green', marginBottom: '10px'}}>{success}</div>}
        <div className="input-box">
          <input
            type="text"
            name="firstname"
            placeholder="Enter your First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="lastname"
            placeholder="Enter your Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box button">
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Register Now"}
          </button>
        </div>
        <div className="text">
          <h3>Already have an account? <Link href="/login">Login now</Link></h3>
        </div>
      </form>
    </div>
  );
};

export default Signup;