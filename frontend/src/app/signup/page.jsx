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

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      setError("First name and last name are required");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/signup", {
        firstname: formData.firstname, 
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      });

      console.log("Signup response:", response.data);

      if (response.data.status === "success") {
        alert("Sign-up successful!");
        router.push("/login");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "User already exists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <div className="input-box">
          <input
            type="text"
            name=" firstname"
            placeholder="Enter your Fist Name"
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