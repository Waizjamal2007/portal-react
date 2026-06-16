import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://portal-node-mauve.vercel.app/api';

function ManageAssignments({ onLogout }) {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    assignmentName: '',
    description: '',
    deadline: '',
    marks: 20
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignRes, studentsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/assignments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAssignments(assignRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/admin/assignments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Assignment added successfully!');
      setMessageType('success');
      fetchData();
      setShowModal(false);
      setFormData({ studentId: '', assignmentName: '', description: '', deadline: '', marks: 20 });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding assignment');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/assignments/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setMessage(`Assignment marked as ${status}`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating status');
      setMessageType('error');
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
          <div className="navbar-brand">⚡ NexoraAdmin</div>
          <div className="nav-links">
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/students" className="nav-link">Students</Link>
            <Link to="/admin/assignments" className="nav-link active">Assignments</Link>
            <Link to="/admin/study-material" className="nav-link">Study Material</Link>
            <Link to="/admin/progress" className="nav-link">Progress</Link>
            <Link to="/admin/feedback" className="nav-link">Feedback</Link>
            <Link to="/admin/complaints" className="nav-link">Complaints</Link>
            <Link to="/admin/jobs" className="nav-link">Jobs</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {message && <div className={`alert alert-${messageType}`}>{message}</div>}
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>📝 Manage Assignments</h3>
            <button onClick={() => setShowModal(true)} className="btn-primary">➕ Add Assignment</button>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment</th>
                  <th>Deadline</th>
                  <th>Marks</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length > 0 ? (
                  assignments.map(a => (
                    <tr key={a._id}>
                      <td>{a.studentName} ({a.studentId})</td>
                      <td>{a.assignmentName}</td>
                      <td>{a.deadline}</td>
                      <td>{a.marks}</td>
                      <td>
                        <span className={a.status === 'Submitted' ? 'status-submitted' : 'status-pending'}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.status !== 'Submitted' && (
                          <button
                            onClick={() => handleUpdateStatus(a._id, 'Graded')}
                            className="btn-success"
                            style={{ padding: '4px 12px', fontSize: '11px' }}
                          >
                            Mark Graded
                          </button>
                        )}
                        {a.status === 'Submitted' && (
                          <span className="status-submitted">✓ Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      📭 No assignments yet. Click "Add Assignment" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Assignment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px' }}>📝 Add New Assignment</h3>
            <form onSubmit={handleAddAssignment}>
              <div className="form-group">
                <label>Select Student *</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s._id} value={s.studentId}>
                      {s.name} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Assignment Name *</label>
                <input
                  type="text"
                  value={formData.assignmentName}
                  onChange={(e) => setFormData({ ...formData, assignmentName: e.target.value })}
                  placeholder="e.g., React Assignment 1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the assignment..."
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Deadline *</label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  placeholder="e.g., 30th June 2026"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Marks</label>
                <input
                  type="number"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                  placeholder="20"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Assignment'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAssignments;