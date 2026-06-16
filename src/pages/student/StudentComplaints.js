import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api';

function StudentComplaints({ onLogout }) {
  const [complaint, setComplaint] = useState({ subject: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/student/complaints`, complaint, { headers: { Authorization: `Bearer ${token}` } });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setComplaint({ subject: '', description: '' });
    } catch (error) {
      alert('Error submitting complaint');
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
          {submitted && <div className="alert alert-success">Complaint submitted!</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Subject</label><input type="text" value={complaint.subject} onChange={(e) => setComplaint({...complaint, subject: e.target.value})} required /></div>
            <div className="form-group"><label>Description</label><textarea rows="5" value={complaint.description} onChange={(e) => setComplaint({...complaint, description: e.target.value})} required></textarea></div>
            <button type="submit" className="btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentComplaints;