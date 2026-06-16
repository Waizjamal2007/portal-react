import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://portal-node-mauve.vercel.app/api';

function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    totalFeedback: 0,
    totalJobs: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      
      // Fetch jobs count separately
      const jobsRes = await axios.get(`${API_URL}/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(prev => ({ ...prev, totalJobs: jobsRes.data.length }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard', color: '#1e3a8a' },
    { path: '/admin/students', icon: '👨‍🎓', label: 'Students', color: '#10b981' },
    { path: '/admin/assignments', icon: '📝', label: 'Assignments', color: '#f59e0b' },
    { path: '/admin/study-material', icon: '📚', label: 'Study Material', color: '#8b5cf6' },
    { path: '/admin/progress', icon: '📈', label: 'Progress & Attendance', color: '#ef4444' },
    { path: '/admin/feedback', icon: '💬', label: 'Feedback', color: '#06b6d4' },
    { path: '/admin/complaints', icon: '⚠️', label: 'Complaints', color: '#f97316' },
    { path: '/admin/jobs', icon: '💼', label: 'Jobs', color: '#6366f1' },
  ];

  return (
    <div className="admin-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`} style={{
        width: sidebarOpen ? '280px' : '70px',
        background: '#0f172a',
        color: 'white',
        transition: 'all 0.3s ease',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000
      }}>
        <div className="sidebar-header" style={{
          padding: '20px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <div>
              <h2 style={{ fontSize: '20px', margin: 0 }}>⚡ NexoraAdmin</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '5px 0 0' }}>Student Portal Admin</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer'
          }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="sidebar-user" style={{
          padding: '20px',
          borderBottom: '1px solid #1e293b',
          textAlign: 'center'
        }}>
          <div style={{
            width: sidebarOpen ? '60px' : '40px',
            height: sidebarOpen ? '60px' : '40px',
            background: '#1e3a8a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: sidebarOpen ? '24px' : '18px'
          }}>
            👨‍💼
          </div>
          {sidebarOpen && (
            <>
              <h4 style={{ margin: '10px 0 5px' }}>{user?.name || 'Admin'}</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Administrator</p>
            </>
          )}
        </div>

        <nav className="sidebar-nav" style={{ padding: '20px 10px' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="sidebar-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                color: '#cbd5e1',
                textDecoration: 'none',
                borderRadius: '10px',
                marginBottom: '5px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1e293b';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 15px',
              color: '#f87171',
              textDecoration: 'none',
              borderRadius: '10px',
              marginTop: '20px',
              width: '100%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#7f1d1d';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#f87171';
            }}
          >
            <span style={{ fontSize: '20px' }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: sidebarOpen ? '280px' : '70px',
        flex: 1,
        transition: 'all 0.3s ease',
        background: '#f1f5f9',
        minHeight: '100vh'
      }}>
        {/* Top Header */}
        <header style={{
          background: 'white',
          padding: '15px 25px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 99
        }}>
          <h1 style={{ fontSize: '20px', margin: 0, color: '#1e293b' }}>
            Welcome back, {user?.name || 'Admin'}!
          </h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button onClick={handleLogout} className="btn-logout" style={{ padding: '6px 15px' }}>Logout</button>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={{ padding: '25px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '16px', borderLeft: `4px solid #1e3a8a` }}>
              <div style={{ fontSize: '28px' }}>👨‍🎓</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>{stats.totalStudents}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Total Students</div>
            </div>
            
            <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '16px', borderLeft: `4px solid #f59e0b` }}>
              <div style={{ fontSize: '28px' }}>📝</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>{stats.totalAssignments}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Assignments</div>
            </div>
            
            <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '16px', borderLeft: `4px solid #ef4444` }}>
              <div style={{ fontSize: '28px' }}>⚠️</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>{stats.pendingComplaints}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Pending Complaints</div>
            </div>
            
            <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '16px', borderLeft: `4px solid #10b981` }}>
              <div style={{ fontSize: '28px' }}>💬</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>{stats.totalFeedback}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Feedback Received</div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '15px', color: '#1e3a8a' }}>📚 Manage Students</h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Add, edit, or remove students. Reset passwords and manage student profiles.</p>
              <Link to="/admin/students">
                <button className="btn-primary" style={{ width: '100%' }}>Go to Students →</button>
              </Link>
            </div>

            <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '15px', color: '#f59e0b' }}>📝 Manage Assignments</h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Create assignments for students, track submissions, and grade work.</p>
              <Link to="/admin/assignments">
                <button className="btn-primary" style={{ width: '100%', background: '#f59e0b' }}>Go to Assignments →</button>
              </Link>
            </div>

            <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '15px', color: '#8b5cf6' }}>📚 Study Material</h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Upload notes, PDFs, and other learning resources for students.</p>
              <Link to="/admin/study-material">
                <button className="btn-primary" style={{ width: '100%', background: '#8b5cf6' }}>Go to Study Material →</button>
              </Link>
            </div>

            <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '15px', color: '#ef4444' }}>📈 Progress Tracking</h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Update student attendance, marks, and overall progress.</p>
              <Link to="/admin/progress">
                <button className="btn-primary" style={{ width: '100%', background: '#ef4444' }}>Go to Progress →</button>
              </Link>
            </div>

            <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '15px', color: '#06b6d4' }}>💬 Feedback & Complaints</h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Review student feedback and respond to complaints.</p>
              <Link to="/admin/feedback">
                <button className="btn-primary" style={{ width: '100%', background: '#06b6d4' }}>Go to Feedback →</button>
              </Link>
            </div>

            <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '15px', color: '#6366f1' }}>💼 Job Opportunities</h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Post job openings and opportunities for students.</p>
              <Link to="/admin/jobs">
                <button className="btn-primary" style={{ width: '100%', background: '#6366f1' }}>Go to Jobs →</button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;