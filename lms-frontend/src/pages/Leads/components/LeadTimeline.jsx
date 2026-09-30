import React from 'react';
import { Check, Clock, Phone, UserCheck, Calendar, CheckCircle2, Bookmark } from 'lucide-react';

/**
 * LeadTimeline Component (LMS PART 2 - Screen 3: Lead Details)
 * 7-step horizontal visual pipeline progress tracker.
 * 100% SVG Vector (Zero Emojis).
 */
export const LeadTimeline = () => {
  const steps = [
    { id: 'created', label: 'Created', date: '11 Sep', status: 'completed', color: '#8B5CF6' },
    { id: 'assigned', label: 'Assigned', date: '11 Sep', status: 'completed', color: '#10B981' },
    { id: 'called', label: 'Called', date: '11 Sep', status: 'completed', color: '#3B82F6' },
    { id: 'follow-up', label: 'Follow-up', date: '12 Sep', status: 'active', color: '#F59E0B' },
    { id: 'interested', label: 'Interested', date: '-', status: 'pending', color: '#94A3B8' },
    { id: 'booking', label: 'Booking', date: '-', status: 'pending', color: '#94A3B8' },
    { id: 'converted', label: 'Converted', date: '-', status: 'pending', color: '#94A3B8' },
  ];

  return (
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
      <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
        Lead Timeline
      </h3>

      {/* Progress Track */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 10px'
      }}>
        {/* Background Connecting Line */}
        <div style={{
          position: 'absolute',
          top: '26px',
          left: '30px',
          right: '30px',
          height: '2px',
          backgroundColor: '#E2E8F0',
          zIndex: 0
        }} />

        {/* Completed Connecting Line (up to active step 4) */}
        <div style={{
          position: 'absolute',
          top: '26px',
          left: '30px',
          width: '50%',
          height: '2px',
          backgroundColor: '#1E56F0',
          zIndex: 0
        }} />

        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <div
              key={step.id}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {/* Step Circle */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? '#EFF6FF' : isActive ? '#FEF3C7' : '#F8FAFC',
                border: isCompleted ? '2px solid #1E56F0' : isActive ? '2px solid #F59E0B' : '2px solid #E2E8F0',
                color: isCompleted ? '#1E56F0' : isActive ? '#D97706' : '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? '0 0 0 4px rgba(245, 158, 11, 0.15)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                {isCompleted ? (
                  <Check size={14} strokeWidth={2.8} />
                ) : (
                  <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>{idx + 1}</span>
                )}
              </div>

              {/* Label & Date */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#0F172A' : isCompleted ? '#1E293B' : '#94A3B8'
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '1px' }}>
                  {step.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadTimeline;
