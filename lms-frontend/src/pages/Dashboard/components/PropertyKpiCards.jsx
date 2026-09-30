import React, { useState, useEffect } from 'react';
import { Users, CalendarCheck, IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react';
import dashboardService from '../../../services/dashboardService';

/**
 * PropertyKpiCards Component (LMS PART 1 - Screen 3: Property Analytics Dashboard)
 * 4 Color-Coded KPI cards: Total Leads, Total Bookings, Total Revenue, Conversion Rate.
 * 100% Dynamic - Connected to live backend metrics.
 */
export const PropertyKpiCards = ({ metrics: propMetrics }) => {
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    totalBookings: 0,
    totalRevenue: 0,
    conversionRate: 0
  });

  useEffect(() => {
    if (propMetrics) {
      setMetrics(propMetrics);
      return;
    }
    const loadMetrics = async () => {
      try {
        const data = await dashboardService.getAdminMetrics();
        if (data) {
          setMetrics({
            totalLeads: data.totalLeads || 0,
            totalBookings: data.totalBookings || 0,
            totalRevenue: data.totalRevenue || 0,
            conversionRate: data.conversionRate || 0
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      }
    };
    loadMetrics();
  }, [propMetrics]);

  const formatCurrency = (val) => {
    if (!val) return '₹ 0';
    return '₹ ' + Number(val).toLocaleString('en-IN');
  };

  const cards = [
    {
      id: 'total-leads',
      title: 'Total Leads',
      value: Number(metrics.totalLeads || 0).toLocaleString('en-IN'),
      trend: metrics.totalLeads > 0 ? 'Live' : '0 leads',
      icon: Users,
      color: '#1E56F0',
      bgColor: '#EFF6FF',
    },
    {
      id: 'total-bookings',
      title: 'Total Bookings',
      value: Number(metrics.totalBookings || 0).toLocaleString('en-IN'),
      trend: metrics.totalBookings > 0 ? 'Live' : '0 bookings',
      icon: CalendarCheck,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      trend: metrics.totalRevenue > 0 ? 'Live' : '₹ 0',
      icon: IndianRupee,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: `${Number(metrics.conversionRate || 0).toFixed(1)}%`,
      trend: 'Avg',
      icon: TrendingUp,
      color: '#059669',
      bgColor: '#ECFDF5',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px'
    }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            {/* Icon Circle */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: card.bgColor,
              color: card.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={22} strokeWidth={2.2} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#64748B',
                fontWeight: 500,
                marginBottom: '4px'
              }}>
                {card.title}
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {card.value}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                marginTop: '4px',
                fontSize: '0.72rem',
                color: '#10B981',
                fontWeight: 600
              }}>
                <ArrowUpRight size={13} strokeWidth={2.5} />
                <span>{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyKpiCards;
