import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Sparkles, UserPlus, PhoneCall, CheckCircle2, Loader2 } from 'lucide-react';
import dashboardService from '../../../services/dashboardService';
import leadService from '../../../services/leadService';
import followupService from '../../../services/followupService';

/**
 * ActionAlertCards Component (LMS PART 1 - Screen 4)
 * Dynamic 4 operational alert cards connected to PostgreSQL APIs:
 * Follow-up Alerts, New Leads Today, Unassigned Leads, Today's Calls.
 * 100% SVG Vector (Zero Emojis).
 */
export const ActionAlertCards = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    followupAlerts: 0,
    newLeadsToday: 0,
    unassignedLeads: 0,
    todaysCalls: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAlertStats = async () => {
      try {
        const [metricsRes, unassignedRes, overdueRes] = await Promise.allSettled([
          dashboardService.getAdminMetrics(),
          leadService.getUnassignedLeads(),
          followupService.getOverdue()
        ]);

        const metrics = metricsRes.status === 'fulfilled' ? metricsRes.value : {};
        const unassignedList = unassignedRes.status === 'fulfilled' ? (unassignedRes.value?.content || unassignedRes.value || []) : [];
        const overdueList = overdueRes.status === 'fulfilled' ? (Array.isArray(overdueRes.value) ? overdueRes.value : []) : [];

        if (isMounted) {
          setStats({
            followupAlerts: overdueList.length || (metrics?.followupsDue || 0),
            newLeadsToday: metrics?.freshLeads || 0,
            unassignedLeads: Array.isArray(unassignedList) ? unassignedList.length : 0,
            todaysCalls: metrics?.followupsDue || 0
          });
        }
      } catch (err) {
        console.warn('Could not load action alerts:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAlertStats();
    return () => { isMounted = false; };
  }, []);

  const alerts = [
    {
      id: 'followup-alerts',
      title: 'Follow-up Alerts',
      value: stats.followupAlerts,
      status: stats.followupAlerts > 0 ? 'Needs attention' : 'All clear',
      statusColor: stats.followupAlerts > 0 ? '#EF4444' : '#10B981',
      icon: Bell,
      color: '#EF4444',
      bgColor: '#FEE2E2',
      link: '/admin/follow-ups'
    },
    {
      id: 'new-leads-today',
      title: 'New Leads Today',
      value: stats.newLeadsToday,
      status: `${stats.newLeadsToday} fresh leads`,
      statusColor: '#10B981',
      icon: Sparkles,
      color: '#10B981',
      bgColor: '#DCFCE7',
      link: '/admin/leads'
    },
    {
      id: 'unassigned-leads',
      title: 'Unassigned Leads',
      value: stats.unassignedLeads,
      status: stats.unassignedLeads > 0 ? 'Assign now' : 'All assigned',
      statusColor: '#1E56F0',
      isAction: stats.unassignedLeads > 0,
      icon: UserPlus,
      color: '#1E56F0',
      bgColor: '#EFF6FF',
      link: '/admin/leads'
    },
    {
      id: 'todays-calls',
      title: "Today's Calls",
      value: stats.todaysCalls,
      status: 'In progress',
      statusColor: '#10B981',
      hasCheck: true,
      icon: PhoneCall,
      color: '#9333EA',
      bgColor: '#F3E8FF',
      link: '/admin/follow-ups'
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px'
    }}>
      {alerts.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => card.link && navigate(card.link)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Icon Container */}
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
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.15
              }}>
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" color="#64748B" />
                ) : (
                  card.value
                )}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px',
                fontSize: '0.74rem',
                color: card.statusColor,
                fontWeight: 600,
                textDecoration: card.isAction ? 'underline' : 'none'
              }}>
                {card.hasCheck && <CheckCircle2 size={12} strokeWidth={2.5} />}
                <span>{card.status}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActionAlertCards;
