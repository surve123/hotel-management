import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Building2, Loader2 } from 'lucide-react';
import dashboardService from '../../../services/dashboardService';

const PROPERTY_COLORS = ['#1E56F0', '#10B981', '#F59E0B', '#06B6D4', '#8B5CF6'];

/**
 * PropertyPerformanceTable Component (LMS PART 1 - Screen 3)
 * Dynamic breakdown of Leads, Bookings, Revenue, and Conversion % per property from PostgreSQL.
 * 100% SVG Vector (Zero Emojis).
 */
export const PropertyPerformanceTable = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPerformance = async () => {
      try {
        const data = await dashboardService.getPropertyPerformance();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          const formatted = list.map((row, idx) => ({
            id: row.propertyId,
            name: row.propertyName || `Property #${row.propertyId}`,
            leads: row.totalLeads || 0,
            bookings: row.confirmedBookings || 0,
            revenue: `₹ ${(row.revenue || 0).toLocaleString('en-IN')}`,
            conversion: `${row.conversionRate || 0}%`,
            color: PROPERTY_COLORS[idx % PROPERTY_COLORS.length]
          }));
          setProperties(formatted);
        }
      } catch (err) {
        console.warn('Could not load property performance table:', err.message);
        if (isMounted) setProperties([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchPerformance();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '18px 20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Property Performance
        </h3>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No property performance records found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Property
                </th>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'center' }}>
                  Leads
                </th>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'center' }}>
                  Bookings
                </th>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'right' }}>
                  Revenue
                </th>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>
                    <span>Conversion %</span>
                    <ArrowUpDown size={12} color="#94A3B8" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < properties.length - 1 ? '1px solid #F8FAFC' : 'none',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <td style={{ padding: '10px', color: '#0F172A', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: `${row.color}15`,
                        color: row.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Building2 size={13} />
                      </div>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#334155', fontWeight: 600 }}>
                    {row.leads}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#334155', fontWeight: 600 }}>
                    {row.bookings}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#0F172A', fontWeight: 700 }}>
                    {row.revenue}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <span style={{
                      color: '#059669',
                      fontWeight: 700,
                      backgroundColor: '#ECFDF5',
                      padding: '3px 7px',
                      borderRadius: '5px',
                      fontSize: '0.75rem'
                    }}>
                      {row.conversion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PropertyPerformanceTable;
