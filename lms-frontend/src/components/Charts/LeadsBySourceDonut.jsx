import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboardService';

/**
 * Donut Chart: Leads by Source (LMS PART 1 - Screen 2)
 * Connected to live Spring Boot source distribution API.
 */
export const LeadsBySourceDonut = () => {
  const [sources, setSources] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const SOURCE_COLORS = {
    INSTAGRAM: '#E1306C',
    WHATSAPP: '#10B981',
    WEBSITE: '#1E56F0',
    DIRECT_CALL: '#06B6D4',
    REFERRAL: '#F59E0B',
    OTHER: '#94A3B8'
  };

  useEffect(() => {
    fetchSourceData();
  }, []);

  const fetchSourceData = async () => {
    try {
      const data = await dashboardService.getSourceDistribution();
      if (data && data.length > 0) {
        let total = 0;
        const formatted = data.map(item => {
          total += item.count;
          return {
            label: item.source.replace('_', ' '),
            percentage: item.percentage || 0,
            color: SOURCE_COLORS[item.source] || '#94A3B8',
            count: item.count
          };
        });
        setSources(formatted);
        setTotalLeads(total);
      } else {
        setSources([]);
        setTotalLeads(0);
      }
    } catch (err) {
      console.error('Failed to load source distribution:', err);
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  const circumference = 238.76;
  let accumulatedPercent = 0;

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
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0, marginBottom: '14px' }}>
        Leads by Source
      </h3>

      {sources.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '130px', color: '#94A3B8', fontSize: '0.85rem' }}>
          {isLoading ? 'Loading sources...' : 'No lead source data available yet.'}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          {/* SVG Donut */}
          <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }}>
              {sources.map((item, idx) => {
                const dashArray = ((item.percentage || 1) / 100) * circumference;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += (item.percentage || 1);

                return (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="14"
                    strokeDasharray={`${dashArray} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </svg>

            {/* Center Text */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {totalLeads}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                Total Leads
              </span>
            </div>
          </div>

          {/* Legend List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            {sources.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }} />
                  <span style={{ color: '#475569', fontWeight: 500, textTransform: 'capitalize' }}>{item.label}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsBySourceDonut;
