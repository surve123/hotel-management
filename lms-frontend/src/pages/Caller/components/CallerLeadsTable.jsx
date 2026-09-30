import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, MessageSquare, Edit3, MoreHorizontal, Loader2, Users } from 'lucide-react';
import leadService from '../../../services/leadService';
import propertyService from '../../../services/propertyService';

const AVATAR_PALETTE = [
  { bg: '#DBEAFE', color: '#1E40AF' },
  { bg: '#F3E8FF', color: '#7E22CE' },
  { bg: '#DCFCE7', color: '#15803D' },
  { bg: '#FCE7F3', color: '#BE185D' },
  { bg: '#FEF3C7', color: '#B45309' },
  { bg: '#E0E7FF', color: '#4338CA' }
];

const STATUS_CONFIG = {
  NEW: { label: 'New', color: '#0284C7', bg: '#E0F2FE' },
  FOLLOW_UP: { label: 'Follow-up', color: '#D97706', bg: '#FEF3C7' },
  HOT: { label: 'Hot Lead', color: '#DC2626', bg: '#FEE2E2' },
  INTERESTED: { label: 'Interested', color: '#059669', bg: '#ECFDF5' },
  BOOKED: { label: 'Converted', color: '#15803D', bg: '#DCFCE7' },
  CANCELLED: { label: 'Cancelled', color: '#64748B', bg: '#F1F5F9' },
  LOST: { label: 'Lost', color: '#94A3B8', bg: '#F8FAFC' }
};

const PRIORITY_CONFIG = {
  URGENT: '#DC2626',
  HIGH: '#EA580C',
  MEDIUM: '#D97706',
  LOW: '#2563EB'
};

/**
 * CallerLeadsTable Component
 * 100% Dynamic - connected to Spring Boot PostgreSQL backend with full live filtering & pagination.
 */
