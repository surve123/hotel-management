import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  CalendarCheck,
  IndianRupee,
  Calendar,
  Download,
  ChevronDown,
  ArrowUpRight,
  Crown,
  Search,
  RefreshCw,
  Loader2
} from 'lucide-react';
import luxuryVillaImg from '../../assets/luxury_pool_villa.jpg';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import propertyService from '../../services/propertyService';
import dashboardService from '../../services/dashboardService';
import reportService from '../../services/reportService';

/**
 * PropertyReportPage Component (LMS PART 7 - Screen 3: Property Report)
 * 100% Dynamic - Connected to live Spring Boot PostgreSQL backend APIs.
 * 100% SVG Lucide Icons (Zero Emojis).
 */
export const PropertyReportPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState('All Properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [properties, setProperties] = useState([]);
  const [propertyPerf, setPropertyPerf] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [trends, setTrends] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [propListRes, perfRes, metricsRes, trendsRes] = await Promise.allSettled([
        propertyService.getProperties(true),
        dashboardService.getPropertyPerformance(),
        dashboardService.getAdminMetrics(),
        dashboardService.getAdminTrends(30)
      ]);

      if (propListRes.status === 'fulfilled' && propListRes.value) setProperties(propListRes.value);
      if (perfRes.status === 'fulfilled' && perfRes.value) setPropertyPerf(perfRes.value);
      if (metricsRes.status === 'fulfilled' && metricsRes.value) setAdminMetrics(metricsRes.value);
      if (trendsRes.status === 'fulfilled' && trendsRes.value) setTrends(trendsRes.value);
    } catch (err) {
      console.error('Failed to load property report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await reportService.downloadLeadsExcel();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export property report.');
    } finally {
      setIsExporting(false);
    }
  };

  // Aggregates
  const totalPropertiesCount = properties.length > 0 ? properties.length : (propertyPerf.length > 0 ? propertyPerf.length : 0);
  const totalLeads = adminMetrics?.totalLeads ?? propertyPerf.reduce((a, b) => a + (b.totalLeads || 0), 0);
  const totalBookings = adminMetrics?.totalBookings ?? propertyPerf.reduce((a, b) => a + (b.totalBookings || 0), 0);
  const totalRevenue = adminMetrics?.totalRevenue ?? propertyPerf.reduce((a, b) => a + Number(b.revenue || 0), 0);

  // 4 Top KPI Cards
  const kpis = [
    {
      label: 'Total Properties',
      value: String(totalPropertiesCount),
      trend: totalPropertiesCount > 0 ? 'Active' : '0',
      icon: Building2,
      color: '#1E56F0',
      bg: '#EFF6FF'
    },
    {
      label: 'Total Leads',
      value: totalLeads.toLocaleString('en-IN'),
      trend: totalLeads > 0 ? 'Live' : '0',
      icon: Users,
      color: '#059669',
      bg: '#ECFDF5'
    },
    {
      label: 'Total Bookings',
      value: totalBookings.toLocaleString('en-IN'),
      trend: totalBookings > 0 ? 'Live' : '0',
      icon: CalendarCheck,
      color: '#7C3AED',
      bg: '#F5F3FF'
    },
    {
      label: 'Total Revenue',
      value: `₹ ${Number(totalRevenue).toLocaleString('en-IN')}`,
      trend: Number(totalRevenue) > 0 ? 'Live' : '0',
      icon: IndianRupee,
      color: '#D97706',
      bg: '#FFFBEB'
    }
  ];

  // Map live property performance rows
  const propertyRows = propertyPerf.map((p, idx) => {
    const leads = p.totalInquiries ?? p.totalLeads ?? 0;
    const books = p.totalBookings ?? 0;
    const rev = Number(p.totalRevenue ?? p.revenue ?? 0);
    const convRaw = leads > 0 ? ((books / leads) * 100) : (p.conversionRate ? Number(p.conversionRate) : (books > 0 ? 100 : 0));
    const convStr = `${convRaw.toFixed(1)}%`;
    const shareVal = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : (totalLeads > 0 ? Math.round((leads / totalLeads) * 100) : 0);

    return {
      id: p.propertyId || idx + 1,
      name: p.propertyName || `Property #${idx + 1}`,
      leads,
      bookings: books,
      revenue: `₹ ${rev.toLocaleString('en-IN')}`,
      rawRev: rev,
      conversionRate: convStr,
      cancellation: '0.0%',
      share: `${shareVal}%`,
      isTop: idx === 0
    };
  });

  const filteredProperties = propertyRows.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topProperty = propertyRows.length > 0 ? propertyRows[0] : null;

  return (
    <div style={{
      boxSizing: 'border-box',
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingBottom: '24px'
    }}>
      
      {/* 1. Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 2px 0',
            letterSpacing: '-0.01em'
          }}>
            Property Report
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
            Compare real-time property performance and conversion statistics.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={fetchData}
            disabled={isLoading}
            title="Refresh Live Metrics"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              color: '#334155',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#1E56F0',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              color: '#FFFFFF',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} color="#FFFFFF" />}
            <span>{isExporting ? 'Exporting...' : 'Export Excel'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {kpi.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
                    {isLoading ? '...' : kpi.value}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#059669'
                  }}>
                    <ArrowUpRight size={11} strokeWidth={2.5} />
                    {kpi.trend}
                  </span>
                </div>
              </div>

              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: kpi.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: kpi.color,
                flexShrink: 0
              }}>
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Row: Property Comparison Table (Left) + Source Distribution (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.35fr 0.8fr',
        gap: '10px',
        alignItems: 'stretch'
      }}>
        
        {/* Left: Property Comparison Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px 14px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          minHeight: '230px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '6px'
          }}>
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Property Comparison
              </h3>
              <p style={{ fontSize: '0.62rem', color: '#64748B', margin: '1px 0 0 0' }}>
                Lead generation, bookings and revenue per property
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '5px',
              padding: '3px 8px',
              width: '140px'
            }}>
              <Search size={11} color="#94A3B8" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter property..."
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.68rem',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredProperties.length > 0 ? (
              <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ width: '34%', padding: '4px 6px', fontSize: '0.6rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Property</th>
                    <th style={{ width: '13%', padding: '4px 6px', fontSize: '0.6rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Leads</th>
                    <th style={{ width: '13%', padding: '4px 6px', fontSize: '0.6rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Book</th>
                    <th style={{ width: '22%', padding: '4px 6px', fontSize: '0.6rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Revenue</th>
                    <th style={{ width: '18%', padding: '4px 6px', fontSize: '0.6rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Conv</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((prop, idx) => (
                    <tr
                      key={prop.id}
                      style={{
                        borderBottom: idx === filteredProperties.length - 1 ? 'none' : '1px solid #F1F5F9'
                      }}
                    >
                      <td style={{ padding: '4px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '3px',
                            backgroundImage: `url(${luxuryVillaImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flexShrink: 0
                          }} />
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prop.name}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '4px 6px', textAlign: 'right', fontSize: '0.72rem', fontWeight: 600, color: '#0F172A' }}>
                        {prop.leads}
                      </td>

                      <td style={{ padding: '4px 6px', textAlign: 'right', fontSize: '0.72rem', fontWeight: 600, color: '#0F172A' }}>
                        {prop.bookings}
                      </td>

                      <td style={{ padding: '4px 6px', textAlign: 'right', fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                        {prop.revenue}
                      </td>

                      <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor: '#ECFDF5',
                          color: '#059669'
                        }}>
                          {prop.conversionRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', fontSize: '0.75rem' }}>
                No property data available
              </div>
            )}
          </div>
        </div>

        {/* Right: Share Distribution (Property Wise) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '10px 14px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '230px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
            Property Performance Share
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center', overflowY: 'auto' }}>
            {propertyRows.length > 0 ? (
              propertyRows.map((prop, idx) => (
                <div key={prop.id || idx}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                      {prop.name}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A' }}>
                      {prop.share}
                    </span>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '5px',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: prop.share,
                      height: '100%',
                      background: idx % 3 === 0
                        ? 'linear-gradient(90deg, #1E56F0 0%, #EC4899 100%)'
                        : (idx % 3 === 1
                          ? 'linear-gradient(90deg, #2563EB 0%, #F59E0B 100%)'
                          : 'linear-gradient(90deg, #3B82F6 0%, #059669 100%)'),
                      borderRadius: '3px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.75rem' }}>No properties to display</div>
            )}
          </div>
        </div>

      </div>

      {/* 4. Bottom Row: Property Performance Trend Chart (Left) + Top Performing Property Card (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.35fr 0.8fr',
        gap: '10px',
        alignItems: 'stretch'
      }}>
        
        {/* Left: Property Performance Trend Chart */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '10px 14px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '160px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Property Performance Trend
              </h3>
              <p style={{ fontSize: '0.62rem', color: '#64748B', margin: '1px 0 0 0' }}>
                Multi-metric tracking over the last 30 days
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1E56F0' }} />
                <span style={{ fontSize: '0.62rem', color: '#64748B' }}>Leads</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0D9488' }} />
                <span style={{ fontSize: '0.62rem', color: '#64748B' }}>Bookings</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
            {trends.length > 0 ? (
              <svg width="100%" height="100%" viewBox="0 0 450 90" preserveAspectRatio="none">
                <line x1="20" y1="15" x2="430" y2="15" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="20" y1="45" x2="430" y2="45" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="20" y1="75" x2="430" y2="75" stroke="#E2E8F0" />

                {(() => {
                  const maxL = Math.max(...trends.map(t => Math.max(t.leads || 0, 1)), 10);
                  const step = (430 - 20) / Math.max(trends.length - 1, 1);
                  const ptsLeads = trends.map((t, i) => `${20 + i * step},${75 - ((t.leads || 0) / maxL) * 55}`).join(' ');
                  const ptsBooks = trends.map((t, i) => `${20 + i * step},${75 - ((t.conversions || 0) / maxL) * 55}`).join(' ');

                  return (
                    <>
                      <polyline fill="none" stroke="#1E56F0" strokeWidth="2" points={ptsLeads} />
                      <polyline fill="none" stroke="#0D9488" strokeWidth="2" strokeDasharray="3 3" points={ptsBooks} />
                      {trends.filter((_, idx) => idx % Math.ceil(trends.length / 6) === 0).map((t, i) => {
                        const x = 20 + i * Math.ceil(trends.length / 6) * step;
                        return (
                          <text key={i} x={x} y="86" fill="#94A3B8" fontSize="7" fontWeight="500" textAnchor="middle">
                            {t.date ? t.date.substring(5) : ''}
                          </text>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', fontSize: '0.75rem' }}>
                No trend activity recorded
              </div>
            )}
          </div>
        </div>

        {/* Right: Top Performing Property Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '10px 14px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '160px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Top Performing Property
            </h3>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              padding: '1px 6px',
              borderRadius: '4px',
              fontSize: '0.62rem',
              fontWeight: 700
            }}>
              <Crown size={10} strokeWidth={2.5} />
              #1 Ranked
            </span>
          </div>

          {topProperty ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '6px',
                backgroundImage: `url(${luxuryVillaImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0
              }} />
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {topProperty.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    Leads: <strong style={{ color: '#0F172A' }}>{topProperty.leads}</strong>
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    Bookings: <strong style={{ color: '#059669' }}>{topProperty.bookings}</strong>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#94A3B8', fontSize: '0.75rem', padding: '10px 0' }}>No property data recorded</div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px',
            backgroundColor: '#F8FAFC',
            borderRadius: '6px',
            padding: '6px 8px'
          }}>
            <div>
              <span style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 600 }}>REVENUE</span>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                {topProperty ? topProperty.revenue : '₹ 0'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 600 }}>CONVERSION</span>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>
                {topProperty ? topProperty.conversionRate : '0.0%'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyReportPage;
