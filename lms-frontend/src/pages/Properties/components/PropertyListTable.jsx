import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit3, MoreHorizontal, LayoutGrid, List } from 'lucide-react';
import propertyService from '../../../services/propertyService';
import luxuryVillaImg from '../../../assets/luxury_pool_villa.jpg';

/**
 * PropertyListTable Component (LMS PART 5 - Screen 1: Properties List)
 * Connected to live Spring Boot PostgreSQL Properties API.
 */
export const PropertyListTable = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const data = await propertyService.getProperties(false);
      if (data) {
        setProperties(data);
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = properties.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      (p.type && p.type.toLowerCase().includes(q))
    );
  });

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
      {/* 1. Header Filter Bar */}
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
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '0 10px',
          height: '36px',
          width: '280px'
        }}>
          <Search size={15} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search properties by name, city..."
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

        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
          {filtered.length} Properties in Portfolio
        </span>
      </div>

      {/* 2. Table */}
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
              <th style={{ padding: '10px 14px' }}>Property Name</th>
              <th style={{ padding: '10px 14px' }}>Type</th>
              <th style={{ padding: '10px 14px' }}>Location</th>
              <th style={{ padding: '10px 14px' }}>Base Price / Night</th>
              <th style={{ padding: '10px 14px' }}>Capacity</th>
              <th style={{ padding: '10px 14px' }}>Status</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                  Loading properties from database...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                  No properties found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    fontSize: '0.78rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : luxuryVillaImg}
                        alt={p.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #E2E8F0'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{p.totalRooms || 5} Bedrooms</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: p.type === 'VILLA' ? '#ECFDF5' : '#EFF6FF',
                      color: p.type === 'VILLA' ? '#059669' : '#1E56F0',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {p.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>
                    {p.city || p.address || 'Maharashtra'}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#16A34A' }}>
                    {formatCurrency(p.basePricePerNight)}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>
                    Up to {p.maxGuests || 20} Guests
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: p.active ? '#DCFCE7' : '#FEE2E2',
                      color: p.active ? '#16A34A' : '#EF4444',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/properties/edit/${p.id}`)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          color: '#334155',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/properties/${p.id}`)}
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
                        View Profile
                      </button>
                    </div>
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

export default PropertyListTable;
