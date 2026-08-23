import { useState } from 'react';
import '../styles/Login.css';

function RegisterPage({ onNavigateToLogin, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      onRegister(formData);
      alert('Registration successful! You can now login.');
      onNavigateToLogin();
    } else {
      alert('Passwords do not match!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Register</h1>
        <p className="login-subtitle">Create your employee account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter your job title"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="login-link">
          Already have an account? <span onClick={onNavigateToLogin}>Login here</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
