import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, Mail, Star, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

/**
 * Update Follow-up Page (LMS PART 3 - Screen 3)
 * Log call details, interactive 5-star customer interest rating, schedule next follow-up, and vertical timeline.
 * 100% SVG Vector (Zero Emojis).
 */
export const UpdateFollowupPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const basePath = role === ROLES.CALLER ? '/caller/follow-ups' : '/admin/follow-ups';

  const [callDate, setCallDate] = useState('2025-09-11');
  const [callTime, setCallTime] = useState('10:00 AM');
  const [callDuration, setCallDuration] = useState('8 minutes');
  const [callOutcome, setCallOutcome] = useState('Interested');
  const [interestLevel, setInterestLevel] = useState(4);
  const [nextDate, setNextDate] = useState('2025-09-12');
  const [nextTime, setNextTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('Customer is interested in pool villa. Will confirm by tomorrow.');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Follow-up updated successfully!');
    navigate(basePath);
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '0.84rem',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '6px'
  };

  const timelineSteps = [
    { label: 'Lead Created', date: '19 May 2025, 10:00 AM', status: 'done', color: '#8B5CF6' },
    { label: 'Assigned', date: '19 May 2025, 11:00 AM', status: 'done', color: '#10B981' },
    { label: 'Follow-up', date: '20 May 2025, 10:00 AM', status: 'done', color: '#3B82F6' },
    { label: 'Interested', date: '11 Sep 2025, 10:00 AM', status: 'active', color: '#F59E0B' },
    { label: 'Next Follow-up', date: '12 Sep 2025, 11:00 AM', status: 'pending', color: '#94A3B8' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header */}
      <div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.2,
          margin: 0
        }}>
          Update Follow-up
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748B',
          marginTop: '3px',
          margin: 0
        }}>
          Log your call details and set the next follow-up.
        </p>
      </div>

      {/* 2. Main 3-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 2fr 1.2fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Lead Information Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Lead Information
          </h3>

          {/* Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#1E56F0',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              RS
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                  Rahul Sharma
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                +91 98765 43210
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
            <span style={{ color: '#64748B' }}>rahul@gmail.com</span>
            <span style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '9999px'
            }}>
              Hot Lead
            </span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: 0 }} />

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Property</div>
              <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '1px' }}>
                Celebrino Garden Villa
              </div>
            </div>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Source</div>
              <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '1px' }}>
                Instagram
              </div>
            </div>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Assigned To</div>
              <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '1px' }}>
                Amit Sharma
              </div>
            </div>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Last Follow-up</div>
              <div style={{ color: '#475569', marginTop: '1px' }}>
                19 May 2025, 10:00 AM
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Call Details Form */}
        <form onSubmit={handleSave} style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Call Details
          </h3>

          {/* Call Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Call Date <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="date"
                required
                value={callDate}
                onChange={(e) => setCallDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Call Time <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="text"
                required
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Call Duration */}
          <div>
            <label style={labelStyle}>Call Duration</label>
            <select
              value={callDuration}
              onChange={(e) => setCallDuration(e.target.value)}
              style={inputStyle}
            >
              <option value="5 minutes">5 minutes</option>
              <option value="8 minutes">8 minutes</option>
              <option value="15 minutes">15 minutes</option>
              <option value="30 minutes">30 minutes</option>
            </select>
          </div>

          {/* Call Outcome */}
          <div>
            <label style={labelStyle}>Call Outcome <span style={{ color: '#EF4444' }}>*</span></label>
            <select
              value={callOutcome}
              onChange={(e) => setCallOutcome(e.target.value)}
              style={inputStyle}
            >
              <option value="Interested">Interested</option>
              <option value="Connected">Connected</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="No Answer">No Answer</option>
              <option value="Busy">Busy</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Customer Interest Level (Interactive 5-Star Rating) */}
          <div>
            <label style={labelStyle}>Customer Interest Level</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setInterestLevel(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    color: star <= interestLevel ? '#F59E0B' : '#CBD5E1',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Star size={20} fill={star <= interestLevel ? '#F59E0B' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* Next Follow-up Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Next Follow-up Date <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="date"
                required
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Next Follow-up Time <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="text"
                required
                value={nextTime}
                onChange={(e) => setNextTime(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Remarks / Notes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ ...labelStyle, margin: 0 }}>Remarks / Notes</label>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{notes.length}/500</span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => navigate(basePath)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 86, 240, 0.25)'
              }}
            >
              Save Follow-up
            </button>
          </div>
        </form>

        {/* Right Column: Quick Actions & Vertical Lead Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Quick Actions Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              Quick Actions
            </h3>

            {/* Call Customer */}
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Phone size={14} />
              <span>Call Customer</span>
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: '#F0FDF4',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </button>

            {/* Send Email */}
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: '#F5F3FF',
                color: '#7C3AED',
                border: '1px solid #DDD6FE',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Mail size={14} />
              <span>Send Email</span>
            </button>
          </div>

          {/* Vertical Lead Timeline */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Lead Timeline
            </h3>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '8px' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                top: '8px',
                bottom: '10px',
                left: '17px',
                width: '2px',
                backgroundColor: '#E2E8F0',
                zIndex: 0
              }} />

              {timelineSteps.map((step, idx) => {
                const isDone = step.status === 'done';
                const isActive = step.status === 'active';

                return (
                  <div key={idx} style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isDone ? step.color : isActive ? '#FEF3C7' : '#FFFFFF',
                      border: isDone ? `2px solid ${step.color}` : isActive ? '2px solid #F59E0B' : '2px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {isDone && <CheckCircle2 size={12} color="#FFFFFF" strokeWidth={3} />}
                      {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />}
                    </div>

                    <div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#0F172A' : isDone ? '#1E293B' : '#94A3B8'
                      }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>
                        {step.date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFollowupPage;
