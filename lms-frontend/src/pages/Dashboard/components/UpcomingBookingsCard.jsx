import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2 } from 'lucide-react';
import bookingService from '../../../services/bookingService';

/**
 * UpcomingBookingsCard Component (LMS PART 1 - Screen 4)
 * Dynamic upcoming guest bookings list from PostgreSQL with dates, assigned properties, and status pills.
 * 100% SVG Vector (Zero Emojis).
 */
export const UpcomingBookingsCard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUpcoming = async () => {
      try {
        const data = await bookingService.getBookings({ size: 5, sortBy: 'checkInDate', sortDir: 'ASC' });
        if (isMounted) {
          const list = data?.content || (Array.isArray(data) ? data : []);
          const formatted = list.map((b) => ({
            id: b.id,
            bookingNumber: b.bookingNumber || `BKG-${b.id}`,
            guest: b.guestName || b.customerName || 'Guest',
            date: b.checkInDate ? new Date(b.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming',
            property: b.propertyName || 'Aranavee Resort',
            status: b.status || 'CONFIRMED',
            statusColor: b.status === 'CONFIRMED' ? '#059669' : (b.status === 'CANCELLED' ? '#DC2626' : '#D97706'),
            statusBg: b.status === 'CONFIRMED' ? '#ECFDF5' : (b.status === 'CANCELLED' ? '#FEF2F2' : '#FFFBEB'),
            statusBorder: b.status === 'CONFIRMED' ? '#A7F3D0' : (b.status === 'CANCELLED' ? '#FECACA' : '#FDE68A')
          }));
          setBookings(formatted);
        }
      } catch (err) {
        console.warn('Could not load upcoming bookings:', err.message);
        if (isMounted) setBookings([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchUpcoming();
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
          Upcoming Bookings
        </h3>
        <span
          onClick={() => navigate('/admin/bookings')}
          style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E56F0', cursor: 'pointer' }}
        >
          View All
        </span>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No upcoming bookings found.
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              onClick={() => navigate(`/admin/bookings/${b.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
            >
              {/* Left: Booking info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#EFF6FF',
                  color: '#1E56F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Calendar size={16} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0F172A' }}>
                    {b.guest}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    {b.date} • {b.property}
                  </div>
                </div>
              </div>

              {/* Right: Status badge */}
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: b.statusColor,
                backgroundColor: b.statusBg,
                border: `1px solid ${b.statusBorder}`,
                padding: '3px 8px',
                borderRadius: '9999px',
                flexShrink: 0
              }}>
                {b.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingBookingsCard;
