import React, { useState } from 'react';
import { Phone, FileText, Folder } from 'lucide-react';

/**
 * LeadCallHistoryTable Component (LMS PART 2 - Screen 3: Lead Details)
 * Activity Tabs (Call History, Notes, Documents) with interaction history log.
 * 100% SVG Vector (Zero Emojis).
 */
export const LeadCallHistoryTable = () => {
  const [activeTab, setActiveTab] = useState('call-history');

  const calls = [
    {
      dateTime: '11 Sep 2025, 10:30 AM',
      telecaller: 'Amit Sharma',
      outcome: 'Connected',
      outcomeBg: '#DCFCE7',
      outcomeColor: '#15803D',
      notes: 'Discussed property details. Customer interested.'
    },
    {
      dateTime: '11 Sep 2025, 04:15 PM',
      telecaller: 'Amit Sharma',
      outcome: 'No Answer',
      outcomeBg: '#FEF3C7',
      outcomeColor: '#B45309',
      notes: 'Will call again tomorrow.'
    },
    {
      dateTime: '12 Sep 2025, 02:00 PM',
      telecaller: 'Neha K.',
      outcome: 'Interested',
      outcomeBg: '#EFF6FF',
      outcomeColor: '#1D4ED8',
      notes: 'Shared brochure. Asked for pricing.'
    },
    {
      dateTime: '12 Sep 2025, 05:45 PM',
      telecaller: 'Neha K.',
      outcome: 'Follow-up',
      outcomeBg: '#ECFEFF',
      outcomeColor: '#0E7490',
      notes: 'Customer wants to talk with family.'
    },
  ];

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
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '0 16px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF'
      }}>
        {[
          { id: 'call-history', label: 'Call History', icon: Phone },
          { id: 'notes', label: 'Notes', icon: FileText },
          { id: 'documents', label: 'Documents', icon: Folder },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '2px solid #1E56F0' : '2px solid transparent',
                color: isActive ? '#1E56F0' : '#64748B',
                fontSize: '0.825rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Call History */}
      {activeTab === 'call-history' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                <th style={{ padding: '10px 14px' }}>Date & Time</th>
                <th style={{ padding: '10px 14px' }}>Telecaller</th>
                <th style={{ padding: '10px 14px' }}>Outcome</th>
                <th style={{ padding: '10px 14px' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx === calls.length - 1 ? 'none' : '1px solid #F1F5F9',
                    fontSize: '0.78rem'
                  }}
                >
                  <td style={{ padding: '10px 14px', color: '#0F172A', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {call.dateTime}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {call.telecaller}
                  </td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      backgroundColor: call.outcomeBg,
                      color: call.outcomeColor,
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {call.outcome}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#475569', lineHeight: 1.3 }}>
                    {call.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Notes Placeholder */}
      {activeTab === 'notes' && (
        <div style={{ padding: '24px', fontSize: '0.84rem', color: '#64748B', textAlign: 'center' }}>
          Customer is interested in 2-night weekend stay. Prefers pool view villa.
        </div>
      )}

      {/* Tab 3: Documents Placeholder */}
      {activeTab === 'documents' && (
        <div style={{ padding: '24px', fontSize: '0.84rem', color: '#64748B', textAlign: 'center' }}>
          No documents uploaded for this lead yet.
        </div>
      )}
    </div>
  );
};

export default LeadCallHistoryTable;
