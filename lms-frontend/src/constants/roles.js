/**
 * LMS Role Definitions (3 Roles Hierarchy)
 * 1. SUPER_ADMIN: Full system control & configuration
 * 2. SUB_ADMIN: Business & lead operations management
 * 3. CALLER: Lead operations & follow-up execution
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUB_ADMIN: 'SUB_ADMIN',
  CALLER: 'CALLER',

  // Aliases for compatibility
  ADMIN: 'SUB_ADMIN',
  TELECALLER: 'CALLER'
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.SUB_ADMIN]: 'Sub Admin',
  [ROLES.CALLER]: 'Caller / Telecaller'
};

export const DEFAULT_REDIRECTS = {
  [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
  [ROLES.SUB_ADMIN]: '/admin/dashboard',
  [ROLES.CALLER]: '/caller/dashboard'
};

export default ROLES;
