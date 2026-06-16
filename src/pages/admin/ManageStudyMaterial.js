import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portal-node-mauve.vercel.app/api';

function ManageStudyMaterial({ onLogout }) {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', fileName: '', filePath: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/study-materials`, { headers: { Authorization: `Bearer ${token}` } });
      setMaterials(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/study-materials`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Study material added successfully');
      fetchMaterials();
      setShowModal(false);
      setFormData({ title: '', description: '', fileName: '', filePath: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding material');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this material?')) {
      try {
        await axios.delete(`${API_URL}/admin/study-materials/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchMaterials();
      } catch (error) {
        alert('Error deleting');
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
          <div className="navbar-brand">Admin Panel</div>
          <div className="nav-links">
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/students" className="nav-link">Students</Link>
            <Link to="/admin/assignments" className="nav-link">Assignments</Link>
            <Link to="/admin/study-material" className="nav-link active">Study Material</Link>
            <Link to="/admin/progress" className="nav-link">Progress</Link>
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
            <h3 className="card-title" style={{ marginBottom: 0 }}>Study Materials</h3>
            <button onClick={() => setShowModal(true)} className="btn-primary">+ Upload Material</button>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Description</th><th>File Name</th><th>Upload Date</th><th>Action</th></tr></thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m._id}>
                    <td>{m.title}</td>
                    <td>{m.description}</td>
                    <td>{m.fileName}</td>
                    <td>{new Date(m.uploadDate).toLocaleDateString()}</td>
                    <td><button onClick={() => handleDelete(m._id)} className="btn-primary" style={{ background: '#ef4444', padding: '4px 12px' }}>Delete</button></td>
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
            <h3>Upload Study Material</h3>
            <form onSubmit={handleAddMaterial}>
              <div className="form-group"><label>Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea></div>
              <div className="form-group"><label>File Name</label><input type="text" value={formData.fileName} onChange={(e) => setFormData({...formData, fileName: e.target.value})} placeholder="e.g., react-guide.pdf" required /></div>
              <div className="form-group"><label>File Path</label><input type="text" value={formData.filePath} onChange={(e) => setFormData({...formData, filePath: e.target.value})} placeholder="e.g., uploads/react-guide.pdf" required /></div>
              <div style={{ display: 'flex', gap: '12px' }}><button type="submit" className="btn-primary">Upload</button><button type="button" onClick={() => setShowModal(false)} className="btn-primary" style={{ background: '#94a3b8' }}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudyMaterial;