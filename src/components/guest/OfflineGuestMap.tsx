import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Home, 
  MapPin, 
  Navigation, 
  Compass as CompassIcon, 
  Crosshair, 
  Plus, 
  Minus, 
  Copy, 
  Check, 
  ExternalLink, 
  Coffee, 
  Utensils, 
  Wine, 
  ShoppingBag, 
  Eye, 
  Footprints, 
  X, 
  Wifi, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight,
  Heart
} from 'lucide-react';
import { Property, Recommendation } from '../../types';
import { useApp } from '../../context/AppContext';

interface OfflineGuestMapProps {
  property: Property;
  onClose?: () => void;
  isCompact?: boolean;
}

export const OfflineGuestMap: React.FC<OfflineGuestMapProps> = ({
  property,
  onClose,
  isCompact = false
}) => {
  const { theme, t, showToast, language, isGuestFavorite, toggleGuestFavorite } = useApp();
  const isDark = theme === 'dark';

  // Base coordinates for property (defaults to Old Tbilisi coordinates if not explicitly set)
  const propLat = property.latitude ?? 41.6914;
  const propLng = property.longitude ?? 44.7992;

  // Selected Recommendation
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Map Pan and Zoom State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Enriched Recommendations with deterministic coordinates around property if missing
  const spots = useMemo(() => {
    return property.recommendations.map((rec, index) => {
      // Deterministic spread around property if exact lat/lng is missing
      const angles = [0.8, 2.3, 3.8, 5.1, 1.4, 4.4, 3.1, 0.2];
      const radii = [0.0028, 0.0019, 0.0039, 0.0024, 0.0048, 0.0032, 0.0055, 0.0021];
      
      const angle = angles[index % angles.length];
      const radius = radii[index % radii.length];
      
      const spotLat = rec.latitude ?? (propLat + Math.sin(angle) * radius);
      const spotLng = rec.longitude ?? (propLng + Math.cos(angle) * (radius * 1.3));

      // Calculate approximate distance in meters
      const dLat = (spotLat - propLat) * 111000;
      const dLng = (spotLng - propLng) * 111000 * Math.cos((propLat * Math.PI) / 180);
      const distMeters = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
      const walkMinutes = Math.max(1, Math.round(distMeters / 75)); // ~4.5 km/h walk speed

      return {
        ...rec,
        spotLat,
        spotLng,
        distMeters,
        walkMinutes: rec.walkingTimeMinutes ?? walkMinutes,
        dx: dLng, // relative east/west meters
        dy: -dLat // relative north/south meters (SVG y is down)
      };
    });
  }, [property.recommendations, propLat, propLng]);

  const filteredSpots = useMemo(() => {
    if (activeCategory === 'all') return spots;
    return spots.filter(s => s.category === activeCategory);
  }, [spots, activeCategory]);

  const selectedSpot = useMemo(() => {
    if (!selectedSpotId) return null;
    return spots.find(s => s.id === selectedSpotId) || null;
  }, [spots, selectedSpotId]);

  // Center on property
  const handleCenterProperty = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setSelectedSpotId(null);
  };

  // Select Spot & Pan smoothly toward it
  const handleSelectSpot = (spot: typeof spots[0]) => {
    setSelectedSpotId(spot.id);
    // Pan slightly towards the spot while keeping it in comfortable view
    setPan({
      x: -spot.dx * 0.45 * zoom,
      y: -spot.dy * 0.45 * zoom
    });
  };

  // Copy address handler
  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    showToast(t.guestGuide.map.addressCopied);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Drag pan handlers (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Zoom controls (clamped between 0.7x and 2.2x)
  const handleZoomIn = () => setZoom(z => Math.min(2.2, z + 0.25));
  const handleZoomOut = () => setZoom(z => Math.max(0.7, z - 0.25));

  // Category Icon helper
  const getCategoryIcon = (category: string, className = 'w-3.5 h-3.5') => {
    switch (category) {
      case 'coffee': return <Coffee className={className} />;
      case 'food': return <Utensils className={className} />;
      case 'nightlife': return <Wine className={className} />;
      case 'groceries': return <ShoppingBag className={className} />;
      default: return <Eye className={className} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coffee': return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-400', fill: '#f59e0b' };
      case 'food': return { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-400', fill: '#10b981' };
      case 'nightlife': return { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-400', fill: '#a855f7' };
      case 'groceries': return { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-400', fill: '#3b82f6' };
      default: return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-400', fill: '#f43f5e' };
    }
  };

  // Convert meters to pixel scale on canvas (approx 1 meter = 0.65 pixel at 1x zoom)
  const scale = 0.68 * zoom;
  const cx = 200 + pan.x;
  const cy = 200 + pan.y;

  // Bearing angle to selected spot
  const bearingAngle = useMemo(() => {
    if (!selectedSpot) return 0;
    const rad = Math.atan2(selectedSpot.dx, -selectedSpot.dy);
    return Math.round((rad * 180) / Math.PI);
  }, [selectedSpot]);

  return (
    <div className={`w-full flex flex-col font-sans select-none overflow-hidden ${
      isCompact ? 'rounded-2xl border' : 'h-full flex-1'
    } ${isDark ? 'bg-[#0A0E11] text-stone-100 border-stone-800' : 'bg-stone-50 text-stone-900 border-stone-200'}`}>

      {/* 1. TOP HEADER & FILTER BAR */}
      <div className={`p-3.5 border-b shrink-0 flex flex-col gap-2.5 z-20 backdrop-blur-md ${
        isDark ? 'bg-[#0E1317]/95 border-stone-800/90' : 'bg-white/95 border-stone-200/90'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-sm truncate leading-tight">
                  {t.guestGuide.map.title}
                </h4>
                {/* Offline Ready Badge */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t.guestGuide.map.offlineReady}</span>
                </span>
              </div>
              <p className={`text-[10px] truncate ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {property.title} · {property.address}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full shrink-0 transition-colors ${
                isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              title="Close Map"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: t.guestGuide.map.categories.all, icon: <Sparkles className="w-3 h-3" /> },
            { id: 'coffee', label: t.guestGuide.map.categories.coffee, icon: <Coffee className="w-3 h-3" /> },
            { id: 'food', label: t.guestGuide.map.categories.food, icon: <Utensils className="w-3 h-3" /> },
            { id: 'nightlife', label: t.guestGuide.map.categories.nightlife, icon: <Wine className="w-3 h-3" /> },
            { id: 'groceries', label: t.guestGuide.map.categories.groceries, icon: <ShoppingBag className="w-3 h-3" /> }
          ].map(cat => {
            const count = cat.id === 'all' ? spots.length : spots.filter(s => s.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedSpotId(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 shadow-2xs ${
                  isActive
                    ? isDark 
                      ? 'bg-amber-600 text-white font-black shadow-xs' 
                      : 'bg-stone-950 text-white font-black shadow-xs'
                    : isDark 
                      ? 'bg-stone-900 text-stone-200 border border-stone-700/80 hover:bg-stone-800 hover:text-white' 
                      : 'bg-white text-stone-900 border border-stone-300 hover:bg-stone-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-black/20 text-inherit' : 'bg-black/10 dark:bg-white/10 opacity-90'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. INTERACTIVE MAP VIEWPORT */}
      <div 
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full overflow-hidden flex-1 cursor-grab active:cursor-grabbing touch-none ${
          isCompact ? 'h-[360px]' : 'min-h-[420px] sm:min-h-[480px]'
        } ${isDark ? 'bg-[#090D10]' : 'bg-[#F2F5F3]'}`}
      >
        {/* Offline Map Geometric SVG Canvas */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern for Neighborhood Blocks */}
            <pattern id="offline-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke={isDark ? '#141C22' : '#E2E8E5'} 
                strokeWidth="1" 
              />
            </pattern>
            {/* Subtle Diagonal Blocks Pattern */}
            <pattern id="city-blocks" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="8" y="8" width="64" height="64" rx="8" fill={isDark ? '#0F161C' : '#EBF0ED'} opacity="0.6" />
            </pattern>
            {/* Glowing Beacon Filter */}
            <filter id="beacon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Street Texture Grid */}
          <rect width="100%" height="100%" fill="url(#offline-grid)" />
          <rect width="100%" height="100%" fill="url(#city-blocks)" />

          {/* Natural Landmark Curves (e.g. Mtkvari River in Tbilisi / Black Sea curve) */}
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Stylized River Curve flowing through town */}
            <path
              d="M -600 280 C -250 200, -80 320, 140 240 C 320 180, 520 220, 700 160"
              fill="none"
              stroke={isDark ? '#132838' : '#D0E3F0'}
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* River Label */}
            <text
              x="260"
              y="225"
              fill={isDark ? '#3D617D' : '#88B2D4'}
              fontSize="9"
              fontFamily="monospace"
              letterSpacing="3"
              transform="rotate(-12, 260, 225)"
            >
              MTKVARI RIVER
            </text>

            {/* Distance Radius Radar Rings centered at Property */}
            {[
              { r: 200 * scale, label: t.guestGuide.map.radiusRings.r200 },
              { r: 500 * scale, label: t.guestGuide.map.radiusRings.r500 },
              { r: 1000 * scale, label: t.guestGuide.map.radiusRings.r1k }
            ].map((ring, idx) => (
              <g key={idx}>
                <circle
                  cx="0"
                  cy="0"
                  r={ring.r}
                  fill="none"
                  stroke={isDark ? '#1F2C33' : '#D6DFDB'}
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity={idx === 0 ? '0.9' : idx === 1 ? '0.7' : '0.5'}
                />
                <text
                  x={ring.r - 28}
                  y="-6"
                  fill={isDark ? '#4E616C' : '#93A49E'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {ring.label}
                </text>
              </g>
            ))}

            {/* Walking Path Line to Selected Spot */}
            {selectedSpot && (
              <g>
                {/* Walking route vector from Property (0,0) to Spot (dx * scale, dy * scale) */}
                <line
                  x1="0"
                  y1="0"
                  x2={selectedSpot.dx * scale}
                  y2={selectedSpot.dy * scale}
                  stroke={isDark ? '#F55A51' : '#0C1510'}
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />

                {/* Midpoint Distance Badge */}
                <g transform={`translate(${(selectedSpot.dx * scale) / 2}, ${(selectedSpot.dy * scale) / 2})`}>
                  <rect
                    x="-42"
                    y="-11"
                    width="84"
                    height="22"
                    rx="11"
                    fill={isDark ? '#0C1510' : '#FFFFFF'}
                    stroke={isDark ? '#F55A51' : '#0C1510'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill={isDark ? '#F55A51' : '#0C1510'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {selectedSpot.distMeters}m · {selectedSpot.walkMinutes} min
                  </text>
                </g>
              </g>
            )}

            {/* Pulsing Beacon Radar Ring for Property */}
            <circle
              cx="0"
              cy="0"
              r="22"
              fill={isDark ? '#F55A51' : '#0C1510'}
              opacity="0.15"
              className="animate-ping"
            />
            <circle
              cx="0"
              cy="0"
              r="12"
              fill={isDark ? '#F55A51' : '#0C1510'}
              opacity="0.25"
            />
          </g>
        </svg>

        {/* 3. HTML INTERACTIVE MARKERS LAYER */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translate(${cx}px, ${cy}px)` }}
        >
          {/* PROPERTY MARKER BEACON */}
          <div 
            onClick={handleCenterProperty}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-30"
          >
            <div className="flex flex-col items-center">
              {/* Home Icon Pin */}
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-95 border-2 ${
                isDark 
                  ? 'bg-amber-600 text-white border-white/80 shadow-amber-950/40' 
                  : 'bg-stone-900 text-white border-white shadow-stone-900/30'
              }`}>
                <Home className="w-5 h-5 fill-current" />
              </div>

              {/* Tag Label */}
              <div className={`mt-1 px-2.5 py-0.5 rounded-full shadow-md text-[10px] font-bold font-mono whitespace-nowrap border ${
                isDark 
                  ? 'bg-stone-900/95 text-amber-400 border-stone-700' 
                  : 'bg-white/95 text-stone-900 border-stone-200'
              }`}>
                📍 {t.guestGuide.map.youAreHere}
              </div>
            </div>
          </div>

          {/* POINT OF INTEREST MARKERS */}
          {filteredSpots.map((spot) => {
            const isSelected = spot.id === selectedSpotId;
            const themeCfg = getCategoryColor(spot.category);
            const x = spot.dx * scale;
            const y = spot.dy * scale;

            return (
              <div
                key={spot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectSpot(spot);
                }}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-20 group"
              >
                <div className="flex flex-col items-center">
                  {/* Pin Circle */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white shadow-md transition-all active:scale-90 ${
                    themeCfg.bg
                  } ${
                    isSelected 
                      ? 'ring-4 ring-white dark:ring-stone-900 scale-125 z-40' 
                      : 'hover:scale-110 border border-white/80'
                  }`}>
                    {getCategoryIcon(spot.category, 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-white')}
                  </div>

                  {/* Spot Mini Label */}
                  <div className={`mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold whitespace-nowrap shadow-xs border transition-all max-w-[110px] truncate ${
                    isSelected
                      ? isDark 
                        ? 'bg-amber-600 text-white border-transparent font-extrabold' 
                        : 'bg-stone-900 text-white border-transparent font-extrabold'
                      : isDark
                        ? 'bg-stone-900/90 text-stone-200 border-stone-800'
                        : 'bg-white/90 text-stone-800 border-stone-200'
                  }`}>
                    {spot.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. FLOATING MAP CONTROLS (ZOOM, COMPASS, RECENTER) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20 pointer-events-auto">
          {/* Compass & Bearing Rose */}
          <div 
            className={`w-9 h-9 rounded-2xl border shadow-md flex items-center justify-center transition-transform ${
              isDark ? 'bg-stone-900/95 border-stone-800 text-stone-200' : 'bg-white/95 border-stone-200 text-stone-800'
            }`}
            title={`Compass North · Bearing: ${bearingAngle}°`}
          >
            <CompassIcon 
              className="w-4 h-4 text-rose-500 transition-transform duration-300"
              style={{ transform: `rotate(${-bearingAngle}deg)` }}
            />
          </div>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className={`w-9 h-9 rounded-2xl border shadow-md flex items-center justify-center transition-all active:scale-95 ${
              isDark ? 'bg-stone-900/95 hover:bg-stone-850 border-stone-800 text-stone-200' : 'bg-white/95 hover:bg-stone-50 border-stone-200 text-stone-800'
            }`}
            title={t.guestGuide.map.interactiveMap}
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className={`w-9 h-9 rounded-2xl border shadow-md flex items-center justify-center transition-all active:scale-95 ${
              isDark ? 'bg-stone-900/95 hover:bg-stone-850 border-stone-800 text-stone-200' : 'bg-white/95 hover:bg-stone-50 border-stone-200 text-stone-800'
            }`}
            title="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Re-center on Property */}
          <button
            onClick={handleCenterProperty}
            className={`w-9 h-9 rounded-2xl border shadow-md flex items-center justify-center transition-all active:scale-95 ${
              isDark 
                ? 'bg-stone-900/95 hover:bg-stone-850 border-stone-800 text-amber-400' 
                : 'bg-white/95 hover:bg-stone-50 border-stone-200 text-amber-600'
            }`}
            title={t.guestGuide.map.centerOnProperty}
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* 5. OFFLINE STATUS CHIP IN BOTTOM CORNER */}
        <div className="absolute top-3 left-3 z-20 pointer-events-auto">
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1.5 border shadow-sm backdrop-blur-md ${
            isDark 
              ? 'bg-stone-900/90 border-stone-800 text-stone-300' 
              : 'bg-white/90 border-stone-200 text-stone-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.guestGuide.map.offlineReady}</span>
          </div>
        </div>

      </div>

      {/* 6. SELECTED SPOT BOTTOM DRAWER / FLOATING CARD */}
      {selectedSpot ? (
        <div className={`p-4 border-t shrink-0 z-30 transition-all animate-in slide-in-from-bottom-4 ${
          isDark ? 'bg-[#0E1317] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-xl'
        }`}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                getCategoryColor(selectedSpot.category).bg
              }`}>
                {getCategoryIcon(selectedSpot.category, 'w-4 h-4 text-white')}
              </div>
              <div className="min-w-0">
                <h5 className="font-serif font-bold text-sm sm:text-base truncate leading-tight text-stone-950 dark:text-white">
                  {selectedSpot.name}
                </h5>
                <span className={`text-xs block truncate font-semibold ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>
                  {selectedSpot.address}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  toggleGuestFavorite(selectedSpot.id, selectedSpot.name);
                }}
                className={`p-1.5 rounded-full transition-all active:scale-75 cursor-pointer ${
                  isGuestFavorite(selectedSpot.id)
                    ? 'bg-rose-500 text-white shadow-xs'
                    : isDark
                    ? 'bg-stone-800 text-stone-300 hover:text-white'
                    : 'bg-stone-100 text-stone-700 hover:text-stone-950'
                }`}
                title={isGuestFavorite(selectedSpot.id) ? "Saved to favorites" : "Save to favorites"}
                aria-label="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${isGuestFavorite(selectedSpot.id) ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={() => setSelectedSpotId(null)}
                className={`p-1.5 rounded-full shrink-0 transition-colors cursor-pointer ${
                  isDark ? 'bg-stone-800 text-stone-300 hover:text-white' : 'bg-stone-100 text-stone-700 hover:text-stone-950'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description & Distance Bar */}
          <p className={`text-xs sm:text-sm leading-relaxed mb-2.5 font-medium ${isDark ? 'text-stone-200' : 'text-stone-950'}`}>
            {selectedSpot.description}
          </p>

          {/* Walking Time + Distance Pill */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 mb-2.5 ${
            isDark ? 'bg-[#080B0D] border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-black text-stone-950 dark:text-stone-100">
              <Footprints className="w-4 h-4 text-emerald-500" />
              <span>{selectedSpot.distMeters} m · ~{selectedSpot.walkMinutes} {t.guestGuide.map.walkTime}</span>
            </div>
            <div className={`text-xs font-mono font-bold ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              {bearingAngle > 0 ? `${bearingAngle}° NE` : `${Math.abs(bearingAngle)}° SW`}
            </div>
          </div>

          {/* Host Insider Tip */}
          {selectedSpot.hostTip && (
            <div className={`p-2.5 rounded-xl text-xs mb-3 border font-semibold ${
              isDark ? 'bg-amber-950/35 border-amber-800/60 text-amber-100' : 'bg-amber-50 border-amber-300 text-stone-950'
            }`}>
              <strong className="font-black text-amber-700 dark:text-amber-400">{t.guestGuide.cards.ourTip} </strong>
              <span>{selectedSpot.hostTip}</span>
            </div>
          )}

          {/* Action Buttons: Copy Address & Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => handleCopyAddress(selectedSpot.address)}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                isDark 
                  ? 'bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-200' 
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-900'
              }`}
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddress ? t.common.copied : t.guestGuide.map.copyAddress}</span>
            </button>

            <a
              href={selectedSpot.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(selectedSpot.name + ' ' + selectedSpot.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-stone-800 shadow-sm"
            >
              <span>{t.guestGuide.map.getDirections}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        /* 7. QUICK INLINE HELPER STRIP */
        <div className={`px-4 py-3 border-t text-xs font-semibold flex items-center justify-between ${
          isDark ? 'bg-[#0B0F12] border-stone-800 text-stone-300' : 'bg-stone-100/80 border-stone-200 text-stone-800'
        }`}>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{language === 'ka' ? 'დააწკაპუნეთ მარკერზე მანძილისა და რჩევის სანახავად' : language === 'ru' ? 'Нажмите на точку, чтобы увидеть расстояние и совет' : 'Tap any spot to see walking distance & host advice'}</span>
          </span>
          <span className="font-mono text-xs font-bold opacity-80">{filteredSpots.length} {language === 'ka' ? 'ადგილი' : language === 'ru' ? 'мест' : 'spots'}</span>
        </div>
      )}

    </div>
  );
};
