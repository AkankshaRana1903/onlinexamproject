// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages (add AdminDashboardPage import)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExamsListPage from './pages/ExamsListPage';
import ExamDetailPage from './pages/ExamDetailPage';
import TakeExamPage from './pages/TakeExamPage';
import ExamResultsPage from './pages/ExamResultsPage';
import CertificatesPage from './pages/CertificatesPage';
import ManageExamsPage from './pages/ManageExamsPage';
import CreateExamPage from './pages/CreateExamPage';
import EditExamPage from './pages/EditExamPage';
import ExamAttemptsPage from './pages/ExamAttemptsPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // New import
import StudentProfilePage from './pages/StudentProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuth();

  if (!user || !localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/exams" element={<ExamsListPage />} />
          <Route path="/exams/:examId" element={<ExamDetailPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/take-exam/:examId"
            element={
              <ProtectedRoute>
                <TakeExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-results/:attemptId"
            element={
              <ProtectedRoute>
                <ExamResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <CertificatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-exams"
            element={
              <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                <ManageExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-exam"
            element={
              <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                <CreateExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-exam/:examId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                <EditExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-attempts/:examId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                <ExamAttemptsPage />
              </ProtectedRoute>
            }
          />
          {/* New Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<StudentProfilePage />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;