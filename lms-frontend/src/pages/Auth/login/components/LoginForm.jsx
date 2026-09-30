import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { ROLES } from '../../../../constants/roles';
import { CLIENT_CONFIG } from '../../../../config/clientConfig';
import Button from '../../../../components/Common/Button';

/**
 * Authentication Form Component
 * Clean, focused email & password sign-in.
 * Integrated with Spring Boot REST API & JWT authentication.
 */
export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@aranavee.com');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState(ROLES.SUPER_ADMIN);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === ROLES.CALLER) {
      setEmail('neha@aranavee.com');
      setPassword('telecaller123');
    } else if (role === ROLES.SUB_ADMIN) {
      setEmail('manager@aranavee.com');
      setPassword('manager123');
    } else {
      setEmail('admin@aranavee.com');
      setPassword('admin123');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const redirectPath = await login({ usernameOrEmail: email, password }, selectedRole);
      setIsLoading(false);
      navigate(redirectPath);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Invalid username/email or password. Please try again.');
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.15,
          marginBottom: '4px'
        }}>
          Welcome Back
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748B',
          fontWeight: 400,
          margin: 0
        }}>
          Sign in to your account to continue
        </p>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#B91C1C',
          fontSize: '0.825rem',
          fontWeight: 500,
          marginBottom: '16px'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Test Persona Selector (Discrete Pill Bar) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '3px 4px',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '6px' }}>
          <ShieldCheck size={13} color="#64748B" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>
            DEMO ACCOUNT:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[
            { id: ROLES.SUPER_ADMIN, label: 'Super Admin' },
            { id: ROLES.SUB_ADMIN, label: 'Manager' },
            { id: ROLES.CALLER, label: 'Telecaller' }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRoleSelect(r.id)}
              style={{
                padding: '3px 9px',
                borderRadius: '5px',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: selectedRole === r.id ? CLIENT_CONFIG.branding.primaryBlue : 'transparent',
                color: selectedRole === r.id ? '#FFFFFF' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLoginSubmit}>
        {/* Email or Username Field */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '6px'
          }}>
            Enter your email or username
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0 12px',
            backgroundColor: '#FFFFFF',
            height: '42px'
          }}>
            <User size={16} color="#94A3B8" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aranavee.com"
              style={{
                width: '100%',
                padding: '8px 10px',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.875rem',
                color: '#0F172A'
              }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '6px'
          }}>
            Enter your password
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0 12px',
            backgroundColor: '#FFFFFF',
            height: '42px'
          }}>
            <Lock size={16} color="#94A3B8" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '8px 10px',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.875rem',
                color: '#0F172A'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: '#475569',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: '15px',
                height: '15px',
                accentColor: CLIENT_CONFIG.branding.primaryBlue,
                cursor: 'pointer'
              }}
            />
            <span>Remember me</span>
          </label>

          <a
            href="#forgot"
            onClick={(e) => { e.preventDefault(); alert("Password reset instructions will be sent to your email."); }}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: CLIENT_CONFIG.branding.primaryBlue,
              textDecoration: 'none'
            }}
          >
            Forgot password?
          </a>
        </div>

        {/* Primary Action Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          style={{ padding: '11px 18px', fontSize: '0.92rem' }}
        >
          Login to LMS
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
