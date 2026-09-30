import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  Headphones,
  Eye,
  Plus,
  Check,
  X,
  Info,
  Save,
  RotateCcw,
  CheckCircle2,
  Users,
  Search,
  KeyRound
} from 'lucide-react';
import userService from '../../services/userService';
import permissionService, {
  DEFAULT_ROLE_PERMISSIONS,
  DEFAULT_PERMISSIONS_LIST,
  STANDARD_ROLE_KEYS,
  normalizeRoleKey
} from '../../services/permissionService';

/**
 * Roles & Permissions Page Component (LMS System Settings)
 * Features:
 * 1. Live system users count & avatars
 * 2. Full permission matrix for Super Admin, Sub Admin, Telecaller, Viewer & Custom Roles
 * 3. Toggle & Activate / Deactivate any permission
 * 4. Create Custom Permissions (+ Add Permission)
 * 5. Create Custom Roles (+ Add Role)
 * 6. Persistent state with live app enforcement
 */
export const RolesPermissionsPage = () => {
  const [selectedRoleId, setSelectedRoleId] = useState('super-admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isAddPermissionModalOpen, setIsAddPermissionModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newPermissionLabel, setNewPermissionLabel] = useState('');
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to extract clean initials from user full name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Base role definitions
  const initialRolesStructure = {
    'super-admin': {
      id: 'super-admin',
      name: 'Super Admin',
      badge: 'Full Access',
      usersCount: 0,
      icon: ShieldCheck,
      color: '#DC2626',
      bg: '#FEF2F2',
      summary: 'Complete system control & configuration',
      description: 'Master administrative access across all properties, bookings, financial reports, user management, and system-wide configurations.',
      notice: 'This role has unrestricted system access. All permissions can be toggled or configured as desired.',
      users: [],
      extraUsersCount: 0,
      permissions: { ...DEFAULT_ROLE_PERMISSIONS['super-admin'] }
    },
    'sub-admin': {
      id: 'sub-admin',
      name: 'Sub Admin',
      badge: 'Management',
      usersCount: 0,
      icon: Shield,
      color: '#1E56F0',
      bg: '#EFF6FF',
      summary: 'Operations, properties & report management',
      description: 'Supervises lead pipeline, manages properties, handles booking operations, and reviews operational performance reports.',
      notice: 'Sub Admins manage day-to-day business operations but cannot modify system security or delete audit logs.',
      users: [],
      extraUsersCount: 0,
      permissions: { ...DEFAULT_ROLE_PERMISSIONS['sub-admin'] }
    },
    telecaller: {
      id: 'telecaller',
      name: 'Telecaller',
      badge: 'Operations',
      usersCount: 0,
      icon: Headphones,
      color: '#059669',
      bg: '#ECFDF5',
      summary: 'Assigned leads, calls & follow-ups',
      description: 'Engages prospective clients, logs call outcomes, schedules personal follow-up meetings, and initiates customer booking requests.',
      notice: 'Telecallers only have access to their assigned leads and cannot view global revenue reports or user settings.',
      users: [],
      extraUsersCount: 0,
      permissions: { ...DEFAULT_ROLE_PERMISSIONS['telecaller'] }
    },
    viewer: {
      id: 'viewer',
      name: 'Viewer / Auditor',
      badge: 'Read-only',
      usersCount: 0,
      icon: Eye,
      color: '#D97706',
      bg: '#FEF3C7',
      summary: 'Read-only viewing privileges',
      description: 'Audit and monitoring account with read-only access to view dashboards, leads, and properties without edit permissions.',
      notice: 'Read-only account. Modification, assignment, deletion, and settings configuration are restricted.',
      users: [],
      extraUsersCount: 0,
      permissions: { ...DEFAULT_ROLE_PERMISSIONS['viewer'] }
    }
  };

  const [rolesData, setRolesData] = useState(initialRolesStructure);

  // Load saved permissions on mount
  useEffect(() => {
    const loadSavedPermissions = async () => {
      try {
        const savedPerms = await permissionService.getPermissions();
        if (savedPerms && typeof savedPerms === 'object') {
          setRolesData((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((roleId) => {
              const perms = savedPerms[roleId] || DEFAULT_ROLE_PERMISSIONS[roleId];
              if (perms && Object.keys(perms).length > 0) {
                next[roleId] = {
                  ...next[roleId],
                  permissions: {
                    ...DEFAULT_ROLE_PERMISSIONS[roleId],
                    ...perms
                  }
                };
              }
            });

            // Also load any custom roles (excluding standard role variations)
            Object.keys(savedPerms).forEach((roleId) => {
              const normalized = normalizeRoleKey(roleId);
              if (!STANDARD_ROLE_KEYS.includes(normalized) && !next[roleId]) {
                next[roleId] = {
                  id: roleId,
                  name: roleId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                  badge: 'Custom',
                  usersCount: 0,
                  icon: Shield,
                  color: '#2563EB',
                  bg: '#EFF6FF',
                  summary: 'Custom defined role permissions',
                  description: 'Custom role configured in the system.',
                  notice: 'Custom role with tailored permissions.',
                  users: [],
                  extraUsersCount: 0,
                  permissions: savedPerms[roleId] || {}
                };
              }
            });

            return next;
          });
        }
      } catch (err) {
        console.error('Failed to load saved permissions:', err);
      }
    };

    loadSavedPermissions();
  }, []);

  // Sync actual user counts and assigned avatars from live backend
  useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        const users = await userService.getUsers();
        if (Array.isArray(users)) {
          const superAdminUsers = users
            .filter((u) => u.role === 'ROLE_SUPER_ADMIN' || u.role === 'SUPER_ADMIN')
            .map((u) => ({
              name: u.fullName || u.username,
              avatar: getInitials(u.fullName || u.username),
              bg: '#FEE2E2',
              color: '#DC2626'
            }));

          const subAdminUsers = users
            .filter((u) => u.role === 'ROLE_ADMIN' || u.role === 'ROLE_SUB_ADMIN' || u.role === 'SUB_ADMIN' || u.role === 'ADMIN')
            .map((u) => ({
              name: u.fullName || u.username,
              avatar: getInitials(u.fullName || u.username),
              bg: '#DBEAFE',
              color: '#1E56F0'
            }));

          const telecallerUsers = users
            .filter((u) => u.role === 'ROLE_TELECALLER' || u.role === 'CALLER')
            .map((u) => ({
              name: u.fullName || u.username,
              avatar: getInitials(u.fullName || u.username),
              bg: '#D1FAE5',
              color: '#059669'
            }));

          setRolesData((prev) => ({
            ...prev,
            'super-admin': {
              ...prev['super-admin'],
              usersCount: superAdminUsers.length,
              users: superAdminUsers.slice(0, 3),
              extraUsersCount: Math.max(0, superAdminUsers.length - 3)
            },
            'sub-admin': {
              ...prev['sub-admin'],
              usersCount: subAdminUsers.length,
              users: subAdminUsers.slice(0, 3),
              extraUsersCount: Math.max(0, subAdminUsers.length - 3)
            },
            telecaller: {
              ...prev.telecaller,
              usersCount: telecallerUsers.length,
              users: telecallerUsers.slice(0, 3),
              extraUsersCount: Math.max(0, telecallerUsers.length - 3)
            },
            viewer: {
              ...prev.viewer,
              usersCount: 0,
              users: [],
              extraUsersCount: 0
            }
          }));
        }
      } catch (err) {
        console.error('Failed to load live users for roles matrix:', err);
      }
    };

    fetchLiveUsers();
  }, []);

  const activeRole = rolesData[selectedRoleId] || rolesData['super-admin'] || initialRolesStructure['super-admin'];

  const currentPermissions = useMemo(() => {
    return activeRole?.permissions || DEFAULT_ROLE_PERMISSIONS[selectedRoleId] || DEFAULT_ROLE_PERMISSIONS['super-admin'];
  }, [activeRole, selectedRoleId]);

  // Filter permissions by search query
  const filteredPermissions = useMemo(() => {
    const entries = Object.entries(currentPermissions);
    if (!searchQuery.trim()) return entries;
    return entries.filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase().trim()));
  }, [currentPermissions, searchQuery]);

  // Toggle single permission for the active role
  const handleTogglePermission = (feature) => {
    setRolesData((prev) => {
      const currentRoleObj = prev[selectedRoleId] || initialRolesStructure[selectedRoleId];
      const rolePerms = currentRoleObj.permissions || {};
      return {
        ...prev,
        [selectedRoleId]: {
          ...currentRoleObj,
          permissions: {
            ...rolePerms,
            [feature]: !rolePerms[feature]
          }
        }
      };
    });
  };

  // Select all or deselect all
  const handleSetAllPermissions = (allowed) => {
    setRolesData((prev) => {
      const currentRoleObj = prev[selectedRoleId] || initialRolesStructure[selectedRoleId];
      const updatedPermissions = {};
      Object.keys(currentRoleObj.permissions || {}).forEach((key) => {
        updatedPermissions[key] = allowed;
      });
      return {
        ...prev,
        [selectedRoleId]: {
          ...currentRoleObj,
          permissions: updatedPermissions
        }
      };
    });
  };

  // Reset to default
  const handleResetToDefault = () => {
    const defaults = DEFAULT_ROLE_PERMISSIONS[selectedRoleId] || DEFAULT_ROLE_PERMISSIONS['super-admin'];
    setRolesData((prev) => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        permissions: { ...defaults }
      }
    }));
  };

  // Save changes to permissionService (persists to backend & localStorage)
  const handleSave = async () => {
    setIsSaving(true);
    const permissionsPayload = {};
    Object.keys(rolesData).forEach((rId) => {
      permissionsPayload[rId] = rolesData[rId].permissions;
    });

    await permissionService.savePermissions(permissionsPayload);
    setIsSaving(false);
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
    }, 3000);
  };

  // Add custom role
  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const newId = newRoleName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Copy base permissions template
    const templatePerms = { ...DEFAULT_ROLE_PERMISSIONS['telecaller'] };

    setRolesData((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        name: newRoleName.trim(),
        badge: 'Custom',
        usersCount: 0,
        icon: Shield,
        color: '#2563EB',
        bg: '#EFF6FF',
        summary: newRoleDesc.trim() || 'Custom role permissions',
        description: newRoleDesc.trim() || 'Custom role configured for specific team access.',
        notice: 'Custom created role. Adjust permissions as needed.',
        users: [],
        extraUsersCount: 0,
        permissions: templatePerms
      }
    }));
    setSelectedRoleId(newId);
    setIsAddRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  // Create new custom permission
  const handleCreatePermission = (e) => {
    e.preventDefault();
    if (!newPermissionLabel.trim()) return;
    const label = newPermissionLabel.trim();

    setRolesData((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((rId) => {
        next[rId] = {
          ...next[rId],
          permissions: {
            ...next[rId].permissions,
            [label]: rId === 'super-admin'
          }
        };
      });
      return next;
    });

    setIsAddPermissionModalOpen(false);
    setNewPermissionLabel('');
  };

  return (
    <div style={{
      boxSizing: 'border-box',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      paddingBottom: '24px'
    }}>
      
      {/* 1. Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Roles &amp; Permissions
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '3px 0 0 0' }}>
            Manage role-based access control, active/deactive authorizations, and custom permissions.
          </p>
        </div>

        {/* Action Buttons: Add Role & Add Permission */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsAddPermissionModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              color: '#1E56F0',
              border: '1px solid #BFDBFE',
              borderRadius: '6px',
              padding: '7px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            <KeyRound size={14} />
            <span>+ Add Permission</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddRoleModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1E56F0',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(30, 86, 240, 0.2)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E56F0'}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>+ Add Role</span>
          </button>
        </div>
      </div>

      {/* 2. Top Role Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px'
      }}>
        {Object.values(rolesData).slice(0, 4).map((role) => {
          const Icon = role.icon || Shield;
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '14px 16px',
                border: isSelected ? `2px solid ${role.color}` : '1px solid #E2E8F0',
                boxShadow: isSelected ? '0 4px 12px rgba(30, 86, 240, 0.08)' : '0 1px 2px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: role.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: role.color,
                flexShrink: 0
              }}>
                <Icon size={19} strokeWidth={2.2} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    {role.name}
                  </h3>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: role.bg,
                    color: role.color,
                    fontWeight: 700
                  }}>
                    {role.badge}
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '3px 0 6px 0', lineHeight: 1.3 }}>
                  {role.summary}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} color={role.color} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: role.color }}>
                    {role.usersCount} {role.usersCount === 1 ? 'user' : 'users'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main 3-Column Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr 280px',
        gap: '14px',
        alignItems: 'stretch'
      }}>
        
        {/* Column 1: Roles List Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
            System Roles
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            {Object.values(rolesData).map((role) => {
              const Icon = role.icon || Shield;
              const isSelected = selectedRoleId === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                    border: isSelected ? '1px solid #BFDBFE' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      backgroundColor: role.bg,
                      color: role.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={14} />
                    </div>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#1E40AF' : '#1E293B'
                    }}>
                      {role.name}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    color: isSelected ? '#1E40AF' : '#64748B',
                    fontWeight: 600
                  }}>
                    {role.usersCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Permissions Matrix Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}>
          {/* Header with Title and Search / Bulk actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {activeRole.name} Permissions
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Toggle &amp; active/deactive permissions for {activeRole.name}.
              </p>
            </div>

            {/* Quick Actions & Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '3px 8px',
                width: '130px'
              }}>
                <Search size={12} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.72rem',
                    width: '100%'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleSetAllPermissions(true)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#059669',
                  cursor: 'pointer'
                }}
              >
                Allow All
              </button>
              <button
                type="button"
                onClick={() => handleSetAllPermissions(false)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#DC2626',
                  cursor: 'pointer'
                }}
              >
                Restrict All
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                title="Reset to default permissions"
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Permissions Table */}
          <div style={{ flex: 1, maxHeight: '380px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 5 }}>
                  <th style={{ padding: '8px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Feature / Module Authorization
                  </th>
                  <th style={{ padding: '8px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>
                    Access Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '0.78rem' }}>
                      No matching permissions found.
                    </td>
                  </tr>
                ) : (
                  filteredPermissions.map(([feature, isAllowed], idx) => (
                    <tr
                      key={feature}
                      style={{
                        borderBottom: idx === filteredPermissions.length - 1 ? 'none' : '1px solid #F1F5F9'
                      }}
                    >
                      <td style={{ padding: '9px 10px', fontSize: '0.78rem', fontWeight: 500, color: '#1E293B' }}>
                        {feature}
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(feature)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '5px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: isAllowed ? '1px solid #A7F3D0' : '1px solid #FECACA',
                            backgroundColor: isAllowed ? '#ECFDF5' : '#FEF2F2',
                            color: isAllowed ? '#059669' : '#DC2626',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isAllowed ? (
                            <>
                              <Check size={12} strokeWidth={2.5} color="#059669" />
                              <span>Allowed (Active)</span>
                            </>
                          ) : (
                            <>
                              <X size={12} strokeWidth={2.5} color="#DC2626" />
                              <span>Restricted (Deactive)</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Save Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid #F1F5F9',
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
              {Object.values(currentPermissions).filter(Boolean).length} of {Object.values(currentPermissions).length} permissions active
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {saveFeedback && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#059669',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#ECFDF5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #A7F3D0'
                }}>
                  <CheckCircle2 size={14} />
                  <span>Permissions saved &amp; enforced!</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#1E56F0',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 16px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(30, 86, 240, 0.2)',
                  transition: 'background-color 0.15s ease',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                <Save size={13} />
                <span>{isSaving ? 'Saving...' : 'Save Permissions'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Role Details Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
              Role Details
            </h3>

            {/* Field: Role Name */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Role Name
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                  {activeRole.name}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: activeRole.bg,
                  color: activeRole.color,
                  fontWeight: 700
                }}>
                  {activeRole.badge}
                </span>
              </div>
            </div>

            {/* Field: Description */}
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Description
              </span>
              <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '3px', lineHeight: 1.4 }}>
                {activeRole.description}
              </div>
            </div>

            {/* Field: Users with this role */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Assigned Users ({activeRole.usersCount})
              </span>
              {activeRole.users.length === 0 ? (
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '6px', fontStyle: 'italic' }}>
                  No users assigned to this role yet.
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  {activeRole.users.map((u, i) => (
                    <div
                      key={i}
                      title={u.name}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: u.bg,
                        color: u.color,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                      }}
                    >
                      {u.avatar}
                    </div>
                  ))}
                  {activeRole.extraUsersCount > 0 && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      color: '#64748B',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFFFFF'
                    }}>
                      +{activeRole.extraUsersCount}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info Callout Box */}
          <div style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '6px',
            border: '1px solid #BFDBFE',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Info size={15} color="#1E56F0" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.72rem', color: '#1E40AF', margin: 0, lineHeight: 1.35 }}>
              {activeRole.notice}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Add Role Modal Dialog */}
      {isAddRoleModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            width: '420px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Create New Role
              </h3>
              <button
                type="button"
                onClick={() => setIsAddRoleModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRole} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reservation Specialist"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the responsibilities of this role..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddRoleModalOpen(false)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1E56F0',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 16px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Custom Permission Modal Dialog */}
      {isAddPermissionModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            width: '420px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Create New Permission
              </h3>
              <button
                type="button"
                onClick={() => setIsAddPermissionModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePermission} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Permission Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Export Customer Excel Reports"
                  value={newPermissionLabel}
                  onChange={(e) => setNewPermissionLabel(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddPermissionModalOpen(false)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1E56F0',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 16px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  Create Permission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsPage;
