import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api';

function StudentProgress({ onLogout }) {
  const [progress, setProgress] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', month: '', year: 2025, assignmentMarks: 0, quizMarks: 0, classesAttended: 0, classesHeld: 0, remarks: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, studentsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/progress`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProgress(progressRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/progress`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Progress added successfully');
      fetchData();
      setShowModal(false);
      setFormData({ studentId: '', month: '', year: 2025, assignmentMarks: 0, quizMarks: 0, classesAttended: 0, classesHeld: 0, remarks: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding progress');
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
            <Link to="/admin/progress" className="nav-link active">Progress</Link>
            <Link to="/admin/feedback" className="nav-link">Feedback</Link>
            <Link to="/admin/complaints" className="nav-link">Complaints</Link>
            <Link to="/admin/jobs" className="nav-link">Jobs</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {message && <div className="alert alert-success">{message}</div>}
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Student Progress & Attendance</h3>
            <button onClick={() => setShowModal(true)} className="btn-primary">+ Add Progress</button>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Student</th><th>Month</th><th>Assignment Marks</th><th>Quiz Marks</th><th>Attendance</th><th>Percentage</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {progress.map(p => (
                  <tr key={p._id}>
                    <td>{p.studentName}</td>
                    <td>{p.month} {p.year}</td>
                    <td>{p.assignmentMarks}%</td>
                    <td>{p.quizMarks}%</td>
                    <td>{p.classesAttended}/{p.classesHeld}</td>
                    <td><div className="progress-bar-container" style={{ width: '100px', height: '20px' }}><div className="progress-bar-fill" style={{ width: `${p.percentage}%`, height: '20px', fontSize: '10px' }}>{p.percentage}%</div></div></td>
                    <td>{p.remarks}</td>
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
            <h3>Add Student Progress</h3>
            <form onSubmit={handleAddProgress}>
              <div className="form-group"><label>Student</label><select value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} required><option value="">Select Student</option>{students.map(s => <option key={s._id} value={s.studentId}>{s.name} ({s.studentId})</option>)}</select></div>
              <div className="form-group"><label>Month</label><input type="text" value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} placeholder="e.g., June" required /></div>
              <div className="form-group"><label>Year</label><input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required /></div>
              <div className="form-group"><label>Assignment Marks (%)</label><input type="number" value={formData.assignmentMarks} onChange={(e) => setFormData({...formData, assignmentMarks: e.target.value})} required /></div>
              <div className="form-group"><label>Quiz Marks (%)</label><input type="number" value={formData.quizMarks} onChange={(e) => setFormData({...formData, quizMarks: e.target.value})} required /></div>
              <div className="form-group"><label>Classes Attended</label><input type="number" value={formData.classesAttended} onChange={(e) => setFormData({...formData, classesAttended: e.target.value})} required /></div>
              <div className="form-group"><label>Classes Held</label><input type="number" value={formData.classesHeld} onChange={(e) => setFormData({...formData, classesHeld: e.target.value})} required /></div>
              <div className="form-group"><label>Remarks</label><input type="text" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} placeholder="e.g., Satisfactory" /></div>
              <div style={{ display: 'flex', gap: '12px' }}><button type="submit" className="btn-primary">Add Progress</button><button type="button" onClick={() => setShowModal(false)} className="btn-primary" style={{ background: '#94a3b8' }}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProgress;