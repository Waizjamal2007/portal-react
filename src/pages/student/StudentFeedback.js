import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://portal-node-mauve.vercel.app/api';

function StudentFeedback({ onLogout }) {
  const [formData, setFormData] = useState({
    timeliness: '',
    courseCoverage: '',
    doubtClearing: '',
    assignmentsTimeliness: '',
    examsTimeliness: '',
    practiceTime: '',
    remarks: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if all required fields are filled
    const requiredFields = ['timeliness', 'courseCoverage', 'doubtClearing', 'assignmentsTimeliness', 'examsTimeliness', 'practiceTime'];
    const missing = requiredFields.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      alert('Please answer all questions before submitting.');
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(`${API_URL}/student/feedback`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
      setFormData({
        timeliness: '',
        courseCoverage: '',
        doubtClearing: '',
        assignmentsTimeliness: '',
        examsTimeliness: '',
        practiceTime: '',
        remarks: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert('Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/student/login');
  };

  const ratingOptions = [
    { value: 'Excellent', label: '🌟 Excellent', color: '#10b981' },
    { value: 'Good', label: '👍 Good', color: '#3b82f6' },
    { value: 'Average', label: '👌 Average', color: '#f59e0b' },
    { value: 'Poor', label: '👎 Poor', color: '#ef4444' }
  ];

  const yesNoOptions = [
    { value: 'Yes', label: '✅ Yes', color: '#10b981' },
    { value: 'No', label: '❌ No', color: '#ef4444' }
  ];

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">🎓 NexoraWeb</div>
          <div className="nav-links">
            <Link to="/student/dashboard" className="nav-link">Home</Link>
            <Link to="/student/study-material" className="nav-link">Study Material</Link>
            <Link to="/student/academics" className="nav-link">Academics</Link>
            <Link to="/student/feedback" className="nav-link active">Feedback</Link>
            <Link to="/student/complaints" className="nav-link">Complaints</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {submitted && (
          <div className="alert alert-success" style={{ textAlign: 'center', padding: '20px' }}>
            <strong>🎉 Thank You for Your Feedback!</strong><br />
            Your response has been recorded successfully.
          </div>
        )}

        <div className="card" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className="card-title" style={{ fontSize: '28px', marginBottom: '10px' }}>📊 Monthly Feedback Form</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Your honest feedback helps us improve the learning experience
            </p>
            <div style={{ 
              width: '80px', 
              height: '3px', 
              background: '#1e3a8a', 
              margin: '15px auto',
              borderRadius: '2px'
            }} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Question 1 */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '25px', 
              borderRadius: '16px', 
              marginBottom: '20px',
              borderLeft: '4px solid #1e3a8a'
            }}>
              <label style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1e293b',
                display: 'block',
                marginBottom: '15px'
              }}>
                1. Do classes start and end on time?
              </label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {ratingOptions.map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: formData.timeliness === opt.value ? opt.color : '#f1f5f9',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: formData.timeliness === opt.value ? 'white' : '#334155'
                  }}>
                    <input
                      type="radio"
                      name="timeliness"
                      value={opt.value}
                      checked={formData.timeliness === opt.value}
                      onChange={(e) => setFormData({ ...formData, timeliness: e.target.value })}
                      style={{ display: 'none' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '25px', 
              borderRadius: '16px', 
              marginBottom: '20px',
              borderLeft: '4px solid #10b981'
            }}>
              <label style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1e293b',
                display: 'block',
                marginBottom: '15px'
              }}>
                2. Are you satisfied with the course coverage so far?
              </label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {yesNoOptions.map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 30px',
                    background: formData.courseCoverage === opt.value ? opt.color : '#f1f5f9',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: formData.courseCoverage === opt.value ? 'white' : '#334155'
                  }}>
                    <input
                      type="radio"
                      name="courseCoverage"
                      value={opt.value}
                      checked={formData.courseCoverage === opt.value}
                      onChange={(e) => setFormData({ ...formData, courseCoverage: e.target.value })}
                      style={{ display: 'none' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 3 */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '25px', 
              borderRadius: '16px', 
              marginBottom: '20px',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <label style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1e293b',
                display: 'block',
                marginBottom: '15px'
              }}>
                3. Does the teacher clear your doubts effectively?
              </label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {ratingOptions.map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: formData.doubtClearing === opt.value ? opt.color : '#f1f5f9',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: formData.doubtClearing === opt.value ? 'white' : '#334155'
                  }}>
                    <input
                      type="radio"
                      name="doubtClearing"
                      value={opt.value}
                      checked={formData.doubtClearing === opt.value}
                      onChange={(e) => setFormData({ ...formData, doubtClearing: e.target.value })}
                      style={{ display: 'none' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 4 */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '25px', 
              borderRadius: '16px', 
              marginBottom: '20px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <label style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1e293b',
                display: 'block',
                marginBottom: '15px'
              }}>
                4. Are assignments uploaded according to the scheduled time?
              </label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {ratingOptions.map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: formData.assignmentsTimeliness === opt.value ? opt.color : '#f1f5f9',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: formData.assignmentsTimeliness === opt.value ? 'white' : '#334155'
                  }}>
                    <input
                      type="radio"
                      name="assignmentsTimeliness"
                      value={opt.value}
                      checked={formData.assignmentsTimeliness === opt.value}
                      onChange={(e) => setFormData({ ...formData, assignmentsTimeliness: e.target.value })}
                      style={{ display: 'none' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 5 */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '25px', 
              borderRadius: '16px', 
              marginBottom: '20px',
              borderLeft: '4px solid #ef4444'
            }}>
              <label style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1e293b',
                display: 'block',
                marginBottom: '15px'
              }}>
                5. Are exams and assignments conducted on time?
              </label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {yesNoOptions.map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 30px',
                    background: formData.examsTimeliness === opt.value ? opt.color : '#f1f5f9',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: formData.examsTimeliness === opt.value ? 'white' : '#334155'
                  }}>
                    <input
                      type="radio"
                      name="examsTimeliness"
                      value={opt.value}
                      checked={formData.examsTimeliness === opt.value}
                      onChange={(e) => setFormData({ ...formData, examsTimeliness: e.target.value })}
                      style={{ display: 'none' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 6 */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '25px', 
              borderRadius: '16px', 
              marginBottom: '20px',
              borderLeft: '4px solid #06b6d4'
            }}>
              <label style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1e293b',
                display: 'block',
                marginBottom: '15px'
              }}>
                6. Do you get enough time for practice after lectures?
              </label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {ratingOptions.map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: formData.practiceTime === opt.value ? opt.color : '#f1f5f9',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: formData.practiceTime === opt.value ? 'white' : '#334155'
                  }}>
                    <input
                      type="radio"
                      name="practiceTime"
                      value={opt.value}
                      checked={formData.practiceTime === opt.value}
                      onChange={(e) => setFormData({ ...formData, practiceTime: e.target.value })}
                      style={{ display: 'none' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '25px', 
              borderRadius: '16px', 
              marginBottom: '30px',
              borderLeft: '4px solid #6366f1'
            }}>
              <label style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1e293b',
                display: 'block',
                marginBottom: '15px'
              }}>
                7. Additional Remarks / Suggestions
              </label>
              <textarea
                rows="4"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Please share any additional feedback, suggestions, or concerns..."
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                background: loading ? '#94a3b8' : '#1e3a8a',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Submitting...' : '📤 Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentFeedback;