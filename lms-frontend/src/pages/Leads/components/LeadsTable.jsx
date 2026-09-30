import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Calendar, 
  Eye, 
  Edit3, 
  MoreHorizontal, 
  Filter, 
  RotateCcw,
  CheckSquare,
  Square,
  Search
} from 'lucide-react';
import Badge from '../../../components/Common/Badge';
import leadService from '../../../services/leadService';
import propertyService from '../../../services/propertyService';

/**
 * LeadsTable Component (LMS PART 2 - Screen 1: All Leads Page)
 * Comprehensive Data Table connected to Spring Boot PostgreSQL backend.
 */
export const LeadsTable = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [page, propertyFilter, statusFilter, sourceFilter]);

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getProperties(true);
      if (data) setProperties(data);
    } catch (err) {
      console.error('Failed to load properties:', err);
    }
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
        propertyId: propertyFilter || undefined,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };

      const data = await leadService.getLeads(params);
      if (data) {
        setLeads(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load leads from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchLeads();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPropertyFilter('');
    setStatusFilter('');
    setSourceFilter('');
    setPage(0);
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await leadService.updateStatus(leadId, newStatus);
      fetchLeads();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not scheduled';
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
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
    }}>
      {/* 1. Filter Bar */}
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
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '0 10px',
            height: '36px',
            width: '100%'
          }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by name, phone or email..."
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

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Property Dropdown */}
          <select
            value={propertyFilter}
            onChange={(e) => { setPropertyFilter(e.target.value); setPage(0); }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '0.78rem',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '0.78rem',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="HOT">Hot</option>
            <option value="BOOKED">Booked</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Source Dropdown */}
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setPage(0); }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '0.78rem',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">All Sources</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="WEBSITE">Website</option>
            <option value="DIRECT_CALL">Direct Call</option>
            <option value="REFERRAL">Referral</option>
          </select>

          {/* Reset Filters */}
          {(propertyFilter || statusFilter || sourceFilter || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#EF4444',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Table Element */}
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
              <th style={{ padding: '10px 14px' }}>Lead ID</th>
              <th style={{ padding: '10px 14px' }}>Guest Details</th>
              <th style={{ padding: '10px 14px' }}>Property</th>
              <th style={{ padding: '10px 10px' }}>Source</th>
              <th style={{ padding: '10px 10px' }}>Status</th>
              <th style={{ padding: '10px 10px' }}>Priority</th>
              <th style={{ padding: '10px 14px' }}>Budget</th>
              <th style={{ padding: '10px 14px' }}>Assigned To</th>
              <th style={{ padding: '10px 14px' }}>Next Follow-up</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10" style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                  Loading leads from database...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                  No leads match your filter criteria.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    fontSize: '0.78rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1E56F0' }}>
                    #{lead.id}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{lead.customerName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>
                      {lead.mobileNumber} {lead.email ? `• ${lead.email}` : ''}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>
                    {lead.propertyName || 'General Inquiry'}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <Badge type="source" value={lead.source} />
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="NEW">NEW</option>
                      <option value="FOLLOW_UP">FOLLOW_UP</option>
                      <option value="HOT">HOT</option>
                      <option value="BOOKED">BOOKED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <Badge type="priority" value={lead.priority} />
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                    {formatCurrency(lead.budget)}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>
                    {lead.assignedToName || 'Unassigned'}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748B' }}>
                    {formatDate(lead.nextFollowupDate)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/leads/${lead.id}`)}
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
                      View CRM
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Footer */}
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
        <span>Showing {leads.length} of {totalElements} leads</span>
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
  );
};

export default LeadsTable;
