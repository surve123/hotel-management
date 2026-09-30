import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, User, Building, Phone, Mail } from 'lucide-react';
import leadService from '../../services/leadService';
import propertyService from '../../services/propertyService';
import userService from '../../services/userService';

/**
 * CallerEditAssignLeadPage Component
 * 100% Dynamic - connected to Spring Boot PostgreSQL backend.
 */
export const CallerEditAssignLeadPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [properties, setProperties] = useState([]);
  const [telecallers, setTelecallers] = useState([]);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [budget, setBudget] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [source, setSource] = useState('INSTAGRAM');
  const [status, setStatus] = useState('NEW');
  const [priority, setPriority] = useState('MEDIUM');
  const [assignedToId, setAssignedToId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [nextFollowupDate, setNextFollowupDate] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchFormData = async () => {
      setIsLoading(true);
      try {
        const [leadRes, propsRes, callersRes] = await Promise.allSettled([
          leadService.getLeadById(id),
          propertyService.getProperties(true),
          userService.getUsers('ROLE_TELECALLER')
        ]);

        if (isMounted) {
          if (propsRes.status === 'fulfilled') setProperties(propsRes.value || []);
          if (callersRes.status === 'fulfilled') setTelecallers(callersRes.value || []);

          if (leadRes.status === 'fulfilled' && leadRes.value) {
            const l = leadRes.value;
            setCustomerName(l.customerName || '');
            setMobileNumber(l.mobileNumber || '');
            setEmail(l.email || '');
            setCity(l.city || '');
            setNumberOfGuests(l.numberOfGuests || 2);
            setCheckInDate(l.checkInDate || '');
            setCheckOutDate(l.checkOutDate || '');
            setBudget(l.budget !== undefined ? String(l.budget) : '');
            setPropertyId(l.property?.id || l.propertyId || '');
            setSource(l.source || 'INSTAGRAM');
            setStatus(l.status || 'NEW');
            setPriority(l.priority || 'MEDIUM');
            setAssignedToId(l.assignedTo?.id || '');
            setRemarks(l.remarks || '');
            if (l.nextFollowupDate) {
              setNextFollowupDate(l.nextFollowupDate.substring(0, 16));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load lead edit form:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFormData();
    return () => { isMounted = false; };
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await leadService.updateLead(id, {
        customerName,
        mobileNumber,
        email,
        city,
        numberOfGuests: parseInt(numberOfGuests, 10) || 1,
        checkInDate: checkInDate || null,
        checkOutDate: checkOutDate || null,
        budget: budget ? parseFloat(budget) : null,
        propertyId: propertyId ? parseInt(propertyId, 10) : null,
        source,
        status,
        priority,
        assignedToId: assignedToId ? parseInt(assignedToId, 10) : null,
        remarks,
        nextFollowupDate: nextFollowupDate ? new Date(nextFollowupDate).toISOString() : null
      });

      alert('Lead updated successfully!');
      navigate(`/caller/leads/${id}`);
    } catch (err) {
      console.error('Failed to update lead:', err);
      alert('Failed to update lead. Please verify all inputs.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '8px', color: '#64748B' }}>
        <Loader2 size={32} className="animate-spin" color="#1E56F0" />
        <span style={{ fontSize: '0.85rem' }}>Loading lead details...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <button
            type="button"
            onClick={() => navigate(`/caller/leads/${id}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#1E56F0',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              marginBottom: '6px'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Lead</span>
          </button>

          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            margin: 0
          }}>
            Edit Lead (LD{String(id).padStart(3, '0')})
          </h1>
          <p style={{
            fontSize: '0.82rem',
            color: '#64748B',
            marginTop: '2px',
            margin: 0
          }}>
            Update customer information, property requirements, and assignment.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => navigate(`/caller/leads/${id}`)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#1E56F0',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(30, 86, 240, 0.25)'
            }}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Edit Form Grid */}
      <form onSubmit={handleSave} style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* Left Column: Customer & Stay Details */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0, borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
            Customer Information
          </h3>

          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Check-in Date
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Budget (INR)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 50000"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Right Column: Status, Property, Lead Source, Assignment */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0, borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
            Pipeline & Property Assignment
          </h3>

          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Target Property
            </label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="">-- Select Property --</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Lead Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                <option value="NEW">New</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="HOT">Hot Lead</option>
                <option value="INTERESTED">Interested</option>
                <option value="BOOKED">Booked / Converted</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Lead Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                <option value="INSTAGRAM">Instagram</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="WEBSITE">Website</option>
                <option value="DIRECT_CALL">Direct Call</option>
                <option value="REFERRAL">Referral</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Assigned Telecaller
              </label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                <option value="">-- Unassigned --</option>
                {telecallers.map(t => (
                  <option key={t.id} value={t.id}>{t.fullName || t.username}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Next Follow-up Date & Time
            </label>
            <input
              type="datetime-local"
              value={nextFollowupDate}
              onChange={(e) => setNextFollowupDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Remarks & Internal Notes
            </label>
            <textarea
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Notes about customer preferences, requirements..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8rem',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CallerEditAssignLeadPage;
