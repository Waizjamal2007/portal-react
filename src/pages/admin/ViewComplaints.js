import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api';

function ViewComplaints({ onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/complaints`, { headers: { Authorization: `Bearer ${token}` } });
      setComplaints(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/complaints/${id}`, { status, adminResponse: response }, { headers: { Authorization: `Bearer ${token}` } });
      fetchComplaints();
      setSelectedComplaint(null);
      setResponse('');
    } catch (error) {
      alert('Error updating complaint');
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
            <Link to="/admin/complaints" className="nav-link active">Complaints</Link>
            <Link to="/admin/jobs" className="nav-link">Jobs</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <h3 className="card-title">Student Complaints</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Student</th><th>Subject</th><th>Description</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td>{c.studentName}</td>
                    <td>{c.subject}</td>
                    <td>{c.description.substring(0, 50)}...</td>
                    <td className={c.status === 'Resolved' ? 'status-submitted' : 'status-missed'}>{c.status}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td><button onClick={() => setSelectedComplaint(c)} className="btn-primary" style={{ padding: '4px 12px' }}>Respond</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Respond to Complaint</h3>
            <p><strong>Student:</strong> {selectedComplaint.studentName}</p>
            <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <div className="form-group"><label>Admin Response</label><textarea rows="3" value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Type your response here..."></textarea></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleUpdateStatus(selectedComplaint._id, 'Resolved')} className="btn-primary">Mark Resolved</button>
              <button onClick={() => handleUpdateStatus(selectedComplaint._id, 'In Progress')} className="btn-primary" style={{ background: '#f59e0b' }}>Mark In Progress</button>
              <button onClick={() => setSelectedComplaint(null)} className="btn-primary" style={{ background: '#94a3b8' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewComplaints;