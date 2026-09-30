import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Loader2 } from 'lucide-react';
import reportService from '../../../services/reportService';

const CALLER_COLORS = ['#1E56F0', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4'];

/**
 * TelecallerLeaderboardTable Component (LMS PART 1 - Screen 3)
 * Dynamic Performance table for Telecallers from PostgreSQL.
 * 100% SVG Vector (Zero Emojis).
 */
export const TelecallerLeaderboardTable = () => {
  const [telecallers, setTelecallers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLeaderboard = async () => {
      try {
        const data = await reportService.getTelecallerPerformance();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          const formatted = list.map((caller, idx) => {
            const name = caller.callerName || caller.username || 'Telecaller';
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TC';
            return {
              id: caller.userId,
              name: name,
              initials: initials,
              calls: caller.totalCalls || 0,
              followUps: caller.completedFollowups || 0,
              converted: caller.convertedLeads || 0,
              conversion: `${caller.conversionRate || 0}%`,
              color: CALLER_COLORS[idx % CALLER_COLORS.length]
            };
          });
          setTelecallers(formatted);
        }
      } catch (err) {
        console.warn('Could not load telecaller leaderboard:', err.message);
        if (isMounted) setTelecallers([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchLeaderboard();
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
          Top Performing Telecallers
        </h3>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : telecallers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No telecaller performance recorded yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Name
                </th>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'center' }}>
                  Calls
                </th>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'center' }}>
                  Follow-ups
                </th>
                <th style={{ padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'center' }}>
                  Converted
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
              {telecallers.map((caller, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < telecallers.length - 1 ? '1px solid #F8FAFC' : 'none',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <td style={{ padding: '10px', color: '#0F172A', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: `${caller.color}15`,
                        color: caller.color,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {caller.initials}
                      </div>
                      <span>{caller.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#334155', fontWeight: 600 }}>
                    {caller.calls}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#334155', fontWeight: 600 }}>
                    {caller.followUps}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#334155', fontWeight: 600 }}>
                    {caller.converted}
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
                      {caller.conversion}
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

export default TelecallerLeaderboardTable;
