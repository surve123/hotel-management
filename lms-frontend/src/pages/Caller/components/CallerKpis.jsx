import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  CalendarCheck2, 
  Clock, 
  Flame, 
  Award, 
  PhoneCall, 
  TimerReset, 
  Loader2
} from 'lucide-react';
import dashboardService from '../../../services/dashboardService';

/**
 * CallerKpis Component (LMS PART 4 - Screen 1: Telecaller Dashboard)
 * Dynamic 8 KPI Cards (4x2 grid) from PostgreSQL.
 * 100% SVG Vector Icons (Zero Emojis).
 */
export const CallerKpis = () => {
  const [data, setData] = useState({
    myLeads: 0,
    todaysFollowups: 0,
    pendingFollowups: 0,
    hotLeads: 0,
    convertedLeads: 0,
    todaysCalls: 0,
    upcomingCalls: 0,
    targetCalls: 8,
    targetAchieved: 0,
    achievedPercent: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCallerData = async () => {
      try {
        const metrics = await dashboardService.getTelecallerDashboard();
        if (isMounted && metrics) {
          const completed = metrics.todaysCalls || 0;
          const target = metrics.dailyTarget || 8;
          const percent = target > 0 ? Math.min(Math.round((completed / target) * 100), 100) : 0;

          setData({
            myLeads: metrics.myTotalLeads || 0,
            todaysFollowups: metrics.todaysFollowups || 0,
            pendingFollowups: metrics.pendingFollowups || 0,
            hotLeads: metrics.hotLeads || 0,
            convertedLeads: metrics.convertedLeads || 0,
            todaysCalls: completed,
            upcomingCalls: metrics.upcomingCalls || 0,
            targetCalls: target,
            targetAchieved: completed,
            achievedPercent: percent
          });
        }
      } catch (err) {
        console.warn('Could not load telecaller metrics:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCallerData();
    return () => { isMounted = false; };
  }, []);

  const kpis = [
    {
      id: 'my_leads',
      label: 'My Leads',
      value: data.myLeads,
      badgeText: 'Active',
      badgeBg: '#EFF6FF',
      badgeColor: '#1E56F0',
      icon: FolderGit2,
      iconBg: '#EFF6FF',
      iconColor: '#1E56F0'
    },
    {
      id: 'todays_followups',
      label: "Today's Follow-ups",
      value: data.todaysFollowups,
      badgeText: 'Scheduled',
      badgeBg: '#F0FDF4',
      badgeColor: '#15803D',
      icon: CalendarCheck2,
      iconBg: '#F0FDF4',
      iconColor: '#15803D'
    },
    {
      id: 'pending_followups',
      label: 'Pending Follow-ups',
      value: data.pendingFollowups,
      badgeText: data.pendingFollowups > 0 ? 'Overdue' : 'Clear',
      badgeBg: data.pendingFollowups > 0 ? '#FEF2F2' : '#F0FDF4',
      badgeColor: data.pendingFollowups > 0 ? '#DC2626' : '#15803D',
      icon: Clock,
      iconBg: '#FEF3C7',
      iconColor: '#D97706'
    },
    {
      id: 'hot_leads',
      label: 'Hot Leads',
      value: data.hotLeads,
      badgeText: 'High priority',
      badgeBg: '#FEF2F2',
      badgeColor: '#DC2626',
      icon: Flame,
      iconBg: '#FEE2E2',
      iconColor: '#EF4444'
    },
    {
      id: 'converted_leads',
      label: 'Converted Leads',
      value: data.convertedLeads,
      badgeText: 'Converted',
      badgeBg: '#FAF5FF',
      badgeColor: '#7E22CE',
      icon: Award,
      iconBg: '#F3E8FF',
      iconColor: '#9333EA'
    },
    {
      id: 'todays_calls',
      label: "Today's Calls",
      value: data.todaysCalls,
      badgeText: `/${data.targetCalls}`,
      badgeBg: '#F0FDFA',
      badgeColor: '#0F766E',
      icon: PhoneCall,
      iconBg: '#CCFBF1',
      iconColor: '#0D9488'
    },
    {
      id: 'upcoming_calls',
      label: 'Upcoming Calls',
      value: data.upcomingCalls,
      badgeText: 'Upcoming',
      badgeBg: '#EFF6FF',
      badgeColor: '#1E40AF',
      icon: TimerReset,
      iconBg: '#DBEAFE',
      iconColor: '#2563EB'
    },
  ];

  const strokeDashoffset = 2 * Math.PI * 18 * (1 - (data.achievedPercent / 100));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '14px'
    }}>
      {/* Cards 1 - 7 */}
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

              <div style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: kpi.badgeColor,
                backgroundColor: kpi.badgeBg,
                padding: '2px 7px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                {kpi.badgeText}
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                {isLoading ? <Loader2 size={16} className="animate-spin" color="#64748B" /> : kpi.value}
              </div>
            </div>
          </div>
        );
      })}

      {/* Card 8: Daily Target with Circular Progress Ring */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '84px'
      }}>
        <div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
            Daily Target
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginTop: '2px', lineHeight: 1.15 }}>
            {data.targetAchieved}/{data.targetCalls} <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>calls</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, marginTop: '3px' }}>
            {data.achievedPercent}% achieved
          </div>
        </div>

        {/* Circular Progress SVG Ring */}
        <div style={{ position: 'relative', width: '46px', height: '46px', flexShrink: 0 }}>
          <svg width="46" height="46" viewBox="0 0 46 46">
            <circle
              cx="23"
              cy="23"
              r="18"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="4"
            />
            <circle
              cx="23"
              cy="23"
              r="18"
              fill="none"
              stroke="#1E56F0"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 18}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 23 23)"
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#1E56F0'
          }}>
            {data.achievedPercent}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallerKpis;
