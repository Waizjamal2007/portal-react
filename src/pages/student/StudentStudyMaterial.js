import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api';

function StudentStudyMaterial({ onLogout }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API_URL}/student/study-materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
            <Link to="/student/dashboard" className="nav-link">Home</Link>
            <Link to="/student/study-material" className="nav-link active">Study Material</Link>
            <Link to="/student/academics" className="nav-link">Academics</Link>
            <Link to="/student/feedback" className="nav-link">Feedback</Link>
            <Link to="/student/complaints" className="nav-link">Complaints</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <h3 className="card-title">📚 Study Materials</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Description</th><th>Upload Date</th><th>Action</th></tr></thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m._id}>
                    <td>{m.title}</td>
                    <td>{m.description}</td>
                    <td>{new Date(m.uploadDate).toLocaleDateString()}</td>
                    <td><button className="btn-primary" style={{ padding: '6px 16px' }}>Download</button></td>
                  </tr>
                ))}
                {materials.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No study materials available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentStudyMaterial;