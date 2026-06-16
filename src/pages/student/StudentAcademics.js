import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api';

function StudentAcademics({ onLogout }) {
  const [assignments, setAssignments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch data function
  const fetchData = async () => {
    try {
      const [assignmentsRes, progressRes] = await Promise.all([
        axios.get(`${API_URL}/student/assignments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/student/progress`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAssignments(assignmentsRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelect = (assignmentId, file) => {
    setSelectedFile(file);
    setSelectedAssignmentId(assignmentId);
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('assignmentId', selectedAssignmentId);
    
    try {
      await axios.post(`${API_URL}/student/submit-assignment`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Assignment submitted successfully!');
      setMessageType('success');
      fetchData();
      setSelectedFile(null);
      setSelectedAssignmentId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error submitting assignment: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/student/login');
  };

  // Sample assignments data
  const sampleAssignments = [
    { _id: '1', assignmentName: 'Laravel Assignment no 1', description: 'Create a laravel project , and create 2 views and join them with navbar', deadline: '24th April 2025', marks: 20, facultyFile: 'No Faculty File', status: 'Missed Assignment' },
    { _id: '2', assignmentName: 'Integrate a template on laravel', description: 'Pick a template or website from themewagon.com and integrate it', deadline: '30th April 2025', marks: 20, facultyFile: 'Expired', status: 'Submitted' },
    { _id: '3', assignmentName: 'React JS', description: 'Create a project on react and upload the screenshot here', deadline: '11th February 2026', marks: 20, facultyFile: 'Expired', status: 'Pending' },
    { _id: '4', assignmentName: 'MERN Stack Authentication', description: 'Create authentication system using MERN stack', deadline: '9th June 2026', marks: 20, facultyFile: 'No Faculty File', status: 'Pending' },
  ];

  const displayAssignments = assignments.length > 0 ? assignments : sampleAssignments;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">NexoraWeb</div>
          <div className="nav-links">
            <Link to="/student/dashboard" className="nav-link">Home</Link>
            <Link to="/student/study-material" className="nav-link">Study Material</Link>
            <Link to="/student/academics" className="nav-link active">Academics</Link>
            <Link to="/student/feedback" className="nav-link">Feedback</Link>
            <Link to="/student/complaints" className="nav-link">Complaints</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {message && <div className={`alert alert-${messageType}`}>{message}</div>}

        <div className="card">
          <h3 className="card-title">📊 Your Overall Progress - LAST MONTH</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assignment Marks</th><th>Quiz Marks</th><th>Classes Attended</th>
                  <th>Classes Held</th><th>Percentage</th><th>Remarks</th><th>Month</th>
                </tr>
              </thead>
              <tbody>
                {progress.length > 0 ? progress.map(p => (
                  <tr key={p._id}>
                    <td>{p.assignmentMarks}%</td>
                    <td>{p.quizMarks}%</td>
                    <td>{p.classesAttended}</td>
                    <td>{p.classesHeld}</td>
                    <td>
                      <div className="progress-bar-container" style={{ width: '80px', height: '20px' }}>
                        <div className="progress-bar-fill" style={{ width: `${p.percentage}%`, height: '20px', fontSize: '10px' }}>
                          {p.percentage}%
                        </div>
                      </div>
                    </td>
                    <td>{p.remarks || 'Satisfactory'}</td>
                    <td>{p.month}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>📋 No progress data yet. Admin will update soon.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <button className="btn-primary" style={{ marginTop: '16px' }}>📅 View Every Month's Progress</button>
        </div>

        <div className="card">
          <h3 className="card-title">📋 Your Assignments</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assignment Name</th><th>Description</th><th>Deadline</th>
                  <th>Marks</th><th>Faculty File</th><th>Status</th><th>Submit Assignment</th>
                </tr>
              </thead>
              <tbody>
                {displayAssignments.map((assign) => (
                  <tr key={assign._id}>
                    <td style={{ fontWeight: '500' }}>{assign.assignmentName}</td>
                    <td style={{ maxWidth: '300px' }}>{assign.description?.substring(0, 60)}...</td>
                    <td>{assign.deadline}</td>
                    <td>{assign.marks || 20}</td>
                    <td>
                      <span className={assign.facultyFile === 'Expired' ? 'status-missed' : 'status-pending'}>
                        {assign.facultyFile || 'No Faculty File'}
                      </span>
                    </td>
                    <td>
                      <span className={assign.status === 'Submitted' ? 'status-submitted' : 'status-missed'}>
                        {assign.status}
                      </span>
                    </td>
                    <td>
                      {assign.status !== 'Submitted' ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileSelect(assign._id, e.target.files[0])} 
                            style={{ fontSize: '11px', padding: '4px' }}
                          />
                          <button 
                            onClick={handleSubmit} 
                            className="btn-success" 
                            style={{ padding: '4px 12px', fontSize: '11px' }}
                            disabled={uploading && selectedAssignmentId === assign._id}
                          >
                            {uploading && selectedAssignmentId === assign._id ? '⏳ Uploading...' : '📤 Submit'}
                          </button>
                        </div>
                      ) : (
                        <span className="status-submitted">✓ Submitted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentAcademics;