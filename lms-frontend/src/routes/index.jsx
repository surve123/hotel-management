import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import RequireRole from '../components/Auth/RequireRole';
import Login from '../pages/Auth/login/Login';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import PropertyAnalyticsDashboard from '../pages/Dashboard/PropertyAnalyticsDashboard';
import NotificationActionsDashboard from '../pages/Dashboard/NotificationActionsDashboard';
import PropertiesListPage from '../pages/Properties/PropertiesListPage';
import AddPropertyPage from '../pages/Properties/AddPropertyPage';
import PropertyDetailsPage from '../pages/Properties/PropertyDetailsPage';
import PropertyPerformancePage from '../pages/Properties/PropertyPerformancePage';
import AllLeadsPage from '../pages/Leads/AllLeadsPage';
import AddNewLeadPage from '../pages/Leads/AddNewLeadPage';
import LeadDetailsPage from '../pages/Leads/LeadDetailsPage';
import EditAssignLeadPage from '../pages/Leads/EditAssignLeadPage';
import FollowupDashboardPage from '../pages/Followups/FollowupDashboardPage';
import FollowupCalendarPage from '../pages/Followups/FollowupCalendarPage';
import UpdateFollowupPage from '../pages/Followups/UpdateFollowupPage';
import FollowupHistoryPage from '../pages/Followups/FollowupHistoryPage';
import CallerDashboardPage from '../pages/Caller/CallerDashboardPage';
import CallerMyLeadsPage from '../pages/Caller/CallerMyLeadsPage';
import CallerLeadDetailsPage from '../pages/Caller/CallerLeadDetailsPage';
import CallerEditAssignLeadPage from '../pages/Caller/CallerEditAssignLeadPage';
import BookingDashboardPage from '../pages/Bookings/BookingDashboardPage';
import BookingListPage from '../pages/Bookings/BookingListPage';
import BookingDetailsPage from '../pages/Bookings/BookingDetailsPage';
import CustomerProfilePage from '../pages/Customers/CustomerProfilePage';
import LeadSourceReportPage from '../pages/Reports/LeadSourceReportPage';
import TelecallerPerformancePage from '../pages/Reports/TelecallerPerformancePage';
import PropertyReportPage from '../pages/Reports/PropertyReportPage';
import RevenueConversionReportPage from '../pages/Reports/RevenueConversionReportPage';
import UserManagementPage from '../pages/Settings/UserManagementPage';
import RolesPermissionsPage from '../pages/Settings/RolesPermissionsPage';
import ConfigurationPage from '../pages/Settings/ConfigurationPage';
import SystemSettingsPage from '../pages/Settings/SystemSettingsPage';
import { useAuth } from '../context/AuthContext';
import { ROLES, DEFAULT_REDIRECTS } from '../constants/roles';

/**
 * Segregated RBAC Routes Configuration
 * 
 * Strict 3-Role Architecture:
 * 1. 🔴 SUPER_ADMIN: Full system control & administrative config
 * 2. 🔵 SUB_ADMIN: Complete business & properties management
 * 3. 🟢 CALLER: Lead operations, calls & personal follow-ups
 */
