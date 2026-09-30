import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Main Application Layout Shell
 * - Fixed full-height sidebar on the left (matches Login page background)
 * - Scrollable main content area with proper offset
 * - Zero-scroll viewport fitting for executive reports pages
 */
export const Layout = () => {
  const location = useLocation();
  const isReportsPage = location.pathname.includes('/reports');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Fixed Full-Height Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by 230px sidebar width) */}
      <div style={{
        flex: 1,
        marginLeft: '230px',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC'
      }}>
        <Navbar />
        <main style={{
          flex: 1,
          padding: isReportsPage ? '18px 24px' : '24px 28px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
