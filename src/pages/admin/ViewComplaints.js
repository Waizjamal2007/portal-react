import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// API URL ko direct live backend production server par set kar diya hai
const API_URL = 'https://portal-node-mauve.vercel.app/api';

function ViewComplaints({ onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/complaints`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      // Handle array safe check
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/complaints/${id}`, 
        { status, adminResponse: response }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessageType('success');
      setMessage(`Complaint marked as ${status} successfully!`);
      fetchComplaints();
      setSelectedComplaint(null);
      setResponse('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Error updating complaint');
      setTimeout(() => setMessage(''), 3000);
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
        {message && (
          <div 
            className={`alert alert-${messageType}`}
            style={{ 
              padding: '12px', 
              marginBottom: '15px', 
              borderRadius: '4px', 
              backgroundColor: messageType === 'success' ? '#d1e7dd' : '#f8d7da', 
              color: messageType === 'success' ? '#0f5132' : '#842029'
            }}
          >
            {message}
          </div>
        )}

        <div className="card">
          <h3 className="card-title">Student Complaints</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length > 0 ? (
                  complaints.map(c => (
                    <tr key={c._id}>
                      {/* Name agar populate na ho toh fallback text lagaya hai */}
                      <td>{c.studentName || c.studentId || 'Anonymous Student'}</td>
                      <td style={{ fontWeight: '500' }}>{c.subject}</td>
                      <td style={{ maxWidth: '250px' }}>{c.description ? c.description.substring(0, 50) + '...' : 'No description'}</td>
                      <td>
                        <span className={c.status === 'Resolved' ? 'status-submitted' : 'status-missed'} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {c.status || 'Pending'}
                        </span>
                      </td>
                      <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button onClick={() => setSelectedComplaint(c)} className="btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>
                          Respond
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                      📭 Abhi tak koi student complaint register nahi hui!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Respond to Complaint</h3>
            <p style={{ marginBottom: '8px' }}><strong>Student:</strong> {selectedComplaint.studentName || 'N/A'}</p>
            <p style={{ marginBottom: '8px' }}><strong>Subject:</strong> {selectedComplaint.subject}</p>
            <p style={{ marginBottom: '16px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}><strong>Description:</strong> {selectedComplaint.description}</p>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Admin Response</label>
              <textarea 
                rows="3" 
                value={response} 
                onChange={(e) => setResponse(e.target.value)} 
                placeholder="Type your response here..."
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }}
              ></textarea>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setSelectedComplaint(null)} className="btn-primary" style={{ background: '#94a3b8', border: 'none', padding: '8px 16px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleUpdateStatus(selectedComplaint._id, 'In Progress')} className="btn-primary" style={{ background: '#f59e0b', border: 'none', padding: '8px 16px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Mark In Progress</button>
              <button onClick={() => handleUpdateStatus(selectedComplaint._id, 'Resolved')} className="btn-primary" style={{ border: 'none', padding: '8px 16px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Mark Resolved</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewComplaints;