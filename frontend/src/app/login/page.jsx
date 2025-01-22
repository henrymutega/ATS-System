"use client"
import React from 'react';
import { useState } from 'react';
import axiosInstance from '../../../utilis/axios';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };  
const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/login", formData);

      if (response.status >= 200 && response.status < 300) {
        alert("Login successful!");
        console.log(response.data);
        router.push("/");
        setFormData({ email: "", password: "" });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      alert("Login failed!");
      setLoading(false);
    }
  }

  return (
    <div className="wrapper">
    <h2>Login</h2>
    <form onSubmit={handleSubmit} >
      <div className="input-box">
        <input type="text" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}  required/>
      </div>
      <div className="input-box">
        <input type="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange}  required/>
      </div>
      <div className="input-box button">
      <button type="Submit" disabled={loading}>
        {loading ? "Login..." : "Login Now"}
      </button>
      </div>
      <div className="text">
        <h3>Don't have an account? <a href="/signup">SignUp Now</a></h3>
      </div>
    </form>
  </div>
  )
}

export default Login;