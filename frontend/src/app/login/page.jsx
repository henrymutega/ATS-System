import React from 'react'

const Login = () => {
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

export default Login