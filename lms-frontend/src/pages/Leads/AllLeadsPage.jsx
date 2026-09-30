import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import LeadsMetricCards from './components/LeadsMetricCards';
import LeadsTable from './components/LeadsTable';
import { useAuth } from '../../context/AuthContext';

/**
 * All Leads Page Container (LMS PART 2 - Screen 1)
 * Features Header with Export and Add Lead actions, 5 Metric summary cards, and Leads Data Table.
 * 100% SVG Vector (Zero Emojis).
 */
export const AllLeadsPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            margin: 0
          }}>
            All Leads
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748B',
            marginTop: '3px',
            margin: 0
          }}>
            Manage and track all your leads in one place.
          </p>
        </div>

        {/* Action Buttons: Export & Add Lead */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {hasPermission('View all leads') && (
            <button
              type="button"
              onClick={() => alert('Exporting leads data as CSV...')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease'
              }}
            >
              <Download size={15} />
              <span>Export</span>
            </button>
          )}

          {hasPermission('Add new leads') && (
            <button
              type="button"
              onClick={() => navigate('/admin/leads/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(30, 86, 240, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 1: 5 Metric Cards */}
      <LeadsMetricCards />

      {/* Row 2: Comprehensive Leads Table */}
      <LeadsTable />
    </div>
  );
};

export default AllLeadsPage;
