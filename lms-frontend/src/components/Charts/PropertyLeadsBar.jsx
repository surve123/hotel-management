import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Loader2 } from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const PROPERTY_COLORS = ['#1E56F0', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

/**
 * Leads by Property List Component (LMS PART 1 - Screen 2)
 * Features real dynamic property rows with live lead counts, percentages, and progress bars.
 * 100% SVG Icons (Zero Emojis).
 */
export const PropertyLeadsBar = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPerformance = async () => {
      try {
        const data = await dashboardService.getPropertyPerformance();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          const totalAllLeads = list.reduce((acc, curr) => acc + (curr.totalLeads || 0), 0) || 1;
          
          const formatted = list.slice(0, 4).map((p, idx) => ({
            id: p.propertyId,
            name: p.propertyName || `Property #${p.propertyId}`,
            leads: p.totalLeads || 0,
            percentage: Math.round(((p.totalLeads || 0) / totalAllLeads) * 100),
            color: PROPERTY_COLORS[idx % PROPERTY_COLORS.length]
          }));
          setProperties(formatted);
        }
      } catch (err) {
        console.warn('Could not load property performance:', err.message);
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
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Leads by Property
        </h3>
        <span
          onClick={() => navigate('/admin/properties')}
          style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E56F0', cursor: 'pointer' }}
        >
          View All
        </span>
      </div>

      {/* Property List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'space-around' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', color: '#64748B' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No property lead data recorded yet.
          </div>
        ) : (
          properties.map((prop, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Top row: Icon + Name above + Leads count below */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: `${prop.color}15`,
                  color: prop.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Building2 size={16} />
                </div>

                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {/* Above: Property Name */}
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {prop.name}
                  </div>
                  {/* Below: Leads Count & Percentage */}
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                    <strong style={{ color: '#0F172A', fontWeight: 700 }}>{prop.leads}</strong> leads <span style={{ color: '#94A3B8' }}>•</span> <span style={{ color: prop.color, fontWeight: 600 }}>{prop.percentage}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                height: '6px',
                width: '100%',
                backgroundColor: '#F1F5F9',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.max(prop.percentage, 4)}%`,
                  backgroundColor: prop.color,
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyLeadsBar;
