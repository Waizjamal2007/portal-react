import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api';

function ManageJobs({ onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', company: '', location: '', salary: '', applyBefore: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/jobs`, { headers: { Authorization: `Bearer ${token}` } });
      setJobs(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/jobs`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Job posted successfully');
      fetchJobs();
      setShowModal(false);
      setFormData({ title: '', description: '', company: '', location: '', salary: '', applyBefore: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error posting job');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      try {
        await axios.delete(`${API_URL}/admin/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchJobs();
      } catch (error) {
        alert('Error deleting');
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">Admin Panel</div>
          <div className="nav-links">
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/students" className="nav-link">Students</Link>
            <Link to="/admin/assignments" className="nav-link">Assignments</Link>
            <Link to="/admin/study-material" className="nav-link">Study Material</Link>
            <Link to="/admin/progress" className="nav-link">Progress</Link>
            <Link to="/admin/feedback" className="nav-link">Feedback</Link>
            <Link to="/admin/complaints" className="nav-link">Complaints</Link>
            <Link to="/admin/jobs" className="nav-link active">Jobs</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {message && <div className="alert alert-success">{message}</div>}
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Job Opportunities</h3>
            <button onClick={() => setShowModal(true)} className="btn-primary">+ Post Job</button>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Title</th><th>Company</th><th>Location</th><th>Salary</th><th>Apply Before</th><th>Action</th></tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j._id}>
                    <td>{j.title}</td>
                    <td>{j.company}</td>
                    <td>{j.location}</td>
                    <td>{j.salary}</td>
                    <td>{j.applyBefore}</td>
                    <td><button onClick={() => handleDelete(j._id)} className="btn-primary" style={{ background: '#ef4444', padding: '4px 12px' }}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Post New Job</h3>
            <form onSubmit={handleAddJob}>
              <div className="form-group"><label>Job Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea></div>
              <div className="form-group"><label>Company</label><input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required /></div>
              <div className="form-group"><label>Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required /></div>
              <div className="form-group"><label>Salary</label><input type="text" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} placeholder="e.g., 50k-80k" /></div>
              <div className="form-group"><label>Apply Before</label><input type="text" value={formData.applyBefore} onChange={(e) => setFormData({...formData, applyBefore: e.target.value})} placeholder="e.g., 30th June 2026" required /></div>
              <div style={{ display: 'flex', gap: '12px' }}><button type="submit" className="btn-primary">Post Job</button><button type="button" onClick={() => setShowModal(false)} className="btn-primary" style={{ background: '#94a3b8' }}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;