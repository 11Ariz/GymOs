import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MemberProvider } from './context/MemberContext';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Reminders } from './pages/Reminders';
import './App.css';

const App: React.FC = () => {
  return (
    <MemberProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="reminders" element={<Reminders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MemberProvider>
  );
};

export default App;
