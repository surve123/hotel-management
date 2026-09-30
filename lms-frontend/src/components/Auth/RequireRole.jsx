import React from 'react';
import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS, DEFAULT_REDIRECTS } from '../../constants/roles';

/**
 * RequireRole Guard
 * Secures routes based on the 3 LMS roles:
 * - SUPER_ADMIN
 * - SUB_ADMIN
 * - CALLER
 * 
 * If unauthenticated -> Redirects to /login.
 * If unauthorized -> Shows branded 403 Forbidden Barrier with fallback navigation.
 */
export const RequireRole = ({ allowedRoles = [] }) => {
  const { isAuthenticated, role, user, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Authentication Check
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Authorization Check
  const isAuthorized = allowedRoles.length === 0 || allowedRoles.includes(role);

  if (!isAuthorized) {
    const defaultHome = DEFAULT_REDIRECTS[role] || '/admin/dashboard';
    const requiredRoleNames = allowedRoles.map(r => ROLE_LABELS[r] || r).join(' or ');
    const currentRoleName = ROLE_LABELS[role] || role;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: '24px'
      }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #FEE2E2',
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.08), 0 8px 10px -6px rgba(239, 68, 68, 0.04)',
          padding: '36px 32px',
          textAlign: 'center'
        }}>
          {/* Red Shield Alert Crest */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: '#FEF2F2',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            border: '1px solid #FCA5A5'
          }}>
            <ShieldAlert size={32} strokeWidth={2.2} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
            403: Access Restricted
          </h2>

          <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            You do not have permission to view this section. This resource is restricted to <strong>{requiredRoleNames}</strong>.
          </p>

          {/* Current Role Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: '#F1F5F9',
            border: '1px solid #E2E8F0',
            fontSize: '0.8rem',
            color: '#334155',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <span>Logged in as:</span>
            <span style={{
              color: user?.badgeColor || '#2563EB',
              fontWeight: 700
            }}>
              {currentRoleName}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigate(defaultHome)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '11px 20px',
                borderRadius: '8px',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 86, 240, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowLeft size={16} />
              <span>Return to My Authorized Workspace</span>
            </button>

            {/* Quick Role Switcher for Dev/Testing */}
            {allowedRoles[0] && (
              <button
                type="button"
                onClick={() => {
                  switchRole(allowedRoles[0]);
                  navigate(location.pathname);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <RefreshCw size={14} />
                <span>Switch to {ROLE_LABELS[allowedRoles[0]] || allowedRoles[0]} (Test Access)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default RequireRole;
