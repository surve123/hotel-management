import React, { useState, useEffect } from 'react';
import { Building2, Users, CalendarCheck2, IndianRupee, Percent } from 'lucide-react';
import dashboardService from '../../../services/dashboardService';
import propertyService from '../../../services/propertyService';

/**
 * PropertyKpiCards Component (LMS PART 5 - Screen 1: Properties List)
 * 5 Metric Cards: Total Properties, Total Leads, Total Bookings, Total Revenue, Conversion Rate.
 * 100% Dynamic - Connected to live PostgreSQL backend data.
 */
export const PropertyKpiCards = () => {
  const [metrics, setMetrics] = useState({
    totalProperties: 0,
    totalLeads: 0,
    totalBookings: 0,
    totalRevenue: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKpiMetrics();
  }, []);

  const loadKpiMetrics = async () => {
    setLoading(true);
    try {
      const [adminMetrics, propsList] = await Promise.allSettled([
        dashboardService.getAdminMetrics(),
        propertyService.getProperties(false)
      ]);

      const propsCount = propsList.status === 'fulfilled' && Array.isArray(propsList.value)
        ? propsList.value.length
        : 0;

      if (adminMetrics.status === 'fulfilled' && adminMetrics.value) {
        const m = adminMetrics.value;
        setMetrics({
          totalProperties: propsCount,
          totalLeads: m.totalLeads || 0,
          totalBookings: m.totalBookings || 0,
          totalRevenue: m.totalRevenue || 0,
          conversionRate: m.conversionRate || 0
        });
      } else {
        setMetrics(prev => ({ ...prev, totalProperties: propsCount }));
      }
    } catch (err) {
      console.error('Failed to load property KPI cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '₹ 0';
    return '₹ ' + Number(val).toLocaleString('en-IN');
  };

  const kpis = [
    {
      id: 'total_properties',
      label: 'Total Properties',
      value: loading ? '...' : String(metrics.totalProperties),
      trend: metrics.totalProperties > 0 ? `${metrics.totalProperties} active` : '0 active',
      icon: Building2,
      iconBg: '#EFF6FF',
      iconColor: '#1E56F0'
    },
    {
      id: 'total_leads',
      label: 'Total Leads',
      value: loading ? '...' : Number(metrics.totalLeads).toLocaleString('en-IN'),
      trend: metrics.totalLeads > 0 ? `${metrics.totalLeads} total` : '0 leads',
      icon: Users,
      iconBg: '#ECFDF5',
      iconColor: '#059669'
    },
    {
      id: 'total_bookings',
      label: 'Total Bookings',
      value: loading ? '...' : Number(metrics.totalBookings).toLocaleString('en-IN'),
      trend: metrics.totalBookings > 0 ? `${metrics.totalBookings} booked` : '0 booked',
      icon: CalendarCheck2,
      iconBg: '#FAF5FF',
      iconColor: '#7E22CE'
    },
    {
      id: 'total_revenue',
      label: 'Total Revenue',
      value: loading ? '...' : formatCurrency(metrics.totalRevenue),
      trend: metrics.totalRevenue > 0 ? 'Live' : '₹ 0',
      icon: IndianRupee,
      iconBg: '#FEF3C7',
      iconColor: '#D97706'
    },
    {
      id: 'conversion_rate',
      label: 'Conversion Rate',
      value: loading ? '...' : `${Number(metrics.conversionRate || 0).toFixed(1)}%`,
      trend: 'Avg',
      icon: Percent,
      iconBg: '#FCE7F3',
      iconColor: '#BE185D'
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '14px'
    }}>
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '14px 16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '84px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                backgroundColor: kpi.iconBg,
                color: kpi.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={18} strokeWidth={2.2} />
              </div>

              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#F0FDF4',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                {kpi.trend}
              </span>
            </div>

            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                {kpi.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyKpiCards;
