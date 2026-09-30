import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, Check, ArrowLeft, Loader2 } from 'lucide-react';
import leadService from '../../services/leadService';
import propertyService from '../../services/propertyService';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

/**
 * Add New Lead Page (LMS PART 2 - Screen 2)
 * Connected to Spring Boot backend API.
 */
export const AddNewLeadPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const leadsPath = role === ROLES.CALLER ? '/caller/leads' : '/admin/leads';
  const [properties, setProperties] = useState([]);
  const [telecallers, setTelecallers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    email: '',
    city: '',
    source: 'INSTAGRAM',
    propertyId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 2,
    budget: '',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedToUserId: '',
    remarks: '',
    nextFollowupDate: ''
  });

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      const [props, users] = await Promise.all([
        propertyService.getProperties(true),
        userService.getUsers('ROLE_TELECALLER')
      ]);
      if (props) setProperties(props);
      if (users) setTelecallers(users);
    } catch (err) {
      console.error('Failed to load properties or team roster:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: formData.customerName,
        mobileNumber: formData.mobileNumber,
        email: formData.email || undefined,
        city: formData.city || undefined,
        source: formData.source,
        propertyId: formData.propertyId ? Number(formData.propertyId) : undefined,
        checkInDate: formData.checkInDate || undefined,
        checkOutDate: formData.checkOutDate || undefined,
        numberOfGuests: formData.numberOfGuests ? Number(formData.numberOfGuests) : undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
        priority: formData.priority,
        status: formData.status,
        assignedToUserId: formData.assignedToUserId ? Number(formData.assignedToUserId) : undefined,
        remarks: formData.remarks || undefined,
        nextFollowupDate: formData.nextFollowupDate ? formData.nextFollowupDate + ':00' : undefined
      };

      await leadService.createLead(payload);
      navigate(leadsPath);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* 1. Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748B' }}>
        <Link to="/admin/leads" style={{ color: '#1E56F0', textDecoration: 'none', fontWeight: 600 }}>
          Leads
        </Link>
        <ChevronRight size={13} />
        <span style={{ color: '#0F172A', fontWeight: 600 }}>Add New Lead</span>
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
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Create New Inquiry
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '3px', margin: 0 }}>
            Enter guest details and assign to a sales telecaller.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#B91C1C',
          fontSize: '0.85rem'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Section 1: Guest Information */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
            1. Guest Contact Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Customer Name *</label>
              <input
                type="text"
                name="customerName"
                required
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. Vikram Malhotra"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Mobile Number *</label>
              <input
                type="tel"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="e.g. 9820198201"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. vikram@gmail.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Inquiry & Stay Details */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
            2. Property & Booking Preferences
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Preferred Property</label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">General Inquiry / Undecided</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Lead Source *</label>
              <select
                name="source"
                required
                value={formData.source}
                onChange={handleChange}
                style={inputStyle}
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
              <label style={labelStyle}>Check-in Date</label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Check-out Date</label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Number of Guests</label>
              <input
                type="number"
                name="numberOfGuests"
                min="1"
                value={formData.numberOfGuests}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Estimated Budget (₹)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. 50000"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Section 3: CRM Assignment & Follow-up */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
            3. CRM Assignment & Follow-up
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Assign to Telecaller</label>
              <select
                name="assignedToUserId"
                value={formData.assignedToUserId}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Unassigned / Pool</option>
                {telecallers.map(u => (
                  <option key={u.id} value={u.id}>{u.fullName} ({u.username})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Next Follow-up Date & Time</label>
              <input
                type="datetime-local"
                name="nextFollowupDate"
                value={formData.nextFollowupDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Internal Remarks / Requirements</label>
            <textarea
              name="remarks"
              rows="3"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="e.g. Inquired about pool party setup, private chef for 15 people."
              style={{ ...inputStyle, height: 'auto', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={() => navigate(leadsPath)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#1E56F0',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 3px 10px rgba(30, 86, 240, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isSubmitting ? 'Creating Lead...' : 'Create Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewLeadPage;
