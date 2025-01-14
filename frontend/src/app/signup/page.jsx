"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '../../../utilis/axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "", 
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) =>{
    e.preventDefault();

    if (!formData.email.includes("@")){
      alert("Please enter a valid email.");
      return;
    }
    if (formData.password.length < 6){
      alert("Password must be at least 6 characters");
      return;
    } 

    if (formData.password !== formData.confirmPassword){
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try{
      const response = await axiosInstance.post("/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.status >= 200 && response.status < 300){
        alert("Sign-up successful!");
        router.push("/login");
        console.log(response.data);
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      }
    }catch(error) {
      if(error.response){
        alert("Sign-up failed: " + (error.response.data?.message || "Unknown error occurred"));
        console.error("Error response:", error.response);
      }else if(error.request){
        alert("No response from the server. Please try again.");
        console.error("Error request:", error.request);
    }else {
      alert("An error occurred. Please try again.");
      console.error("Error message:", error.message);
    }
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="wrapper">
    <h2>Registration</h2>
    <form onSubmit={handleSubmit} >
      <div className="input-box">
        <input type="text" name="username" placeholder="Enter your name" value={formData.username} onChange={handleChange} required/>
      </div>
      <div className="input-box">
        <input type="text" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}  required/>
      </div>
      <div className="input-box">
        <input type="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange}  required/>
      </div>
      <div className="input-box">
        <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange}  required/>
      </div>
      <div className="policy">
        <input type="checkbox" required/>
        <h3>I accept all terms & condition</h3>
      </div>
      <div className="input-box button">
      <button type="Submit" disabled={loading}>
        {loading ? "Registering..." : "Register Now"}
      </button>
      </div>
      <div className="text">
        <h3>Already have an account <a href="/login">Login now</a></h3>
      </div>
    </form>
  </div>
  )
}

export default Signup;