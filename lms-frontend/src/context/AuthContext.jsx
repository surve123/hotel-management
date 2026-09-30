import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ROLES, DEFAULT_REDIRECTS } from '../constants/roles';
import authService from '../services/authService';
import permissionService from '../services/permissionService';
import { TOKEN_KEY } from '../services/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'arnavee_auth_session_v2';

const mapBackendRole = (backendRole) => {
  if (!backendRole) return ROLES.SUPER_ADMIN;
  if (backendRole.includes('SUPER_ADMIN')) return ROLES.SUPER_ADMIN;
  if (backendRole.includes('ADMIN')) return ROLES.SUB_ADMIN;
  if (backendRole.includes('TELECALLER') || backendRole.includes('CALLER')) return ROLES.CALLER;
  return ROLES.SUPER_ADMIN;
};

export const AuthProvider = ({ children }) => {
  const [permissionsVersion, setPermissionsVersion] = useState(0);

  const [authState, setAuthState] = useState(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (token && saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated && parsed.user) {
          return {
            isAuthenticated: true,
            role: parsed.role || ROLES.SUPER_ADMIN,
            user: parsed.user
          };
        }
      }
    } catch {
      // Ignore parse errors
    }
    // Clear any stale partial session
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch {}

    return {
      isAuthenticated: false,
      role: null,
      user: null
    };
  });

  useEffect(() => {
    const syncPermissionsFromBackend = async () => {
      try {
        await permissionService.getPermissions();
        setPermissionsVersion((v) => v + 1);
      } catch (err) {
        console.warn('Failed to sync permissions in AuthContext:', err);
      }
    };

    // Immediate sync on load
    syncPermissionsFromBackend();

    const handlePermissionsUpdated = () => {
      setPermissionsVersion((v) => v + 1);
    };

    window.addEventListener('arnavee_permissions_updated', handlePermissionsUpdated);
    window.addEventListener('storage', handlePermissionsUpdated);
    window.addEventListener('focus', syncPermissionsFromBackend);

    return () => {
      window.removeEventListener('arnavee_permissions_updated', handlePermissionsUpdated);
      window.removeEventListener('storage', handlePermissionsUpdated);
      window.removeEventListener('focus', syncPermissionsFromBackend);
    };
  }, []);

  useEffect(() => {
    try {
      if (authState.isAuthenticated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [authState]);

  /**
   * Check if current active user role has a permission
   */
  const hasPermission = useCallback((permissionKey) => {
    if (!authState.role) return false;
    return permissionService.checkPermission(authState.role, permissionKey);
  }, [authState.role, permissionsVersion]);

  /**
   * Quick Role Switcher for testing (requires valid active session)
   */
  const switchRole = (newRole) => {
    const updatedUser = {
      ...(authState.user || {}),
      role: newRole,
      fullName: authState.user?.fullName || (newRole === ROLES.SUPER_ADMIN ? 'Super Admin' : (newRole === ROLES.SUB_ADMIN ? 'Property Manager' : 'Telecaller'))
    };

    setAuthState({
      isAuthenticated: true,
      role: newRole,
      user: updatedUser
    });
    return DEFAULT_REDIRECTS[newRole] || '/admin/dashboard';
  };

  /**
   * Live Backend Login with JWT authentication
   */
  const login = async (credentials = {}) => {
    const usernameOrEmail = credentials.usernameOrEmail || credentials.email || credentials.username || '';
    const password = credentials.password || '';

    // Authenticate with Spring Boot backend
    const authData = await authService.login({ usernameOrEmail, password });
    const frontendRole = mapBackendRole(authData.role);

    const userProfile = {
      id: authData.userId || 'usr_' + (authData.username || 'user'),
      username: authData.username,
      fullName: authData.fullName || authData.username || 'User',
      email: authData.email,
      role: frontendRole,
      initials: (authData.fullName || authData.username || 'AH').substring(0, 2).toUpperCase(),
      badgeColor: frontendRole === ROLES.SUPER_ADMIN ? '#EF4444' : (frontendRole === ROLES.SUB_ADMIN ? '#2563EB' : '#10B981')
    };

    setAuthState({
      isAuthenticated: true,
      role: frontendRole,
      user: userProfile
    });

    return DEFAULT_REDIRECTS[frontendRole] || '/admin/dashboard';
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      isAuthenticated: false,
      role: null,
      user: null
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: authState.isAuthenticated,
      role: authState.role,
      user: authState.user,
      hasPermission,
      switchRole,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;

