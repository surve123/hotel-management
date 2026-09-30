import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import leadService from '../../../services/leadService';

const AVATAR_PALETTE = [
  { bg: '#DBEAFE', color: '#1E40AF' },
  { bg: '#FEF3C7', color: '#B45309' },
  { bg: '#FCE7F3', color: '#BE185D' },
  { bg: '#E0E7FF', color: '#4338CA' },
  { bg: '#DCFCE7', color: '#15803D' }
];

/**
 * CallerRecentLeads Component (LMS PART 4 - Screen 1)
 * Dynamic recent leads assigned to telecaller from PostgreSQL.
 * 100% SVG Vector (Zero Emojis).
 */
export const CallerRecentLeads = () => {
  const navigate = useNavigate();
  const [recentLeads, setRecentLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLeads = async () => {
      try {
        const data = await leadService.getMyLeads({ size: 4, sortBy: 'createdAt', sortDir: 'DESC' });
        if (isMounted) {
          const list = data?.content || (Array.isArray(data) ? data : []);
          const formatted = list.map((item, idx) => {
            const name = item.fullName || `Lead #${item.id}`;
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'LD';
            const pal = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
            const timeAgo = item.createdAt ? formatTimeAgo(new Date(item.createdAt)) : 'Recently';

            return {
              id: item.id,
              name: name,
              initials: initials,
              avatarBg: pal.bg,
              avatarColor: pal.color,
              property: item.propertyName || 'Aranavee Property',
              timeAgo: timeAgo,
              status: item.status || 'NEW',
              statusColor: item.status === 'HOT' ? '#DC2626' : (item.status === 'CONFIRMED' ? '#059669' : '#D97706'),
              statusBg: item.status === 'HOT' ? '#FEE2E2' : (item.status === 'CONFIRMED' ? '#ECFDF5' : '#FEF3C7'),
              statusBorder: item.status === 'HOT' ? '#FECACA' : (item.status === 'CONFIRMED' ? '#A7F3D0' : '#FDE68A')
            };
          });
          setRecentLeads(formatted);
        }
      } catch (err) {
        console.warn('Could not load caller recent leads:', err.message);
        if (isMounted) setRecentLeads([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchLeads();
    return () => { isMounted = false; };
  }, []);

  const formatTimeAgo = (date) => {
    const diffMs = new Date() - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '16px 18px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Recent Leads
        </h3>
        <span
          onClick={() => navigate('/caller/leads')}
          style={{ fontSize: '0.74rem', fontWeight: 600, color: '#1E56F0', cursor: 'pointer' }}
        >
          View All
        </span>
      </div>

      {/* Leads List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : recentLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No assigned leads yet.
          </div>
        ) : (
          recentLeads.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/caller/leads/${item.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
                e.currentTarget.style.borderColor = '#BFDBFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: item.avatarBg,
                  color: item.avatarColor,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.initials}
                </div>

                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '1px' }}>
                    {item.property} • <span style={{ color: '#94A3B8' }}>{item.timeAgo}</span>
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '9999px',
                color: item.statusColor,
                backgroundColor: item.statusBg,
                border: `1px solid ${item.statusBorder}`
              }}>
                {item.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CallerRecentLeads;
