import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://portal-node-mauve.vercel.app/api';

function ManageStudents({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    enrollmentNo: '', 
    email: '', 
    phone: '', 
    currentSemester: '' 
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/students`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error fetching students');
      setMessageType('error');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Validation
    if (!formData.name || !formData.enrollmentNo || !formData.email || !formData.phone || !formData.currentSemester) {
      setMessage('Please fill all fields');
      setMessageType('error');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/admin/students`, formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      console.log('Student added:', response.data);
      setMessage('Student added successfully!');
      setMessageType('success');
      fetchStudents();
      setShowModal(false);
      setFormData({ name: '', enrollmentNo: '', email: '', phone: '', currentSemester: '' });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding student:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Error adding student. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (id, studentId) => {
    if (window.confirm(`Reset password for ${studentId}? Password will be set to their Student ID.`)) {
      try {
        await axios.post(`${API_URL}/admin/students/reset-password/${id}`, {}, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setMessage(`Password reset to ${studentId}`);
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error resetting password');
        setMessageType('error');
      }
    }
  };

  const handleSetStudentOfMonth = async (id, name) => {
    if (window.confirm(`Set ${name} as Student of the Month?`)) {
      try {
        await axios.post(`${API_URL}/admin/student-of-month/${id}`, {}, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setMessage(`${name} is now Student of the Month!`);
        setMessageType('success');
        fetchStudents();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error updating student of month');
        setMessageType('error');
      }
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Delete student ${name}? This action cannot be undone.`)) {
      try {
        await axios.delete(`${API_URL}/admin/students/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setMessage(`Student ${name} deleted successfully`);
        setMessageType('success');
        fetchStudents();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting student');
        setMessageType('error');
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
          <div className="navbar-brand">⚡ NexoraAdmin</div>
          <div className="nav-links">
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/students" className="nav-link active">Students</Link>
            <Link to="/admin/assignments" className="nav-link">Assignments</Link>
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
        {message && (
          <div className={`alert alert-${messageType}`}>
            {message}
          </div>
        )}
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>📋 Manage Students</h3>
            <button onClick={() => setShowModal(true)} className="btn-primary">➕ Add New Student</button>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Semester</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s, index) => (
                    <tr key={s._id}>
                      <td>{index + 1}</td>
                      <td>
                        {s.name} 
                        {s.studentOfMonth && <span style={{ color: '#f59e0b', marginLeft: '5px' }}>⭐</span>}
                      </td>
                      <td>{s.studentId}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td>{s.currentSemester}</td>
                      <td><span className="status-submitted">Active</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => handleResetPassword(s._id, s.studentId)} 
                            className="btn-secondary" 
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Reset Pass
                          </button>
                          <button 
                            onClick={() => handleSetStudentOfMonth(s._id, s.name)} 
                            className="btn-primary" 
                            style={{ padding: '4px 8px', fontSize: '11px', background: '#f59e0b' }}
                          >
                            ⭐ Star
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(s._id, s.name)} 
                            className="btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      📭 No students yet. Click "Add New Student" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px' }}>➕ Add New Student</h3>
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g., Waiz Jamal"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Enrollment Number *</label>
                <input 
                  type="text" 
                  value={formData.enrollmentNo} 
                  onChange={(e) => setFormData({...formData, enrollmentNo: e.target.value})} 
                  placeholder="e.g., 22082408A"
                  required 
                />
                <small style={{ color: '#64748b' }}>Student ID will be: STUDENT + Enrollment Number</small>
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="student@example.com"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="e.g., 03331234567"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Current Semester *</label>
                <input 
                  type="text" 
                  value={formData.currentSemester} 
                  onChange={(e) => setFormData({...formData, currentSemester: e.target.value})} 
                  placeholder="e.g., HDSE ||"
                  required 
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;