import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Headphones,
  UserCog,
  UserX,
  Plus,
  Search,
  Download,
  Edit2,
  KeyRound,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

/**
 * UserManagementPage Component (LMS PART 8 - Screen 1: User Management)
 * Connected to live Spring Boot PostgreSQL User Management API.
 */
export const UserManagementPage = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Password Reset Modal State
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');

  // New User Form State
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'ROLE_TELECALLER',
    assignedProperty: 'Celebrino Garden Villa'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      if (data) setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      await userService.createUser(newUser);
      setIsAddModalOpen(false);
      setNewUser({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'ROLE_TELECALLER',
        assignedProperty: 'Celebrino Garden Villa'
      });
      fetchUsers();
    } catch (err) {
      setFormError(err.message || 'Failed to register user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await userService.toggleStatus(userId, !currentStatus);
      fetchUsers();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordModalUser || !newPasswordValue.trim()) return;
    setIsResettingPassword(true);
    setFormError('');
    try {
      await userService.resetPassword(passwordModalUser.id, newPasswordValue.trim());
      setPasswordSuccessMessage(`Password updated successfully for ${passwordModalUser.fullName}`);
      setTimeout(() => {
        setPasswordModalUser(null);
        setNewPasswordValue('');
        setPasswordSuccessMessage('');
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to update password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (selectedRole !== 'All Roles' && u.role !== selectedRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRoleBadge = (role) => {
    if (role === 'ROLE_SUPER_ADMIN') {
      return { label: 'Super Admin', bg: '#FEE2E2', color: '#B91C1C' };
    }
    if (role === 'ROLE_ADMIN') {
      return { label: 'Property Manager', bg: '#EFF6FF', color: '#1E56F0' };
    }
    return { label: 'Telecaller', bg: '#F0FDF4', color: '#16A34A' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            User & Team Management
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '3px', margin: 0 }}>
            Manage telecaller accounts, property administrators, and RBAC permissions.
          </p>
        </div>

        {hasPermission('User management') && (
          <button
            type="button"
            onClick={() => { setIsAddModalOpen(true); setFormError(''); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#1E56F0',
              color: '#FFFFFF',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(30, 86, 240, 0.25)'
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add New User</span>
          </button>
        )}
      </div>

      {/* Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
      }}>
        {/* Filter Bar */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#FAFAFA'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '0 10px',
            height: '36px',
            width: '260px'
          }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search team member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '6px 8px',
                fontSize: '0.8rem',
                width: '100%',
                color: '#0F172A'
              }}
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem' }}
          >
            <option value="All Roles">All Roles</option>
            <option value="ROLE_SUPER_ADMIN">Super Admin</option>
            <option value="ROLE_ADMIN">Property Manager</option>
            <option value="ROLE_TELECALLER">Telecaller</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                whiteSpace: 'nowrap'
              }}>
                <th style={{ padding: '10px 14px' }}>User Details</th>
                <th style={{ padding: '10px 14px' }}>Role</th>
                <th style={{ padding: '10px 14px' }}>Phone</th>
                <th style={{ padding: '10px 14px' }}>Assigned Property</th>
                <th style={{ padding: '10px 14px' }}>Active Leads</th>
                <th style={{ padding: '10px 14px' }}>Account Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                    Loading team accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const badge = getRoleBadge(u.role);
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{u.fullName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          @{u.username} • {u.email}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: badge.bg,
                          color: badge.color,
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>
                        {u.phone || '—'}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>
                        {u.assignedProperty || 'All Properties'}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1E56F0' }}>
                        {u.activeLeadsCount || 0} Leads
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: u.active ? '#DCFCE7' : '#FEE2E2',
                          color: u.active ? '#16A34A' : '#EF4444',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {u.active ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setPasswordModalUser(u);
                              setNewPasswordValue('');
                              setFormError('');
                              setPasswordSuccessMessage('');
                            }}
                            title="Change User Password"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              color: '#334155',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <KeyRound size={13} color="#64748B" />
                            <span>Password</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id, u.active)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: u.active ? '#FFF5F5' : '#F0FDF4',
                              color: u.active ? '#DC2626' : '#16A34A',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '28px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>
              Register New Team Member
            </h3>

            {formError && (
              <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '0.8rem', marginBottom: '14px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kulkarni"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Username *</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="e.g. ramesh"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g. ramesh@aranavee.com"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Password *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="e.g. 9820198201"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                >
                  <option value="ROLE_TELECALLER">Telecaller / Sales Caller</option>
                  <option value="ROLE_ADMIN">Property Manager</option>
                  <option value="ROLE_SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#1E56F0', color: '#FFFFFF', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Registering...' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change / Reset Password Modal */}
      {passwordModalUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '28px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E56F0'
              }}>
                <KeyRound size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Reset User Password
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Updating password for <strong>{passwordModalUser.fullName}</strong> (@{passwordModalUser.username})
                </p>
              </div>
            </div>

            {formError && (
              <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '0.8rem', marginBottom: '14px' }}>
                {formError}
              </div>
            )}

            {passwordSuccessMessage && (
              <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '0.8rem', marginBottom: '14px', fontWeight: 600 }}>
                {passwordSuccessMessage}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>New Password *</label>
                <input
                  type="password"
                  required
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  placeholder="Enter new strong password"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => { setPasswordModalUser(null); setNewPasswordValue(''); }}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingPassword || !newPasswordValue.trim()}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#1E56F0',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: isResettingPassword ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isResettingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;

