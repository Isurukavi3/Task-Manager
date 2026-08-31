import { useState } from 'react';
import '../styles/Login.css';

function LoginPage({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validUsers = [
    { email: 'isuru@gmail.com', password: 'isuru1234' },
    { email: 'nadith@gmail.com', password: 'nadith1234' },
    { email: 'sahan@gmail.com', password: 'sahan1234' },
    { email: 'manuja@gmail.com', password: 'manuja1234' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setError('');
      onLogin(email);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Task Board Login</h1>
        <p className="login-subtitle">Software Company Task Management</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="login-link">
          Don't have an account? <span onClick={onNavigateToRegister}>Register here</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
