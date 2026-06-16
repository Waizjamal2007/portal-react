import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentLogin from './pages/student/StudentLogin';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentStudyMaterial from './pages/student/StudentStudyMaterial';
import StudentAcademics from './pages/student/StudentAcademics';
import StudentFeedback from './pages/student/StudentFeedback';
import StudentComplaints from './pages/student/StudentComplaints';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageAssignments from './pages/admin/ManageAssignments';
import ManageStudyMaterial from './pages/admin/ManageStudyMaterial';
import ViewFeedback from './pages/admin/ViewFeedback';
import ViewComplaints from './pages/admin/ViewComplaints';
import ManageJobs from './pages/admin/ManageJobs';
import StudentProgress from './pages/admin/StudentProgress';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/student/login" element={
          !isAuthenticated ? 
          <StudentLogin onLogin={handleLogin} /> : 
          user?.role === 'student' ? <Navigate to="/student/dashboard" /> : <Navigate to="/admin/dashboard" />
        } />
        <Route path="/student/dashboard" element={
          isAuthenticated && user?.role === 'student' ? 
          <StudentDashboard user={user} onLogout={handleLogout} /> : 
          <Navigate to="/student/login" />
        } />
        <Route path="/student/study-material" element={
          isAuthenticated && user?.role === 'student' ? 
          <StudentStudyMaterial user={user} onLogout={handleLogout} /> : 
          <Navigate to="/student/login" />
        } />
        <Route path="/student/academics" element={
          isAuthenticated && user?.role === 'student' ? 
          <StudentAcademics user={user} onLogout={handleLogout} /> : 
          <Navigate to="/student/login" />
        } />
        <Route path="/student/feedback" element={
          isAuthenticated && user?.role === 'student' ? 
          <StudentFeedback user={user} onLogout={handleLogout} /> : 
          <Navigate to="/student/login" />
        } />
        <Route path="/student/complaints" element={
          isAuthenticated && user?.role === 'student' ? 
          <StudentComplaints user={user} onLogout={handleLogout} /> : 
          <Navigate to="/student/login" />
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={
          !isAuthenticated ? 
          <AdminLogin onLogin={handleLogin} /> : 
          user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/student/dashboard" />
        } />
        <Route path="/admin/dashboard" element={
          isAuthenticated && user?.role === 'admin' ? 
          <AdminDashboard user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" />
        } />
        <Route path="/admin/students" element={
          isAuthenticated && user?.role === 'admin' ? 
          <ManageStudents user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" />
        } />
        <Route path="/admin/assignments" element={
          isAuthenticated && user?.role === 'admin' ? 
          <ManageAssignments user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" />
        } />
        <Route path="/admin/study-material" element={
          isAuthenticated && user?.role === 'admin' ? 
          <ManageStudyMaterial user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" />
        } />
        <Route path="/admin/feedback" element={
          isAuthenticated && user?.role === 'admin' ? 
          <ViewFeedback user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" />
        } />
        <Route path="/admin/complaints" element={
          isAuthenticated && user?.role === 'admin' ? 
          <ViewComplaints user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" />
        } />
        <Route path="/admin/jobs" element={
          isAuthenticated && user?.role === 'admin' ? 
          <ManageJobs user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" />
        } />
        <Route path="/admin/progress" element={
          isAuthenticated && user?.role === 'admin' ? 
          <StudentProgress user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" />
        } />
        
        <Route path="/" element={<Navigate to="/student/login" />} />
      </Routes>
    </Router>
  );
}

export default App;