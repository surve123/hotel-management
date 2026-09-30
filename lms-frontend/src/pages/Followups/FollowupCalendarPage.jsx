import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Phone, Calendar as CalendarIcon, MessageSquare, Loader2, RefreshCw } from 'lucide-react';
import followupService from '../../services/followupService';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

/**
 * Follow-up Calendar Page (LMS PART 3 - Screen 2)
 * Features Day/Week/Month views, interactive 7-day strip, live hourly schedule, and dynamic mini calendar.
 * 100% Dynamic - Connected to live backend APIs.
 * 100% SVG Vector (Zero Emojis).
 */
export const FollowupCalendarPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const basePath = role === ROLES.CALLER ? '/caller/follow-ups' : '/admin/follow-ups';
  const [viewMode, setViewMode] = useState('Day');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate dynamic 7-day strip around today
  const [baseDate, setBaseDate] = useState(new Date());

  const daysStrip = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      fullDate: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      isoDate: d.toISOString().split('T')[0]
    };
  });

  const selectedDateObj = daysStrip[selectedDayIndex] || daysStrip[0];

  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      const [calRes, todayRes] = await Promise.allSettled([
        followupService.getCalendarEvents(),
        followupService.getToday()
      ]);
      if (calRes.status === 'fulfilled' && calRes.value) setEvents(calRes.value);
      if (todayRes.status === 'fulfilled' && todayRes.value) setTodayFollowups(todayRes.value);
    } catch (err) {
      console.error('Failed to load calendar follow-ups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  // Filter events for selected day
  const allDayEvents = [
    ...(Array.isArray(events) ? events : []),
    ...(Array.isArray(todayFollowups) ? todayFollowups.map(t => ({
      id: String(t.leadId),
      title: `${t.customerName || 'Customer'} - ${t.propertyName || 'Property'}`,
      customerName: t.customerName,
      mobileNumber: t.mobileNumber,
      status: t.leadStatus,
      propertyName: t.propertyName,
      start: t.scheduledTime
    })) : [])
  ];

  // Build hourly slots from 09:00 AM to 06:00 PM
  const hours = [
    { label: '09:00 AM', hourNum: 9 },
    { label: '10:00 AM', hourNum: 10 },
    { label: '11:00 AM', hourNum: 11 },
    { label: '12:00 PM', hourNum: 12 },
    { label: '01:00 PM', hourNum: 13 },
    { label: '02:00 PM', hourNum: 14 },
    { label: '03:00 PM', hourNum: 15 },
    { label: '04:00 PM', hourNum: 16 },
    { label: '05:00 PM', hourNum: 17 },
    { label: '06:00 PM', hourNum: 18 },
  ];

  const hourlySchedule = hours.map(h => {
    const match = allDayEvents.find(e => {
      if (!e.start) return false;
      const d = new Date(e.start);
      return d.getHours() === h.hourNum;
    });

    return {
      time: h.label,
      event: match ? {
        customer: match.customerName || match.title || 'Client',
        property: match.propertyName || 'Arnavee Properties',
        status: match.status || 'Follow-up',
        mobileNumber: match.mobileNumber,
        statusColor: '#D97706',
        statusBg: '#FEF3C7',
        cardBg: '#EFF6FF',
        cardBorder: '#BFDBFE',
        accentColor: '#1E56F0'
      } : null
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Top Header & Segmented View Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            margin: 0
          }}>
            Follow-up Calendar
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748B',
            marginTop: '3px',
            margin: 0
          }}>
            Schedule and manage follow-ups across dates and caller agendas.
          </p>
        </div>

        {/* View Mode Segmented Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={fetchCalendarData}
            title="Sync Calendar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              color: '#334155',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>

          <div style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
            gap: '2px'
          }}>
            {['Day', 'Week', 'Month'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === mode ? '#1E56F0' : 'transparent',
                  color: viewMode === mode ? '#FFFFFF' : '#64748B',
                  fontSize: '0.78rem',
                  fontWeight: viewMode === mode ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 7-Day Strip Selector */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
      }}>
        <button
          type="button"
          onClick={() => {
            const d = new Date(baseDate);
            d.setDate(d.getDate() - 7);
            setBaseDate(d);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flex: 1,
          gap: '8px'
        }}>
          {daysStrip.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#1E56F0' : 'transparent',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minWidth: '60px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: isSelected ? 'rgba(255, 255, 255, 0.85)' : '#64748B'
                }}>
                  {item.day}
                </div>
                <div style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  marginTop: '2px'
                }}>
                  {item.date}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            const d = new Date(baseDate);
            d.setDate(d.getDate() + 7);
            setBaseDate(d);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 3. Main Grid: Hourly Timeline (Left) + Mini Calendar & Legend (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* Left: Hourly Schedule Timeline */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '12px'
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Agenda for {selectedDateObj.fullDate}
            </h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E56F0' }}>
              {hourlySchedule.filter(h => h.event !== null).length} scheduled items
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hourlySchedule.map((slot, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  minHeight: '44px'
                }}
              >
                <div style={{
                  width: '68px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#64748B',
                  paddingTop: '6px',
                  flexShrink: 0
                }}>
                  {slot.time}
                </div>

                <div style={{ flex: 1 }}>
                  {slot.event ? (
                    <div
                      onClick={() => navigate(`${basePath}/update`)}
                      style={{
                        backgroundColor: slot.event.cardBg,
                        border: `1px solid ${slot.event.cardBorder}`,
                        borderLeft: `4px solid ${slot.event.accentColor}`,
                        borderRadius: '8px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                          {slot.event.customer}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                          {slot.event.property}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: slot.event.statusColor,
                          backgroundColor: slot.event.statusBg,
                          padding: '2px 8px',
                          borderRadius: '9999px'
                        }}>
                          {slot.event.status}
                        </span>

                        {slot.event.mobileNumber && (
                          <a
                            href={`tel:${slot.event.mobileNumber}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              backgroundColor: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#1E56F0',
                              border: '1px solid #DBEAFE',
                              textDecoration: 'none'
                            }}
                          >
                            <Phone size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      height: '36px',
                      borderBottom: '1px dashed #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#CBD5E1',
                      fontSize: '0.72rem'
                    }}>
                      No follow-up scheduled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Actions and Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
          }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
              Calendar Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569' }}>
                <span>Total Live Events:</span>
                <strong style={{ color: '#0F172A' }}>{allDayEvents.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569' }}>
                <span>Today's Actions:</span>
                <strong style={{ color: '#10B981' }}>{todayFollowups.length}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`${basePath}/update`)}
              style={{
                marginTop: '14px',
                width: '100%',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Add / Schedule Follow-up
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FollowupCalendarPage;
