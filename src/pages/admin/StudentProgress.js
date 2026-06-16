import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// API URL ko direct production server par sahi se set kar diya hai
const API_URL = 'https://portal-node-mauve.vercel.app/api';

function StudentProgress({ onLogout }) {
  const [progress, setProgress] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    studentId: '', 
    month: '', 
    year: 2026, 
    assignmentMarks: 0, 
    quizMarks: 0, 
    classesAttended: 0, 
    classesHeld: 0, 
    remarks: '' 
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [progressRes, studentsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/progress`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      // Data ko state mein save kar rahe hain aur check laga rahe hain ke array hi ho
      setProgress(Array.isArray(progressRes.data) ? progressRes.data : []);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
    } catch (error) {
      console.error('Data lane mein error aaya:', error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddProgress = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/progress`, formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMessage('Progress added successfully!');
      fetchData();
      setShowModal(false);
      setFormData({ 
        studentId: '', 
        month: '', 
        year: 2026, 
        assignmentMarks: 0, 
        quizMarks: 0, 
        classesAttended: 0, 
        classesHeld: 0, 
        remarks: '' 
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding progress');
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
            <Link to="/admin/progress" className="nav-link active">Progress</Link>
            <Link to="/admin/feedback" className="nav-link">Feedback</Link>
            <Link to="/admin/complaints" className="nav-link">Complaints</Link>
            <Link to="/admin/jobs" className="nav-link">Jobs</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {message && <div className="alert alert-success" style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#d1e7dd', color: '#0f5132' }}>{message}</div>}
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Student Progress & Attendance</h3>
            <button onClick={() => setShowModal(true)} className="btn-primary">+ Add Progress</button>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Month</th>
                  <th>Assignment Marks</th>
                  <th>Quiz Marks</th>
                  <th>Attendance</th>
                  <th>Percentage</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {progress.length > 0 ? (
                  progress.map(p => (
                    <tr key={p._id}>
                      <td>{p.studentName || p.studentId}</td>
                      <td>{p.month} {p.year}</td>
                      <td>{p.assignmentMarks}%</td>
                      <td>{p.quizMarks}%</td>
                      <td>{p.classesAttended}/{p.classesHeld}</td>
                      <td>
                        <div className="progress-bar-container" style={{ width: '100px', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div className="progress-bar-fill" style={{ width: `${p.percentage}%`, height: '20px', fontSize: '10px', backgroundColor: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {p.percentage}%
                          </div>
                        </div>
                      </td>
                      <td>{p.remarks || 'Satisfactory'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                      📋 No progress data records found. Naya progress add karein!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Add Student Progress</h3>
            <form onSubmit={handleAddProgress}>
              
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Select Student</label>
                <select 
                  value={formData.studentId} 
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})} 
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s._id} value={s.studentId || s._id}>
                      {s.name} ({s.studentId || 'No ID'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Month</label>
                <input type="text" value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} placeholder="e.g., June" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Year</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Assignment Marks (%)</label>
                <input type="number" value={formData.assignmentMarks} onChange={(e) => setFormData({...formData, assignmentMarks: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Quiz Marks (%)</label>
                <input type="number" value={formData.quizMarks} onChange={(e) => setFormData({...formData, quizMarks: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Classes Attended</label>
                <input type="number" value={formData.classesAttended} onChange={(e) => setFormData({...formData, classesAttended: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Classes Held</label>
                <input type="number" value={formData.classesHeld} onChange={(e) => setFormData({...formData, classesHeld: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Remarks</label>
                <input type="text" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} placeholder="e.g., Excellent performance" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-primary" style={{ background: '#94a3b8', border: 'none', padding: '8px 16px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Add Progress</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProgress;