import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Filter, Download } from 'lucide-react';
import FollowupKpiCards from './components/FollowupKpiCards';
import FollowupTrendChart from './components/FollowupTrendChart';
import UpcomingFollowupsTable from './components/UpcomingFollowupsTable';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

/**
 * Follow-up Dashboard Page Container (LMS PART 3 - Screen 1)
 * 6 Follow-up KPI cards, 7-day dual-line trend chart, Quick Actions panel, and scheduled follow-ups table.
 * 100% SVG Vector (Zero Emojis).
 */
export const FollowupDashboardPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const basePath = role === ROLES.CALLER ? '/caller/follow-ups' : '/admin/follow-ups';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.2,
          margin: 0
        }}>
          Follow-up Dashboard
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748B',
          marginTop: '3px',
          margin: 0
        }}>
          Stay on top of your follow-ups and never miss an opportunity.
        </p>
      </div>

      {/* Row 1: 6 Follow-up KPI Cards */}
      <FollowupKpiCards />

      {/* Row 2: Dual Column Analytics (Trend Chart & Quick Actions) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr',
        gap: '18px',
        alignItems: 'stretch'
      }}>
        {/* Left: 7-Day Dual Line Trend Chart */}
        <FollowupTrendChart />

        {/* Right: Quick Actions Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Quick Actions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* 1. Add Follow-up */}
            <button
              type="button"
              onClick={() => navigate(`${basePath}/update`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(30, 86, 240, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Follow-up</span>
            </button>

            {/* 2. View Calendar -> Navigates to Screen 2 */}
            <button
              type="button"
              onClick={() => navigate(`${basePath}/calendar`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 16px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                border: '1px solid #E2E8F0',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Calendar size={15} color="#64748B" />
              <span>View Calendar</span>
            </button>

            {/* 3. Filter */}
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 16px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                border: '1px solid #E2E8F0',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Filter size={15} color="#64748B" />
              <span>Filter</span>
            </button>

            {/* 4. Export Report */}
            <button
              type="button"
              onClick={() => alert('Exporting follow-up report...')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 16px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                border: '1px solid #E2E8F0',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Download size={15} color="#64748B" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Follow-ups Table */}
      <UpcomingFollowupsTable />
    </div>
  );
};

export default FollowupDashboardPage;
