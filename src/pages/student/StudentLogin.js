import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api/student/login';

function StudentLogin({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/student/login`, { studentId, password });
      onLogin(response.data.token, response.data.user);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1>NexoraWeb</h1>
          <p className="subtitle">Student Portal Login</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-field">
            <label>Student ID</label>
            <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Enter your student ID" required autoFocus />
          </div>
          
          <div className="input-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your student ID is your password" required />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Logging in...' : 'Sign In'}</button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={() => navigate('/admin/login')} className="btn-primary" style={{ background: '#64748b' }}>Admin Login →</button>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          Demo: STUDENT160 / STUDENT160
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;