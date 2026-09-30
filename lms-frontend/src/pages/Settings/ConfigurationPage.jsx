import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  MessageCircle,
  Globe,
  Phone,
  Users,
  Footprints,
  Tag,
  Info,
  Sliders,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import leadService from '../../services/leadService';
import dashboardService from '../../services/dashboardService';

// Custom SVG Instagram Icon
const InstagramIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/**
 * ConfigurationPage Component (LMS PART 8 - Screen 3: Lead Sources / Status Configuration)
 * Connected with live database metrics:
 * - Real dynamic lead counts per source, status, priority, and follow-up outcome.
 * - Dynamic SVG donut chart rendering actual database totals and percentages.
 * - Tab navigation across Lead Sources, Lead Statuses, Priority, Follow-up Outcomes, Booking Statuses.
 */
export const ConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState('Lead Sources');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Live Database Leads Cache
  const [liveLeads, setLiveLeads] = useState([]);

  const tabs = [
    'Lead Sources',
    'Lead Statuses',
    'Priority',
    'Follow-up Outcomes',
    'Booking Statuses'
  ];

  // Base Source Items
  const [sourcesList, setSourcesList] = useState([
    { id: 1, name: 'Instagram', key: 'INSTAGRAM', icon: InstagramIcon, iconColor: '#E1306C', iconBg: '#FCE7F3', isDefault: true, status: 'Active', color: '#E1306C' },
    { id: 2, name: 'WhatsApp', key: 'WHATSAPP', icon: MessageCircle, iconColor: '#10B981', iconBg: '#ECFDF5', isDefault: true, status: 'Active', color: '#10B981' },
    { id: 3, name: 'Website', key: 'WEBSITE', icon: Globe, iconColor: '#2563EB', iconBg: '#EFF6FF', isDefault: true, status: 'Active', color: '#2563EB' },
    { id: 4, name: 'Phone', key: 'PHONE', icon: Phone, iconColor: '#F59E0B', iconBg: '#FEF3C7', isDefault: true, status: 'Active', color: '#6366F1' },
    { id: 5, name: 'Referral', key: 'REFERRAL', icon: Users, iconColor: '#059669', iconBg: '#D1FAE5', isDefault: true, status: 'Active', color: '#F59E0B' },
    { id: 6, name: 'Walk-in', key: 'WALK_IN', icon: Footprints, iconColor: '#7C3AED', iconBg: '#F5F3FF', isDefault: true, status: 'Active', color: '#0D9488' },
    { id: 7, name: 'Other', key: 'OTHER', icon: Tag, iconColor: '#0284C7', iconBg: '#F0F9FF', isDefault: true, status: 'Active', color: '#8B5CF6' }
  ]);

  // Base Status Items
  const [statusesList, setStatusesList] = useState([
    { id: 1, name: 'New Inquiry', key: 'NEW', color: '#1E56F0', status: 'Active' },
    { id: 2, name: 'Follow-up Scheduled', key: 'FOLLOW_UP', color: '#8B5CF6', status: 'Active' },
    { id: 3, name: 'Hot / Qualified', key: 'HOT', color: '#F59E0B', status: 'Active' },
    { id: 4, name: 'Converted / Booked', key: 'BOOKED', color: '#10B981', status: 'Active' },
    { id: 5, name: 'Cancelled / Lost', key: 'CANCELLED', color: '#64748B', status: 'Active' }
  ]);

  // Base Priority Items
  const [prioritiesList, setPrioritiesList] = useState([
    { id: 1, name: 'High Priority (VIP / Urgent)', key: 'HIGH', color: '#E11D48', status: 'Active' },
    { id: 2, name: 'Medium Priority (Standard)', key: 'MEDIUM', color: '#F59E0B', status: 'Active' },
    { id: 3, name: 'Low Priority (Cold / Generic)', key: 'LOW', color: '#64748B', status: 'Active' }
  ]);

  // Base Follow-up Outcomes
  const [outcomesList, setOutcomesList] = useState([
    { id: 1, name: 'Connected - Interested', key: 'INTERESTED', color: '#10B981', status: 'Active' },
    { id: 2, name: 'Callback Requested', key: 'CALLBACK', color: '#2563EB', status: 'Active' },
    { id: 3, name: 'No Answer / Ringing', key: 'NO_ANSWER', color: '#F59E0B', status: 'Active' },
    { id: 4, name: 'Busy / Disconnected', key: 'BUSY', color: '#8B5CF6', status: 'Active' },
    { id: 5, name: 'Not Interested', key: 'NOT_INTERESTED', color: '#E11D48', status: 'Active' }
  ]);

  // Base Booking Statuses
  const [bookingsList, setBookingsList] = useState([
    { id: 1, name: 'Confirmed', key: 'CONFIRMED', color: '#10B981', status: 'Active' },
    { id: 2, name: 'Pending Advance', key: 'PENDING_ADVANCE', color: '#F59E0B', status: 'Active' },
    { id: 3, name: 'Checked In', key: 'CHECKED_IN', color: '#2563EB', status: 'Active' },
    { id: 4, name: 'Completed / Checked Out', key: 'CHECKED_OUT', color: '#059669', status: 'Active' },
    { id: 5, name: 'Cancelled', key: 'CANCELLED', color: '#E11D48', status: 'Active' }
  ]);

  // Fetch live leads from database on mount
  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = async () => {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads({ size: 1000 });
      if (response && response.content) {
        setLiveLeads(response.content);
      }
    } catch (err) {
      console.error('Failed to load live database leads for configuration stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalLeadsCount = liveLeads.length;

  // Compute live counts and percentages for Lead Sources
  const computedSources = useMemo(() => {
    return sourcesList.map((item) => {
      const count = liveLeads.filter((l) => {
        if (!l.source) return false;
        const s = String(l.source).toUpperCase();
        return s === item.key || s.includes(item.name.toUpperCase());
      }).length;

      const sharePercent = totalLeadsCount > 0 ? ((count / totalLeadsCount) * 100).toFixed(1) : '0.0';

      return {
        ...item,
        totalLeads: count,
        share: `${sharePercent}%`,
        rawPercent: totalLeadsCount > 0 ? (count / totalLeadsCount) * 100 : 0
      };
    });
  }, [sourcesList, liveLeads, totalLeadsCount]);

  // Compute live counts for Lead Statuses
  const computedStatuses = useMemo(() => {
    return statusesList.map((item) => {
      const count = liveLeads.filter((l) => {
        if (!l.status) return false;
        const st = String(l.status).toUpperCase();
        return st === item.key || st.includes(item.name.toUpperCase());
      }).length;
      return { ...item, totalLeads: count };
    });
  }, [statusesList, liveLeads]);

  // Compute live counts for Priorities
  const computedPriorities = useMemo(() => {
    return prioritiesList.map((item) => {
      const count = liveLeads.filter((l) => {
        if (!l.priority) return false;
        const p = String(l.priority).toUpperCase();
        return p === item.key || p.includes(item.name.toUpperCase());
      }).length;
      return { ...item, totalLeads: count };
    });
  }, [prioritiesList, liveLeads]);

  // Compute live counts for Follow-up Outcomes
  const computedOutcomes = useMemo(() => {
    return outcomesList.map((item) => {
      const count = liveLeads.filter((l) => {
        if (!l.lastCallOutcome) return false;
        const o = String(l.lastCallOutcome).toUpperCase();
        return o === item.key || o.includes(item.name.toUpperCase());
      }).length;
      return { ...item, totalLeads: count };
    });
  }, [outcomesList, liveLeads]);

  // Compute live counts for Bookings
  const computedBookings = useMemo(() => {
    const bookedLeads = liveLeads.filter((l) => l.status === 'BOOKED').length;
    return bookingsList.map((item, idx) => {
      return {
        ...item,
        totalLeads: idx === 0 ? bookedLeads : 0
      };
    });
  }, [bookingsList, liveLeads]);

  // Current active data list
  const currentTableData = useMemo(() => {
    switch (activeTab) {
      case 'Lead Sources': return computedSources;
      case 'Lead Statuses': return computedStatuses;
      case 'Priority': return computedPriorities;
      case 'Follow-up Outcomes': return computedOutcomes;
      case 'Booking Statuses': return computedBookings;
      default: return computedSources;
    }
  }, [activeTab, computedSources, computedStatuses, computedPriorities, computedOutcomes, computedBookings]);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(currentTableData.map((s) => s.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Toggle active / inactive status
  const handleToggleStatus = (id) => {
    const updater = (list) =>
      list.map((item) =>
        item.id === id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item
      );

    if (activeTab === 'Lead Sources') setSourcesList(updater);
    else if (activeTab === 'Lead Statuses') setStatusesList(updater);
    else if (activeTab === 'Priority') setPrioritiesList(updater);
    else if (activeTab === 'Follow-up Outcomes') setOutcomesList(updater);
    else if (activeTab === 'Booking Statuses') setBookingsList(updater);
  };

  // Delete item
  const handleDeleteItem = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      const filterer = (list) => list.filter((item) => item.id !== id);
      if (activeTab === 'Lead Sources') setSourcesList(filterer);
      else if (activeTab === 'Lead Statuses') setStatusesList(filterer);
      else if (activeTab === 'Priority') setPrioritiesList(filterer);
      else if (activeTab === 'Follow-up Outcomes') setOutcomesList(filterer);
      else if (activeTab === 'Booking Statuses') setBookingsList(filterer);
    }
  };

  // Add / Edit Item Submit
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    if (editingItem) {
      const updater = (list) =>
        list.map((item) => (item.id === editingItem.id ? { ...item, name: newItemName.trim() } : item));
      if (activeTab === 'Lead Sources') setSourcesList(updater);
      else if (activeTab === 'Lead Statuses') setStatusesList(updater);
      else if (activeTab === 'Priority') setPrioritiesList(updater);
      else if (activeTab === 'Follow-up Outcomes') setOutcomesList(updater);
      else if (activeTab === 'Booking Statuses') setBookingsList(updater);
    } else {
      const newItem = {
        id: Date.now(),
        name: newItemName.trim(),
        key: newItemName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_'),
        icon: Tag,
        iconColor: '#1E56F0',
        iconBg: '#EFF6FF',
        isDefault: false,
        status: 'Active',
        color: '#1E56F0'
      };

      if (activeTab === 'Lead Sources') setSourcesList((prev) => [...prev, newItem]);
      else if (activeTab === 'Lead Statuses') setStatusesList((prev) => [...prev, newItem]);
      else if (activeTab === 'Priority') setPrioritiesList((prev) => [...prev, newItem]);
      else if (activeTab === 'Follow-up Outcomes') setOutcomesList((prev) => [...prev, newItem]);
      else if (activeTab === 'Booking Statuses') setBookingsList((prev) => [...prev, newItem]);
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
    setNewItemName('');
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setIsAddModalOpen(true);
  };

  // Calculate SVG donut stroke dash arrays dynamically
  const circumference = 2 * Math.PI * 38; // ~238.76
  let accumulatedOffset = 0;

  return (
    <div style={{
      boxSizing: 'border-box',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
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
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Lead Sources / Status Configuration
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '3px 0 0 0' }}>
            Live system configuration, lead sources, statuses, and real-time database counts.
          </p>
        </div>

        {/* Action Button: Add Source & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={fetchLiveData}
            title="Refresh Live Data"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '7px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setNewItemName('');
              setIsAddModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1E56F0',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(30, 86, 240, 0.2)'
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add {activeTab.replace(/s$/, '')}</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '2px',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedItems([]);
              }}
              style={{
                backgroundColor: isActive ? '#1E56F0' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#475569',
                border: isActive ? '1px solid #1E56F0' : '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Main 2-Column Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.35fr 330px',
        gap: '16px',
        alignItems: 'stretch'
      }}>
        
        {/* Left Column: Configuration Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {activeTab}
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
              {totalLeadsCount} Total Leads in Database
            </span>
          </div>

          <div style={{ flex: 1, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ width: '38px', padding: '10px 14px' }}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={currentTableData.length > 0 && selectedItems.length === currentTableData.length}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '10px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    {activeTab === 'Lead Sources' ? 'Source Name' : (activeTab === 'Priority' ? 'Priority Level' : 'Status Name')}
                  </th>
                  <th style={{ padding: '10px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>
                    Icon / Indicator
                  </th>
                  <th style={{ padding: '10px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '10px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>
                    Total Leads
                  </th>
                  <th style={{ padding: '10px 14px', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((item, idx) => {
                  const Icon = item.icon || Tag;
                  const isSelected = selectedItems.includes(item.id);
                  const isSource = activeTab === 'Lead Sources';
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: idx === currentTableData.length - 1 ? 'none' : '1px solid #F1F5F9',
                        backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF'
                      }}
                    >
                      <td style={{ padding: '10px 14px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(item.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>

                      {/* Name */}
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isSource ? (
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: item.iconBg || '#EFF6FF',
                              color: item.iconColor || item.color || '#1E56F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Icon size={13} />
                            </div>
                          ) : (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: item.color || '#1E56F0'
                            }} />
                          )}
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Default Tag Pill / Indicator */}
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: item.isDefault ? '#EFF6FF' : '#F1F5F9',
                          color: item.isDefault ? '#1E56F0' : '#64748B',
                          border: item.isDefault ? '1px solid #BFDBFE' : '1px solid #E2E8F0'
                        }}>
                          {item.isDefault ? 'D' : '—'}
                        </span>
                      </td>

                      {/* Status Toggle Button */}
                      <td style={{ padding: '10px 12px' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id)}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: item.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                            color: item.status === 'Active' ? '#059669' : '#DC2626'
                          }}
                        >
                          {item.status}
                        </button>
                      </td>

                      {/* Total Leads (Live Data) */}
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.82rem', fontWeight: 700, color: item.totalLeads > 0 ? '#1E56F0' : '#64748B' }}>
                        {item.totalLeads}
                      </td>

                      {/* Action Icons */}
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px' }}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF'
          }}>
            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
              Showing 1 - {currentTableData.length} of {currentTableData.length} {activeTab.toLowerCase()}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button style={{ border: '1px solid #1E56F0', backgroundColor: '#1E56F0', color: '#FFFFFF', borderRadius: '4px', padding: '3px 9px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                1
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Source Statistics + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Card 1: Source Statistics Donut */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
              {activeTab === 'Lead Sources' ? 'Source Statistics' : `${activeTab} Distribution`}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* SVG Donut */}
              <div style={{ position: 'relative', width: '105px', height: '105px', flexShrink: 0 }}>
                <svg width="105" height="105" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  
                  {totalLeadsCount > 0 ? (
                    computedSources.map((item) => {
                      if (!item.rawPercent || item.rawPercent <= 0) return null;
                      const segmentLength = (item.rawPercent / 100) * circumference;
                      const dashArray = `${segmentLength.toFixed(2)} ${(circumference - segmentLength).toFixed(2)}`;
                      const dashOffset = -accumulatedOffset;
                      accumulatedOffset += segmentLength;

                      return (
                        <circle
                          key={item.id}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="12"
                          strokeDasharray={dashArray}
                          strokeDashoffset={dashOffset}
                        />
                      );
                    })
                  ) : (
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                  )}
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
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                    {totalLeadsCount}
                  </span>
                  <span style={{ fontSize: '0.56rem', color: '#64748B', fontWeight: 600 }}>Total Leads</span>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, maxHeight: '150px', overflowY: 'auto' }}>
                {(activeTab === 'Lead Sources' ? computedSources : currentTableData).map((item) => {
                  const share = totalLeadsCount > 0
                    ? `${((item.totalLeads / totalLeadsCount) * 100).toFixed(1)}%`
                    : '0.0%';
                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.color || '#1E56F0' }} />
                        <span style={{ fontSize: '0.72rem', color: '#334155' }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>{share}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Quick Actions & Best Practice Tip */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Quick Actions
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setNewItemName('');
                  setIsAddModalOpen(true);
                }}
                style={{
                  backgroundColor: '#1E56F0',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                + Add Item
              </button>
              <button
                type="button"
                onClick={() => alert(`Bulk actions available on ${selectedItems.length} selected items.`)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '7px 4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Edit ({selectedItems.length})
              </button>
              <button
                type="button"
                onClick={fetchLiveData}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '7px 4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Re-sync
              </button>
            </div>

            {/* Tip Callout Banner */}
            <div style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '6px',
              border: '1px solid #BFDBFE',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <Info size={15} color="#1E56F0" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E40AF', display: 'block' }}>
                  Live CRM Synchronization
                </span>
                <p style={{ fontSize: '0.7rem', color: '#1E40AF', margin: '2px 0 0 0', lineHeight: 1.35 }}>
                  Total leads and distribution statistics automatically reflect real PostgreSQL database records.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Add / Edit Modal Dialog */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            width: '400px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {editingItem ? `Edit ${editingItem.name}` : `Add New ${activeTab.replace(/s$/, '')}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. Meta Ads or Direct Inquiry`}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1E56F0',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 16px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPage;
