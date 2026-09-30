import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, CheckCircle2, Calendar, CreditCard, Loader2 } from 'lucide-react';
import leadService from '../../../services/leadService';
import bookingService from '../../../services/bookingService';

/**
 * RecentNotificationsCard Component (LMS PART 1 - Screen 4)
 * Dynamic Real-time event notifications list from PostgreSQL.
 * 100% SVG Vector (Zero Emojis).
 */
export const RecentNotificationsCard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveFeed = async () => {
      try {
        const [leadsRes, bookingsRes] = await Promise.allSettled([
          leadService.getLeads({ size: 4, sortBy: 'createdAt', sortDir: 'DESC' }),
          bookingService.getBookings({ size: 3, sortBy: 'createdAt', sortDir: 'DESC' })
        ]);

        const events = [];

        if (leadsRes.status === 'fulfilled' && leadsRes.value?.content) {
          leadsRes.value.content.forEach((lead) => {
            const timeAgo = lead.createdAt ? formatTimeAgo(new Date(lead.createdAt)) : 'Recently';
            if (lead.status === 'CONFIRMED' || lead.status === 'BOOKED') {
              events.push({
                id: `lead-conv-${lead.id}`,
                title: 'Lead Converted',
                description: `${lead.fullName || 'Lead'} • ${lead.propertyName || 'Property'}`,
                time: timeAgo,
                icon: CheckCircle2,
                color: '#10B981',
                bgColor: '#DCFCE7',
                link: `/admin/leads/${lead.id}`
              });
            } else {
              events.push({
                id: `lead-new-${lead.id}`,
                title: `New lead from ${lead.source ? lead.source.replace('_', ' ') : 'Channel'}`,
                description: `${lead.fullName || 'Lead'} interested in ${lead.propertyName || 'Villa/Resort'}`,
                time: timeAgo,
                icon: Bell,
                color: '#1E56F0',
                bgColor: '#EFF6FF',
                link: `/admin/leads/${lead.id}`
              });
            }
          });
        }

        if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.content) {
          bookingsRes.value.content.forEach((b) => {
            const timeAgo = b.createdAt ? formatTimeAgo(new Date(b.createdAt)) : 'Recently';
            events.push({
              id: `bkg-${b.id}`,
              title: `Booking #${b.bookingNumber || b.id} Confirmed`,
              description: `${b.guestName || 'Guest'} - ₹ ${(b.totalAmount || 0).toLocaleString('en-IN')}`,
              time: timeAgo,
              icon: Calendar,
              color: '#059669',
              bgColor: '#ECFDF5',
              link: `/admin/bookings/${b.id}`
            });
          });
        }

        if (isMounted) {
          setNotifications(events.slice(0, 5));
        }
      } catch (err) {
        console.warn('Could not load dynamic notifications:', err.message);
        if (isMounted) setNotifications([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLiveFeed();
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
          Recent Activity & Notifications
        </h3>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No recent activity recorded yet.
          </div>
        ) : (
          notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => item.link && navigate(item.link)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  cursor: item.link ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: item.bgColor,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={16} strokeWidth={2.2} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0F172A', lineHeight: 1.25 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.description}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.72rem',
                  color: '#94A3B8',
                  fontWeight: 500,
                  flexShrink: 0,
                  marginLeft: '12px'
                }}>
                  {item.time}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentNotificationsCard;
