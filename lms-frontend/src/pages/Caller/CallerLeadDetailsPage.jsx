import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  Edit3,
  FileText,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Send
} from 'lucide-react';
import leadService from '../../services/leadService';

const STATUS_CONFIG = {
  NEW: { label: 'New', color: '#0284C7', bg: '#E0F2FE', border: '#BAE6FD' },
  FOLLOW_UP: { label: 'Follow-up', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  HOT: { label: 'Hot Lead', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
  INTERESTED: { label: 'Interested', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  BOOKED: { label: 'Converted', color: '#15803D', bg: '#DCFCE7', border: '#86EFAC' },
  CANCELLED: { label: 'Cancelled', color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' },
  LOST: { label: 'Lost', color: '#94A3B8', bg: '#F8FAFC', border: '#CBD5E1' }
};

const OUTCOME_COLORS = {
  INTERESTED: { color: '#059669', bg: '#ECFDF5' },
  CALL_LATER: { color: '#D97706', bg: '#FEF3C7' },
  BUDGET_ISSUE: { color: '#EA580C', bg: '#FFEDD5' },
  CONFIRMED: { color: '#15803D', bg: '#DCFCE7' },
  LOST: { color: '#DC2626', bg: '#FEE2E2' },
  NO_ANSWER: { color: '#64748B', bg: '#F1F5F9' }
};

/**
 * CallerLeadDetailsPage Component
 * 100% Dynamic - connected to Spring Boot PostgreSQL backend with live timeline, call logs, notes, and stay details.
 */
export const CallerLeadDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Call History');

  // Quick note state
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Quick call log state
  const [showLogCallModal, setShowLogCallModal] = useState(false);
  const [callOutcome, setCallOutcome] = useState('INTERESTED');
  const [callDuration, setCallDuration] = useState(5);
  const [callRemarks, setCallRemarks] = useState('');
  const [nextFollowup, setNextFollowup] = useState('');
  const [isLoggingCall, setIsLoggingCall] = useState(false);

  const fetchLeadDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await leadService.getLeadById(id);
      setLead(data);
    } catch (err) {
      console.error('Failed to load lead details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      await leadService.addNote(id, newNote.trim());
      setNewNote('');
      fetchLeadDetails();
    } catch (err) {
      console.error('Failed to add note:', err);
      alert('Failed to add note.');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleLogCall = async (e) => {
    e.preventDefault();
    setIsLoggingCall(true);
    try {
      await leadService.logCall(id, {
        outcome: callOutcome,
        durationMinutes: parseInt(callDuration, 10) || 5,
        remarks: callRemarks,
        nextFollowupDate: nextFollowup ? new Date(nextFollowup).toISOString() : null
      });
      setShowLogCallModal(false);
      setCallRemarks('');
      setNextFollowup('');
      fetchLeadDetails();
    } catch (err) {
      console.error('Failed to log call:', err);
      alert('Failed to log call.');
    } finally {
      setIsLoggingCall(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '10px', color: '#64748B' }}>
        <Loader2 size={32} className="animate-spin" color="#1E56F0" />
        <span style={{ fontSize: '0.85rem' }}>Loading lead details...</span>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <AlertCircle size={36} color="#DC2626" style={{ margin: '0 auto 10px auto' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>Lead Not Found</h3>
        <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 16px 0' }}>The requested lead could not be found or has been archived.</p>
        <button
          type="button"
          onClick={() => navigate('/caller/leads')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1E56F0',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Back to Leads
        </button>
      </div>
    );
  }

  const customerName = lead.customerName || `Lead #${lead.id}`;
  const initials = customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'LD';
  const statusMeta = STATUS_CONFIG[lead.status] || { label: lead.status || 'Active', color: '#475569', bg: '#F1F5F9', border: '#E2E8F0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Back Button Link */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/caller/leads')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#1E56F0',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to My Leads</span>
        </button>
      </div>

      {/* Row 1: Profile Card + Timeline & Status + Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.6fr 1fr',
        gap: '16px',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Lead Profile Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {initials}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {customerName}
                  </h2>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: statusMeta.bg,
                    color: statusMeta.color,
                    border: `1px solid ${statusMeta.border}`
                  }}>
                    {statusMeta.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  {lead.mobileNumber || '-'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {lead.email || '-'}
                </div>
              </div>
            </div>

            {/* Meta Key-Values */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px 14px',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Property</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', marginTop: '1px' }}>
                  {lead.propertyName || lead.property?.name || 'Unassigned'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Source</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', marginTop: '1px' }}>
                  {lead.source ? String(lead.source).replace('_', ' ') : '-'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Assigned To</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', marginTop: '1px' }}>
                  {lead.assignedTo?.fullName || lead.assignedTo?.username || 'Unassigned'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Lead ID</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', marginTop: '1px' }}>
                  LD{String(lead.id).padStart(3, '0')}
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
            Created On: <strong>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</strong>
          </div>
        </div>

        {/* Center Column: Status & Followup Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '16px 18px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Current Pipeline Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: statusMeta.bg,
                color: statusMeta.color,
                border: `1px solid ${statusMeta.border}`
              }}>
                {statusMeta.label}
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: lead.priority === 'URGENT' || lead.priority === 'HIGH' ? '#DC2626' : '#D97706' }}>
                • {lead.priority || 'MEDIUM'} Priority
              </span>
            </div>

            <div style={{ marginTop: '14px', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Next Scheduled Follow-up</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {lead.nextFollowupDate 
                  ? new Date(lead.nextFollowupDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'No follow-up scheduled'}
              </div>
            </div>

            {lead.remarks && (
              <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#475569' }}>
                <strong>Remarks:</strong> {lead.remarks}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button
              type="button"
              onClick={() => setShowLogCallModal(true)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Log Call Outcome
            </button>

            <button
              type="button"
              onClick={() => navigate(`/caller/leads/${lead.id}/edit`)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#334155',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Edit Lead
            </button>
          </div>
        </div>

        {/* Right Column: Direct Quick Triggers */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '16px 18px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>
            Quick Contact
          </h4>

          {lead.mobileNumber && (
            <a
              href={`tel:${lead.mobileNumber}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                color: '#1E56F0',
                border: '1px solid #BFDBFE',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.78rem'
              }}
            >
              <Phone size={14} />
              <span>Call +91 {lead.mobileNumber}</span>
            </a>
          )}

          {lead.mobileNumber && (
            <a
              href={`https://wa.me/91${lead.mobileNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.78rem'
              }}
            >
              <MessageSquare size={14} />
              <span>Send WhatsApp</span>
            </a>
          )}

          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                color: '#475569',
                border: '1px solid #E2E8F0',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.78rem'
              }}
            >
              <Mail size={14} />
              <span>Send Email</span>
            </a>
          )}
        </div>
      </div>

      {/* Row 2: Tabs (Call History, Internal Notes, Stay Details) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 16px',
          backgroundColor: '#F8FAFC'
        }}>
          {['Call History', 'Internal Notes', 'Stay Details'].map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 18px',
                  border: 'none',
                  borderBottom: isSelected ? '2px solid #1E56F0' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: isSelected ? '#1E56F0' : '#64748B',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '18px 20px' }}>
          {/* TAB 1: Call History */}
          {activeTab === 'Call History' && (
            <div>
              {(!lead.callLogs || lead.callLogs.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94A3B8', fontSize: '0.82rem' }}>
                  No call logs recorded for this lead yet. Click "Log Call Outcome" above to record one.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {lead.callLogs.map((call, idx) => {
                    const outcomeMeta = OUTCOME_COLORS[call.outcome] || { color: '#475569', bg: '#F1F5F9' };
                    return (
                      <div
                        key={call.id || idx}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '9999px',
                              backgroundColor: outcomeMeta.bg,
                              color: outcomeMeta.color
                            }}>
                              {call.outcome}
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0F172A' }}>
                              {call.caller?.fullName || call.caller?.username || 'Telecaller'}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                              ({call.durationMinutes || 0} mins)
                            </span>
                          </div>

                          {call.remarks && (
                            <p style={{ fontSize: '0.75rem', color: '#475569', margin: '4px 0 0 0' }}>
                              {call.remarks}
                            </p>
                          )}
                        </div>

                        <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748B' }}>
                          {call.callDate ? new Date(call.callDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Internal Notes */}
          {activeTab === 'Internal Notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add an internal note about this customer..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmittingNote || !newNote.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#1E56F0',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: isSubmittingNote ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={13} />
                  <span>{isSubmittingNote ? 'Saving...' : 'Add Note'}</span>
                </button>
              </form>

              {(!lead.notes || lead.notes.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.82rem' }}>
                  No internal notes added yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lead.notes.map((noteItem, idx) => (
                    <div key={noteItem.id || idx} style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E56F0' }}>
                          {noteItem.author?.fullName || noteItem.author?.username || 'Team Member'}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                          {noteItem.createdAt ? new Date(noteItem.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#334155', margin: 0 }}>
                        {noteItem.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Stay Details */}
          {activeTab === 'Stay Details' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Number of Guests</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {lead.numberOfGuests ? `${lead.numberOfGuests} Guests` : '-'}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Budget</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                  {lead.budget ? `₹ ${Number(lead.budget).toLocaleString('en-IN')}` : '-'}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Target Dates</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {lead.checkInDate ? `${lead.checkInDate} to ${lead.checkOutDate || ''}` : '-'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log Call Outcome Modal */}
      {showLogCallModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px 24px',
            width: '420px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 14px 0' }}>
              Log Call with {customerName}
            </h3>

            <form onSubmit={handleLogCall} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Call Outcome
                </label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                >
                  <option value="INTERESTED">Interested</option>
                  <option value="CALL_LATER">Call Later / Follow-up</option>
                  <option value="CONFIRMED">Confirmed / Booked</option>
                  <option value="BUDGET_ISSUE">Budget Issue</option>
                  <option value="LOST">Lost</option>
                  <option value="NO_ANSWER">No Answer</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Call Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={callDuration}
                  onChange={(e) => setCallDuration(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.78rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Next Follow-up Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={nextFollowup}
                  onChange={(e) => setNextFollowup(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.78rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Call Remarks & Discussion Notes
                </label>
                <textarea
                  rows="3"
                  value={callRemarks}
                  onChange={(e) => setCallRemarks(e.target.value)}
                  placeholder="What was discussed during the call..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.78rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowLogCallModal(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoggingCall}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: '#1E56F0',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: isLoggingCall ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoggingCall ? 'Saving...' : 'Save Call Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallerLeadDetailsPage;
