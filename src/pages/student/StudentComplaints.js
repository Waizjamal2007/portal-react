import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// API URL ko direct live backend server par set kar diya hai
const API_URL = 'https://portal-node-mauve.vercel.app/api';

function StudentComplaints({ onLogout }) {
  const [complaint, setComplaint] = useState({ subject: '', description: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ya 'error' ke liye
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend ko complaint data aur Auth token dono sahi se bhej rahe hain
      await axios.post(`${API_URL}/student/complaints`, complaint, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setMessageType('success');
      setMessage('Complaint submitted successfully!');
      setComplaint({ subject: '', description: '' }); // Form clear karne ke liye
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      console.error('Complaint submission error:', error);
      setMessageType('error');
      // Agar backend se koi custom error message aaye toh woh show hoga warna generic message
      setMessage(error.response?.data?.message || 'Error submitting complaint. Please try again.');
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">NexoraWeb</div>
          <div className="nav-links">
            <Link to="/student/dashboard" className="nav-link">Home</Link>
            <Link to="/student/study-material" className="nav-link">Study Material</Link>
            <Link to="/student/academics" className="nav-link">Academics</Link>
            <Link to="/student/feedback" className="nav-link">Feedback</Link>
            <Link to="/student/complaints" className="nav-link active">Complaints</Link>
            <button onClick={() => { onLogout(); navigate('/student/login'); }} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <h3 className="card-title">Register Complaint</h3>
          
          {/* Dynamic Alert Messages (Success aur Error dono ke liye render hoga) */}
          {message && (
            <div 
              className={`alert alert-${messageType}`} 
              style={{ 
                padding: '12px', 
                marginBottom: '15px', 
                borderRadius: '4px', 
                backgroundColor: messageType === 'success' ? '#d1e7dd' : '#f8d7da', 
                color: messageType === 'success' ? '#0f5132' : '#842029',
                border: `1px solid ${messageType === 'success' ? '#badbcc' : '#f5c2c7'}`
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Subject</label>
              <input 
                type="text" 
                value={complaint.subject} 
                onChange={(e) => setComplaint({...complaint, subject: e.target.value})} 
                required 
                placeholder="e.g., Portal Loading Issue"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Description</label>
              <textarea 
                rows="5" 
                value={complaint.description} 
                onChange={(e) => setComplaint({...complaint, description: e.target.value})} 
                required
                placeholder="Write your issue details here..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }}
              ></textarea>
            </div>
            
            <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentComplaints;