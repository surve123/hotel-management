import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Home, 
  Edit3, 
  Users, 
  CalendarCheck2, 
  IndianRupee, 
  Percent,
  Calendar,
  ChevronDown,
  Wifi,
  Waves,
  Utensils,
  Sparkles,
  Wine,
  Car,
  Coffee,
  ShieldCheck,
  Tv,
  Bed,
  Bath,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  Loader2,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import luxuryVillaImg from '../../assets/luxury_pool_villa.jpg';
import LeadBookingFunnel from '../../components/Charts/LeadBookingFunnel';
import PropertyPerformanceTable from '../Dashboard/components/PropertyPerformanceTable';
import LeadsBySourceDonut from '../../components/Charts/LeadsBySourceDonut';
import TelecallerLeaderboardTable from '../Dashboard/components/TelecallerLeaderboardTable';
import MonthlyTrendBarChart from './components/MonthlyTrendBarChart';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import propertyService from '../../services/propertyService';
import leadService from '../../services/leadService';
import bookingService from '../../services/bookingService';

/**
 * PropertyDetailsPage Component (LMS PART 5 - Screen 3: Property Details)
 * Hero villa showcase with dynamic performance overview, interactive tabs for Overview, Gallery, Rooms, Amenities, Performance, and Recent Customers.
 * Authorized for: 🔴 Super Admin + 🔵 Sub Admin.
 * 100% Dynamic data fetched from REST API.
 */
export const PropertyDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [property, setProperty] = useState(null);
  const [leads, setLeads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAllData(id);
    }
  }, [id]);

  const loadAllData = async (propId) => {
    setIsLoading(true);
    try {
      const [propData, leadsData, bookingsData] = await Promise.all([
        propertyService.getPropertyById(propId).catch(() => null),
        leadService.getLeads({ propertyId: propId, size: 50 }).catch(() => ({ content: [] })),
        bookingService.getBookings({ propertyId: propId, size: 50 }).catch(() => ({ content: [] }))
      ]);

      if (propData) {
        setProperty(propData);
      }
      setLeads(leadsData?.content || (Array.isArray(leadsData) ? leadsData : []));
      setBookings(bookingsData?.content || (Array.isArray(bookingsData) ? bookingsData : []));
    } catch (err) {
      console.error('Failed to load property details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const editPath = role === ROLES.SUPER_ADMIN ? `/super-admin/properties/edit/${id}` : `/admin/properties/edit/${id}`;
  const propName = property?.name || 'Property Details';
  const propCity = property?.city || property?.address || 'Location not specified';
  const propType = property?.type || 'Villa';
  const propRooms = property?.totalRooms || 0;
  const propGuests = property?.maxGuests || 0;
  const propPrice = property?.basePricePerNight ? `₹ ${Number(property.basePricePerNight).toLocaleString('en-IN')}` : '₹ 0';
  const propDesc = property?.description || 'No description provided for this property.';
  const propImages = property?.imageUrls && property.imageUrls.length > 0 ? property.imageUrls : [];
  const propImage = propImages.length > 0 ? propImages[0] : luxuryVillaImg;

  // Dynamic Mini KPIs
  const totalLeadsCount = leads.length;
  const bookingsCount = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const conversionRate = totalLeadsCount > 0 ? ((bookingsCount / totalLeadsCount) * 100).toFixed(1) + '%' : '0.0%';

  const miniKpis = [
    { label: 'Total Leads', value: String(totalLeadsCount), trend: '+0%', icon: Users, color: '#1E56F0', bg: '#EFF6FF' },
    { label: 'Bookings', value: String(bookingsCount), trend: '+0%', icon: CalendarCheck2, color: '#059669', bg: '#ECFDF5' },
    { label: 'Revenue', value: `₹ ${totalRevenue.toLocaleString('en-IN')}`, trend: '+0%', icon: IndianRupee, color: '#7E22CE', bg: '#FAF5FF' },
    { label: 'Conversion Rate', value: conversionRate, trend: '+0%', icon: Percent, color: '#D97706', bg: '#FEF3C7' },
  ];

  // Dynamic Lead Sources calculation
  const sourceColors = {
    INSTAGRAM: '#E1306C',
    WHATSAPP: '#25D366',
    WEBSITE: '#1E56F0',
    PHONE: '#9333EA',
    REFERRAL: '#EA580C',
    GOOGLE_ADS: '#0284C7',
    OTHER: '#64748B'
  };

  const leadSourcesCount = leads.reduce((acc, lead) => {
    const src = (lead.source || 'OTHER').toUpperCase();
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  const leadSources = Object.keys(leadSourcesCount).length > 0 
    ? Object.entries(leadSourcesCount).map(([src, count]) => ({
        label: src.charAt(0) + src.slice(1).toLowerCase().replace('_', ' '),
        percentage: Math.round((count / (totalLeadsCount || 1)) * 100),
        color: sourceColors[src] || '#1E56F0'
      }))
    : [
        { label: 'Instagram', percentage: 0, color: '#E1306C' },
        { label: 'WhatsApp', percentage: 0, color: '#25D366' },
        { label: 'Website', percentage: 0, color: '#1E56F0' },
        { label: 'Phone', percentage: 0, color: '#9333EA' },
      ];

  // Dynamic Amenities Helper
  const getAmenityIcon = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return Wifi;
    if (lower.includes('pool') || lower.includes('swim')) return Waves;
    if (lower.includes('kitchen') || lower.includes('dining') || lower.includes('chef') || lower.includes('cook')) return Utensils;
    if (lower.includes('bar') || lower.includes('cocktail') || lower.includes('drink')) return Wine;
    if (lower.includes('spa') || lower.includes('steam') || lower.includes('jacuzzi')) return Sparkles;
    if (lower.includes('park') || lower.includes('car') || lower.includes('valet')) return Car;
    if (lower.includes('coffee') || lower.includes('tea') || lower.includes('breakfast')) return Coffee;
    if (lower.includes('sec') || lower.includes('guard') || lower.includes('cctv')) return ShieldCheck;
    if (lower.includes('tv') || lower.includes('theatre') || lower.includes('screen')) return Tv;
    if (lower.includes('bed') || lower.includes('room') || lower.includes('suite')) return Bed;
    if (lower.includes('bath') || lower.includes('shower')) return Bath;
    return CheckCircle2;
  };

  const amenitiesList = (property?.amenities && property.amenities.length > 0)
    ? property.amenities.map(name => ({
        title: name,
        icon: getAmenityIcon(name),
        category: 'Included Feature'
      }))
    : [];

  const backPath = role === ROLES.SUPER_ADMIN ? '/super-admin/properties' : '/admin/properties';
  const performancePath = role === ROLES.SUPER_ADMIN ? '/super-admin/properties/performance' : '/admin/properties/performance';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Bar: Back Link & Date Range */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          type="button"
          onClick={() => navigate(backPath)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#1E56F0',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Properties</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '0.78rem',
          color: '#475569',
          fontWeight: 600
        }}>
          <Calendar size={14} color="#64748B" />
          <span>11 Sep 2025 - 17 Sep 2025</span>
          <ChevronDown size={12} color="#94A3B8" />
        </div>
      </div>

      {/* Row 1: Hero Villa Showcase + Key Info */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '14px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.8fr',
        gap: '20px',
        alignItems: 'center'
      }}>
        {/* Left: Showcase Villa Image */}
        <div style={{
          height: '220px',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <img
            src={propImage}
            alt={propName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px'
          }}>
            {propType} • {propRooms} BHK
          </span>
        </div>

        {/* Right: Property Profile & 4 Mini KPIs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0
                }}>
                  {propName}
                </h1>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  backgroundColor: (property?.active ?? true) ? '#ECFDF5' : '#FEE2E2',
                  color: (property?.active ?? true) ? '#059669' : '#EF4444'
                }}>
                  {(property?.active ?? true) ? 'Active' : 'Inactive'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate(editPath)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: '#1E56F0',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(30, 86, 240, 0.2)'
                }}
              >
                <Edit3 size={13} />
                <span>Edit Property</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#64748B' }}>
                <MapPin size={13} color="#94A3B8" />
                <span>{propCity}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#64748B' }}>
                <Home size={13} color="#94A3B8" />
                <span>{propType}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>
                <span>{propPrice} / night</span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#475569', margin: '8px 0 0 0', lineHeight: 1.4 }}>
              {propDesc}
            </p>
          </div>

          {/* 4 Mini KPIs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '12px'
          }}>
            {miniKpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #F1F5F9',
                    borderRadius: '8px',
                    padding: '10px 12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>
                      {kpi.label}
                    </span>
                    <Icon size={14} color={kpi.color} />
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '3px' }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 700, marginTop: '1px' }}>
                    ▲ {kpi.trend}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Tabs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #CBD5E1',
        paddingLeft: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {['Overview', 'Gallery', 'Rooms', 'Amenities', 'Performance', 'Recent Customers'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #1E56F0' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === tab ? '#1E56F0' : '#64748B',
                fontSize: '0.8rem',
                fontWeight: activeTab === tab ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action button to open Full Performance Screen */}
        {activeTab === 'Performance' && (
          <button
            type="button"
            onClick={() => navigate(performancePath)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #BFDBFE',
              backgroundColor: '#EFF6FF',
              color: '#1E56F0',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '6px'
            }}
          >
            <span>Open Full Analytics Screen</span>
            <ExternalLink size={13} />
          </button>
        )}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr 1.2fr',
          gap: '16px',
          alignItems: 'stretch'
        }}>
          {/* Panel 1: Property Gallery */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                Property Gallery
              </h3>

              {/* Main Showcase Image */}
              <div style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                <img src={propImage} alt={propName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Thumbnails */}
              {propImages.length > 1 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {propImages.slice(1, 4).map((url, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveTab('Gallery')}
                      style={{ height: '56px', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                    >
                      <img
                        src={url}
                        alt={`thumb-${idx}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {idx === 2 && propImages.length > 4 && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(15, 23, 42, 0.65)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.78rem'
                        }}>
                          +{propImages.length - 3} more
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '4px 0', textAlign: 'center' }}>
                  {propImages.length === 1 ? '1 image uploaded' : 'No additional gallery images'}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('Gallery')}
              style={{
                marginTop: '14px',
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#475569',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View Full Gallery ({propImages.length})
            </button>
          </div>

          {/* Panel 2: Property Performance & Lead Sources */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Property Performance
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E56F0' }} />
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Leads: {totalLeadsCount}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Bookings: {bookingsCount}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Chart Summary */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Inquiry Conversion</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E56F0', marginTop: '2px' }}>{conversionRate}</div>
                </div>
                <div style={{ height: '28px', width: '1px', backgroundColor: '#E2E8F0' }} />
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Total Revenue</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>₹ {totalRevenue.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Lead Sources Breakdown */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  Lead Sources Breakdown
                </div>
                {totalLeadsCount > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {leadSources.map((s) => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', width: '75px', fontWeight: 500 }}>
                          {s.label}
                        </span>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          backgroundColor: '#F1F5F9',
                          borderRadius: '9999px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${s.percentage}%`,
                            height: '100%',
                            backgroundColor: s.color,
                            borderRadius: '9999px'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#0F172A', fontWeight: 700, width: '32px', textAlign: 'right' }}>
                          {s.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '6px'
                  }}>
                    No lead source data available yet for this property.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel 3: Recent Bookings */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Recent Bookings
              </h3>
              <span
                onClick={() => setActiveTab('Recent Customers')}
                style={{ fontSize: '0.74rem', fontWeight: 600, color: '#1E56F0', cursor: 'pointer' }}
              >
                View All ({bookings.length})
              </span>
            </div>

            {bookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {bookings.slice(0, 5).map((b) => {
                  const guestName = b.customerName || (b.customer ? b.customer.name : 'Guest');
                  const checkIn = b.checkInDate || '';
                  const checkOut = b.checkOutDate || '';
                  const nights = b.totalNights || 1;
                  const isConfirmed = (b.status || '').toUpperCase() === 'CONFIRMED';
                  return (
                    <div
                      key={b.id || b.bookingNumber}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: '7px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #F1F5F9'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isConfirmed ? '#ECFDF5' : '#EFF6FF',
                          color: isConfirmed ? '#059669' : '#1E56F0',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {guestName[0]?.toUpperCase() || 'G'}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                            {guestName}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                            {checkIn} • {nights} Night{nights > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        backgroundColor: isConfirmed ? '#ECFDF5' : '#FEF3C7',
                        color: isConfirmed ? '#059669' : '#D97706'
                      }}>
                        {b.status || 'Active'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                padding: '24px 12px',
                textAlign: 'center',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px dashed #E2E8F0'
              }}>
                <CalendarCheck2 size={24} color="#94A3B8" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>No bookings recorded yet</div>
                <button
                  type="button"
                  onClick={() => navigate('/admin/leads/new')}
                  style={{
                    marginTop: '8px',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#1E56F0',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Create Lead
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PERFORMANCE (Full LMS Part 5 Screen 4 Embedded in Tab) */}
      {activeTab === 'Performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Row 1: Funnel & Performance Comparison Table */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: '16px',
            alignItems: 'stretch'
          }}>
            <LeadBookingFunnel />
            <PropertyPerformanceTable />
          </div>

          {/* Row 2: Source Donut, Telecaller Leaderboard, Monthly Trend Chart */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr 1.1fr',
            gap: '16px',
            alignItems: 'stretch'
          }}>
            <LeadsBySourceDonut />
            <TelecallerLeaderboardTable />
            <MonthlyTrendBarChart />
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: GALLERY */}
      {activeTab === 'Gallery' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                High-Resolution Visual Showcase
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                {propImages.length} photo perspective{propImages.length === 1 ? '' : 's'} of {propName}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(editPath)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '7px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#1E56F0',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Upload / Edit Photos</span>
            </button>
          </div>

          {propImages.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {propImages.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    position: 'relative'
                  }}
                >
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={url}
                      alt={`${propName} view ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                    />
                  </div>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                        {propName} - Photo {idx + 1}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {propCity}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: '#EFF6FF',
                      color: '#1E56F0'
                    }}>
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px dashed #CBD5E1'
            }}>
              <ImageIcon size={36} color="#94A3B8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>No Photos Uploaded Yet</div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', maxWidth: '360px', margin: '4px auto 12px' }}>
                Upload photos when creating or editing this property to showcase the villa grounds and amenities.
              </p>
              <button
                type="button"
                onClick={() => navigate(editPath)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: '#1E56F0',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Edit Property to Add Photos
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: ROOMS */}
      {activeTab === 'Rooms' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Room Types & Configuration
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Accommodation layout and capacity details for {propName}.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {propName} ({propRooms > 0 ? `${propRooms} BHK ` : ''}{propType})
                  </h4>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: (property?.active ?? true) ? '#ECFDF5' : '#FEE2E2',
                    color: (property?.active ?? true) ? '#059669' : '#EF4444'
                  }}>
                    {(property?.active ?? true) ? 'Available Now' : 'Under Maintenance'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                  Capacity: Up to {propGuests} Guests • {propRooms} Bedroom{propRooms > 1 ? 's' : ''}
                </div>
                {property?.amenities && property.amenities.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {property.amenities.map((a) => (
                      <span
                        key={a}
                        style={{
                          fontSize: '0.68rem',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          color: '#475569',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: 500
                        }}
                      >
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E56F0' }}>
                  {propPrice} / night
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/admin/leads/new')}
                  style={{
                    marginTop: '8px',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#1E56F0',
                    color: '#FFFFFF',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Create Booking Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: AMENITIES */}
      {activeTab === 'Amenities' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Included Luxury Amenities & Services
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                {amenitiesList.length} verified amenities registered for {propName}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(editPath)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '7px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#1E56F0',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Edit3 size={13} />
              <span>Edit Amenities</span>
            </button>
          </div>

          {amenitiesList.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px'
            }}>
              {amenitiesList.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      backgroundColor: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#EFF6FF',
                      color: '#1E56F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={18} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              padding: '30px 20px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px dashed #CBD5E1'
            }}>
              <CheckCircle2 size={32} color="#94A3B8" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>No Amenities Selected Yet</div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0 12px' }}>
                You can select and update amenities like WiFi, Swimming Pool, Parking, etc. in the edit screen.
              </p>
              <button
                type="button"
                onClick={() => navigate(editPath)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#1E56F0',
                  color: '#FFFFFF',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Add Amenities
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 6: RECENT CUSTOMERS */}
      {activeTab === 'Recent Customers' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Recent Guest Inquiries & Booking History
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                All {bookings.length} verified bookings and guest reservations associated with {propName}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/leads/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: '#1E56F0',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Add Lead for Property</span>
            </button>
          </div>

          {bookings.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>Guest Name</th>
                  <th style={{ padding: '10px 14px' }}>Stay Dates</th>
                  <th style={{ padding: '10px 14px' }}>Amount</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const guestName = b.customerName || (b.customer ? b.customer.name : 'Guest');
                  const checkIn = b.checkInDate || '-';
                  const checkOut = b.checkOutDate || '-';
                  const isConfirmed = (b.status || '').toUpperCase() === 'CONFIRMED';
                  return (
                    <tr key={b.id || b.bookingNumber} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: isConfirmed ? '#ECFDF5' : '#EFF6FF',
                            color: isConfirmed ? '#059669' : '#1E56F0',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {guestName[0]?.toUpperCase() || 'G'}
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, color: '#0F172A' }}>{guestName}</span>
                            {b.customerPhone && (
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{b.customerPhone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>
                        {checkIn} to {checkOut} ({b.totalNights || 1}N)
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                        ₹ {Number(b.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: isConfirmed ? '#ECFDF5' : '#FEF3C7',
                          color: isConfirmed ? '#059669' : '#D97706'
                        }}>
                          {b.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => navigate('/admin/bookings')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#FFFFFF',
                            color: '#1E56F0',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          View Booking
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{
              padding: '30px 20px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px dashed #CBD5E1'
            }}>
              <Users size={32} color="#94A3B8" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>No Bookings or Inquiries Yet</div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0 12px' }}>
                When customers inquire or book this property, their details will automatically appear here.
              </p>
              <button
                type="button"
                onClick={() => navigate('/admin/leads/new')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#1E56F0',
                  color: '#FFFFFF',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Create First Lead
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
