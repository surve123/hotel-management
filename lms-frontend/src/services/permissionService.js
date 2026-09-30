import api from './api';
import { ROLES } from '../constants/roles';

export const PERMISSIONS_STORAGE_KEY = 'arnavee_role_permissions_v3';

export const DEFAULT_PERMISSIONS_LIST = [
  'View all leads',
  'Add new leads',
  'Edit lead details',
  'Delete leads',
  'Assign & reassign leads',
  'Schedule follow-ups',
  'Manage bookings',
  'Add & edit properties',
  'View revenue reports',
  'Telecaller analytics',
  'User management',
  'System settings & configuration'
];

export const DEFAULT_ROLE_PERMISSIONS = {
  'super-admin': {
    'View all leads': true,
    'Add new leads': true,
    'Edit lead details': true,
    'Delete leads': true,
    'Assign & reassign leads': true,
    'Schedule follow-ups': true,
    'Manage bookings': true,
    'Add & edit properties': true,
    'View revenue reports': true,
    'Telecaller analytics': true,
    'User management': true,
    'System settings & configuration': true
  },
  'sub-admin': {
    'View all leads': true,
    'Add new leads': true,
    'Edit lead details': true,
    'Delete leads': false,
    'Assign & reassign leads': true,
    'Schedule follow-ups': true,
    'Manage bookings': true,
    'Add & edit properties': true,
    'View revenue reports': true,
    'Telecaller analytics': true,
    'User management': false,
    'System settings & configuration': false
  },
  'telecaller': {
    'View all leads': false,
    'Add new leads': true,
    'Edit lead details': true,
    'Delete leads': false,
    'Assign & reassign leads': false,
    'Schedule follow-ups': true,
    'Manage bookings': false,
    'Add & edit properties': false,
    'View revenue reports': false,
    'Telecaller analytics': false,
    'User management': false,
    'System settings & configuration': false
  },
  'viewer': {
    'View all leads': true,
    'Add new leads': false,
    'Edit lead details': false,
    'Delete leads': false,
    'Assign & reassign leads': false,
    'Schedule follow-ups': false,
    'Manage bookings': false,
    'Add & edit properties': false,
    'View revenue reports': true,
    'Telecaller analytics': true,
    'User management': false,
    'System settings & configuration': false
  }
};

export const STANDARD_ROLE_KEYS = ['super-admin', 'sub-admin', 'telecaller', 'viewer'];

export const normalizeRoleKey = (role) => {
  if (!role) return 'super-admin';
  const r = String(role).trim().toUpperCase();
  if (r.includes('SUPER')) return 'super-admin';
  if (r.includes('SUB') || r === 'ADMIN' || r === 'ROLE_ADMIN' || r === 'ROLE_SUB_ADMIN') return 'sub-admin';
  if (r.includes('CALLER') || r.includes('TELECALLER') || r === 'ROLE_TELECALLER') return 'telecaller';
  if (r.includes('VIEWER') || r.includes('AUDITOR')) return 'viewer';
  return String(role).toLowerCase().replace(/[^a-z0-9]+/g, '-');
};

export const permissionService = {
  /**
   * Load saved permissions from localStorage with fallback to defaults
   */
  getPermissions: async () => {
    let rawPerms = null;
    try {
      const response = await api.get('/settings/permissions');
      if (response?.data?.data && Object.keys(response.data.data).length > 0) {
        rawPerms = response.data.data;
      }
    } catch {
      // Fall back to localStorage
    }

    if (!rawPerms) {
      try {
        const saved = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            rawPerms = parsed;
          }
        }
      } catch (e) {
        console.warn('Error reading permissions from storage:', e);
      }
    }

    const merged = {
      'super-admin': { ...DEFAULT_ROLE_PERMISSIONS['super-admin'] },
      'sub-admin': { ...DEFAULT_ROLE_PERMISSIONS['sub-admin'] },
      'telecaller': { ...DEFAULT_ROLE_PERMISSIONS['telecaller'] },
      'viewer': { ...DEFAULT_ROLE_PERMISSIONS['viewer'] }
    };

    if (rawPerms) {
      Object.keys(rawPerms).forEach((key) => {
        const normalizedKey = normalizeRoleKey(key);
        if (merged[normalizedKey]) {
          merged[normalizedKey] = { ...merged[normalizedKey], ...rawPerms[key] };
        } else if (!STANDARD_ROLE_KEYS.includes(key)) {
          // Custom user created role
          merged[key] = rawPerms[key];
        }
      });
    }

    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  },

  /**
   * Save updated permissions to backend and localStorage
   */
  savePermissions: async (allRolesPermissions) => {
    try {
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(allRolesPermissions));
      
      // Dispatch custom event to notify all listening components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('arnavee_permissions_updated', { detail: allRolesPermissions }));
      }
      
      // Persist to backend
      try {
        await api.put('/settings/permissions', allRolesPermissions);
      } catch {
        // Fallback gracefully
      }

      return true;
    } catch (e) {
      console.error('Failed to save permissions:', e);
      return false;
    }
  },

  /**
   * Check if a specific role has a permission
   */
  checkPermission: (role, permissionKey) => {
    const normalized = normalizeRoleKey(role);

    try {
      const saved = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
      const permissionsMap = saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
      const rolePerms = permissionsMap[normalized] || permissionsMap[role] || DEFAULT_ROLE_PERMISSIONS[normalized];
      if (rolePerms && typeof rolePerms[permissionKey] === 'boolean') {
        return rolePerms[permissionKey];
      }
    } catch {
      // Fallback
    }

    if (normalized === 'super-admin') return true;

    const defaultPerms = DEFAULT_ROLE_PERMISSIONS[normalized] || DEFAULT_ROLE_PERMISSIONS[role];
    return defaultPerms ? !!defaultPerms[permissionKey] : false;
  }
};

export default permissionService;
