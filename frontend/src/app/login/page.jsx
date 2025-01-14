"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '../../../utilis/axios';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.post("/login", formData);
      const { success, token, message } = response.data;

      if (success) {
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        setError(message || 'Invalid email or password');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
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
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange}  
            required
          />
        </div>
        <div className="input-box button">
          <button type="submit" disabled={loading}>
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