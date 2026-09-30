import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, MessageSquare, ArrowRight, Smartphone } from 'lucide-react';

/**
 * CallerQuickActions Component (LMS PART 4 - Screen 1)
 * Telecaller workspace quick triggers and WhatsApp connectivity banner.
 * 100% SVG Vector (Zero Emojis).
 */
export const CallerQuickActions = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '16px 18px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      boxSizing: 'border-box',
      gap: '12px'
    }}>
      <div>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
          Quick Actions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* 1. Add New Lead */}
          <button
            type="button"
            onClick={() => navigate('/caller/leads/new')}
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
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(30, 86, 240, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add New Lead</span>
          </button>

          {/* 2. Schedule Follow-up */}
          <button
            type="button"
            onClick={() => navigate('/caller/follow-ups/calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              color: '#1E56F0',
              border: '1px solid #BFDBFE',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={14} strokeWidth={2.2} />
            <span>Schedule Follow-up</span>
          </button>

          {/* 3. View My Leads */}
          <button
            type="button"
            onClick={() => navigate('/caller/leads')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#F0FDF4',
              color: '#15803D',
              border: '1px solid #BBF7D0',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={14} strokeWidth={2.2} />
            <span>View My Leads</span>
          </button>

          {/* 4. WhatsApp Templates */}
          <button
            type="button"
            onClick={() => alert('Opening WhatsApp message templates...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#FAF5FF',
              color: '#7E22CE',
              border: '1px solid #E9D5FF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare size={14} strokeWidth={2.2} />
            <span>WhatsApp Templates</span>
          </button>
        </div>
      </div>

      {/* Stay Connected WhatsApp Banner Card */}
      <div style={{
        backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: '10px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MessageSquare size={16} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#14532D' }}>
              Stay Connected
            </div>
            <div style={{ fontSize: '0.67rem', color: '#166534', lineHeight: 1.2 }}>
              Use WhatsApp to follow up faster.
            </div>
          </div>
        </div>

        <ArrowRight size={14} color="#15803D" strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default CallerQuickActions;
