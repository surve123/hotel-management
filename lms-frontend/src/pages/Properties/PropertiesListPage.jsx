import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PropertyKpiCards from './components/PropertyKpiCards';
import PropertyListTable from './components/PropertyListTable';

/**
 * PropertiesListPage Component (LMS PART 5 - Screen 1: Properties List)
 * High-level overview of portfolio properties with 5 KPI cards and full data table.
 * Authorized for: 🔴 Super Admin + 🔵 Sub Admin.
 * 100% SVG Lucide Icons (Zero Emojis).
 */
export const PropertiesListPage = () => {
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
            Properties
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748B',
            marginTop: '3px',
            margin: 0
          }}>
            Manage and view all your properties with performance insights.
          </p>
        </div>

        {/* Add Property Button */}
        <button
          type="button"
          onClick={() => navigate('/admin/properties/new')}
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
            boxShadow: '0 3px 10px rgba(30, 86, 240, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Property</span>
        </button>
      </div>

      {/* Row 1: 5 KPI Cards */}
      <PropertyKpiCards />

      {/* Row 2: Properties Data Table */}
      <PropertyListTable />
    </div>
  );
};

export default PropertiesListPage;
