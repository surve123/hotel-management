import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import Badge from '../../../components/Common/Badge';
import followupService from '../../../services/followupService';

/**
 * Upcoming Follow-ups List Component (LMS PART 1 - Screen 2)
 * Connected to live Spring Boot follow-ups API.
 */
export const UpcomingFollowUpsList = () => {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodayFollowups();
  }, []);

  const fetchTodayFollowups = async () => {
    setIsLoading(true);
    try {
      const data = await followupService.getToday();
      if (data) {
        setFollowups(data);
      }
    } catch (err) {
      console.error('Failed to load today followups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Pending';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'FL';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box'
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
          Today's Follow-ups
        </h3>
        <span
          onClick={() => navigate('/follow-ups/calendar')}
          style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E56F0', cursor: 'pointer' }}
        >
          View Calendar →
        </span>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', flex: 1, minHeight: '180px' }}>
        {isLoading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
            Loading agenda...
          </div>
        ) : followups.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
            No pending follow-ups for today. Great job!
          </div>
        ) : (
          followups.slice(0, 5).map((item, idx) => (
            <div
              key={item.leadId || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 8px',
                borderBottom: idx === followups.length - 1 ? 'none' : '1px solid #F8FAFC'
              }}
            >
              {/* Contact Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  color: '#1E56F0',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getInitials(item.customerName)}
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>
                    {item.customerName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>
                    {formatTime(item.scheduledTime)} • {item.propertyName || 'General'}
                  </div>
                </div>
              </div>

              {/* Status & Call Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge type="status" value={item.leadStatus} />
                <button
                  type="button"
                  onClick={() => navigate(`/admin/leads/${item.leadId}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#EFF6FF',
                    color: '#1E56F0',
                    border: '1px solid #BFDBFE',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Phone size={12} />
                  <span>Call</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingFollowUpsList;
