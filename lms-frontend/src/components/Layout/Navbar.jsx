import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  ChevronDown, 
  Bell, 
  LayoutDashboard, 
  Building2, 
  Users, 
  CalendarClock, 
  BarChart3,
  Shield, 
  UserCheck, 
  Check,
  LogOut,
  UserCog,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS, DEFAULT_REDIRECTS } from '../../constants/roles';

/**
 * Top Navbar Component (LMS RBAC Segregated)
 * Features:
 * - Search bar
 * - Role-based Screen view pills
 * - Interactive Role Switcher Dropdown (Super Admin / Sub Admin / Caller)
 * - Date Range Picker, Notifications bell, and Dynamic User initials avatar
 * - Profile dropdown with Logout / Sign out
 * - 100% SVG Icons (Zero Emojis).
 */
export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // Dynamic current date range
  const getDynamicDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    const startStr = start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };
  const [dateRange] = useState(getDynamicDateRange());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user, switchRole, logout, hasPermission } = useAuth();

  // Screens visible based on active role & permissions
  const getNavScreens = () => {
    if (role === ROLES.CALLER) {
      const callerScreens = [
        { label: 'My Dashboard', path: '/caller/dashboard', icon: LayoutDashboard },
        { 
          label: hasPermission('View all leads') ? 'All Leads' : 'My Leads', 
          path: hasPermission('View all leads') ? '/admin/leads' : '/caller/leads', 
          icon: Users 
        },
      ];
      if (hasPermission('Schedule follow-ups')) {
        callerScreens.push({ label: 'My Follow-ups', path: '/caller/follow-ups', icon: CalendarClock });
      }
      if (hasPermission('Manage bookings')) {
        callerScreens.push({ label: 'Bookings', path: '/admin/bookings', icon: Users });
      }
      if (hasPermission('Add & edit properties')) {
        callerScreens.push({ label: 'Properties', path: '/admin/properties', icon: Building2 });
      }
      if (hasPermission('View revenue reports') || hasPermission('Telecaller analytics')) {
        callerScreens.push({ label: 'Reports', path: '/admin/reports', icon: BarChart3 });
      }
      if (hasPermission('User management')) {
        callerScreens.push({ label: 'Users', path: '/admin/settings/users', icon: UserCheck });
      }
      return callerScreens;
    }

    const screens = [
      { label: 'Dashboard', path: role === ROLES.SUPER_ADMIN ? '/super-admin/dashboard' : '/admin/dashboard', icon: LayoutDashboard },
    ];

    if (hasPermission('Add & edit properties') || role === ROLES.SUPER_ADMIN) {
      screens.push({ label: 'Properties', path: role === ROLES.SUPER_ADMIN ? '/super-admin/properties' : '/admin/properties', icon: Building2 });
    }

    screens.push({ label: 'All Leads', path: '/admin/leads', icon: Users });

    if (hasPermission('Schedule follow-ups')) {
      screens.push({ label: 'Follow-ups', path: '/admin/follow-ups', icon: CalendarClock });
    }

    if (hasPermission('View revenue reports') || hasPermission('Telecaller analytics') || role === ROLES.SUPER_ADMIN) {
      screens.push({ label: 'Reports', path: role === ROLES.SUPER_ADMIN ? '/super-admin/reports' : '/admin/reports', icon: BarChart3 });
    }

    if (hasPermission('User management') || role === ROLES.SUPER_ADMIN) {
      screens.push({ label: 'Users', path: role === ROLES.SUPER_ADMIN ? '/super-admin/settings/users' : '/admin/settings/users', icon: UserCheck });
    }

    return screens;
  };

  const screens = getNavScreens();

  const handleRoleSelect = (targetRole) => {
    setRoleDropdownOpen(false);
    const redirectUrl = switchRole(targetRole);
    navigate(redirectUrl);
  };

  const roleConfigs = [
    { role: ROLES.SUPER_ADMIN, label: 'Super Admin', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
    { role: ROLES.SUB_ADMIN, label: 'Sub Admin', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    { role: ROLES.CALLER, label: 'Caller / Telecaller', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' }
  ];

  const currentConfig = roleConfigs.find(c => c.role === role) || roleConfigs[0];

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      flexShrink: 0
    }}>
      {/* Left: Search input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '0 12px',
        width: '200px',
        height: '36px',
        flexShrink: 0
      }}>
        <Search size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search leads, properties..."
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '0.8rem',
            color: '#0F172A',
            backgroundColor: 'transparent',
            width: '100%',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Center: Dynamic Screen view pills */}
      <nav aria-label="Quick screen navigation" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: '#F1F5F9',
        padding: '3px',
        borderRadius: '8px',
        border: '1px solid #E2E8F0'
      }}>
        {screens.map((screen) => {
          const Icon = screen.icon;
          const isActive = location.pathname.startsWith(screen.path) || (screen.label === 'Properties' && location.pathname.includes('/properties'));

          return (
            <button
              key={screen.path}
              type="button"
              onClick={() => navigate(screen.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#1E56F0' : '#64748B',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.74rem',
                cursor: 'pointer',
                boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
              <span>{screen.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Role Switcher Dropdown, Date Range, Bell, Avatar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        position: 'relative'
      }}>
        {/* Role Pill: Interactive Switcher for Super Admin, Static Badge for Caller / Other Roles */}
        {role === ROLES.SUPER_ADMIN ? (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '9999px',
                backgroundColor: currentConfig.bg,
                border: `1px solid ${currentConfig.border}`,
                color: currentConfig.color,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Click to switch role view (Super Admin only)"
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentConfig.color
              }} />
              <span>{currentConfig.label}</span>
              <ChevronDown size={12} strokeWidth={2.5} />
            </button>

            {/* Dropdown Menu */}
            {roleDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '38px',
                right: 0,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                width: '210px',
                zIndex: 50,
                overflow: 'hidden',
                padding: '4px'
              }}>
                <div style={{ padding: '6px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Switch System Role
                </div>
                {roleConfigs.map((cfg) => {
                  const isSelected = cfg.role === role;
                  return (
                    <button
                      key={cfg.role}
                      type="button"
                      onClick={() => handleRoleSelect(cfg.role)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: isSelected ? cfg.bg : 'transparent',
                        color: isSelected ? cfg.color : '#1E293B',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cfg.color }} />
                        <span>{cfg.label}</span>
                      </div>
                      {isSelected && <Check size={14} color={cfg.color} strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '9999px',
              backgroundColor: currentConfig.bg,
              border: `1px solid ${currentConfig.border}`,
              color: currentConfig.color,
              fontSize: '0.75rem',
              fontWeight: 700,
              userSelect: 'none'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: currentConfig.color
            }} />
            <span>{currentConfig.label}</span>
          </div>
        )}

        {/* Date Range Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          whiteSpace: 'nowrap'
        }}>
          <Calendar size={13} color="#64748B" />
          <span>{dateRange}</span>
          <ChevronDown size={12} color="#94A3B8" />
        </div>

        {/* Notification Bell */}
        <div
          onClick={() => navigate('/admin/notifications')}
          style={{ position: 'relative', cursor: 'pointer' }}
          title="View Notifications & Quick Actions"
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: location.pathname === '/admin/notifications' ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: location.pathname === '/admin/notifications' ? '#1E56F0' : '#475569',
            backgroundColor: location.pathname === '/admin/notifications' ? '#EFF6FF' : '#FFFFFF',
            transition: 'all 0.15s ease'
          }}>
            <Bell size={16} />
          </div>
          {/* Red unread dot */}
          <span style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '7px',
            height: '7px',
            backgroundColor: '#EF4444',
            borderRadius: '50%',
            border: '1.5px solid #FFFFFF'
          }} />
        </div>

        {/* Dynamic User Avatar & Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: user?.badgeColor || '#1E56F0',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
              border: '2px solid #FFFFFF'
            }}
            title={`${user?.fullName || 'User'} (${ROLE_LABELS[role] || role})`}
          >
            {user?.initials || 'SA'}
          </div>

          {profileDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: 0,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              width: '210px',
              padding: '6px',
              zIndex: 50
            }}>
              {/* User Info Header */}
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                  {user?.fullName || 'User'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                  {user?.email || 'user@aranavee.com'}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: currentConfig.bg,
                    color: currentConfig.color,
                    fontSize: '0.65rem',
                    fontWeight: 700
                  }}>
                    {ROLE_LABELS[role] || role}
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              {role === ROLES.SUPER_ADMIN && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/super-admin/settings/users');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.78rem',
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <UserCog size={14} color="#64748B" />
                  <span>Team &amp; Users</span>
                </button>
              )}

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.78rem',
                  color: '#DC2626',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={14} color="#DC2626" />
                <span>Sign Out / Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
