import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MemberProvider } from './context/MemberContext';
import { MainLayout } from './components/layout/MainLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Superadmin } from './pages/Superadmin';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Reminders } from './pages/Reminders';
import { Toaster } from 'react-hot-toast';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roleRequired?: string }> = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MemberProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/superadmin" element={
              <ProtectedRoute roleRequired="SUPERADMIN">
                <Superadmin />
              </ProtectedRoute>
            } />

            <Route path="/" element={
              <ProtectedRoute roleRequired="GYM_OWNER">
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="reminders" element={<Reminders />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </MemberProvider>
    </AuthProvider>
  );
};

export default App;
