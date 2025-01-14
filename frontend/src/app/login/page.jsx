"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '../../../utilis/axios';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Only clear messages, not form data
  useEffect(() => {
    return () => {
      setError('');
      setSuccess('');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Only clear messages when typing, keep the form data
    setError(''); 
    setSuccess('');
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axiosInstance.post("/login", formData);
      
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccess('Login successful! Redirecting...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/");
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        setError('Invalid response from server');
      }
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (error.response) {
        const errorMessage = error.response.data || 'An error occurred';
        setError(errorMessage);
      } else if (error.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError('Failed to make request. Please try again.');
      }
      // Don't clear form data on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-box" style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: '4px',
            color: '#c62828',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div className="success-box" style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#e8f5e9',
            border: '1px solid #c8e6c9',
            borderRadius: '4px',
            color: '#2e7d32',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}>
            {success}
          </div>
        )}
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
          <button 
            type="submit" 
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? "Logging in..." : "Login Now"}
          </button>
        </div>
        <div className="text">
          <h3>Don't have an account? <Link href="/signup">SignUp Now</Link></h3>
        </div>
      </form>
    </div>
  )
}

export default Login;