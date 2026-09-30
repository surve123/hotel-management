import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../../components/Common/Badge';
import leadService from '../../../services/leadService';

/**
 * Recent Leads Table Component (LMS PART 1 - Screen 2)
 * Connected to live Spring Boot Leads API.
 */
export const RecentLeadsTable = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentLeads();
  }, []);

  const fetchRecentLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeads({ size: 5, sortBy: 'createdAt', sortDir: 'desc' });
      if (data?.content) {
        setLeads(data.content);
      }
    } catch (err) {
      console.error('Failed to load recent leads:', err);
    } finally {
      setIsLoading(false);
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

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Table Header Title */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Recent Leads
        </h3>
        <span
          onClick={() => navigate('/admin/leads')}
          style={{ fontSize: '0.78rem', color: '#1E56F0', fontWeight: 600, cursor: 'pointer' }}
        >
          View All Leads →
        </span>
      </div>

      {/* Table Content */}
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
              <th style={{ padding: '9px 12px' }}>Name</th>
              <th style={{ padding: '9px 12px' }}>Mobile</th>
              <th style={{ padding: '9px 12px' }}>Property</th>
              <th style={{ padding: '9px 8px' }}>Source</th>
              <th style={{ padding: '9px 8px' }}>Status</th>
              <th style={{ padding: '9px 12px' }}>Next Follow-up</th>
              <th style={{ padding: '9px 12px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                  Loading latest leads...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                  No leads found. Click "Add Lead" to register your first inquiry.
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
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0F172A' }}>
                    {lead.customerName}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#64748B' }}>
                    {lead.mobileNumber}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#334155' }}>
                    {lead.propertyName || 'General Inquiry'}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <Badge type="source" value={lead.source} />
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <Badge type="status" value={lead.status} />
                  </td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>
                    {formatDate(lead.nextFollowupDate)}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/leads/${lead.id}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1E56F0',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeadsTable;
