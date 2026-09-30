import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare } from 'lucide-react';
import followupService from '../../../services/followupService';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../constants/roles';

/**
 * UpcomingFollowupsTable Component (LMS PART 3 - Screen 1: Follow-up Dashboard)
 * Schedule list with direct Call and WhatsApp triggers.
 * 100% Dynamic - Connected to live backend follow-ups API.
 * 100% SVG Vector (Zero Emojis).
 */
export const UpcomingFollowupsTable = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const basePath = role === ROLES.CALLER ? '/caller/follow-ups' : '/admin/follow-ups';
  const [followups, setFollowups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowups = async () => {
      try {
        const data = await followupService.getToday();
        if (data && Array.isArray(data)) {
          setFollowups(data);
        }
      } catch (err) {
        console.error('Failed to load upcoming follow-ups:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFollowups();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'HOT':
      case 'Hot Lead':
        return { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', text: 'Hot Lead' };
      case 'INTERESTED':
      case 'Interested':
        return { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', text: 'Interested' };
      case 'BOOKED':
      case 'CONVERTED':
        return { color: '#1E56F0', bg: '#EFF6FF', border: '#BFDBFE', text: 'Converted' };
      default:
        return { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', text: status || 'Follow-up' };
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Today's Scheduled Follow-ups
        </h3>
        <span 
          onClick={() => navigate(`${basePath}/history`)}
          style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E56F0', cursor: 'pointer' }}
        >
          View All
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '0.825rem' }}>
            Loading scheduled follow-ups...
          </div>
        ) : followups.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: '0.825rem' }}>
            No scheduled follow-ups found for today.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
            <thead>
              <tr style={{
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                whiteSpace: 'nowrap'
              }}>
                <th style={{ padding: '10px 18px' }}>Scheduled Time</th>
                <th style={{ padding: '10px 18px' }}>Customer</th>
                <th style={{ padding: '10px 18px' }}>Property</th>
                <th style={{ padding: '10px 18px' }}>Assigned To</th>
                <th style={{ padding: '10px 18px' }}>Status</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {followups.map((item, idx) => {
                const badge = getStatusBadge(item.leadStatus);
                const timeStr = item.scheduledTime
                  ? new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Scheduled';

                return (
                  <tr
                    key={item.leadId || idx}
                    onClick={() => navigate(`${basePath}/update`)}
                    style={{
                      borderBottom: idx === followups.length - 1 ? 'none' : '1px solid #F1F5F9',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0F172A' }}>
                      {timeStr}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: '#1E293B' }}>
                      <div>{item.customerName || 'Customer'}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 400 }}>{item.mobileNumber}</div>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#475569' }}>
                      {item.propertyName || 'General'}
                    </td>
                    <td style={{ padding: '12px 18px', color: '#64748B' }}>
                      {item.assignedToName || 'Unassigned'}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: badge.color,
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.border}`,
                        padding: '3px 8px',
                        borderRadius: '9999px'
                      }}>
                        {badge.text}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <a
                          href={`tel:${item.mobileNumber}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#EFF6FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1E56F0',
                            border: '1px solid #DBEAFE',
                            textDecoration: 'none'
                          }}
                        >
                          <Phone size={13} />
                        </a>
                        <a
                          href={`https://wa.me/${(item.mobileNumber || '').replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#ECFDF5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#059669',
                            border: '1px solid #A7F3D0',
                            textDecoration: 'none'
                          }}
                        >
                          <MessageSquare size={13} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UpcomingFollowupsTable;
