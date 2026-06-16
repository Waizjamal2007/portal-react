import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://portal-node-mauve.vercel.app/api';  // Hardcoded for now

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Sending login request...');
      const response = await axios.post(`${API_URL}/admin/login`, { username, password });
      console.log('Response:', response.data);
      onLogin(response.data.token, response.data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1>Admin Panel</h1>
          <p className="subtitle">NexoraWeb Administration</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-field">
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required 
              autoFocus
            />
          </div>
          
          <div className="input-field">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={() => navigate('/student/login')} className="btn-primary" style={{ background: '#64748b' }}>Student Login →</button>
        </div>
        
       
      </div>
    </div>
  );
}

export default AdminLogin;