import React from 'react';
import RoomCapacityBanner from './components/RoomCapacityBanner';
import DashboardStatCards from './components/DashboardStatCards';
import LeadsTrendChart from '../../components/Charts/LeadsTrendChart';
import LeadsBySourceDonut from '../../components/Charts/LeadsBySourceDonut';
import PropertyLeadsBar from '../../components/Charts/PropertyLeadsBar';
import RecentLeadsTable from './components/RecentLeadsTable';
import UpcomingFollowUpsList from './components/UpcomingFollowUpsList';

/**
 * Admin Dashboard Page Container (LMS PART 1 - Screen 2)
 * Pixel-by-pixel match to design image Screen 2:
 * - Header with Greeting & Room Capacity Banner
 * - 5 Color-coded KPI Cards
 * - 3-column analytics row (Trend chart, Donut chart, Property leads)
 * - 2-column operational row (Recent leads table, Upcoming follow-ups)
 * - 100% SVG Vector Icons (Zero Emojis).
 */
export const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header: Greeting & Room Capacity Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            margin: 0
          }}>
            Good Morning, Admin!
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748B',
            marginTop: '3px',
            margin: 0
          }}>
            Here's your complete lead management overview.
          </p>
        </div>

        {/* Room Capacity Card */}
        <RoomCapacityBanner />
      </div>

      {/* Row 1: 5 Color-Coded KPI Stat Cards */}
      <DashboardStatCards />

      {/* Row 2: Analytics Row (3 Columns: Line Chart, Donut Chart, Property Leads) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr 1fr',
        gap: '18px',
        alignItems: 'stretch'
      }}>
        <LeadsTrendChart />
        <LeadsBySourceDonut />
        <PropertyLeadsBar />
      </div>

      {/* Row 3: Operational Row (2 Columns: Recent Leads Table & Upcoming Follow-ups) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.3fr 1fr',
        gap: '18px',
        alignItems: 'stretch'
      }}>
        <RecentLeadsTable />
        <UpcomingFollowUpsList />
      </div>
    </div>
  );
};

export default AdminDashboard;
