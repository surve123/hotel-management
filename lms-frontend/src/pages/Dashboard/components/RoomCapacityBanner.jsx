import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Loader2 } from 'lucide-react';
import dashboardService from '../../../services/dashboardService';

/**
 * Top Right Room Capacity Card (LMS PART 1 - Screen 2)
 * Pure Dynamic SVG Component connected to PostgreSQL live metrics.
 */
export const RoomCapacityBanner = () => {
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCapacity = async () => {
      try {
        const metrics = await dashboardService.getAdminMetrics();
        if (isMounted) {
          setCapacity(metrics?.availableRoomCapacity ?? 0);
        }
      } catch (err) {
        console.warn('Could not load dynamic room capacity:', err.message);
        if (isMounted) setCapacity(0);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCapacity();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      backgroundColor: '#F0FDF4',
      border: '1px solid #DCFCE7',
      borderRadius: '10px',
      padding: '10px 18px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        backgroundColor: '#DCFCE7',
        color: '#16A34A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <BedDouble size={20} />
      </div>
      <div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" style={{ display: 'inline-block', color: '#16A34A' }} />
          ) : (
            (capacity || 0).toLocaleString('en-IN')
          )}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
          <span>Total Available Room Capacity</span>
          <span>•</span>
          <span
            onClick={() => navigate('/admin/properties')}
            style={{ color: '#16A34A', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            View Properties
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomCapacityBanner;
