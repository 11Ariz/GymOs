import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}>
        <Header />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
