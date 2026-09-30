import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import CallerLeadsTable from './components/CallerLeadsTable';

/**
 * CallerMyLeadsPage Component (LMS PART 4 - Screen 2: My Leads)
 * Complete leads management suite for telecallers.
 * 100% SVG Vector Icons (Zero Emojis).
 */
export const CallerMyLeadsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            margin: 0
          }}>
            My Leads
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748B',
            marginTop: '3px',
            margin: 0
          }}>
            Leads assigned to you.
          </p>
        </div>

        {/* Action CTAs: Export & Add Lead */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => alert('Exporting my leads to CSV...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.15s ease'
            }}
          >
            <Download size={14} color="#64748B" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/caller/leads/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#1E56F0',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(30, 86, 240, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Main Leads Table */}
      <CallerLeadsTable />
    </div>
  );
};

export default CallerMyLeadsPage;
