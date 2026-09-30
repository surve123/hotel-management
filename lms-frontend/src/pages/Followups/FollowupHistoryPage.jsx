import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, CheckCircle2, PhoneOff, Info, ArrowRight, RefreshCw } from 'lucide-react';
import followupService from '../../services/followupService';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

/**
 * Call / Follow-up History Page (LMS PART 3 - Screen 4)
 * Communication statistics, live call outcome logs, telecaller records, and info banner.
 * 100% Dynamic - Connected to live backend APIs.
 * 100% SVG Vector (Zero Emojis).
 */
export const FollowupHistoryPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const basePath = role === ROLES.CALLER ? '/caller/follow-ups' : '/admin/follow-ups';
  const [historyItems, setHistoryItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const [histRes, statRes] = await Promise.allSettled([
        followupService.getHistory(),
        followupService.getDashboard()
      ]);
      if (histRes.status === 'fulfilled' && histRes.value) setHistoryItems(histRes.value);
      if (statRes.status === 'fulfilled' && statRes.value) setStats(statRes.value);
    } catch (err) {
      console.error('Failed to load followup history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalCalls = historyItems.length;
  const dueFollowups = stats?.dueToday ?? 0;
  const completedCount = stats?.completedToday ?? 0;
  const overdueCount = stats?.overdue ?? 0;

  const metrics = [
    { label: 'Total Logged Calls', value: String(totalCalls), icon: Phone, color: '#1E56F0', bgColor: '#EFF6FF' },
    { label: 'Follow-ups Active', value: String(dueFollowups), icon: Calendar, color: '#8B5CF6', bgColor: '#F5F3FF' },
    { label: 'Completed Today', value: String(completedCount), icon: CheckCircle2, color: '#10B981', bgColor: '#ECFDF5' },
    { label: 'Overdue Calls', value: String(overdueCount), icon: PhoneOff, color: '#EF4444', bgColor: '#FEE2E2' },
  ];

  const getOutcomeColor = (status) => {
    switch (status) {
      case 'HOT':
      case 'Hot Lead':
        return { color: '#DC2626', bg: '#FEE2E2', label: 'Hot Lead' };
      case 'INTERESTED':
      case 'Interested':
        return { color: '#059669', bg: '#ECFDF5', label: 'Interested' };
      case 'BOOKED':
      case 'CONVERTED':
        return { color: '#1E56F0', bg: '#EFF6FF', label: 'Converted' };
      default:
        return { color: '#D97706', bg: '#FEF3C7', label: status || 'Follow-up' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            margin: 0
          }}>
            Call / Follow-up History
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748B',
            marginTop: '3px',
            margin: 0
          }}>
            View complete real-time communication history with customer records.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          title="Refresh History"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            color: '#334155',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          <span>Sync</span>
        </button>
      </div>

      {/* 2. Communication Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: m.bgColor,
                color: m.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                  {isLoading ? '...' : m.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Communication History Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Communication Logs
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E56F0' }}>
            {historyItems.length} records found
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '0.825rem' }}>
              Loading communication history...
            </div>
          ) : historyItems.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#94A3B8', fontSize: '0.825rem' }}>
              No previous communication history recorded yet.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
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
                  <th style={{ padding: '10px 16px' }}>Date & Time</th>
                  <th style={{ padding: '10px 16px' }}>Customer</th>
                  <th style={{ padding: '10px 16px' }}>Property</th>
                  <th style={{ padding: '10px 16px' }}>Remarks / Summary</th>
                  <th style={{ padding: '10px 16px' }}>Outcome</th>
                  <th style={{ padding: '10px 16px' }}>Assigned Caller</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {historyItems.map((row, idx) => {
                  const badge = getOutcomeColor(row.leadStatus);
                  const dateStr = row.scheduledTime
                    ? new Date(row.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                    : 'Recent';

                  return (
                    <tr
                      key={row.leadId || idx}
                      onClick={() => navigate(`${basePath}/update`)}
                      style={{
                        borderBottom: idx === historyItems.length - 1 ? 'none' : '1px solid #F1F5F9',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 600 }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#1E293B', fontWeight: 600 }}>
                        <div>{row.customerName || 'Customer'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 400 }}>{row.mobileNumber}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                        {row.propertyName || 'General'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748B', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.remarks || 'Follow-up discussion logged'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: badge.color,
                          backgroundColor: badge.bg,
                          padding: '3px 8px',
                          borderRadius: '5px'
                        }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>
                        {row.assignedToName || 'Unassigned'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span
                          onClick={() => navigate(`${basePath}/update`)}
                          style={{
                            color: '#1E56F0',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.78rem'
                          }}
                        >
                          View
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowupHistoryPage;
