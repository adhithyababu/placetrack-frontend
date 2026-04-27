import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';
import StudentRegister from './pages/auth/StudentRegister';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentJobs from './pages/student/StudentJobs';
import StudentApplications from './pages/student/StudentApplications';
import StudentProfile from './pages/student/StudentProfile';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<StudentRegister />} />

          {/* Student */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/jobs" element={
            <ProtectedRoute role="student"><StudentJobs /></ProtectedRoute>
          } />
          <Route path="/student/applications" element={
            <ProtectedRoute role="student"><StudentApplications /></ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/jobs" element={
            <ProtectedRoute role="admin"><AdminJobs /></ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute role="admin"><AdminApplications /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
