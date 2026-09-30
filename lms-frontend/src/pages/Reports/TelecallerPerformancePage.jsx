import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  PhoneCall,
  CalendarClock,
  CheckCircle2,
  IndianRupee,
  Calendar,
  Download,
  ChevronDown,
  ArrowUpRight,
  Crown,
  Search,
  Loader2,
  TrendingUp,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import reportService from '../../services/reportService';

/**
 * TelecallerPerformancePage Component
 * Live dynamic metrics connected to PostgreSQL backend with real-time donut gauge.
 */
export const TelecallerPerformancePage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [timeFilter] = useState('All Time (Live)');
  const [searchQuery, setSearchQuery] = useState('');
  const [telecallers, setTelecallers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kpiStats, setKpiStats] = useState({
    totalTelecallers: 0,
    totalCalls: 0,
    totalFollowups: 0,
    convertedLeads: 0,
    overallConvRate: '0%',
    overallConvNum: 0,
    totalAssigned: 0
  });

  useEffect(() => {
    let isMounted = true;
    const fetchTelecallers = async () => {
      try {
        const data = await reportService.getTelecallerReport();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          let assignedSum = 0;
          let callsSum = 0;
          let followSum = 0;
          let convSum = 0;

          const sorted = [...list].sort((a, b) => {
            const bConv = b.bookingsClosed ?? b.convertedLeads ?? 0;
            const aConv = a.bookingsClosed ?? a.convertedLeads ?? 0;
            return bConv - aConv;
          });

          const formatted = sorted.map((caller, idx) => {
            const name = caller.fullName || caller.callerName || caller.username || `User #${caller.userId}`;
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TC';
            
            const assigned = caller.totalAssigned ?? caller.totalAssignedLeads ?? 0;
            const calls = caller.callsLogged ?? caller.totalCalls ?? assigned;
            const followups = caller.followupsCount ?? caller.completedFollowups ?? 0;
            const converted = caller.bookingsClosed ?? caller.convertedLeads ?? 0;
            const rate = caller.conversionRate !== undefined ? Number(caller.conversionRate) : (assigned > 0 ? (converted / assigned) * 100 : 0);
            const revenueVal = caller.revenueGenerated && Number(caller.revenueGenerated) > 0 
              ? Number(caller.revenueGenerated) 
              : (converted * 50000);

            assignedSum += assigned;
            callsSum += calls;
            followSum += followups;
            convSum += converted;

            return {
              id: caller.userId || idx + 1,
              name: name,
              initials: initials,
              assigned: assigned,
              calls: calls,
              followups: followups,
              converted: converted,
              bookings: converted,
              revenue: `₹ ${revenueVal.toLocaleString('en-IN')}`,
              conversionRate: `${rate.toFixed(1)}%`,
              conversionRateNum: rate,
              rank: idx + 1
            };
          });

          setTelecallers(formatted);
          const baseDenominator = assignedSum > 0 ? assignedSum : callsSum;
          const overallConv = baseDenominator > 0 ? ((convSum / baseDenominator) * 100).toFixed(1) : '0.0';
          
          setKpiStats({
            totalTelecallers: formatted.length,
            totalCalls: callsSum.toLocaleString('en-IN'),
            totalFollowups: followSum.toLocaleString('en-IN'),
            convertedLeads: convSum.toLocaleString('en-IN'),
            overallConvRate: `${overallConv}%`,
            overallConvNum: Math.min(Math.max(parseFloat(overallConv) || 0, 0), 100),
            totalAssigned: assignedSum
          });
        }
      } catch (err) {
        console.warn('Could not load telecaller performance:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTelecallers();
    return () => { isMounted = false; };
  }, []);

  // 5 Top KPI Cards
  const kpis = [
    {
      label: 'Total Telecallers',
      value: kpiStats.totalTelecallers,
      trend: 'Live',
      icon: Users,
      color: '#2563EB',
      bg: '#EFF6FF'
    },
    {
      label: 'Total Calls',
      value: kpiStats.totalCalls,
      trend: 'Live',
      icon: PhoneCall,
      color: '#0891B2',
      bg: '#ECFEFF'
    },
    {
      label: 'Follow-ups',
      value: kpiStats.totalFollowups,
      trend: 'Live',
      icon: CalendarClock,
      color: '#7C3AED',
      bg: '#F5F3FF'
    },
    {
      label: 'Converted Leads',
      value: kpiStats.convertedLeads,
      trend: 'Live',
      icon: CheckCircle2,
      color: '#059669',
      bg: '#ECFDF5'
    },
    {
      label: 'Overall Conversion',
      value: kpiStats.overallConvRate,
      trend: 'Avg',
      icon: IndianRupee,
      color: '#EA580C',
      bg: '#FFF7ED'
    }
  ];

  const filteredTelecallers = telecallers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SVG Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const dashValue = ((kpiStats.overallConvNum / 100) * circumference).toFixed(1);

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
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 2px 0',
            letterSpacing: '-0.01em'
          }}>
            Telecaller Performance
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
            Track telecaller productivity, lead assignments, and conversion performance.
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
            <span>{timeFilter}</span>
            <ChevronDown size={13} color="#94A3B8" />
          </div>

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
            <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} (Live)</span>
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

      {/* 2. Top 5 KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px'
      }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                padding: '8px 12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  {kpi.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '1px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
                    {isLoading ? <Loader2 size={16} className="animate-spin" color="#64748B" /> : kpi.value}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#059669'
                  }}>
                    <ArrowUpRight size={11} strokeWidth={2.5} />
                    {kpi.trend}
                  </span>
                </div>
              </div>

              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                backgroundColor: kpi.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: kpi.color,
                flexShrink: 0
              }}>
                <Icon size={14} strokeWidth={2.2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Grid: Table Left (68%), Performance Overview + Top Performers Right (32%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.45fr 0.65fr',
        gap: '12px',
        alignItems: 'stretch',
        flex: 1,
        minHeight: 0
      }}>
        
        {/* Left: Telecaller Performance Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 14px',
          boxSizing: 'border-box',
          overflow: 'hidden'
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
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Telecaller Performance Leaderboard
              </h3>
              <p style={{ fontSize: '0.68rem', color: '#64748B', margin: '1px 0 0 0' }}>
                Assigned leads, calls logged, bookings & revenue tracking
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '5px',
              padding: '4px 8px',
              width: '140px'
            }}>
              <Search size={12} color="#94A3B8" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search telecaller..."
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.72rem',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', color: '#64748B' }}>
                <Loader2 size={24} className="animate-spin" color="#2563EB" />
                <span style={{ fontSize: '0.8rem' }}>Loading live telecaller metrics...</span>
              </div>
            ) : filteredTelecallers.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', color: '#94A3B8', padding: '24px' }}>
                <Users size={32} strokeWidth={1.5} color="#CBD5E1" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>No Telecaller Data Available</span>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Telecaller leads, calls and conversions will appear here once logged.</span>
              </div>
            ) : (
              <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ width: '6%', padding: '6px 4px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>#</th>
                    <th style={{ width: '23%', padding: '6px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Telecaller</th>
                    <th style={{ width: '10%', padding: '6px 4px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Leads</th>
                    <th style={{ width: '9%', padding: '6px 4px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Calls</th>
                    <th style={{ width: '9%', padding: '6px 4px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Follow</th>
                    <th style={{ width: '9%', padding: '6px 4px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Conv</th>
                    <th style={{ width: '9%', padding: '6px 4px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Book</th>
                    <th style={{ width: '14%', padding: '6px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Revenue</th>
                    <th style={{ width: '11%', padding: '6px 4px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Rate</th>
                    <th style={{ width: '8%', padding: '6px 4px', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTelecallers.map((t, idx) => (
                    <tr
                      key={t.id}
                      style={{
                        borderBottom: idx === filteredTelecallers.length - 1 ? 'none' : '1px solid #F1F5F9'
                      }}
                    >
                      <td style={{ padding: '6px 4px', fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>
                        {idx + 1}
                      </td>

                      <td style={{ padding: '6px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: t.rank === 1 ? '#FEF3C7' : (t.rank === 2 ? '#E0E7FF' : '#F1F5F9'),
                            color: t.rank === 1 ? '#D97706' : (t.rank === 2 ? '#4F46E5' : '#475569'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {t.initials}
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {t.name}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '6px 4px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#0F172A' }}>
                        {t.assigned}
                      </td>

                      <td style={{ padding: '6px 4px', textAlign: 'right', fontSize: '0.75rem', color: '#334155' }}>
                        {t.calls}
                      </td>

                      <td style={{ padding: '6px 4px', textAlign: 'right', fontSize: '0.75rem', color: '#334155' }}>
                        {t.followups}
                      </td>

                      <td style={{ padding: '6px 4px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                        {t.converted}
                      </td>

                      <td style={{ padding: '6px 4px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#0F172A' }}>
                        {t.bookings}
                      </td>

                      <td style={{ padding: '6px 6px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                        {t.revenue}
                      </td>

                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: parseFloat(t.conversionRate) >= 20 ? '#ECFDF5' : (parseFloat(t.conversionRate) > 0 ? '#EFF6FF' : '#F1F5F9'),
                          color: parseFloat(t.conversionRate) >= 20 ? '#059669' : (parseFloat(t.conversionRate) > 0 ? '#2563EB' : '#64748B')
                        }}>
                          {t.conversionRate}
                        </span>
                      </td>

                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {t.rank === 1 ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#FEF3C7',
                            color: '#D97706'
                          }}>
                            <Crown size={11} fill="#D97706" />
                          </div>
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            width: '17px',
                            height: '17px',
                            lineHeight: '17px',
                            borderRadius: '50%',
                            backgroundColor: t.rank <= 3 ? '#EFF6FF' : '#F8FAFC',
                            color: t.rank <= 3 ? '#1E56F0' : '#64748B',
                            fontSize: '0.68rem',
                            fontWeight: 700
                          }}>
                            {t.rank}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Performance Overview (Live Gauge) + Top Performers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Performance Overview (Live Donut Gauge) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '12px 14px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1.1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Performance Overview
              </h3>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                color: kpiStats.overallConvNum > 0 ? '#059669' : '#64748B',
                backgroundColor: kpiStats.overallConvNum > 0 ? '#ECFDF5' : '#F1F5F9',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {kpiStats.overallConvNum > 0 ? 'Live Active' : 'No Data'}
              </span>
            </div>

            {/* Dynamic Circular Gauge SVG */}
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '4px auto' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
                {/* Dynamic Progress Fill */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={kpiStats.overallConvNum > 0 ? '#1E56F0' : '#CBD5E1'}
                  strokeWidth="10"
                  strokeDasharray={`${dashValue} ${circumference.toFixed(1)}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.6s ease-in-out' }}
                />
              </svg>

              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {isLoading ? '...' : kpiStats.overallConvRate}
                </span>
                <span style={{ fontSize: '0.58rem', color: '#64748B', fontWeight: 600 }}>Overall Conv</span>
                {kpiStats.overallConvNum > 0 && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: '#059669',
                    marginTop: '2px'
                  }}>
                    <TrendingUp size={9} strokeWidth={2.5} /> Efficiency
                  </span>
                )}
              </div>
            </div>

            {/* Summary Indicators */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              paddingTop: '6px',
              borderTop: '1px solid #F1F5F9'
            }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '4px 6px', borderRadius: '5px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.6rem', color: '#64748B', display: 'block' }}>Total Converted</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>{kpiStats.convertedLeads}</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '4px 6px', borderRadius: '5px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.6rem', color: '#64748B', display: 'block' }}>Total Assigned</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>{kpiStats.totalAssigned}</span>
              </div>
            </div>
          </div>

          {/* Top Performers Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '12px 14px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 0.9
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
              Top Performers
            </h3>

            {telecallers.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', color: '#94A3B8', fontSize: '0.72rem' }}>
                No performers ranked yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '6px' }}>
                {telecallers.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #F1F5F9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: item.rank === 1 ? '#FEF3C7' : '#E0E7FF',
                        color: item.rank === 1 ? '#D97706' : '#4F46E5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.62rem',
                        fontWeight: 700
                      }}>
                        {item.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0F172A' }}>{item.name}</div>
                        <div style={{ fontSize: '0.62rem', color: '#64748B' }}>{item.bookings} bookings</div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                      {item.conversionRate}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => reportService.downloadLeadsExcel()}
              style={{
                width: '100%',
                padding: '5px 10px',
                borderRadius: '6px',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(30, 86, 240, 0.2)'
              }}
            >
              Export Detailed Analytics
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TelecallerPerformancePage;

