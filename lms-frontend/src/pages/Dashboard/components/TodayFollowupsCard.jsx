import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ExternalLink, Loader2 } from 'lucide-react';
import followupService from '../../../services/followupService';

const AVATAR_COLORS = [
  { color: '#F59E0B', bgColor: '#FEF3C7' },
  { color: '#8B5CF6', bgColor: '#F5F3FF' },
  { color: '#06B6D4', bgColor: '#ECFEFF' },
  { color: '#10B981', bgColor: '#ECFDF5' },
  { color: '#1E56F0', bgColor: '#EFF6FF' }
];

/**
 * TodayFollowupsCard Component (LMS PART 1 - Screen 4)
 * Dynamic today's schedule of customer follow-ups from PostgreSQL with instant Call and View actions.
 * 100% SVG Vector (Zero Emojis).
 */
export const TodayFollowupsCard = () => {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchToday = async () => {
      try {
        const data = await followupService.getToday();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          const formatted = list.slice(0, 5).map((item, idx) => {
            const name = item.leadName || item.customerName || `Lead #${item.leadId}`;
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'LD';
            const colorScheme = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const timeStr = item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Today';

            return {
              id: item.id,
              leadId: item.leadId,
              name: name,
              phone: item.leadPhone || item.phone || '',
              initials: initials,
              time: timeStr,
              property: item.propertyName || 'Aranavee Property',
              color: colorScheme.color,
              bgColor: colorScheme.bgColor,
            };
          });
          setFollowups(formatted);
        }
      } catch (err) {
        console.warn('Could not load today follow-ups:', err.message);
        if (isMounted) setFollowups([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchToday();
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
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Today's Follow-ups
        </h3>
        <span
          onClick={() => navigate('/admin/follow-ups')}
          style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E56F0', cursor: 'pointer' }}
        >
          View All
        </span>
      </div>

      {/* Follow-ups List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : followups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No follow-ups scheduled for today.
          </div>
        ) : (
          followups.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #F1F5F9'
              }}
            >
              {/* Left: Avatar + Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: item.bgColor,
                  color: item.color,
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0F172A' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{item.time}</span> • {item.property}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {item.phone && (
                  <a
                    href={`tel:${item.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      color: '#1E56F0',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Phone size={12} strokeWidth={2.2} />
                    <span>Call</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/admin/leads/${item.leadId || item.id}`)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#475569',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayFollowupsCard;
