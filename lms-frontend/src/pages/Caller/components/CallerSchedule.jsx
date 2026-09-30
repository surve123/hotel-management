import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Loader2 } from 'lucide-react';
import followupService from '../../../services/followupService';

/**
 * CallerSchedule Component (LMS PART 4 - Screen 1)
 * Dynamic "Today's Follow-ups" list for telecaller from PostgreSQL.
 * 100% SVG Vector (Zero Emojis).
 */
export const CallerSchedule = () => {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSchedule = async () => {
      try {
        const data = await followupService.getToday();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          const formatted = list.slice(0, 5).map((item) => ({
            id: item.id,
            leadId: item.leadId,
            time: item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Today',
            customer: item.leadName || item.customerName || `Lead #${item.leadId}`,
            phone: item.leadPhone || item.phone || '',
            property: item.propertyName || 'Aranavee Property',
            status: item.status || 'SCHEDULED',
            statusColor: item.status === 'COMPLETED' ? '#059669' : (item.status === 'MISSED' ? '#DC2626' : '#D97706'),
            statusBg: item.status === 'COMPLETED' ? '#ECFDF5' : (item.status === 'MISSED' ? '#FEF2F2' : '#FEF3C7'),
            statusBorder: item.status === 'COMPLETED' ? '#A7F3D0' : (item.status === 'MISSED' ? '#FECACA' : '#FDE68A')
          }));
          setFollowups(formatted);
        }
      } catch (err) {
        console.warn('Could not load caller schedule:', err.message);
        if (isMounted) setFollowups([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchSchedule();
    return () => { isMounted = false; };
  }, []);

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
          Today's Follow-ups
        </h3>
        <span
          onClick={() => navigate('/caller/follow-ups')}
          style={{ fontSize: '0.74rem', fontWeight: 600, color: '#1E56F0', cursor: 'pointer' }}
        >
          View All
        </span>
      </div>

      {/* Follow-up list items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : followups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No follow-ups due today.
          </div>
        ) : (
          followups.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/caller/follow-ups/${item.leadId || item.id}/update`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
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
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#64748B',
                  width: '60px',
                  flexShrink: 0
                }}>
                  {item.time}
                </div>

                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                    {item.customer}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '1px' }}>
                    {item.property}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

                {item.phone && (
                  <a
                    href={`tel:${item.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid #BFDBFE',
                      backgroundColor: '#FFFFFF',
                      color: '#1E56F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    title={`Call ${item.customer}`}
                  >
                    <Phone size={13} strokeWidth={2.2} />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CallerSchedule;
