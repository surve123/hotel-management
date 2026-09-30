import React from 'react';
import { Plus, UserCheck, CalendarClock, BarChart3, HelpCircle, Headphones, ArrowRight } from 'lucide-react';

/**
 * QuickActionsPanel Component (LMS PART 1 - Screen 4)
 * Stacked Quick Action CTAs and Support Card.
 * 100% SVG Vector (Zero Emojis).
 */
export const QuickActionsPanel = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Quick Actions Box */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '18px 20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Quick Actions
        </h3>

        {/* 1. Add New Lead (Primary Blue) */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '11px 16px',
            borderRadius: '9px',
            backgroundColor: '#1E56F0',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(30, 86, 240, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add New Lead</span>
        </button>

        {/* 2. Assign Lead (Soft Emerald) */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 16px',
            borderRadius: '9px',
            backgroundColor: '#ECFDF5',
            color: '#059669',
            border: '1px solid #A7F3D0',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <UserCheck size={16} strokeWidth={2.2} />
          <span>Assign Lead</span>
        </button>

        {/* 3. Schedule Follow-up (Soft Purple) */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 16px',
            borderRadius: '9px',
            backgroundColor: '#F5F3FF',
            color: '#7C3AED',
            border: '1px solid #DDD6FE',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <CalendarClock size={16} strokeWidth={2.2} />
          <span>Schedule Follow-up</span>
        </button>

        {/* 4. View Reports (Soft Slate/Blue) */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 16px',
            borderRadius: '9px',
            backgroundColor: '#F8FAFC',
            color: '#2563EB',
            border: '1px solid #E2E8F0',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <BarChart3 size={16} strokeWidth={2.2} />
          <span>View Reports</span>
        </button>
      </div>

      {/* Need Help? Support Card */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '1px solid #BFDBFE',
        borderRadius: '12px',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        {/* Support Avatar */}
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: '#1E56F0',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 10px rgba(30, 86, 240, 0.25)'
        }}>
          <Headphones size={20} strokeWidth={2.2} />
        </div>

        {/* Support Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E3A8A' }}>
            Need Help?
          </div>
          <div style={{ fontSize: '0.74rem', color: '#3B82F6', marginTop: '2px', lineHeight: 1.25 }}>
            Got a question or need assistance?
          </div>
          <div style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#1D4ED8',
            marginTop: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}>
            <span>Contact Support</span>
            <ArrowRight size={12} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
