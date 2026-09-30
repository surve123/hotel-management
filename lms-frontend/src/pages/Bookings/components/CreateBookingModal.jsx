import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  User,
  FileText,
  Upload,
  Clock,
  Sparkles,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import propertyService from '../../../services/propertyService';
import bookingService from '../../../services/bookingService';

export const CreateBookingModal = ({ isOpen, onClose, onSuccess, initialData = {} }) => {
  const [properties, setProperties] = useState([]);
  const [isLoadingProps, setIsLoadingProps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    leadId: initialData.leadId || null,
    propertyId: initialData.propertyId || '',
    customerName: initialData.customerName || '',
    mobileNumber: initialData.mobileNumber || '',
    email: initialData.email || '',
    checkInDate: initialData.checkInDate || new Date().toISOString().split('T')[0],
    checkOutDate: initialData.checkOutDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    numberOfGuests: initialData.numberOfGuests || 2,
    totalAmount: initialData.budget || 35000,
    selectedRooms: [],
    idProofType: 'Aadhaar Card',
    idProofNumber: '',
    idDocumentUrl: '',
    securityDeposit: 5000,
    emergencyContact: '',
    advancePaid: 15000,
    paymentMode: 'UPI',
    transactionReference: '',
    specialRequests: initialData.remarks || ''
  });

  // Room Availability Matrix State
  const [roomAvailability, setRoomAvailability] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.propertyId && formData.checkInDate && formData.checkOutDate) {
      checkAvailability(formData.propertyId, formData.checkInDate, formData.checkOutDate);
    }
  }, [formData.propertyId, formData.checkInDate, formData.checkOutDate]);

  const fetchProperties = async () => {
    setIsLoadingProps(true);
    try {
      const data = await propertyService.getProperties(true);
      if (data && data.length > 0) {
        setProperties(data);
        if (!formData.propertyId) {
          setFormData(prev => ({ ...prev, propertyId: data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load properties for booking:', err);
    } finally {
      setIsLoadingProps(false);
    }
  };

  const checkAvailability = async (propId, inDate, outDate) => {
    setIsLoadingRooms(true);
    setConflictWarning(null);
    try {
      const data = await bookingService.getRoomAvailability(propId, inDate, outDate);
      if (data && data.rooms) {
        setRoomAvailability(data.rooms);
        // Deselect any currently selected room that is now booked
        setFormData(prev => {
          const validSelected = prev.selectedRooms.filter(rName => {
            const match = data.rooms.find(r => r.roomNumber === rName);
            const isMatchAvail = match && ((match.isAvailable !== undefined) ? match.isAvailable : (match.available !== undefined ? match.available : true));
            return isMatchAvail;
          });
          return { ...prev, selectedRooms: validSelected };
        });
      }
    } catch (err) {
      console.error('Failed to check room availability:', err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const handleRoomToggle = (room) => {
    const isAvail = (room.isAvailable !== undefined) ? room.isAvailable : (room.available !== undefined ? room.available : true);
    if (!isAvail) {
      setConflictWarning({
        roomNumber: room.roomNumber,
        bookedBy: room.bookedByCustomer || 'Another Guest',
        bookingNumber: room.bookingNumber || 'Confirmed'
      });
      return;
    }

    setConflictWarning(null);
    setFormData(prev => {
      const exists = prev.selectedRooms.includes(room.roomNumber);
      if (exists) {
        return {
          ...prev,
          selectedRooms: prev.selectedRooms.filter(r => r !== room.roomNumber)
        };
      } else {
        return {
          ...prev,
          selectedRooms: [...prev.selectedRooms, room.roomNumber]
        };
      }
    });
  };

  const handleSelectAllAvailableRooms = () => {
    const allAvail = roomAvailability
      .filter(r => ((r.isAvailable !== undefined) ? r.isAvailable : (r.available !== undefined ? r.available : true)))
      .map(r => r.roomNumber);

    if (allAvail.length === 0) {
      setConflictWarning({
        roomNumber: 'All Rooms',
        bookedBy: 'Existing reservations',
        bookingNumber: 'No rooms available for these dates'
      });
      return;
    }
    setConflictWarning(null);
    setFormData(prev => ({
      ...prev,
      selectedRooms: allAvail
    }));
  };

  const calculateBalance = () => {
    const total = Number(formData.totalAmount) || 0;
    const advance = Number(formData.advancePaid) || 0;
    return Math.max(0, total - advance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.propertyId) {
      setErrorMessage('Please select a property.');
      return;
    }

    if (!formData.customerName.trim() || !formData.mobileNumber.trim()) {
      setErrorMessage('Customer name and mobile number are required.');
      return;
    }

    if (formData.selectedRooms.length === 0) {
      setErrorMessage('Please select at least one room to allocate.');
      return;
    }

    if (!formData.idProofNumber.trim()) {
      setErrorMessage('Guest ID Proof Number is required for security verification.');
      return;
    }

    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      setErrorMessage('Check-out date must be strictly after check-in date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        leadId: formData.leadId ? Number(formData.leadId) : null,
        propertyId: Number(formData.propertyId),
        customerName: formData.customerName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email ? formData.email.trim() : null,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: Number(formData.numberOfGuests) || 2,
        totalAmount: Number(formData.totalAmount) || 0,
        roomNumbers: formData.selectedRooms.join(', '),
        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber.trim(),
        idDocumentUrl: formData.idDocumentUrl || 'Verified (Govt ID Card)',
        securityDeposit: Number(formData.securityDeposit) || 0,
        emergencyContact: formData.emergencyContact ? formData.emergencyContact.trim() : null,
        advancePaid: Number(formData.advancePaid) || 0,
        paymentMode: Number(formData.advancePaid) > 0 ? formData.paymentMode : null,
        transactionReference: formData.transactionReference ? formData.transactionReference.trim() : null,
        specialRequests: formData.specialRequests ? formData.specialRequests.trim() : null
      };

      const result = await bookingService.createBooking(payload);
      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err) {
      console.error('Failed to create booking:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#1E56F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <KeyRound size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {formData.leadId ? 'Convert Lead to Confirmed Reservation' : 'Create Confirmed Villa Reservation'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Allocate rooms with real-time conflict checking, collect guest ID verification, and record advance deposit.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Error Banner */}
          {errorMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #F87171',
              color: '#B91C1C',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertTriangle size={18} />
              <span><strong>Error:</strong> {errorMessage}</span>
            </div>
          )}

          {/* Section 1: Property & Stay Schedule */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Building2 size={16} color="#1E56F0" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                1. Property & Stay Window
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Select Property *
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="">Choose Property</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.city || 'Lonavala'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Check-in Date *
                </label>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Check-out Date *
                </label>
                <input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Guests Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Room Allocation & Conflict Checker Matrix */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={16} color="#1E56F0" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  2. Room Allocation Matrix (Collision Detection)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleSelectAllAvailableRooms}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #BFDBFE',
                  backgroundColor: '#EFF6FF',
                  color: '#1E56F0',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Select All Available Rooms
              </button>
            </div>

            {/* Room Conflict Alert Popover if clicked booked room */}
            {conflictWarning && (
              <div style={{
                marginBottom: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#991B1B',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} color="#DC2626" />
                  <span>
                    <strong>{conflictWarning.roomNumber} is ALREADY BOOKED!</strong> Reserved by {conflictWarning.bookedBy} (Ref: {conflictWarning.bookingNumber}) for these dates.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setConflictWarning(null)}
                  style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>
            )}

            {isLoadingRooms ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '0.8rem' }}>
                Checking room occupancy and availability schedule...
              </div>
            ) : roomAvailability.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#64748B', fontSize: '0.8rem' }}>
                Please select a property and stay dates above to load room inventory.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {roomAvailability.map((room) => {
                  const isSelected = formData.selectedRooms.includes(room.roomNumber);
                  const isAvail = (room.isAvailable !== undefined) ? room.isAvailable : (room.available !== undefined ? room.available : true);

                  return (
                    <div
                      key={room.roomNumber}
                      onClick={() => handleRoomToggle(room)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: isSelected
                          ? '2px solid #1E56F0'
                          : isAvail
                            ? '1px solid #CBD5E1'
                            : '1px solid #FCA5A5',
                        backgroundColor: isSelected
                          ? '#EFF6FF'
                          : isAvail
                            ? '#FFFFFF'
                            : '#FEF2F2',
                        cursor: isAvail ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(30, 86, 240, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isAvail ? '#0F172A' : '#991B1B' }}>
                          {room.roomNumber}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 size={16} color="#1E56F0" />
                        ) : isAvail ? (
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#DCFCE7',
                            color: '#16A34A'
                          }}>
                            Available
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626'
                          }}>
                            Booked
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {room.roomType}
                      </div>

                      {!isAvail && (
                        <div style={{ fontSize: '0.68rem', color: '#DC2626', fontWeight: 600, marginTop: '2px' }}>
                          Occ: {room.bookedByCustomer || 'Booked'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
              <span>
                Selected: <strong style={{ color: '#1E56F0' }}>{formData.selectedRooms.length > 0 ? formData.selectedRooms.join(', ') : 'None'}</strong>
              </span>
              <span style={{ fontSize: '0.72rem' }}>
                🟢 Click room to allocate • 🔴 Red cards indicate conflict with overlapping bookings
              </span>
            </div>
          </div>

          {/* Section 3: Guest Contact & Security Verification */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <ShieldCheck size={16} color="#1E56F0" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                3. Primary Guest Contact & Security Verification (KYC)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Full Name of Guest *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* KYC Proof Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  ID Proof Document *
                </label>
                <select
                  value={formData.idProofType}
                  onChange={(e) => setFormData({ ...formData, idProofType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                  <option value="Passport">Passport (Indian / International)</option>
                  <option value="Driving License">Driving License (RTO)</option>
                  <option value="Voter ID">Voter ID Card</option>
                  <option value="PAN Card">PAN Card</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  ID Document Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5432-8910-1234 or Z4839201"
                  value={formData.idProofNumber}
                  onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 91234 56789"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Commercials, Refundable Deposit & Advance Payment */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <CreditCard size={16} color="#1E56F0" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                4. Financial Breakdown & Advance Collection
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              marginBottom: '14px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', marginBottom: '2px' }}>
                  Total Villa Tariff (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#0F172A'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', marginBottom: '2px' }}>
                  Refundable Security Deposit (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#0F172A'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', marginBottom: '2px' }}>
                  Advance Paid (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.advancePaid}
                  onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#16A34A'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', marginBottom: '2px' }}>
                  Remaining Balance (₹)
                </label>
                <div style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: calculateBalance() > 0 ? '#DC2626' : '#16A34A'
                }}>
                  ₹ {calculateBalance().toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Payment Mode & Reference */}
            {Number(formData.advancePaid) > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Payment Mode
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.825rem',
                      outline: 'none'
                    }}
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="CREDIT_CARD">Credit Card / Debit Card</option>
                    <option value="NET_BANKING">Net Banking / NEFT / RTGS</option>
                    <option value="CASH">Cash Deposit</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Transaction Reference / UTR Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI-20260920-9482910"
                    value={formData.transactionReference}
                    onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.825rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Special Guest Requests / Security Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Late check-in 8 PM, Jain meals requested, extra mattress in Room 102"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.825rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '16px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(30, 86, 240, 0.25)'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Confirming & Allocating...' : 'Confirm & Generate Booking'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingModal;
