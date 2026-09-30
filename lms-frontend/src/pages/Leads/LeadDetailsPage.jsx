import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  MessageSquare, 
  CalendarClock, 
  UserCheck, 
  Flame, 
  XCircle,
  Building2,
  Clock,
  User,
  CreditCard,
  Calendar,
  Send,
  Plus
} from 'lucide-react';
import Badge from '../../components/Common/Badge';
import leadService from '../../services/leadService';
import bookingService from '../../services/bookingService';
import CreateBookingModal from '../Bookings/components/CreateBookingModal';

/**
 * Lead Details Page (LMS PART 2 - Screen 3)
 * Connected to live Spring Boot REST API.
 */
export const LeadDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals / Input States
  const [showLogCallModal, setShowLogCallModal] = useState(false);
  const [showConvertBookingModal, setShowConvertBookingModal] = useState(false);
  const [callOutcome, setCallOutcome] = useState('INTERESTED');
  const [callDuration, setCallDuration] = useState(5);
  const [callRemarks, setCallRemarks] = useState('');
  const [nextFollowup, setNextFollowup] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeadById(id);
      setLead(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch lead');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await leadService.updateStatus(lead.id, status);
      fetchLead();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleLogCallSubmit = async (e) => {
    e.preventDefault();
    try {
      await leadService.logCall(lead.id, {
        outcome: callOutcome,
        durationMinutes: Number(callDuration),
        remarks: callRemarks,
        nextFollowupDate: nextFollowup ? nextFollowup + ':00' : undefined
      });
      setShowLogCallModal(false);
      setCallRemarks('');
      fetchLead();
    } catch (err) {
      alert('Failed to log call: ' + err.message);
    }
  };

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await leadService.addNote(lead.id, newNote.trim());
      setNewNote('');
      fetchLead();
    } catch (err) {
      alert('Failed to add note: ' + err.message);
    }
  };

  const handleConvertToBooking = () => {
    setShowConvertBookingModal(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '₹ 0';
    return '₹ ' + Number(val).toLocaleString('en-IN');
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
        Loading lead details from server...
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
        <h3>Error: {error || 'Lead not found'}</h3>
        <button onClick={() => navigate('/admin/leads')} style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '6px' }}>
          Back to All Leads
        </button>
      </div>
    );
  }

  const initials = lead.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748B' }}>
        <Link to="/admin/leads" style={{ color: '#1E56F0', textDecoration: 'none', fontWeight: 600 }}>
          Leads
        </Link>
        <ChevronRight size={13} />
        <span style={{ color: '#0F172A', fontWeight: 600 }}>#{lead.id} — {lead.customerName}</span>
      </div>

      {/* 2. Lead Hero Profile Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '14px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Left: Avatar + Identity + Contacts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: '#1E56F0',
            color: '#FFFFFF',
            fontSize: '1.15rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 3px 8px rgba(30, 86, 240, 0.25)'
          }}>
            {initials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {lead.customerName}
              </h2>
              <Badge type="status" value={lead.status} />
              <Badge type="priority" value={lead.priority} />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginTop: '6px',
              fontSize: '0.8rem',
              color: '#475569'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={13} color="#1E56F0" />
                <strong>{lead.mobileNumber}</strong>
              </span>
              {lead.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} color="#64748B" />
                  <span>{lead.email}</span>
                </span>
              )}
              {lead.city && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#64748B" />
                  <span>{lead.city}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowLogCallModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #BFDBFE',
              backgroundColor: '#EFF6FF',
              color: '#1E56F0',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Phone size={15} />
            <span>Log Call Outcome</span>
          </button>

          <button
            type="button"
            disabled={isConverting || lead.status === 'BOOKED'}
            onClick={handleConvertToBooking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: lead.status === 'BOOKED' ? '#10B981' : '#16A34A',
              color: '#FFFFFF',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: lead.status === 'BOOKED' ? 'default' : 'pointer',
              boxShadow: '0 3px 10px rgba(22, 163, 74, 0.25)'
            }}
          >
            <UserCheck size={15} strokeWidth={2.5} />
            <span>{lead.status === 'BOOKED' ? 'Booking Confirmed ✓' : 'Convert to Booking'}</span>
          </button>
        </div>
      </div>

      {/* 3. Grid: Left Details & Right Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        {/* Left Column: Lead Specifications & Call Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Stay Specs Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Stay & Property Preference
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Property:</span>
                <strong style={{ color: '#0F172A' }}>{lead.propertyName || 'General Inquiry'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Acquisition Source:</span>
                <strong style={{ color: '#0F172A' }}>{lead.source}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Stay Window:</span>
                <strong style={{ color: '#0F172A' }}>{formatDate(lead.checkInDate)} → {formatDate(lead.checkOutDate)}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Guest Count:</span>
                <strong style={{ color: '#0F172A' }}>{lead.numberOfGuests || 'Not specified'} Guests</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Target Budget:</span>
                <strong style={{ color: '#16A34A', fontSize: '0.95rem' }}>{formatCurrency(lead.budget)}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', marginBottom: '2px' }}>Assigned Telecaller:</span>
                <strong style={{ color: '#0F172A' }}>{lead.assignedToName || 'Unassigned'}</strong>
              </div>
            </div>

            {lead.remarks && (
              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                <strong style={{ color: '#334155' }}>Guest Requirements / Remarks:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#475569' }}>{lead.remarks}</p>
              </div>
            )}
          </div>

          {/* Call Logs Table */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Telecaller Call History ({lead.callLogs?.length || 0})
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    <th style={{ padding: '9px 12px' }}>Date & Time</th>
                    <th style={{ padding: '9px 12px' }}>Caller</th>
                    <th style={{ padding: '9px 10px' }}>Outcome</th>
                    <th style={{ padding: '9px 12px' }}>Duration</th>
                    <th style={{ padding: '9px 12px' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {!lead.callLogs || lead.callLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '0.8rem' }}>
                        No calls logged yet. Click "Log Call Outcome" above to record the first contact.
                      </td>
                    </tr>
                  ) : (
                    lead.callLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.78rem' }}>
                        <td style={{ padding: '10px 12px', color: '#0F172A', fontWeight: 600 }}>
                          {formatDate(log.callDate)}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#475569' }}>
                          {log.callerName || 'Staff'}
                        </td>
                        <td style={{ padding: '10px 10px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: log.outcome === 'CONFIRMED' ? '#DCFCE7' : '#EFF6FF',
                            color: log.outcome === 'CONFIRMED' ? '#16A34A' : '#1E56F0',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            {log.outcome}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#64748B' }}>
                          {log.durationMinutes ? `${log.durationMinutes} mins` : '—'}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>
                          {log.remarks || 'No remarks recorded'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive CRM Timeline & Internal Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Add Quick Internal Note */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '18px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
          }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
              Add Internal Remark
            </h4>
            <form onSubmit={handleAddNoteSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a note about this customer..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#1E56F0',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Post
              </button>
            </form>
          </div>

          {/* Chronological Activity Feed */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
          }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
              Activity & Audit Feed
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!lead.activities || lead.activities.length === 0 ? (
                <p style={{ color: '#64748B', fontSize: '0.8rem', margin: 0 }}>No activity logged yet.</p>
              ) : (
                lead.activities.map((act) => (
                  <div key={act.id} style={{ display: 'flex', gap: '10px', fontSize: '0.78rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E56F0', marginTop: '5px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{act.description}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
                        By {act.userName || 'System'} • {formatDate(act.activityTime)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Call Modal */}
      {showLogCallModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '24px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>
              Log Telecaller Call with {lead.customerName}
            </h3>

            <form onSubmit={handleLogCallSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Call Outcome *</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                >
                  <option value="INTERESTED">INTERESTED</option>
                  <option value="CALL_LATER">CALL LATER</option>
                  <option value="BUDGET_ISSUE">BUDGET ISSUE</option>
                  <option value="CONFIRMED">CONFIRMED (READY TO BOOK)</option>
                  <option value="LOST">LOST / CANCELLED</option>
                  <option value="NO_ANSWER">NO ANSWER</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Call Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={callDuration}
                  onChange={(e) => setCallDuration(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Next Follow-up Date & Time</label>
                <input
                  type="datetime-local"
                  value={nextFollowup}
                  onChange={(e) => setNextFollowup(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Call Notes / Remarks</label>
                <textarea
                  rows="3"
                  value={callRemarks}
                  onChange={(e) => setCallRemarks(e.target.value)}
                  placeholder="Summary of conversation..."
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowLogCallModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#1E56F0', color: '#FFFFFF', fontWeight: 700 }}
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert to Booking Modal */}
      {showConvertBookingModal && (
        <CreateBookingModal
          isOpen={showConvertBookingModal}
          onClose={() => setShowConvertBookingModal(false)}
          onSuccess={(newBooking) => {
            fetchLead();
            navigate('/admin/bookings/list');
          }}
          initialData={{
            leadId: lead.id,
            propertyId: lead.propertyId || '',
            customerName: lead.customerName || '',
            mobileNumber: lead.mobileNumber || '',
            email: lead.email || '',
            budget: lead.budget || 35000,
            checkInDate: lead.checkInDate || '',
            checkOutDate: lead.checkOutDate || '',
            numberOfGuests: lead.numberOfGuests || 2,
            remarks: lead.remarks || ''
          }}
        />
      )}
    </div>
  );
};

export default LeadDetailsPage;
