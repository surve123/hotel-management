import React, { useState, useEffect } from 'react';
import { Users, Send, Calendar, UserCheck, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import dashboardService from '../../../services/dashboardService';
import { useAuth } from '../../../context/AuthContext';

/**
 * 5 Color-Coded KPI Metric Cards (LMS PART 1 - Screen 2)
 * Integrated with Spring Boot live backend API with dynamic RBAC permission enforcement.
 */
export const DashboardStatCards = () => {
  const { hasPermission } = useAuth();
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    newLeads: 0,
    hotLeads: 0,
    inFollowupLeads: 0,
    totalBookings: 0,
    totalRevenue: 0,
    advanceCollected: 0,
    pendingBalance: 0,
    conversionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardService.getAdminMetrics();
      if (data) {
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return '₹ ' + Number(val || 0).toLocaleString('en-IN');
  };

  const cards = [
    {
      title: 'Total Leads',
      value: Number(metrics.totalLeads || 0).toLocaleString(),
      trend: `${metrics.conversionRate || 0}% conversion`,
      isPositive: true,
      icon: Users,
      color: '#1E56F0',
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
      visible: true
    },
    {
      title: 'New Inquiries',
      value: Number(metrics.newLeads || 0).toLocaleString(),
      trend: 'Fresh pipeline',
      isPositive: true,
      icon: Send,
      color: '#16A34A',
      bgColor: '#F0FDF4',
      borderColor: '#DCFCE7',
      visible: true
    },
    {
      title: 'Follow-ups Due',
      value: Number(metrics.inFollowupLeads || 0).toLocaleString(),
      trend: 'Action required',
      isPositive: false,
      icon: Calendar,
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FEF3C7',
      visible: hasPermission('Schedule follow-ups')
    },
    {
      title: 'Confirmed Bookings',
      value: Number(metrics.totalBookings || 0).toLocaleString(),
      trend: formatCurrency(metrics.totalRevenue),
      isPositive: true,
      icon: UserCheck,
      color: '#9333EA',
      bgColor: '#FAF5FF',
      borderColor: '#F3E8FF',
      visible: hasPermission('Manage bookings') || hasPermission('View revenue reports')
    },
    {
      title: 'Pending Balance',
      value: formatCurrency(metrics.pendingBalance),
      trend: `Adv: ${formatCurrency(metrics.advanceCollected)}`,
      isPositive: Number(metrics.pendingBalance || 0) === 0,
      icon: Receipt,
      color: '#E11D48',
      bgColor: '#FFF1F2',
      borderColor: '#FFE4E6',
      visible: hasPermission('View revenue reports')
    }
  ];

  const visibleCards = cards.filter(c => c.visible);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '14px',
      marginBottom: '22px'
    }}>
      {visibleCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 0.2s ease'
            }}
          >
            {/* Top row: Icon in colored circle + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: card.bgColor,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>
                {card.title}
              </span>
            </div>

            {/* Bottom: Big Value + Trend badge */}
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                {card.value}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: card.isPositive ? '#16A34A' : '#E11D48',
                marginTop: '4px'
              }}>
                {card.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStatCards;
