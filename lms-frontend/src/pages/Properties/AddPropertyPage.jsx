import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Plus,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List as ListIcon,
  Check,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import luxuryVillaImg from '../../assets/luxury_pool_villa.jpg';
import propertyService from '../../services/propertyService';
import mediaService from '../../services/mediaService';

/**
 * AddPropertyPage Component (LMS PART 5 - Screen 2: Add / Edit Property)
 * Comprehensive 3-column form with basic info, rich text description, drag & drop image uploader, amenities checkbox grid, capacity, and contact info.
 * Authorized for: 🔴 Super Admin + 🔵 Sub Admin.
 * 100% SVG Lucide Icons (Zero Emojis).
 */
export const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);

  // Basic Information
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('Villa');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [basePrice, setBasePrice] = useState('25000');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Images state & upload
  const [imageUrls, setImageUrls] = useState([
    luxuryVillaImg,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Amenities
  const [amenities, setAmenities] = useState({
    WiFi: true,
    'Swimming Pool': true,
    Restaurant: true,
    Spa: false,
    Bar: false,
    Parking: true,
    'Room Service': false,
    AC: true,
    'Power Backup': true,
    TV: true,
    Laundry: false,
    'Conference Hall': false,
    Other: false
  });
  const [otherAmenities, setOtherAmenities] = useState('');

  // Property & Contact Details
  const [totalRooms, setTotalRooms] = useState('5');
  const [roomTypes, setRoomTypes] = useState('Villa Suite');
  const [adultsCapacity, setAdultsCapacity] = useState('12');
  const [childrenCapacity, setChildrenCapacity] = useState('4');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (id) {
      loadPropertyData(id);
    }
  }, [id]);

  const loadPropertyData = async (propId) => {
    setIsLoadingProperty(true);
    try {
      const data = await propertyService.getPropertyById(propId);
      if (data) {
        setPropertyName(data.name || '');
        if (data.type) {
          const formattedType = data.type.charAt(0).toUpperCase() + data.type.slice(1).toLowerCase();
          setPropertyType(formattedType);
        }
        setLocation(data.city || '');
        setAddress(data.address || '');
        setBasePrice(String(data.basePricePerNight || 25000));
        setDescription(data.description || '');
        setStatus(data.active ? 'Active' : 'Inactive');
        setTotalRooms(String(data.totalRooms || 5));
        
        const guests = data.maxGuests || 16;
        setAdultsCapacity(String(Math.max(1, guests > 4 ? guests - 4 : guests)));
        setChildrenCapacity(String(guests > 4 ? 4 : 0));

        if (data.imageUrls && data.imageUrls.length > 0) {
          setImageUrls(data.imageUrls);
        }

        if (data.amenities && Array.isArray(data.amenities)) {
          setAmenities(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => {
              next[k] = data.amenities.includes(k);
            });
            return next;
          });
          const custom = data.amenities.filter(a => !Object.keys(amenities).includes(a));
          if (custom.length > 0) {
            setOtherAmenities(custom.join(', '));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load property details:', err);
      setErrorMsg('Failed to load property details for editing.');
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const toggleAmenity = (name) => {
    setAmenities(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    const uploadedList = [];

    for (const file of Array.from(files)) {
      try {
        const res = await mediaService.upload(file);
        if (res?.url) {
          uploadedList.push(res.url);
          continue;
        }
      } catch (err) {
        console.warn('Direct upload not available, using preview data URL:', err);
      }
      const localUrl = URL.createObjectURL(file);
      uploadedList.push(localUrl);
    }

    setImageUrls(prev => [...prev, ...uploadedList]);
    setIsUploadingImage(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!propertyName.trim()) {
      alert('Please enter a property name');
      return;
    }
    if (!location.trim()) {
      alert('Please enter a property location/city');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const selectedAmenities = Object.entries(amenities)
        .filter(([_, val]) => val)
        .map(([key]) => key);

      if (otherAmenities.trim()) {
        selectedAmenities.push(otherAmenities.trim());
      }

      const totalCap = (parseInt(adultsCapacity, 10) || 0) + (parseInt(childrenCapacity, 10) || 0);

      const payload = {
        name: propertyName.trim(),
        type: (propertyType || 'VILLA').toUpperCase(),
        city: location.trim(),
        address: address.trim() || location.trim(),
        basePricePerNight: Number(basePrice) || 25000,
        maxGuests: totalCap > 0 ? totalCap : 15,
        totalRooms: parseInt(totalRooms, 10) || 5,
        description: description.trim() || `${propertyName} in ${location}`,
        amenities: selectedAmenities,
        imageUrls: imageUrls.length > 0 ? imageUrls : [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60'
        ],
        active: status === 'Active'
      };

      if (isEditMode) {
        await propertyService.updateProperty(id, payload);
        alert('Property updated successfully!');
      } else {
        await propertyService.createProperty(payload);
        alert('Property successfully created and saved to database!');
      }
      navigate('/admin/properties');
    } catch (err) {
      console.error('Failed to save property:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Back Button Link */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/properties')}
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
      </div>

      {/* Header */}
      <div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.2,
          margin: 0
        }}>
          {isEditMode ? 'Edit Property' : 'Add New Property'}
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748B',
          marginTop: '3px',
          margin: 0
        }}>
          {isEditMode
            ? 'Update and manage your property specifications, images, and pricing.'
            : 'Fill in the details to add a new property to your system.'}
        </p>
      </div>

      {/* 3-Column Configuration Form */}
      <form onSubmit={handleSave} style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1.3fr 1.1fr',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* Column 1: Basic Information */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Basic Information
          </h3>

          {/* Property Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Property Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter property name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                color: '#0F172A',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Property Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Property Type <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            >
              <option>Villa</option>
              <option>Resort</option>
              <option>Hotel</option>
              <option>Homestay</option>
            </select>
          </div>

          {/* Location / City (Type any city or select suggestions) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Location / City <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              list="location-suggestions"
              required
              placeholder="Type any location (e.g. Lonavala, Alibaug, Karjat...)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <datalist id="location-suggestions">
              <option value="Lonavala" />
              <option value="Alibaug" />
              <option value="Karjat" />
              <option value="Mahabaleshwar" />
              <option value="Igatpuri" />
              <option value="Goa" />
              <option value="Pune" />
              <option value="Mumbai" />
              <option value="Udaipur" />
              <option value="Bali" />
            </datalist>
          </div>

          {/* Base Price per Night */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Base Price / Night (₹) <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="e.g. 25000"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                color: '#0F172A',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Address <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Enter complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                color: '#0F172A',
                fontFamily: 'inherit',
                resize: 'none',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Description with formatting toolbar */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Description
            </label>
            <div style={{
              border: '1px solid #CBD5E1',
              borderRadius: '7px',
              overflow: 'hidden'
            }}>
              {/* Rich text formatting bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px 8px',
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0'
              }}>
                <button type="button" style={{ padding: '3px 6px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <Bold size={12} />
                </button>
                <button type="button" style={{ padding: '3px 6px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <Italic size={12} />
                </button>
                <button type="button" style={{ padding: '3px 6px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <Underline size={12} />
                </button>
                <button type="button" style={{ padding: '3px 6px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <LinkIcon size={12} />
                </button>
                <button type="button" style={{ padding: '3px 6px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <ListIcon size={12} />
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Enter property description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: 'none',
                  fontSize: '0.78rem',
                  color: '#0F172A',
                  fontFamily: 'inherit',
                  resize: 'none',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Status <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                fontSize: '0.78rem',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Column 2: Property Images & Amenities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Property Images Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
              Property Images
            </h3>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Drag & Drop Upload Container */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFiles(e.dataTransfer.files);
                }
              }}
              style={{
                border: isDragging ? '2px dashed #1E56F0' : '2px dashed #BFDBFE',
                borderRadius: '10px',
                backgroundColor: isDragging ? '#EFF6FF' : '#F8FAFC',
                padding: '18px 14px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '12px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#1E56F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto'
              }}>
                {isUploadingImage ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <UploadCloud size={18} strokeWidth={2.2} />
                )}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E56F0' }}>
                {isUploadingImage ? 'Processing images...' : 'Drag & drop images here '}
                {!isUploadingImage && <span style={{ color: '#64748B', fontWeight: 500 }}>or click to browse</span>}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#94A3B8', marginTop: '2px' }}>
                Supports JPG, PNG, WebP (Select multiple files)
              </div>
            </div>

            {/* Image Preview Thumbnails with live remove */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {imageUrls.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: '56px',
                    height: '44px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <img
                    src={img}
                    alt={`preview-${idx}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    title="Remove image"
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={9} />
                  </div>
                </div>
              ))}

              {/* Add image placeholder button */}
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Add more images"
                style={{
                  width: '56px',
                  height: '44px',
                  borderRadius: '6px',
                  border: '1px dashed #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1E56F0',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
              </div>
            </div>
          </div>

          {/* Amenities Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
              Amenities
            </h3>

            {/* Checkbox 3-column Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px 10px',
              fontSize: '0.74rem',
              color: '#334155'
            }}>
              {Object.keys(amenities).map((name) => (
                <label
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={amenities[name]}
                    onChange={() => toggleAmenity(name)}
                    style={{ cursor: 'pointer', accentColor: '#1E56F0' }}
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>

            {/* Other Amenities Field */}
            <div style={{ marginTop: '12px' }}>
              <input
                type="text"
                placeholder="Other Amenities (e.g. Jacuzzi, Private Chef)"
                value={otherAmenities}
                onChange={(e) => setOtherAmenities(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.74rem',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Column 3: Property Details, Contact Info, and Save/Cancel Actions */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
              Property Details
            </h3>

            {/* Total Rooms */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Total Rooms <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="number"
                placeholder="Enter total rooms"
                value={totalRooms}
                onChange={(e) => setTotalRooms(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.78rem',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            {/* Room Types */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Room Types
              </label>
              <select
                value={roomTypes}
                onChange={(e) => setRoomTypes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.78rem',
                  color: '#0F172A',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              >
                <option>Select room types</option>
                <option>Villa Suite</option>
                <option>Deluxe Suite</option>
                <option>Executive Room</option>
              </select>
            </div>

            {/* Capacity (Adults & Children) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Capacity <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Adults</span>
                  <input
                    type="number"
                    value={adultsCapacity}
                    onChange={(e) => setAdultsCapacity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 8px',
                      borderRadius: '7px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.74rem',
                      color: '#0F172A',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Children</span>
                  <input
                    type="number"
                    value={childrenCapacity}
                    onChange={(e) => setChildrenCapacity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 8px',
                      borderRadius: '7px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.74rem',
                      color: '#0F172A',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
              Contact Information
            </h3>

            {/* Contact Person */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Contact Person <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter contact person name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.78rem',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            {/* Phone Number with +91 prefix */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Phone Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  padding: '8px 10px',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#334155'
                }}>
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.78rem',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.78rem',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Form Bottom Action CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '14px'
          }}>
            <button
              type="button"
              onClick={() => navigate('/admin/properties')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isSubmitting ? '#93C5FD' : '#1E56F0',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 3px 10px rgba(30, 86, 240, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Property' : 'Save Property'}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyPage;