export const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();
  const defaultHome = DEFAULT_REDIRECTS[role] || '/login';

  return (
    <Routes>
      {/* 1. Public Authentication Route */}
      <Route path="/login" element={<Login />} />

      {/* 2. Protected App Shell (Requires Authentication) */}
      <Route element={<Layout />}>
        
        {/* ========================================================= */}
        {/* TIER 1: SUPER ADMIN ONLY (🔴 Full System Configuration)  */}
        {/* ========================================================= */}
        <Route element={<RequireRole allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/super-admin/dashboard" element={<AdminDashboard />} />
          <Route path="/super-admin/properties" element={<PropertiesListPage />} />
          <Route path="/super-admin/properties/new" element={<AddPropertyPage />} />
          <Route path="/super-admin/properties/edit/:id" element={<AddPropertyPage />} />
          <Route path="/super-admin/properties/:id/edit" element={<AddPropertyPage />} />
          <Route path="/super-admin/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/super-admin/properties/performance" element={<PropertyPerformancePage />} />
          <Route path="/super-admin/bookings" element={<BookingDashboardPage />} />
          <Route path="/super-admin/bookings/list" element={<BookingListPage />} />
          <Route path="/super-admin/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/super-admin/customers" element={<CustomerProfilePage />} />
          <Route path="/super-admin/customers/:id" element={<CustomerProfilePage />} />
          
          {/* Part 7: Reports Suite (Super Admin) */}
          <Route path="/super-admin/reports" element={<LeadSourceReportPage />} />
          <Route path="/super-admin/reports/lead-source" element={<LeadSourceReportPage />} />
          <Route path="/super-admin/reports/telecallers" element={<TelecallerPerformancePage />} />
          <Route path="/super-admin/reports/telecaller-performance" element={<TelecallerPerformancePage />} />
          <Route path="/super-admin/reports/properties" element={<PropertyReportPage />} />
          <Route path="/super-admin/reports/revenue" element={<RevenueConversionReportPage />} />
          <Route path="/super-admin/reports/revenue-conversion" element={<RevenueConversionReportPage />} />
          {/* Part 8: Settings & Administration Suite (Super Admin) */}
          <Route path="/super-admin/users" element={<UserManagementPage />} />
          <Route path="/super-admin/roles" element={<RolesPermissionsPage />} />
          <Route path="/super-admin/settings" element={<SystemSettingsPage />} />
          <Route path="/super-admin/settings/system" element={<SystemSettingsPage />} />
          <Route path="/super-admin/settings/users" element={<UserManagementPage />} />
          <Route path="/super-admin/settings/roles" element={<RolesPermissionsPage />} />
          <Route path="/super-admin/settings/configuration" element={<ConfigurationPage />} />
          <Route path="/super-admin/configuration" element={<ConfigurationPage />} />
        </Route>

        {/* ========================================================= */}
        {/* TIER 2: BUSINESS MANAGEMENT (🔴 Super Admin + 🔵 Sub Admin + 🟢 Telecaller)*/}
        {/* ========================================================= */}
        <Route element={<RequireRole allowedRoles={[ROLES.SUPER_ADMIN, ROLES.SUB_ADMIN, ROLES.CALLER]} />}>
          {/* Part 1: Dashboards & Analytics */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/notifications" element={<NotificationActionsDashboard />} />
          <Route path="/admin/quick-actions" element={<NotificationActionsDashboard />} />
          
          {/* Part 5: Properties Management Suite */}
          <Route path="/admin/properties" element={<PropertiesListPage />} />
          <Route path="/admin/properties/new" element={<AddPropertyPage />} />
          <Route path="/admin/properties/edit/:id" element={<AddPropertyPage />} />
          <Route path="/admin/properties/:id/edit" element={<AddPropertyPage />} />
          <Route path="/admin/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/admin/properties/performance" element={<PropertyPerformancePage />} />
          <Route path="/admin/property-analytics" element={<PropertyPerformancePage />} />
          <Route path="/properties" element={<PropertiesListPage />} />
          <Route path="/properties/new" element={<AddPropertyPage />} />
          <Route path="/properties/edit/:id" element={<AddPropertyPage />} />
          <Route path="/properties/:id/edit" element={<AddPropertyPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/properties/performance" element={<PropertyPerformancePage />} />
          
          {/* Part 6: Bookings & Customers Suite */}
          <Route path="/admin/bookings" element={<BookingDashboardPage />} />
          <Route path="/admin/bookings/list" element={<BookingListPage />} />
          <Route path="/admin/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/admin/customers" element={<CustomerProfilePage />} />
          <Route path="/admin/customers/:id" element={<CustomerProfilePage />} />
          <Route path="/bookings" element={<BookingDashboardPage />} />
          <Route path="/bookings/list" element={<BookingListPage />} />
          <Route path="/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/customers" element={<CustomerProfilePage />} />
          <Route path="/customers/:id" element={<CustomerProfilePage />} />

          {/* Part 2: All Leads Management & Re-assignment */}
          <Route path="/admin/leads" element={<AllLeadsPage />} />
          <Route path="/admin/leads/:id/edit" element={<EditAssignLeadPage />} />
          
          {/* Part 3: Global Follow-up Overview */}
          <Route path="/admin/follow-ups" element={<FollowupDashboardPage />} />
          <Route path="/admin/follow-ups/history" element={<FollowupHistoryPage />} />

          {/* Part 7: Reports Suite (Sub Admin / Admin) */}
          <Route path="/admin/reports" element={<LeadSourceReportPage />} />
          <Route path="/admin/reports/lead-source" element={<LeadSourceReportPage />} />
          <Route path="/admin/reports/telecallers" element={<TelecallerPerformancePage />} />
          <Route path="/admin/reports/telecaller-performance" element={<TelecallerPerformancePage />} />
          <Route path="/admin/reports/properties" element={<PropertyReportPage />} />
          <Route path="/admin/reports/revenue" element={<RevenueConversionReportPage />} />
          <Route path="/admin/reports/revenue-conversion" element={<RevenueConversionReportPage />} />
          <Route path="/admin/telecallers" element={<TelecallerPerformancePage />} />

          {/* Direct aliases for /reports/* */}
          <Route path="/reports" element={<LeadSourceReportPage />} />
          <Route path="/reports/lead-source" element={<LeadSourceReportPage />} />
          <Route path="/reports/telecallers" element={<TelecallerPerformancePage />} />
          <Route path="/reports/telecaller-performance" element={<TelecallerPerformancePage />} />
          <Route path="/reports/properties" element={<PropertyReportPage />} />
          <Route path="/reports/revenue" element={<RevenueConversionReportPage />} />
          <Route path="/reports/revenue-conversion" element={<RevenueConversionReportPage />} />
          <Route path="/telecallers" element={<TelecallerPerformancePage />} />

          {/* Part 8: Settings Suite (Admin Aliases) */}
          <Route path="/admin/settings" element={<SystemSettingsPage />} />
          <Route path="/admin/settings/system" element={<SystemSettingsPage />} />
          <Route path="/admin/settings/users" element={<UserManagementPage />} />
          <Route path="/admin/settings/roles" element={<RolesPermissionsPage />} />
          <Route path="/admin/settings/configuration" element={<ConfigurationPage />} />
        </Route>

        {/* ========================================================= */}
        {/* TIER 3: CALLER OPERATIONS (🟢 Caller / Telecaller Only)   */}
        {/* ========================================================= */}
        <Route element={<RequireRole allowedRoles={[ROLES.CALLER]} />}>
          {/* Part 4: Complete Caller Workspace */}
          <Route path="/caller/dashboard" element={<CallerDashboardPage />} />
          <Route path="/caller/leads" element={<CallerMyLeadsPage />} />
          <Route path="/caller/leads/new" element={<AddNewLeadPage />} />
          <Route path="/caller/leads/:id" element={<CallerLeadDetailsPage />} />
          <Route path="/caller/leads/:id/edit" element={<CallerEditAssignLeadPage />} />
          <Route path="/caller/follow-ups" element={<FollowupDashboardPage />} />
          <Route path="/caller/follow-ups/calendar" element={<FollowupCalendarPage />} />
          <Route path="/caller/follow-ups/update" element={<UpdateFollowupPage />} />
          <Route path="/caller/follow-ups/:id/update" element={<UpdateFollowupPage />} />
          <Route path="/caller/follow-ups/history" element={<FollowupHistoryPage />} />
          <Route path="/caller/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/caller/customers/:id" element={<CustomerProfilePage />} />

          {/* Telecaller aliases */}
          <Route path="/admin/telecaller/dashboard" element={<CallerDashboardPage />} />
          <Route path="/admin/telecaller/leads" element={<CallerMyLeadsPage />} />
        </Route>

        {/* ========================================================= */}
        {/* SHARED OPERATIONAL SCREENS (Accessible by all 3 roles)    */}
        {/* ========================================================= */}
        <Route element={<RequireRole allowedRoles={[ROLES.SUPER_ADMIN, ROLES.SUB_ADMIN, ROLES.CALLER]} />}>
          {/* Add New Lead (shared access) */}
          <Route path="/leads/new" element={<AddNewLeadPage />} />
          <Route path="/admin/leads/new" element={<AddNewLeadPage />} />

          {/* Lead Details */}
          <Route path="/leads/:id" element={<LeadDetailsPage />} />
          <Route path="/admin/leads/:id" element={<LeadDetailsPage />} />

          {/* Calendar */}
          <Route path="/follow-ups/calendar" element={<FollowupCalendarPage />} />
          <Route path="/admin/follow-ups/calendar" element={<FollowupCalendarPage />} />

          {/* Update Follow-up Log */}
          <Route path="/follow-ups/update" element={<UpdateFollowupPage />} />
          <Route path="/admin/follow-ups/update" element={<UpdateFollowupPage />} />
          <Route path="/admin/follow-ups/:id/update" element={<UpdateFollowupPage />} />

          {/* Bookings & Customers Shared Access */}
          <Route path="/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/customers/:id" element={<CustomerProfilePage />} />
        </Route>

      </Route>

      {/* 3. Root & Wildcard Intelligent Redirects */}
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? defaultHome : "/login"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? defaultHome : "/login"} replace />} 
      />
    </Routes>
  );
};

export default AppRoutes;
