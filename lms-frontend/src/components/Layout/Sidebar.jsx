import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BookCheck,
  Building2,
  UserCheck,
  BarChart3,
  Headphones,
  Settings,
  Shield,
  ChevronDown,
  LogOut
} from 'lucide-react';
import BrandLogo from '../Common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../../constants/roles';

/**
 * Dynamic Sidebar Navigation Component (LMS RBAC Segregated)
 * Adapts menu items for:
 * - 🔴 SUPER_ADMIN (Full control, Users, Settings)
 * - 🔵 SUB_ADMIN (Business operations, Properties, Reports)
 * - 🟢 CALLER (Lead operations, My Leads, My Follow-ups)
 * 
 * - Fits 100% in 1 screen on ANY viewport height (ZERO scrollbar).
 * - 100% SVG Lucide Icons (Zero Emojis).
 */
export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, user, logout, hasPermission } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-agnostic, 100% permission-driven primary navigation items
  const getMenuItems = () => {
    const items = [];

    // 1. Dashboard (Always available for authenticated user)
    const dashboardPath = role === ROLES.SUPER_ADMIN 
      ? '/super-admin/dashboard' 
      : (role === ROLES.SUB_ADMIN ? '/admin/dashboard' : '/caller/dashboard');
    items.push({
      label: role === ROLES.CALLER ? 'My Dashboard' : 'Dashboard',
      path: dashboardPath,
      icon: LayoutDashboard
    });

    // 2. Leads (View all leads vs My Leads / Add new leads)
    const hasViewAllLeads = hasPermission('View all leads');
    const hasAddLeads = hasPermission('Add new leads');
    const hasEditLeads = hasPermission('Edit lead details');
    const hasAnyLeads = hasViewAllLeads || hasAddLeads || hasEditLeads || role === ROLES.CALLER;

    if (hasAnyLeads) {
      const isGlobal = hasViewAllLeads || role === ROLES.SUPER_ADMIN;
      items.push({
        label: isGlobal ? 'All Leads' : 'My Leads',
        path: isGlobal ? '/admin/leads' : '/caller/leads',
        icon: Users,
        isLeads: true
      });
    }

    // 3. Follow-ups
    if (hasPermission('Schedule follow-ups')) {
      const followupsPath = role === ROLES.CALLER ? '/caller/follow-ups' : '/admin/follow-ups';
      items.push({
        label: role === ROLES.CALLER ? 'My Follow-ups' : 'Follow-ups',
        path: followupsPath,
        icon: CalendarClock,
        isFollowups: true
      });
    }

    // 4. Bookings
    if (hasPermission('Manage bookings')) {
      const bookingsPath = role === ROLES.SUPER_ADMIN ? '/super-admin/bookings' : '/admin/bookings';
      items.push({
        label: 'Bookings',
        path: bookingsPath,
        icon: BookCheck,
        isBookings: true
      });
    }

    // 5. Properties
    if (hasPermission('Add & edit properties')) {
      const propertiesPath = role === ROLES.SUPER_ADMIN ? '/super-admin/properties' : '/admin/properties';
      items.push({
        label: 'Properties',
        path: propertiesPath,
        icon: Building2,
        isProperties: true
      });
    }

    // 6. Customers (shown if user has access to bookings or leads)
    if (hasPermission('Manage bookings') || hasPermission('View all leads') || role === ROLES.SUPER_ADMIN) {
      const customersPath = role === ROLES.SUPER_ADMIN ? '/super-admin/customers' : '/admin/customers';
      items.push({
        label: 'Customers',
        path: customersPath,
        icon: UserCheck
      });
    }

    // 7. Reports
    if (hasPermission('View revenue reports') || hasPermission('Telecaller analytics')) {
      const reportsPath = role === ROLES.SUPER_ADMIN ? '/super-admin/reports' : '/admin/reports';
      items.push({
        label: 'Reports',
        path: reportsPath,
        icon: BarChart3,
        isReports: true
      });
    }

    // 8. Telecaller Performance
    if (hasPermission('Telecaller analytics')) {
      const telecallersPath = role === ROLES.SUPER_ADMIN ? '/super-admin/reports/telecallers' : '/admin/reports/telecallers';
      items.push({
        label: 'Telecallers',
        path: telecallersPath,
        icon: Headphones
      });
    }

    // 9. Settings (User Management, Roles & Permissions, Configuration, System Settings)
    const hasUserMgmt = hasPermission('User management');
    const hasSysConfig = hasPermission('System settings & configuration');
    if (hasUserMgmt || hasSysConfig) {
      const settingsPath = role === ROLES.SUPER_ADMIN ? '/super-admin/settings' : '/admin/settings';
      items.push({
        label: 'Settings',
        path: settingsPath,
        icon: Settings,
        isSettings: true
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  const isLeadsActive = location.pathname.startsWith('/admin/leads') || location.pathname.startsWith('/caller/leads');
  const isFollowupsActive = location.pathname.startsWith('/admin/follow-ups') || location.pathname.startsWith('/caller/follow-ups');
  const isPropertiesActive = location.pathname.includes('/properties');
  const isBookingsActive = location.pathname.includes('/bookings');
  const isCustomersActive = location.pathname.includes('/customers');
  const isReportsActive = location.pathname.includes('/reports');
  const isSettingsActive = location.pathname.includes('/settings') || location.pathname.includes('/users') || location.pathname.includes('/roles') || location.pathname.includes('/configuration');

  return (
    <aside style={{
      width: '230px',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      height: '100vh',
      maxHeight: '100vh',
      background: 'radial-gradient(circle at 20% 15%, rgba(59, 130, 246, 0.35) 0%, transparent 60%), linear-gradient(155deg, #1D4ED8 0%, #1E40AF 40%, #1E3A8A 80%, #172554 100%)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 40,
      userSelect: 'none',
      overflow: 'hidden', // No scrollbar
      boxSizing: 'border-box',
      borderRight: '1px solid rgba(255, 255, 255, 0.15)'
    }}>
      {/* Top: Brand Logo + Nav Menu */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Brand Logo */}
        <div style={{ padding: '14px 16px 8px 16px', flexShrink: 0 }}>
          <BrandLogo size="sm" isLight={true} />
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '4px 10px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px', margin: 0, padding: 0 }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = item.isLeads 
                ? isLeadsActive 
                : (item.isFollowups 
                  ? isFollowupsActive 
                  : (item.isProperties 
                    ? isPropertiesActive 
                    : (item.isBookings 
                      ? isBookingsActive 
                      : (item.isReports
                        ? isReportsActive
                        : (item.isSettings
                          ? isSettingsActive
                          : (item.label === 'Customers' 
                            ? isCustomersActive 
                            : location.pathname === item.path))))));

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5.5px 12px',
                      borderRadius: '7px',
                      color: '#FFFFFF',
                      backgroundColor: isItemActive ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                      border: isItemActive ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid transparent',
                      boxShadow: isItemActive ? '0 2px 6px rgba(0, 0, 0, 0.1)' : 'none',
                      textDecoration: 'none',
                      fontSize: '0.8125rem',
                      fontWeight: isItemActive ? 700 : 500,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={15} strokeWidth={2} />
                      <span>{item.label}</span>
                    </div>
                    {item.isSettings && (
                      <ChevronDown
                        size={13}
                        style={{
                          transform: isSettingsActive ? 'rotate(0deg)' : 'rotate(-90deg)',
                          transition: 'transform 0.15s ease',
                          opacity: 0.85
                        }}
                      />
                    )}
                  </NavLink>

                  {/* Sub-menu under Leads */}
                  {item.isLeads && isLeadsActive && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: '32px',
                      margin: '2px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1px'
                    }}>
                      <li>
                        <NavLink
                          to={role === ROLES.CALLER ? '/caller/leads' : '/admin/leads'}
                          end
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          {role === ROLES.CALLER ? 'My Leads' : 'All Leads'}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.CALLER ? '/caller/leads/new' : '/admin/leads/new'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          + Add New Lead
                        </NavLink>
                      </li>
                    </ul>
                  )}

                  {/* Sub-menu under Follow-ups */}
                  {item.isFollowups && isFollowupsActive && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: '32px',
                      margin: '2px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1px'
                    }}>
                      <li>
                        <NavLink
                          to={role === ROLES.CALLER ? '/caller/follow-ups' : '/admin/follow-ups'}
                          end
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.CALLER ? '/caller/follow-ups/calendar' : '/admin/follow-ups/calendar'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Calendar
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.CALLER ? '/caller/follow-ups/update' : '/admin/follow-ups/update'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Update Follow-up
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.CALLER ? '/caller/follow-ups/history' : '/admin/follow-ups/history'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Call History
                        </NavLink>
                      </li>
                    </ul>
                  )}

                  {/* Sub-menu under Bookings */}
                  {item.isBookings && isBookingsActive && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: '32px',
                      margin: '2px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1px'
                    }}>
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/bookings' : '/admin/bookings'}
                          end
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Booking Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/bookings/list' : '/admin/bookings/list'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Booking List
                        </NavLink>
                      </li>
                      {location.pathname.includes('/bookings/') && !location.pathname.endsWith('/list') && (
                        <li>
                          <div
                            style={{
                              display: 'block',
                              fontSize: '0.72rem',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.15)'
                            }}
                          >
                            Booking Details
                          </div>
                        </li>
                      )}
                    </ul>
                  )}

                  {/* Sub-menu under Properties */}
                  {item.isProperties && isPropertiesActive && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: '32px',
                      margin: '2px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1px'
                    }}>
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/properties' : '/admin/properties'}
                          end
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          All Properties
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/properties/new' : '/admin/properties/new'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          + Add Property
                        </NavLink>
                      </li>
                      {location.pathname.includes('/properties/') && !location.pathname.endsWith('/new') && !location.pathname.endsWith('/performance') && (
                        <li>
                          <div
                            style={{
                              display: 'block',
                              fontSize: '0.72rem',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.15)'
                            }}
                          >
                            Property Details
                          </div>
                        </li>
                      )}
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/properties/performance' : '/admin/properties/performance'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Performance
                        </NavLink>
                      </li>
                    </ul>
                  )}

                  {/* Sub-menu under Reports */}
                  {item.isReports && isReportsActive && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: '32px',
                      margin: '2px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1px'
                    }}>
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/reports/lead-source' : '/admin/reports/lead-source'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive || location.pathname.endsWith('/reports') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive || location.pathname.endsWith('/reports') ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive || location.pathname.endsWith('/reports') ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Lead Source Report
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/reports/telecallers' : '/admin/reports/telecallers'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Telecaller Performance
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/reports/properties' : '/admin/reports/properties'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Property Report
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={role === ROLES.SUPER_ADMIN ? '/super-admin/reports/revenue' : '/admin/reports/revenue'}
                          style={({ isActive }) => ({
                            display: 'block',
                            fontSize: '0.72rem',
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            fontWeight: isActive ? 700 : 500,
                            textDecoration: 'none',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                          })}
                        >
                          Revenue &amp; Conversion
                        </NavLink>
                      </li>
                    </ul>
                  )}

                  {/* Sub-menu under Settings (Part 8) */}
                  {item.isSettings && isSettingsActive && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: '32px',
                      margin: '2px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1px'
                    }}>
                      {hasPermission('User management') && (
                        <li>
                          <NavLink
                            to={role === ROLES.SUPER_ADMIN ? '/super-admin/settings/users' : '/admin/settings/users'}
                            style={({ isActive }) => {
                              const isUsersActive = isActive || location.pathname.includes('/users');
                              return {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.72rem',
                                color: isUsersActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                                fontWeight: isUsersActive ? 700 : 500,
                                textDecoration: 'none',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: isUsersActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                              };
                            }}
                          >
                            <span style={{ fontSize: '0.65rem' }}>◇</span>
                            <span>User Management</span>
                          </NavLink>
                        </li>
                      )}
                      {hasPermission('System settings & configuration') && (
                        <>
                          <li>
                            <NavLink
                              to={role === ROLES.SUPER_ADMIN ? '/super-admin/settings/roles' : '/admin/settings/roles'}
                              style={({ isActive }) => {
                                const isRolesActive = isActive || location.pathname.includes('/roles');
                                return {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '0.72rem',
                                  color: isRolesActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                                  fontWeight: isRolesActive ? 700 : 500,
                                  textDecoration: 'none',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: isRolesActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                };
                              }}
                            >
                              <span style={{ fontSize: '0.65rem' }}>◇</span>
                              <span>Roles &amp; Permissions</span>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={role === ROLES.SUPER_ADMIN ? '/super-admin/settings/configuration' : '/admin/settings/configuration'}
                              style={({ isActive }) => {
                                const isConfigActive = isActive || location.pathname.includes('/configuration');
                                return {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '0.72rem',
                                  color: isConfigActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                                  fontWeight: isConfigActive ? 700 : 500,
                                  textDecoration: 'none',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: isConfigActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                };
                              }}
                            >
                              <span style={{ fontSize: '0.65rem' }}>◇</span>
                              <span>Configuration</span>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={role === ROLES.SUPER_ADMIN ? '/super-admin/settings' : '/admin/settings'}
                              end
                              style={({ isActive }) => {
                                const isSysActive = isActive || location.pathname.endsWith('/settings') || location.pathname.endsWith('/system');
                                return {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '0.72rem',
                                  color: isSysActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                                  fontWeight: isSysActive ? 700 : 500,
                                  textDecoration: 'none',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: isSysActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                };
                              }}
                            >
                              <span style={{ fontSize: '0.65rem' }}>◇</span>
                              <span>System Settings</span>
                            </NavLink>
                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom User Profile Card */}
      <div style={{
        padding: '8px 10px',
        margin: '8px 10px',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {/* Avatar */}
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            color: user?.badgeColor || '#1E40AF',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {user?.initials || 'SA'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName || 'Admin'}
            </div>
            <div style={{ 
              fontSize: '0.65rem', 
              color: role === ROLES.SUPER_ADMIN ? '#FCA5A5' : (role === ROLES.SUB_ADMIN ? '#93C5FD' : '#6EE7B7'), 
              fontWeight: 700 
            }}>
              {ROLE_LABELS[role] || 'User'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out / Logout"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.6)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
