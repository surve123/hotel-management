import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Target,
  IndianRupee,
  Calendar,
  Download,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Globe,
  PhoneCall,
  Share2,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import reportService from '../../services/reportService';

// Custom SVG Instagram Icon
const InstagramIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const SOURCE_META = {
  INSTAGRAM: { icon: InstagramIcon, color: '#E1306C', bg: '#FFF1F2' },
  WHATSAPP: { icon: MessageSquare, color: '#10B981', bg: '#ECFDF5' },
  WEBSITE: { icon: Globe, color: '#2563EB', bg: '#EFF6FF' },
  DIRECT_CALL: { icon: PhoneCall, color: '#6366F1', bg: '#EEF2FF' },
  REFERRAL: { icon: Share2, color: '#F59E0B', bg: '#FFFBEB' },
  OTHER: { icon: MoreHorizontal, color: '#8B5CF6', bg: '#F5F3FF' }
};

/**
 * LeadSourceReportPage Component (LMS PART 7 - Screen 1: Lead Source Report)
 * Dynamic 1-screen viewport responsive layout connected to live PostgreSQL report APIs.
 * 100% SVG Lucide Icons (Zero Emojis).
 */
export const LeadSourceReportPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [dateRange] = useState('All Time (Live)');
  const [searchQuery, setSearchQuery] = useState('');
  const [sources, setSources] = useState([]);
  const [kpiStats, setKpiStats] = useState({
    totalLeads: 0,
    totalBookings: 0,
    conversionRate: '0%',
    totalRevenue: '₹ 0'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      try {
        const data = await reportService.getSourceReport();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          let leadsSum = 0;
          let bookSum = 0;
          let revSum = 0;

          const formatted = list.map((item) => {
            const leads = item.totalLeads || 0;
            const bookings = item.convertedLeads ?? item.confirmedBookings ?? 0;
            const rev = Number(item.totalRevenueGenerated ?? item.totalRevenue ?? 0);
            const conv = item.conversionRate !== undefined ? Number(item.conversionRate) : (leads > 0 ? (bookings / leads) * 100 : 0);

            leadsSum += leads;
            bookSum += bookings;
            revSum += rev;
            const meta = SOURCE_META[item.source] || SOURCE_META.OTHER;

            return {
              name: item.source ? item.source.replace('_', ' ') : 'Channel',
              icon: meta.icon,
              iconColor: meta.color,
              iconBg: meta.bg,
              leads: leads,
              bookings: bookings,
              conversionRate: `${conv.toFixed(1)}%`,
              revenue: `₹ ${rev.toLocaleString('en-IN')}`,
              percentage: `${leadsSum > 0 ? Math.round((leads / leadsSum) * 100) : 0}%`,
              barColor: meta.color
            };
          });

          setSources(formatted);
          const overallConv = leadsSum > 0 ? ((bookSum / leadsSum) * 100).toFixed(1) : '0.0';
          setKpiStats({
            totalLeads: leadsSum.toLocaleString('en-IN'),
            totalBookings: bookSum.toLocaleString('en-IN'),
            conversionRate: `${overallConv}%`,
            totalRevenue: `₹ ${revSum.toLocaleString('en-IN')}`
          });
        }
      } catch (err) {
        console.warn('Could not load source report:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReport();
    return () => { isMounted = false; };
  }, []);

  const kpis = [
    {
      label: 'Total Leads',
      value: kpiStats.totalLeads,
      trend: 'Live',
      isPositive: true,
      icon: Users,
      color: '#1E56F0',
      bg: '#EFF6FF'
    },
    {
      label: 'Total Bookings',
      value: kpiStats.totalBookings,
      trend: 'Live',
      isPositive: true,
      icon: CalendarCheck,
      color: '#059669',
      bg: '#ECFDF5'
    },
    {
      label: 'Conversion Rate',
      value: kpiStats.conversionRate,
      trend: 'Avg',
      isPositive: true,
      icon: Target,
      color: '#7C3AED',
      bg: '#F5F3FF'
    },
    {
      label: 'Total Revenue',
      value: kpiStats.totalRevenue,
      trend: 'PostgreSQL',
      isPositive: true,
      icon: IndianRupee,
      color: '#D97706',
      bg: '#FFFBEB'
    }
  ];

  const filteredSources = sources.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      boxSizing: 'border-box',
      backgroundColor: '#F8FAFC',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      overflow: 'hidden'
    }}>
      
      {/* 1. Header Section (Compact) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 2px 0',
            letterSpacing: '-0.01em'
          }}>
            Lead Source Report
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
            Track lead sources, conversion rates and revenue performance.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '0.75rem',
            color: '#334155',
            fontWeight: 500,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            <Calendar size={13} color="#64748B" />
            <span>{dateRange}</span>
            <ChevronDown size={13} color="#94A3B8" />
          </div>

          <button
            onClick={() => reportService.downloadLeadsExcel()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '0.75rem',
              color: '#334155',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            <Download size={13} color="#64748B" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards (Compact Row) */}
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
                    {isLoading ? <Loader2 size={16} className="animate-spin" color="#64748B" /> : kpi.value}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: kpi.isPositive ? '#059669' : '#DC2626'
                  }}>
                    {kpi.isPositive ? <ArrowUpRight size={11} strokeWidth={2.5} /> : <ArrowDownRight size={11} strokeWidth={2.5} />}
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

      {/* 3. Main 2-Column Grid (Table Left, 2 Charts Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.45fr 1fr',
        gap: '10px',
        alignItems: 'stretch',
        flex: 1,
        minHeight: 0
      }}>
        
        {/* Left: Lead Source Performance Table Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px 12px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          {/* Card Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '6px'
          }}>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Lead Source Performance
              </h3>
              <p style={{ fontSize: '0.65rem', color: '#64748B', margin: '1px 0 0 0' }}>
                Comprehensive breakdown by source channel from PostgreSQL
              </p>
            </div>

            {/* Quick Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '5px',
              padding: '3px 8px',
              width: '130px'
            }}>
              <Search size={11} color="#94A3B8" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter source..."
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.7rem',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px' }}>
                <Loader2 size={24} className="animate-spin" color="#1E56F0" />
              </div>
            ) : filteredSources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.82rem' }}>
                No lead source data available yet.
              </div>
            ) : (
              <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ width: '24%', padding: '5px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Source</th>
                    <th style={{ width: '12%', padding: '5px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Leads</th>
                    <th style={{ width: '12%', padding: '5px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Book</th>
                    <th style={{ width: '16%', padding: '5px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Conv Rate</th>
                    <th style={{ width: '22%', padding: '5px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Revenue</th>
                    <th style={{ width: '14%', padding: '5px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSources.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: idx === filteredSources.length - 1 ? 'none' : '1px solid #F1F5F9'
                        }}
                      >
                        {/* Source */}
                        <td style={{ padding: '5px 6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '5px',
                              backgroundColor: item.iconBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: item.iconColor,
                              flexShrink: 0
                            }}>
                              <Icon size={12} />
                            </div>
                            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </span>
                          </div>
                        </td>

                        {/* Leads */}
                        <td style={{ padding: '5px 6px', textAlign: 'right', fontSize: '0.74rem', fontWeight: 600, color: '#0F172A' }}>
                          {item.leads}
                        </td>

                        {/* Bookings */}
                        <td style={{ padding: '5px 6px', textAlign: 'right', fontSize: '0.74rem', fontWeight: 600, color: '#0F172A' }}>
                          {item.bookings}
                        </td>

                        {/* Conversion Rate */}
                        <td style={{ padding: '5px 6px', textAlign: 'center' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            backgroundColor: parseFloat(item.conversionRate) >= 25 ? '#ECFDF5' : '#FEF3C7',
                            color: parseFloat(item.conversionRate) >= 25 ? '#059669' : '#D97706'
                          }}>
                            {item.conversionRate}
                          </span>
                        </td>

                        {/* Revenue */}
                        <td style={{ padding: '5px 6px', textAlign: 'right', fontSize: '0.74rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                          {item.revenue}
                        </td>

                        {/* Share */}
                        <td style={{ padding: '5px 6px', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B' }}>
                            {item.percentage}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Visual Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
          
          {/* Card 1: Lead Source Distribution (Donut Chart) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '10px 12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              Lead Source Distribution
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Center Text & Simple dynamic Donut */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px', width: '100%' }}>
                {sources.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94A3B8', fontSize: '0.75rem', padding: '12px 0' }}>
                    No source breakdown available
                  </div>
                ) : (
                  sources.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.barColor }} />
                        <span style={{ fontSize: '0.68rem', color: '#334155', fontWeight: 500 }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A' }}>{item.percentage}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Conversion Rate by Source (Progress Bars) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '10px 12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              Conversion Rate by Source
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', overflow: 'auto' }}>
              {sources.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.75rem', padding: '12px 0' }}>
                  No conversion rate data recorded
                </div>
              ) : (
                sources.map((item, idx) => {
                  const rateNum = parseFloat(item.conversionRate) || 0;
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                        <span style={{ color: '#334155', fontWeight: 600 }}>{item.name}</span>
                        <span style={{ color: '#0F172A', fontWeight: 700 }}>{item.conversionRate}</span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.max(rateNum, 4)}%`, height: '100%', backgroundColor: item.barColor, borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LeadSourceReportPage;
