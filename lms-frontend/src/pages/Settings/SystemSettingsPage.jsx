import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Image,
  Save,
  Info,
  Check,
  Bell,
  MessageSquare,
  ShieldAlert,
  Clock,
  ChevronDown
} from 'lucide-react';
import BrandLogo from '../../components/Common/BrandLogo';

/**
 * SystemSettingsPage Component (LMS PART 8 - Screen 4: System Settings)
 * - Tabs: Company Profile, Property Configuration, Notifications, WhatsApp, Email, Security, Audit Log
 * - 2-Column Form:
 *   1. Company Profile: Company Name, Email, Phone, Website, Address, Logo with Change Logo button
 *   2. Company Details: Business Type, Timezone, Currency, Financial Year, Save Changes button
 * - Bottom Info Banner
 * 100% SVG Lucide Icons (Zero Emojis).
 */
export const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Company Profile');
  const [saveStatus, setSaveStatus] = useState(false);

  // Form State
  const [form, setForm] = useState({
    companyName: 'Arnavee Hospitality',
    email: 'info@arnavee.com',
    phone: '+91 98765 43210',
    website: 'www.arnavee.com',
    address: '123 Hospitality Lane, Mumbai, Maharashtra - 400001',
    businessType: 'Hospitality & Resorts',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR - Indian Rupee',
    financialYear: 'Apr 1 - Mar 31'
  });

  const tabs = [
    'Company Profile',
    'Property Configuration',
    'Notifications',
    'WhatsApp',
    'Email',
    'Security',
    'Audit Log'
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

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
            System Settings
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '3px 0 0 0' }}>
            Configure your application settings and preferences.
          </p>
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
              onClick={() => setActiveTab(tab)}
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

      {/* 3. Main Form Area (when Company Profile tab is active) */}
      {activeTab === 'Company Profile' && (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '16px',
            alignItems: 'stretch'
          }}>
            
            {/* Left Card: Company Profile */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Company Profile
              </h3>

              {/* Company Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Company Name <span style={{ color: '#E11D48' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none',
                    color: '#0F172A'
                  }}
                />
              </div>

              {/* Email & Phone Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Email <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8rem',
                      outline: 'none',
                      color: '#0F172A'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Phone <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8rem',
                      outline: 'none',
                      color: '#0F172A'
                    }}
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Website
                </label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none',
                    color: '#0F172A'
                  }}
                />
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Address <span style={{ color: '#E11D48' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none',
                    color: '#0F172A'
                  }}
                />
              </div>

              {/* Logo */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Logo
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    padding: '8px 14px',
                    border: '1px dashed #CBD5E1',
                    borderRadius: '6px',
                    backgroundColor: '#F8FAFC'
                  }}>
                    <BrandLogo size="md" isLight={false} />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Logo upload dialog...')}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    Change Logo
                  </button>
                </div>
              </div>

            </div>

            {/* Right Card: Company Details */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Company Details
                </h3>

                {/* Business Type */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Business Type
                  </label>
                  <select
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    style={{
                      width: '100%',
                      appearance: 'none',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '8px 28px 8px 10px',
                      fontSize: '0.8rem',
                      color: '#0F172A',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Hospitality & Resorts">Hospitality &amp; Resorts</option>
                    <option value="Luxury Villas & Homestays">Luxury Villas &amp; Homestays</option>
                    <option value="Boutique Hotel Chain">Boutique Hotel Chain</option>
                    <option value="Serviced Apartments">Serviced Apartments</option>
                  </select>
                  <ChevronDown size={14} color="#64748B" style={{ position: 'absolute', right: '10px', top: '28px', pointerEvents: 'none' }} />
                </div>

                {/* Timezone */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Timezone
                  </label>
                  <select
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    style={{
                      width: '100%',
                      appearance: 'none',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '8px 28px 8px 10px',
                      fontSize: '0.8rem',
                      color: '#0F172A',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                    <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                  </select>
                  <ChevronDown size={14} color="#64748B" style={{ position: 'absolute', right: '10px', top: '28px', pointerEvents: 'none' }} />
                </div>

                {/* Currency */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    style={{
                      width: '100%',
                      appearance: 'none',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '8px 28px 8px 10px',
                      fontSize: '0.8rem',
                      color: '#0F172A',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                    <option value="USD - US Dollar">USD - US Dollar</option>
                    <option value="AED - UAE Dirham">AED - UAE Dirham</option>
                    <option value="EUR - Euro">EUR - Euro</option>
                  </select>
                  <ChevronDown size={14} color="#64748B" style={{ position: 'absolute', right: '10px', top: '28px', pointerEvents: 'none' }} />
                </div>

                {/* Financial Year */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Financial Year
                  </label>
                  <select
                    value={form.financialYear}
                    onChange={(e) => setForm({ ...form, financialYear: e.target.value })}
                    style={{
                      width: '100%',
                      appearance: 'none',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '8px 28px 8px 10px',
                      fontSize: '0.8rem',
                      color: '#0F172A',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Apr 1 - Mar 31">Apr 1 - Mar 31</option>
                    <option value="Jan 1 - Dec 31">Jan 1 - Dec 31</option>
                  </select>
                  <ChevronDown size={14} color="#64748B" style={{ position: 'absolute', right: '10px', top: '28px', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Save Changes Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '18px' }}>
                {saveStatus && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                    <Check size={14} /> Saved successfully!
                  </span>
                )}
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1E56F0',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 18px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(30, 86, 240, 0.2)'
                  }}
                >
                  Save Changes
                </button>
              </div>

            </div>

          </div>

          {/* 4. Bottom Info Callout Banner */}
          <div style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '6px',
            border: '1px solid #BFDBFE',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={16} color="#1E56F0" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.74rem', color: '#1E40AF', margin: 0 }}>
              Your company profile helps in generating reports, invoices and communication templates with your brand details.
            </p>
          </div>

        </form>
      )}

      {/* Other Tabs Placeholder Views */}
      {activeTab !== 'Company Profile' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
            {activeTab} Configuration
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 16px 0' }}>
            Manage and configure settings for {activeTab.toLowerCase()}.
          </p>
          <div style={{
            padding: '16px',
            borderRadius: '6px',
            backgroundColor: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            color: '#64748B',
            fontSize: '0.78rem'
          }}>
            {activeTab} parameters are active and managed via the primary cluster configuration.
          </div>
        </div>
      )}

    </div>
  );
};

export default SystemSettingsPage;
