import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api';

function StudentDashboard({ user, onLogout }) {
  const [studentDetails, setStudentDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [progress, setProgress] = useState(null);
  const [studentOfMonth, setStudentOfMonth] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [detailsRes, assignmentsRes, progressRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/student/details`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/student/assignments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/student/progress`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/student/jobs`)
      ]);
      
      setStudentDetails(detailsRes.data.student);
      setStudentOfMonth(detailsRes.data.studentOfMonth);
      setAssignments(assignmentsRes.data);
      setProgress(progressRes.data[0]);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    try {
      await axios.post(`${API_URL}/student/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Password updated successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error changing password');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/student/login');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">NexoraWeb</div>
          <div className="nav-links">
            <Link to="/student/dashboard" className="nav-link active">Home</Link>
            <Link to="/student/study-material" className="nav-link">Study Material</Link>
            <Link to="/student/academics" className="nav-link">Academics</Link>
            <Link to="/student/feedback" className="nav-link">Feedback</Link>
            <Link to="/student/complaints" className="nav-link">Complaints</Link>
            <button onClick={() => setShowPasswordModal(true)} className="nav-link" style={{ background: '#1e3a8a', color: 'white' }}>Change Password</button>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {message && <div className={`alert alert-${messageType}`}>{message}</div>}

        {studentOfMonth && (
          <div className="som-banner">
            <h3>🏆 Student of the Month: {studentOfMonth.name}</h3>
            <div className="som-badge">ID: {studentOfMonth.batch}</div>
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <h3 className="card-title">Your Details</h3>
            <table className="data-table">
              <tbody>
                <tr><th>Student Name</th><td>{studentDetails?.name}</td></tr>
                <tr><th>Enrollment No</th><td>{studentDetails?.enrollmentNo}</td></tr>
                <tr><th>Email</th><td>{studentDetails?.email}</td></tr>
                <tr><th>Phone</th><td>{studentDetails?.phone}</td></tr>
                <tr><th>Faculty</th><td>{studentDetails?.faculty}</td></tr>
                <tr><th>Current Semester</th><td>{studentDetails?.currentSemester}</td></tr>
              </tbody>
            </table>
          </div>

          {progress && (
            <div className="card">
              <h3 className="card-title">Overall Progress</h3>
              <div className="progress-section">
                <div className="progress-label"><span>Attendance</span><span>{progress.percentage}%</span></div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${progress.percentage}%` }}>{progress.percentage}%</div>
                </div>
              </div>
              <table className="data-table">
                <tbody>
                  <tr><th>Assignment Marks</th><td>{progress.assignmentMarks}%</td></tr>
                  <tr><th>Quiz Marks</th><td>{progress.quizMarks}%</td></tr>
                  <tr><th>Attendance</th><td>{progress.classesAttended}/{progress.classesHeld}</td></tr>
                  <tr><th>Month</th><td>{progress.month}</td></tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="card-title">Recent Assignments</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Assignment</th><th>Deadline</th><th>Status</th></tr></thead>
              <tbody>
                {assignments.slice(0, 5).map(assign => (
                  <tr key={assign._id}>
                    <td>{assign.assignmentName}</td>
                    <td>{assign.deadline}</td>
                    <td className={assign.status === 'Submitted' ? 'status-submitted' : 'status-missed'}>{assign.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Job Opportunities</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Position</th><th>Company</th><th>Location</th><th>Apply Before</th></tr></thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.applyBefore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group"><label>Current Password</label><input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} required /></div>
              <div className="form-group"><label>New Password</label><input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required /></div>
              <div className="form-group"><label>Confirm Password</label><input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} required /></div>
              <div style={{ display: 'flex', gap: '12px' }}><button type="submit" className="btn-primary">Update</button><button type="button" onClick={() => setShowPasswordModal(false)} className="btn-primary" style={{ background: '#94a3b8' }}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;