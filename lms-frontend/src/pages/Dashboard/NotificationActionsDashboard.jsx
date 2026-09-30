import React from 'react';
import ActionAlertCards from './components/ActionAlertCards';
import RecentNotificationsCard from './components/RecentNotificationsCard';
import TodayFollowupsCard from './components/TodayFollowupsCard';
import UpcomingBookingsCard from './components/UpcomingBookingsCard';
import QuickActionsPanel from './components/QuickActionsPanel';

/**
 * Dashboard with Notifications & Quick Actions (LMS PART 1 - Screen 4)
 * Exact match to Design Sheet Screen 4:
 * - 4 Alert & Operational KPI Cards
 * - Left column: Recent Notifications, Today's Follow-ups, Upcoming Bookings
 * - Right column: Quick Actions Panel & Support Help card
 * - 100% SVG Vector Icons (Zero Emojis).
 */
export const NotificationActionsDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Row 1: 4 Operational Alert Cards */}
      <ActionAlertCards />

      {/* Row 2 & 3: Main Operational Feed & Quick Actions Sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.9fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Notifications, Follow-ups, Upcoming Bookings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <RecentNotificationsCard />
          <TodayFollowupsCard />
          <UpcomingBookingsCard />
        </div>

        {/* Right Column: Quick Actions & Help Widget */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <QuickActionsPanel />
        </div>
      </div>
    </div>
  );
};

export default NotificationActionsDashboard;
