import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, User, UserCheck, Calendar, Clock, Check } from 'lucide-react';

/**
 * Edit & Assign Lead Page (LMS PART 2 - Screen 4)
 * Lead summary overview, status & priority modification, and telecaller workload reassignment.
 * 100% SVG Vector (Zero Emojis).
 */
export const EditAssignLeadPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const leadId = id || 'LD002';

  const [status, setStatus] = useState('Follow-up');
  const [priority, setPriority] = useState('Medium');
  const [followUpDate, setFollowUpDate] = useState('2025-09-12');
  const [followUpTime, setFollowUpTime] = useState('02:00 PM');
  const [selectedTelecaller, setSelectedTelecaller] = useState('Amit Sharma');
  const [notes, setNotes] = useState('');

  const telecallers = [
    { name: 'Neha Kapoor', leads: '5 leads' },
    { name: 'Amit Sharma', leads: '8 leads' },
    { name: 'Ritika Patel', leads: '6 leads' },
    { name: 'Vikram Singh', leads: '7 leads' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Lead ${leadId} updated and assigned to ${selectedTelecaller}!`);
    navigate(`/admin/leads/${leadId}`);
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
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.15s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '6px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748B' }}>
        <Link to="/admin/leads" style={{ color: '#1E56F0', textDecoration: 'none', fontWeight: 600 }}>
          Leads
        </Link>
        <ChevronRight size={13} />
        <Link to={`/admin/leads/${leadId}`} style={{ color: '#1E56F0', textDecoration: 'none', fontWeight: 600 }}>
          {leadId}
        </Link>
        <ChevronRight size={13} />
        <span style={{ color: '#0F172A', fontWeight: 600 }}>Edit / Assign</span>
      </div>

      {/* 2. Top Header */}
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
            Edit Lead & Assign Telecaller
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748B',
            marginTop: '3px',
            margin: 0
          }}>
            Update lead details, change assignment or modify status.
          </p>
        </div>

        {/* Action Buttons: Cancel & Save Changes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate(`/admin/leads/${leadId}`)}
            style={{
              padding: '8px 16px',
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
            type="button"
            onClick={handleSave}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#1E56F0',
              color: '#FFFFFF',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(30, 86, 240, 0.25)'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* 3. Lead Summary Overview Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Left: Avatar + Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            PV
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                Pooja Verma
              </span>
              <span style={{ fontSize: '0.74rem', color: '#1E56F0', fontWeight: 700, backgroundColor: '#EFF6FF', padding: '1px 6px', borderRadius: '4px' }}>
                {leadId}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3px', fontSize: '0.76rem', color: '#64748B' }}>
              <span>+91 9876542222</span>
              <span>•</span>
              <span>pooja@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Center: Property & Source */}
        <div style={{ fontSize: '0.78rem' }}>
          <div style={{ color: '#64748B' }}>Property: <strong style={{ color: '#0F172A' }}>Pearl Resort</strong></div>
          <div style={{ color: '#64748B', marginTop: '2px' }}>Source: <strong style={{ color: '#0F172A' }}>Website</strong></div>
        </div>

        {/* Right: Status & Priority */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            border: '1px solid #FDE68A',
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '9999px'
          }}>
            Follow-up
          </span>
          <span style={{
            backgroundColor: '#FFFBEB',
            color: '#D97706',
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '6px'
          }}>
            ● Medium
          </span>
        </div>
      </div>

      {/* 4. Main Edit & Reassignment Form Grid (2 Columns) */}
      <form onSubmit={handleSave} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Change Status, Priority, Follow-up */}
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
          {/* Change Status */}
          <div>
            <label style={labelStyle}>Change Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="New">New</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Hot">Hot Lead</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Change Priority */}
          <div>
            <label style={labelStyle}>Change Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={inputStyle}
            >
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>
          </div>

          {/* Next Follow-up Date & Time */}
          <div>
            <label style={labelStyle}>Next Follow-up</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                value={followUpTime}
                onChange={(e) => setFollowUpTime(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Current Assignment, Assign Telecaller, Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Card: Current Assignment Details */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Current Assignment
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '0.78rem',
              backgroundColor: '#F8FAFC',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #F1F5F9'
            }}>
              <div>
                <span style={{ color: '#64748B' }}>Telecaller:</span>{' '}
                <strong style={{ color: '#0F172A' }}>Amit Sharma</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Team:</span>{' '}
                <strong style={{ color: '#0F172A' }}>Sales Team</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Assigned On:</span>{' '}
                <span style={{ color: '#334155' }}>11 Sep 2025, 10:24 AM</span>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Next Follow-up:</span>{' '}
                <span style={{ color: '#334155' }}>12 Sep 2025, 02:00 PM</span>
              </div>
            </div>

            {/* Assign to Telecaller with Workload List */}
            <div>
              <label style={labelStyle}>Assign to Telecaller</label>
              <div style={{
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {telecallers.map((t) => {
                  const isSelected = selectedTelecaller === t.name;
                  return (
                    <div
                      key={t.name}
                      onClick={() => setSelectedTelecaller(t.name)}
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={15} color={isSelected ? '#1E56F0' : '#64748B'} />
                        <span style={{
                          fontSize: '0.825rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#1E56F0' : '#0F172A'
                        }}>
                          {t.name}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                          ({t.leads})
                        </span>
                      </div>
                      {isSelected && <Check size={16} color="#1E56F0" strokeWidth={2.5} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assignment Notes */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ ...labelStyle, margin: 0 }}>Assignment Notes</label>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{notes.length}/500</span>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                placeholder="Add any notes for the telecaller..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Bottom Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 86, 240, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              Update Lead
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAssignLeadPage;
