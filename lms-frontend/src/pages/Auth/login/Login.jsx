import React from 'react';
import LoginHeroSection from './components/LoginHeroSection';
import LoginForm from './components/LoginForm';

/**
 * Login Page Container (LMS PART 1 - Screen 1)
 * Guaranteed 1-Screen Fit (Zero Scroll on any viewport):
 * - height: 100vh, overflow: hidden
 * - 50/50 balance between Hero and Authentication form
 */
export const Login = () => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      maxHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Left Hero Section (Expanded prominent villa photo & light bespoke logo) */}
      <LoginHeroSection />

      {/* Right Login Section (Perfect vertical fit, zero cutoff, zero scroll) */}
      <div style={{
        flex: '1 1 50%',
        height: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 32px',
        backgroundColor: '#FFFFFF',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
