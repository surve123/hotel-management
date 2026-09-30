import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Plus,
  Search,
  ChevronDown,
  Calendar,
  Eye,
  Edit3,
  CreditCard,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import bookingService from '../../services/bookingService';
import propertyService from '../../services/propertyService';
import reportService from '../../services/reportService';
import CreateBookingModal from './components/CreateBookingModal';

/**
 * BookingListPage Component (LMS PART 6 - Screen 2: Booking List)
 * Connected to live Spring Boot PostgreSQL Bookings API.
 */
export const BookingListPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const basePath = role === ROLES.SUPER_ADMIN ? '/super-admin' : '/admin';

  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [page, selectedProperty, selectedStatus]);

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getProperties(true);
      if (data) setProperties(data);
    } catch (err) {
      console.error('Failed to load properties:', err);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        size: 10,
        search: searchQuery || undefined,
        propertyId: selectedProperty || undefined,
        status: selectedStatus || undefined,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };
      const data = await bookingService.getBookings(params);
      if (data) {
        setBookings(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBookings();
  };

  const handleExportExcel = async () => {
    try {
      await reportService.downloadFinanceExcel();
    } catch (err) {
      alert('Failed to export finance ledger: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header with Export & Add Booking CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Bookings Ledger
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '3px', margin: 0 }}>
            Manage confirmed guest reservations, payment deposits, and stay dates.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleExportExcel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={15} />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
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
            <Plus size={15} strokeWidth={2.5} />
            <span>+ New Booking</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#FAFAFA'
        }}>
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0 10px',
              height: '36px',
              width: '260px'
            }}>
              <Search size={15} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search booking # or guest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '6px 8px',
                  fontSize: '0.8rem',
                  width: '100%',
                  color: '#0F172A'
                }}
              />
            </div>
          </form>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={selectedProperty}
              onChange={(e) => { setSelectedProperty(e.target.value); setPage(0); }}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem' }}
            >
              <option value="">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem' }}
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CHECKED_IN">CHECKED IN</option>
              <option value="CHECKED_OUT">CHECKED OUT</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        {/* 3. Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                whiteSpace: 'nowrap'
              }}>
                <th style={{ padding: '10px 14px' }}>Booking #</th>
                <th style={{ padding: '10px 14px' }}>Guest Details</th>
                <th style={{ padding: '10px 14px' }}>Property</th>
                <th style={{ padding: '10px 14px' }}>Check In → Check Out</th>
                <th style={{ padding: '10px 14px' }}>Total Amount</th>
                <th style={{ padding: '10px 14px' }}>Advance Paid</th>
                <th style={{ padding: '10px 14px' }}>Balance Due</th>
                <th style={{ padding: '10px 10px' }}>Payment Status</th>
                <th style={{ padding: '10px 10px' }}>Stay Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="10" style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                    Loading bookings ledger...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                    No bookings found. Convert an inquiry from the Leads tab to create a booking.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1E56F0' }}>
                      {b.bookingNumber}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{b.mobileNumber}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {b.propertyName}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#16A34A' }}>
                      {formatCurrency(b.advancePaid)}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: Number(b.balanceDue) > 0 ? '#E11D48' : '#64748B' }}>
                      {formatCurrency(b.balanceDue)}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: b.paymentStatus === 'PAID' ? '#DCFCE7' : (b.paymentStatus === 'PARTIAL' ? '#FEF3C7' : '#FEE2E2'),
                        color: b.paymentStatus === 'PAID' ? '#16A34A' : (b.paymentStatus === 'PARTIAL' ? '#D97706' : '#EF4444'),
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: '#EFF6FF',
                        color: '#1E56F0',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`${basePath}/bookings/${b.id}`)}
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
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748B',
          backgroundColor: '#FAFAFA'
        }}>
          <span>Showing {bookings.length} of {totalElements} bookings</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: page === 0 ? '#94A3B8' : '#334155',
                cursor: page === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span style={{ padding: '4px 10px', fontWeight: 600, color: '#0F172A' }}>
              Page {page + 1} of {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: page >= totalPages - 1 ? '#94A3B8' : '#334155',
                cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      <CreateBookingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchBookings();
        }}
      />
    </div>
  );
};

export default BookingListPage;
