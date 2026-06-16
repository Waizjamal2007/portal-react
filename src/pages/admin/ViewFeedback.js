import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://portal-node-mauve.vercel.app/api';

function ViewFeedback({ onLogout }) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  const getRatingBadge = (rating) => {
    const colors = {
      'Excellent': { bg: '#d1fae5', color: '#065f46', icon: '🌟' },
      'Good': { bg: '#dbeafe', color: '#1e40af', icon: '👍' },
      'Average': { bg: '#fed7aa', color: '#92400e', icon: '👌' },
      'Poor': { bg: '#fee2e2', color: '#991b1b', icon: '👎' },
      'Yes': { bg: '#d1fae5', color: '#065f46', icon: '✅' },
      'No': { bg: '#fee2e2', color: '#991b1b', icon: '❌' }
    };
    const style = colors[rating] || { bg: '#f1f5f9', color: '#475569', icon: '📊' };
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        display: 'inline-block'
      }}>
        {style.icon} {rating}
      </span>
    );
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">⚡ NexoraAdmin</div>
          <div className="nav-links">
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/students" className="nav-link">Students</Link>
            <Link to="/admin/assignments" className="nav-link">Assignments</Link>
            <Link to="/admin/study-material" className="nav-link">Study Material</Link>
            <Link to="/admin/progress" className="nav-link">Progress</Link>
            <Link to="/admin/feedback" className="nav-link active">Feedback</Link>
            <Link to="/admin/complaints" className="nav-link">Complaints</Link>
            <Link to="/admin/jobs" className="nav-link">Jobs</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <h3 className="card-title" style={{ marginBottom: 0, fontSize: '22px' }}>📊 Student Feedback Analytics</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="som-badge">Total: {feedback.length}</span>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>Loading feedback data...</div>
          ) : feedback.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              📭 No feedback submitted yet. Students will share their feedback here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {feedback.map((f, index) => (
                <div
                  key={f._id}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedFeedback(selectedFeedback?._id === f._id ? null : f)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>{f.studentName}</span>
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '10px' }}>
                        {new Date(f.submittedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {getRatingBadge(f.timeliness)}
                      {getRatingBadge(f.courseCoverage)}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    marginBottom: '15px'
                  }}>
                    <div><span style={{ fontSize: '11px', color: '#64748b' }}>Doubt Clearing:</span> {getRatingBadge(f.doubtClearing)}</div>
                    <div><span style={{ fontSize: '11px', color: '#64748b' }}>Assignments:</span> {getRatingBadge(f.assignmentsTimeliness || f.examsTimeliness)}</div>
                    <div><span style={{ fontSize: '11px', color: '#64748b' }}>Practice Time:</span> {getRatingBadge(f.practiceTime)}</div>
                  </div>

                  {/* Expandable Details */}
                  {selectedFeedback?._id === f._id && (
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid #e2e8f0',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '15px',
                        marginBottom: '20px'
                      }}>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                          <strong>Class Timeliness:</strong>
                          <div style={{ marginTop: '5px' }}>{getRatingBadge(f.timeliness)}</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                          <strong>Course Coverage:</strong>
                          <div style={{ marginTop: '5px' }}>{getRatingBadge(f.courseCoverage)}</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                          <strong>Doubt Clearing:</strong>
                          <div style={{ marginTop: '5px' }}>{getRatingBadge(f.doubtClearing)}</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                          <strong>Exams Timeliness:</strong>
                          <div style={{ marginTop: '5px' }}>{getRatingBadge(f.examsTimeliness)}</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                          <strong>Practice Time:</strong>
                          <div style={{ marginTop: '5px' }}>{getRatingBadge(f.practiceTime)}</div>
                        </div>
                      </div>
                      
                      {f.remarks && (
                        <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '12px', marginTop: '10px' }}>
                          <strong>💬 Student Remarks:</strong>
                          <p style={{ marginTop: '8px', color: '#92400e', lineHeight: '1.5' }}>{f.remarks}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {selectedFeedback?._id === f._id ? '▲ Click to collapse' : '▼ Click to expand'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ViewFeedback;