export const CallerLeadsTable = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    ALL: 0,
    NEW: 0,
    FOLLOW_UP: 0,
    HOT: 0,
    INTERESTED: 0,
    BOOKED: 0,
    CANCELLED: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch properties for filter dropdown
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const propList = await propertyService.getProperties(true);
        setProperties(Array.isArray(propList) ? propList : []);
      } catch (err) {
        console.warn('Failed to load properties for filter:', err);
      }
    };
    fetchProps();
  }, []);

  // Fetch live paginated leads based on filter inputs
  useEffect(() => {
    let isMounted = true;
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const params = {
          page: currentPage - 1,
          size: pageSize,
          search: searchQuery || undefined,
          propertyId: selectedProperty || undefined,
          source: selectedSource || undefined,
          priority: selectedPriority || undefined,
          status: activeTab !== 'ALL' ? activeTab : (selectedStatus || undefined)
        };

        const res = await leadService.getLeads(params);
        if (isMounted) {
          const list = res?.content || (Array.isArray(res) ? res : []);
          setLeads(list);
          setTotalPages(res?.totalPages || 1);
          setTotalElements(res?.totalElements !== undefined ? res.totalElements : list.length);

          // Update counts
          if (activeTab === 'ALL' && !searchQuery && !selectedProperty && !selectedSource && !selectedPriority) {
            const counts = {
              ALL: res?.totalElements || list.length,
              NEW: 0,
              FOLLOW_UP: 0,
              HOT: 0,
              INTERESTED: 0,
              BOOKED: 0,
              CANCELLED: 0
            };
            list.forEach(item => {
              if (counts[item.status] !== undefined) counts[item.status]++;
            });
            setStatusCounts(counts);
          }
        }
      } catch (err) {
        console.error('Failed to load caller leads:', err);
        if (isMounted) {
          setLeads([]);
          setTotalElements(0);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLeads();
    return () => { isMounted = false; };
  }, [activeTab, searchQuery, selectedProperty, selectedSource, selectedStatus, selectedPriority, currentPage]);

  const tabs = [
    { key: 'ALL', label: 'All', count: statusCounts.ALL },
    { key: 'NEW', label: 'New', count: statusCounts.NEW },
    { key: 'FOLLOW_UP', label: 'Follow-up', count: statusCounts.FOLLOW_UP },
    { key: 'HOT', label: 'Hot', count: statusCounts.HOT },
    { key: 'INTERESTED', label: 'Interested', count: statusCounts.INTERESTED },
    { key: 'BOOKED', label: 'Converted', count: statusCounts.BOOKED },
    { key: 'CANCELLED', label: 'Cancelled', count: statusCounts.CANCELLED }
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
      {/* 1. Category Status Tabs Pill Bar */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        backgroundColor: '#FFFFFF'
      }}>
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '9999px',
                border: isSelected ? '1px solid #1E56F0' : '1px solid #E2E8F0',
                backgroundColor: isSelected ? '#1E56F0' : '#F8FAFC',
                color: isSelected ? '#FFFFFF' : '#475569',
                fontSize: '0.74rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                color: isSelected ? '#FFFFFF' : '#64748B',
                fontSize: '0.66rem',
                padding: '1px 5px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Parameter Filters Bar */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Property Dropdown */}
          <select
            value={selectedProperty}
            onChange={(e) => {
              setSelectedProperty(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '0.75rem',
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

          {/* Lead Source Dropdown */}
          <select
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '0.75rem',
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
            <option value="OTHER">Other</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '0.75rem',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Search leads input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '7px',
          padding: '0 10px',
          height: '32px',
          width: '180px'
        }}>
          <Search size={13} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.75rem',
              color: '#0F172A',
              backgroundColor: 'transparent',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      {/* 3. Leads Data Table */}
      <div style={{ overflowX: 'auto', minHeight: '180px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '8px', color: '#64748B' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
            <span style={{ fontSize: '0.78rem' }}>Loading live leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '8px', color: '#94A3B8', padding: '32px' }}>
            <Users size={32} strokeWidth={1.5} color="#CBD5E1" />
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B' }}>No Leads Found</span>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>No active leads match the current filters. Click "+ Add Lead" to create one.</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '920px' }}>
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
                <th style={{ padding: '10px 14px' }}>Customer Name</th>
                <th style={{ padding: '10px 14px' }}>Mobile</th>
                <th style={{ padding: '10px 14px' }}>Property</th>
                <th style={{ padding: '10px 14px' }}>Source</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Priority</th>
                <th style={{ padding: '10px 14px' }}>Next Follow-up</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, idx) => {
                const customerName = lead.customerName || `Lead #${lead.id}`;
                const initials = customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'LD';
                const avatar = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
                const statusMeta = STATUS_CONFIG[lead.status] || { label: lead.status || 'Active', color: '#475569', bg: '#F1F5F9' };
                const priorityColor = PRIORITY_CONFIG[lead.priority] || '#D97706';
                const nextFollow = lead.nextFollowupDate 
                  ? new Date(lead.nextFollowupDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
                  : '-';

                return (
                  <tr
                    key={lead.id}
                    onClick={() => navigate(`/caller/leads/${lead.id}`)}
                    style={{
                      borderBottom: idx === leads.length - 1 ? 'none' : '1px solid #F1F5F9',
                      fontSize: '0.78rem',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748B' }}>
                      LD{String(lead.id).padStart(3, '0')}
                    </td>

                    {/* Customer Name with Avatar */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: avatar.bg,
                          color: avatar.color,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {initials}
                        </div>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          {customerName}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '10px 14px', color: '#475569', fontWeight: 500 }}>
                      {lead.mobileNumber || '-'}
                    </td>

                    <td style={{ padding: '10px 14px', color: '#334155', fontWeight: 500 }}>
                      {lead.propertyName || lead.property?.name || 'Aranavee Property'}
                    </td>

                    <td style={{ padding: '10px 14px', color: '#64748B' }}>
                      {lead.source ? String(lead.source).replace('_', ' ') : '-'}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: statusMeta.bg,
                        color: statusMeta.color
                      }}>
                        {statusMeta.label}
                      </span>
                    </td>

                    {/* Priority Indicator */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: priorityColor
                        }} />
                        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: priorityColor }}>
                          {lead.priority || 'Medium'}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '10px 14px', color: '#475569', fontSize: '0.75rem' }}>
                      {nextFollow}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '10px 14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        {/* Call Button */}
                        {lead.mobileNumber && (
                          <a
                            href={`tel:${lead.mobileNumber}`}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '5px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              color: '#1E56F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            title={`Call ${customerName}`}
                          >
                            <Phone size={12} strokeWidth={2.2} />
                          </a>
                        )}

                        {/* WhatsApp Button */}
                        {lead.mobileNumber && (
                          <a
                            href={`https://wa.me/91${lead.mobileNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '5px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              color: '#15803D',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            title={`WhatsApp ${customerName}`}
                          >
                            <MessageSquare size={12} strokeWidth={2.2} />
                          </a>
                        )}

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => navigate(`/caller/leads/${lead.id}/edit`)}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '5px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#FFFFFF',
                            color: '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          title="Edit Lead"
                        >
                          <Edit3 size={12} strokeWidth={2.2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 4. Footer Pagination */}
      <div style={{
        padding: '10px 18px',
        borderTop: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
          Showing <strong>{leads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {(currentPage - 1) * pageSize + leads.length}</strong> of <strong>{totalElements}</strong> leads
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            style={{
              padding: '3px 8px',
              borderRadius: '5px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              fontSize: '0.74rem',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '3px 8px',
                borderRadius: '5px',
                border: currentPage === page ? '1px solid #1E56F0' : '1px solid #E2E8F0',
                backgroundColor: currentPage === page ? '#1E56F0' : '#FFFFFF',
                color: currentPage === page ? '#FFFFFF' : '#334155',
                fontSize: '0.74rem',
                fontWeight: currentPage === page ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            style={{
              padding: '3px 8px',
              borderRadius: '5px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              fontSize: '0.74rem',
              cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallerLeadsTable;
