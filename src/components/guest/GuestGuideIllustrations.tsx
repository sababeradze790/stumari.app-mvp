import React from 'react';

interface SvgProps {
  className?: string;
  isDark?: boolean;
}

// 1. Georgian Traditional Carved Wooden Balcony (Watermark for Door Code)
export const TbilisiBalconySketch: React.FC<SvgProps> = ({ className = "w-28 h-28", isDark = false }) => {
  const strokeColor = isDark ? '#D97706' : '#C27838';
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ opacity: isDark ? 0.28 : 0.35 }}>
      {/* Balcony Railing & Geometric Wood Carving */}
      <rect x="20" y="85" width="120" height="55" rx="3" stroke={strokeColor} strokeWidth="1.75" />
      <line x1="20" y1="95" x2="140" y2="95" stroke={strokeColor} strokeWidth="1.5" />
      <line x1="20" y1="130" x2="140" y2="130" stroke={strokeColor} strokeWidth="1.5" />
      {/* Decorative vertical balusters with Georgian diamond pattern */}
      {[32, 48, 64, 80, 96, 112, 128].map((x) => (
        <g key={x}>
          <line x1={x} y1="95" x2={x} y2="130" stroke={strokeColor} strokeWidth="1.5" />
          <polygon points={`${x},107 ${x+4},112.5 ${x},118 ${x-4},112.5`} stroke={strokeColor} strokeWidth="1" fill="none" />
        </g>
      ))}
      {/* Upper carved arch & eave */}
      <path d="M15 45 C45 30 115 30 145 45" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      <path d="M20 50 C40 38 120 38 140 50" stroke={strokeColor} strokeWidth="1.2" />
      {/* Decorative lace brackets */}
      <path d="M25 50 Q45 55 45 85" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      <path d="M135 50 Q115 55 115 85" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      <circle cx="35" cy="65" r="4" stroke={strokeColor} strokeWidth="1" />
      <circle cx="125" cy="65" r="4" stroke={strokeColor} strokeWidth="1" />
      {/* Wooden support corbels */}
      <polygon points="30,140 38,140 30,155" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      <polygon points="130,140 122,140 130,155" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      {/* Balcony arched door frame */}
      <path d="M60 85 V52 C60 42 100 42 100 52 V85" stroke={strokeColor} strokeWidth="1.5" />
      <line x1="80" y1="46" x2="80" y2="85" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
};

// 2. Georgian Church Dome / Bell Tower (Watermark for Wi-Fi Network)
export const TbilisiTowerSketch: React.FC<SvgProps> = ({ className = "w-28 h-28", isDark = false }) => {
  const strokeColor = isDark ? '#38BDF8' : '#2563EB';
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ opacity: isDark ? 0.28 : 0.32 }}>
      {/* Cross on spire */}
      <line x1="80" y1="12" x2="80" y2="28" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="74" y1="18" x2="86" y2="18" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      {/* Conical Georgian dome roof */}
      <polygon points="80,26 50,75 110,75" stroke={strokeColor} strokeWidth="1.75" fill="none" />
      <path d="M50 75 Q80 78 110 75" stroke={strokeColor} strokeWidth="1.5" />
      {/* Drum / Cylindrical base with tall arched windows */}
      <rect x="52" y="75" width="56" height="45" stroke={strokeColor} strokeWidth="1.5" />
      {/* Arched windows */}
      {[62, 80, 98].map((x) => (
        <path key={x} d={`M${x-4} 105 V88 C${x-4} 83 ${x+4} 83 ${x+4} 88 V105 Z`} stroke={strokeColor} strokeWidth="1.25" fill="none" />
      ))}
      {/* Base masonry & frieze */}
      <line x1="45" y1="120" x2="115" y2="120" stroke={strokeColor} strokeWidth="2" />
      <rect x="42" y="120" width="76" height="30" stroke={strokeColor} strokeWidth="1.5" />
      {/* Stone masonry hatchings */}
      <line x1="42" y1="135" x2="118" y2="135" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" />
      <line x1="70" y1="120" x2="70" y2="135" stroke={strokeColor} strokeWidth="1" />
      <line x1="90" y1="135" x2="90" y2="150" stroke={strokeColor} strokeWidth="1" />
    </svg>
  );
};

// 3. Georgian Khinkali Sketch (For Best Khinkali Mood)
export const KhinkaliSketch: React.FC<SvgProps> = ({ className = "w-10 h-10", isDark = false }) => {
  const strokeColor = isDark ? '#F55A51' : '#78350F';
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Knob (Kudi) */}
      <path d="M37 20 C37 15 43 15 43 20 C43 24 41 27 40 29 C39 27 37 24 37 20 Z" stroke={strokeColor} strokeWidth="2" fill={isDark ? '#292524' : '#FFFBEB'} />
      {/* Khinkali Pouch with Accordion Pleats */}
      <path d="M40 29 C24 34 16 48 18 60 C19 65 30 68 40 68 C50 68 61 65 62 60 C64 48 56 34 40 29 Z" stroke={strokeColor} strokeWidth="2" fill={isDark ? '#1C1917' : '#FEF3C7'} />
      {/* Pleat Creases radiating down from the knob */}
      <path d="M40 29 Q34 45 30 65" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M40 29 Q40 46 40 67" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M40 29 Q46 45 50 65" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M39 31 Q26 44 22 56" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M41 31 Q54 44 58 56" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" />
      {/* Cracked black pepper specks */}
      <circle cx="36" cy="52" r="1" fill={strokeColor} />
      <circle cx="45" cy="57" r="1.2" fill={strokeColor} />
      <circle cx="32" cy="58" r="0.9" fill={strokeColor} />
      <circle cx="48" cy="48" r="1" fill={strokeColor} />
      {/* Steam Wisps */}
      <path d="M34 13 Q31 9 34 5" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1 2" />
      <path d="M42 12 Q45 8 42 4" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1 2" />
    </svg>
  );
};

// 4. Wine Glass Sketch (For Wine & Bars Mood)
export const WineGlassSketch: React.FC<SvgProps> = ({ className = "w-10 h-10", isDark = false }) => {
  const strokeColor = isDark ? '#FB7185' : '#9F1239';
  const wineFill = isDark ? '#881337' : '#E11D48';
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Wine Bowl */}
      <path d="M26 18 C26 38 36 48 40 48 C44 48 54 38 54 18 Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      {/* Red Saperavi Wine liquid */}
      <path d="M28 28 C32 29 48 27 52 28 C52 36 44 44 40 44 C36 44 28 36 28 28 Z" fill={wineFill} opacity="0.8" />
      {/* Stem */}
      <line x1="40" y1="48" x2="40" y2="68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Base Foot */}
      <ellipse cx="40" cy="68" rx="14" ry="2.5" stroke={strokeColor} strokeWidth="2" fill="none" />
      {/* Glass reflections */}
      <path d="M31 23 Q30 35 34 40" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};

// 5. Vintage Binoculars Sketch (For Hidden Gems Mood)
export const BinocularsSketch: React.FC<SvgProps> = ({ className = "w-10 h-10", isDark = false }) => {
  const strokeColor = isDark ? '#38BDF8' : '#0369A1';
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left Eyepiece */}
      <rect x="23" y="18" width="10" height="7" rx="1.5" stroke={strokeColor} strokeWidth="1.5" />
      <path d="M24 25 L20 48 L36 48 L32 25 Z" stroke={strokeColor} strokeWidth="1.8" fill={isDark ? '#0C2030' : '#E0F2FE'} />
      <ellipse cx="28" cy="48" rx="8" ry="4" stroke={strokeColor} strokeWidth="2" fill={strokeColor} opacity="0.3" />
      
      {/* Right Eyepiece */}
      <rect x="47" y="18" width="10" height="7" rx="1.5" stroke={strokeColor} strokeWidth="1.5" />
      <path d="M48 25 L44 48 L60 48 L56 25 Z" stroke={strokeColor} strokeWidth="1.8" fill={isDark ? '#0C2030' : '#E0F2FE'} />
      <ellipse cx="52" cy="48" rx="8" ry="4" stroke={strokeColor} strokeWidth="2" fill={strokeColor} opacity="0.3" />

      {/* Central Focus Wheel & Bridge */}
      <rect x="36" y="27" width="8" height="12" rx="1" stroke={strokeColor} strokeWidth="1.5" fill={isDark ? '#0369A1' : '#BAE6FD'} />
      <line x1="36" y1="31" x2="44" y2="31" stroke={strokeColor} strokeWidth="1" />
      <line x1="36" y1="35" x2="44" y2="35" stroke={strokeColor} strokeWidth="1" />
    </svg>
  );
};

// 6. Check-in Instructions Art: Door Handle, Key & Plant
export const CheckinArtSketch: React.FC<SvgProps> = ({ className = "w-24 h-24", isDark = false }) => {
  const stroke = isDark ? '#34D399' : '#059669';
  const leafColor = isDark ? '#065F46' : '#A7F3D0';
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Wooden Door Panel Lines */}
      <rect x="35" y="10" width="80" height="105" rx="3" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
      <rect x="45" y="20" width="60" height="85" rx="2" stroke={stroke} strokeWidth="1.2" opacity="0.5" />
      {/* Brass Door Escutcheon Backplate */}
      <rect x="58" y="42" width="16" height="42" rx="4" stroke={stroke} strokeWidth="2" fill={isDark ? '#064E3B' : '#ECFDF5'} />
      {/* Keyhole */}
      <circle cx="66" cy="70" r="2.5" stroke={stroke} strokeWidth="1.5" fill={stroke} />
      <polygon points="64.5,71 67.5,71 68,76 64,76" fill={stroke} />
      {/* Door Handle Lever */}
      <circle cx="66" cy="52" r="3.5" stroke={stroke} strokeWidth="1.75" />
      <path d="M66 52 H32 C29 52 27 54 27 57 C27 60 29 62 32 62 H38" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Hanging Brass Key with Keychain */}
      <path d="M72 74 Q76 80 82 86" stroke={stroke} strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="85" cy="89" r="4" stroke={stroke} strokeWidth="1.5" fill="none" />
      <path d="M88 92 L96 100 L98 98 L94 94 L97 91" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      {/* Botanical Monstera / Ivy Leaves */}
      <path d="M15 110 Q22 85 45 78 Q36 98 15 110 Z" fill={leafColor} stroke={stroke} strokeWidth="1.5" />
      <path d="M8 88 Q18 70 38 68 Q28 84 8 88 Z" fill={leafColor} stroke={stroke} strokeWidth="1.3" opacity="0.8" />
    </svg>
  );
};

// 7. Appliances & Instructions Art: Refrigerator, Coffee Maker & Washer
export const AppliancesArtSketch: React.FC<SvgProps> = ({ className = "w-24 h-24", isDark = false }) => {
  const stroke = isDark ? '#60A5FA' : '#2563EB';
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Refrigerator */}
      <rect x="15" y="25" width="34" height="85" rx="3" stroke={stroke} strokeWidth="1.8" fill={isDark ? '#1E293B' : '#EFF6FF'} />
      <line x1="15" y1="52" x2="49" y2="52" stroke={stroke} strokeWidth="1.5" />
      <line x1="20" y1="40" x2="20" y2="48" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="58" x2="20" y2="72" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      
      {/* Espresso Coffee Machine */}
      <rect x="56" y="48" width="30" height="36" rx="2" stroke={stroke} strokeWidth="1.6" fill={isDark ? '#172554' : '#DBEAFE'} />
      <line x1="56" y1="58" x2="86" y2="58" stroke={stroke} strokeWidth="1.2" />
      <circle cx="63" cy="53" r="1.5" fill={stroke} />
      <circle cx="69" cy="53" r="1.5" fill={stroke} />
      {/* Portafilter Handle */}
      <path d="M71 62 H88" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      {/* Small Coffee Cup */}
      <rect x="66" y="72" width="10" height="8" rx="1" stroke={stroke} strokeWidth="1.2" fill={isDark ? '#93C5FD' : '#BFDBFE'} />
      <path d="M76 74 C78 74 78 77 76 77" stroke={stroke} strokeWidth="1" />

      {/* Washing Machine Drum (Right side) */}
      <rect x="74" y="65" width="40" height="45" rx="3" stroke={stroke} strokeWidth="1.8" fill={isDark ? '#0F172A' : '#EFF6FF'} />
      <circle cx="94" cy="90" r="13" stroke={stroke} strokeWidth="1.8" />
      <circle cx="94" cy="90" r="9" stroke={stroke} strokeWidth="1.2" strokeDasharray="3 2" />
      <circle cx="82" cy="72" r="2.5" stroke={stroke} strokeWidth="1" />
      <line x1="90" y1="72" x2="108" y2="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
};

// 8. House Rules & Quiet Hours Art: Cozy Armchair, Lamp & Ficus
export const HouseRulesArtSketch: React.FC<SvgProps> = ({ className = "w-24 h-24", isDark = false }) => {
  const stroke = isDark ? '#FBBF24' : '#D97706';
  const seatFill = isDark ? '#451A03' : '#FEF3C7';
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Floor Lamp (Behind Armchair) */}
      <line x1="28" y1="20" x2="28" y2="105" stroke={stroke} strokeWidth="1.75" />
      <polygon points="18,36 38,36 34,20 22,20" stroke={stroke} strokeWidth="1.5" fill={isDark ? '#78350F' : '#FDE68A'} />
      <line x1="20" y1="105" x2="36" y2="105" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      {/* Warm Light Rays */}
      <line x1="16" y1="42" x2="10" y2="48" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      <line x1="40" y1="42" x2="46" y2="48" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

      {/* Mid-Century Cozy Armchair */}
      {/* Backrest with Button Tufting */}
      <rect x="44" y="44" width="46" height="38" rx="8" stroke={stroke} strokeWidth="2" fill={seatFill} />
      <circle cx="56" cy="56" r="1.5" fill={stroke} />
      <circle cx="67" cy="56" r="1.5" fill={stroke} />
      <circle cx="78" cy="56" r="1.5" fill={stroke} />
      {/* Seat Cushion */}
      <rect x="40" y="74" width="54" height="15" rx="5" stroke={stroke} strokeWidth="2" fill={seatFill} />
      {/* Armrests */}
      <rect x="36" y="60" width="10" height="24" rx="4" stroke={stroke} strokeWidth="1.8" fill={seatFill} />
      <rect x="88" y="60" width="10" height="24" rx="4" stroke={stroke} strokeWidth="1.8" fill={seatFill} />
      {/* Tapered Wooden Legs */}
      <line x1="44" y1="89" x2="38" y2="108" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="90" y1="89" x2="96" y2="108" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="52" y1="89" x2="50" y2="104" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="82" y1="89" x2="84" y2="104" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />

      {/* Cozy Potted Plant (Right Side) */}
      <path d="M102 92 L105 106 H115 L118 92 Z" stroke={stroke} strokeWidth="1.5" fill={isDark ? '#292524' : '#FDE68A'} />
      <path d="M110 92 Q110 75 118 70 Q112 85 110 92 Z" stroke={stroke} strokeWidth="1.3" fill={isDark ? '#065F46' : '#BBF7D0'} />
      <path d="M110 92 Q105 78 98 75 Q104 87 110 92 Z" stroke={stroke} strokeWidth="1.3" fill={isDark ? '#065F46' : '#BBF7D0'} />
    </svg>
  );
};

// 9. Departure Checklist Art: Vintage Luggage & Passport Tag
export const DepartureArtSketch: React.FC<SvgProps> = ({ className = "w-24 h-24", isDark = false }) => {
  const stroke = isDark ? '#C084FC' : '#9333EA';
  const suitFill = isDark ? '#3B0764' : '#FAF5FF';
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Main Suitcase Body */}
      <rect x="42" y="38" width="56" height="68" rx="7" stroke={stroke} strokeWidth="2" fill={suitFill} />
      {/* Grooves / Ridges on suitcase body */}
      {[54, 62, 70, 78, 86].map((x) => (
        <line key={x} x1={x} y1="46" x2={x} y2="98" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      ))}
      {/* Telescopic Pull Handle */}
      <rect x="62" y="16" width="16" height="22" rx="2" stroke={stroke} strokeWidth="1.8" />
      <line x1="65" y1="23" x2="75" y2="23" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Corner Protectors */}
      <path d="M42 48 C42 42 48 42 48 42" stroke={stroke} strokeWidth="2" />
      <path d="M98 48 C98 42 92 42 92 42" stroke={stroke} strokeWidth="2" />
      {/* Wheels */}
      <ellipse cx="50" cy="108" rx="3.5" ry="3.5" stroke={stroke} strokeWidth="1.8" fill={stroke} />
      <ellipse cx="90" cy="108" rx="3.5" ry="3.5" stroke={stroke} strokeWidth="1.8" fill={stroke} />
      
      {/* Luggage Tag with Ribbon */}
      <path d="M42 58 Q32 64 26 72" stroke={stroke} strokeWidth="1.3" />
      <polygon points="18,72 28,68 38,82 28,86" stroke={stroke} strokeWidth="1.5" fill={isDark ? '#581C87' : '#F3E8FF'} />
      <circle cx="24" cy="73" r="1.5" fill={stroke} />
      <line x1="28" y1="75" x2="34" y2="82" stroke={stroke} strokeWidth="1" strokeDasharray="2 1" />

      {/* Passport / Flight Ticket Sticking Out */}
      <rect x="25" y="44" width="18" height="24" rx="2" transform="rotate(-15 25 44)" stroke={stroke} strokeWidth="1.5" fill={isDark ? '#6B21A8' : '#EDE9FE'} />
      <circle cx="31" cy="54" r="3" stroke={stroke} strokeWidth="1" />
    </svg>
  );
};

// 10. 24/7 Groceries & Local Market Sticker Art: Paper Grocery Bag with Baguette & Wine
export const GroceryMarketSketch: React.FC<SvgProps> = ({ className = "w-16 h-12", isDark = false }) => {
  const stroke = isDark ? '#FBBF24' : '#D97706';
  const bagFill = isDark ? '#451A03' : '#FEF3C7';
  const itemFill = isDark ? '#78350F' : '#FDE68A';
  return (
    <svg viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Wine Bottle sticking out */}
      <rect x="28" y="10" width="10" height="24" rx="2" stroke={stroke} strokeWidth="1.5" fill={isDark ? '#14532D' : '#DCFCE7'} />
      <rect x="31" y="4" width="4" height="6" rx="0.5" stroke={stroke} strokeWidth="1.2" fill={stroke} />
      {/* Baguette sticking out */}
      <path d="M50 8 C53 6 58 10 55 24 L52 26 C49 20 47 10 50 8 Z" stroke={stroke} strokeWidth="1.5" fill={itemFill} />
      <line x1="51" y1="12" x2="54" y2="15" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
      <line x1="50" y1="18" x2="53" y2="21" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
      {/* Paper Grocery Bag Body */}
      <path d="M20 25 L24 64 H76 L80 25 Z" stroke={stroke} strokeWidth="2" fill={bagFill} strokeLinejoin="round" />
      {/* Serrated bag top edge */}
      <path d="M20 25 L26 27 L32 25 L38 27 L44 25 L50 27 L56 25 L62 27 L68 25 L74 27 L80 25" stroke={stroke} strokeWidth="1.5" />
      {/* Apple / Orange in front */}
      <circle cx="62" cy="30" r="7" stroke={stroke} strokeWidth="1.5" fill={isDark ? '#9A3412' : '#FFEDD5'} />
      <path d="M62 23 Q64 19 68 20" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      {/* Fold Crease on paper bag */}
      <line x1="28" y1="36" x2="72" y2="36" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
};

// 10b. Emergency Contacts Sticker Art: Retro Rotary Telephone Handset
export const PhoneReceiverSketch: React.FC<SvgProps> = ({ className = "w-16 h-12", isDark = false }) => {
  const stroke = isDark ? '#F87171' : '#DC2626';
  const fill = isDark ? '#450A0A' : '#FEE2E2';
  return (
    <svg viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Receiver Bar & Earpieces */}
      <path d="M15 45 C15 32 30 20 50 20 C70 20 85 32 85 45 C85 52 78 54 72 48 L65 40 C62 37 60 38 56 42 C53 45 47 45 44 42 C40 38 38 37 35 40 L28 48 C22 54 15 52 15 45 Z" stroke={stroke} strokeWidth="2.2" fill={fill} strokeLinejoin="round" />
      <circle cx="23" cy="46" r="6" stroke={stroke} strokeWidth="1.5" />
      <circle cx="77" cy="46" r="6" stroke={stroke} strokeWidth="1.5" />
      {/* Curly Cord */}
      <path d="M50 30 Q53 42 47 46 Q42 50 49 55 Q56 60 48 64 Q42 67 46 70" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
};

// 11. Taxi & Transfers Sticker Art: Vintage Sedan Taxi
export const TaxiSedanSketch: React.FC<SvgProps> = ({ className = "w-20 h-14", isDark = false }) => {
  const stroke = isDark ? '#34D399' : '#059669';
  const fill = isDark ? '#064E3B' : '#ECFDF5';
  return (
    <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Car Roof & Greenhouse */}
      <path d="M30 34 L42 16 H78 L92 34 Z" stroke={stroke} strokeWidth="2" fill={fill} strokeLinejoin="round" />
      {/* Windshield & Windows */}
      <polygon points="44,19 34,34 56,34 56,19" stroke={stroke} strokeWidth="1.3" fill="none" />
      <polygon points="60,19 60,34 88,34 76,19" stroke={stroke} strokeWidth="1.3" fill="none" />
      {/* Taxi Roof Sign */}
      <rect x="52" y="10" width="16" height="6" rx="1.5" stroke={stroke} strokeWidth="1.5" fill={isDark ? '#F59E0B' : '#FDE68A'} />
      {/* Car Body */}
      <path d="M12 34 C12 34 8 36 8 40 L8 50 C8 52 10 54 14 54 H22 C22 47 28 42 35 42 C42 42 48 47 48 54 H72 C72 47 78 42 85 42 C92 42 98 47 98 54 H108 C112 54 114 51 114 47 L112 38 C112 35 106 34 100 34 Z" stroke={stroke} strokeWidth="2" fill={fill} />
      {/* Headlights */}
      <ellipse cx="111" cy="41" rx="2" ry="3" stroke={stroke} strokeWidth="1.2" fill={isDark ? '#FEF08A' : '#FEF08A'} />
      <ellipse cx="9" cy="42" rx="1.5" ry="2.5" stroke={stroke} strokeWidth="1.2" fill={isDark ? '#F87171' : '#F87171'} />
      {/* Wheels */}
      <circle cx="35" cy="54" r="9" stroke={stroke} strokeWidth="2.2" fill={isDark ? '#1F2937' : '#374151'} />
      <circle cx="35" cy="54" r="4.5" stroke={stroke} strokeWidth="1.2" fill="white" />
      <circle cx="85" cy="54" r="9" stroke={stroke} strokeWidth="2.2" fill={isDark ? '#1F2937' : '#374151'} />
      <circle cx="85" cy="54" r="4.5" stroke={stroke} strokeWidth="1.2" fill="white" />
    </svg>
  );
};

// 12. Trash & Recycling Sticker Art: Trio of Recycling Bins
export const RecyclingBinsSketch: React.FC<SvgProps> = ({ className = "w-20 h-14", isDark = false }) => {
  const stroke = isDark ? '#A78BFA' : '#7C3AED';
  const fill = isDark ? '#2E1065' : '#F5F3FF';
  return (
    <svg viewBox="0 0 110 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left Bin */}
      <polygon points="12,24 16,62 38,62 42,24" stroke={stroke} strokeWidth="1.6" fill={fill} />
      <rect x="9" y="19" width="36" height="5" rx="2" stroke={stroke} strokeWidth="1.5" fill={fill} />
      <line x1="22" y1="30" x2="24" y2="54" stroke={stroke} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="32" y1="30" x2="30" y2="54" stroke={stroke} strokeWidth="1" strokeDasharray="3 2" />
      
      {/* Center Bin (Main) */}
      <polygon points="36,18 41,64 69,64 74,18" stroke={stroke} strokeWidth="2" fill={fill} />
      <rect x="33" y="12" width="44" height="6" rx="2.5" stroke={stroke} strokeWidth="1.8" fill={isDark ? '#4C1D95' : '#DDD6FE'} />
      {/* Handle */}
      <path d="M50 12 V8 H60 V12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      {/* Recycling Mobius Loop Symbol */}
      <circle cx="55" cy="38" r="7" stroke={stroke} strokeWidth="1.4" strokeDasharray="3 2" />

      {/* Right Bin */}
      <polygon points="68,24 72,62 94,62 98,24" stroke={stroke} strokeWidth="1.6" fill={fill} />
      <rect x="65" y="19" width="36" height="5" rx="2" stroke={stroke} strokeWidth="1.5" fill={fill} />
      <line x1="78" y1="30" x2="80" y2="54" stroke={stroke} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="88" y1="30" x2="86" y2="54" stroke={stroke} strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
};

// 13. Panoramic Old Tbilisi Engraving (For "Explore Tbilisi Like a Local" Banner)
export const TbilisiPanoramaSketch: React.FC<SvgProps> = ({ className = "w-full h-full", isDark = false }) => {
  const stroke = isDark ? '#D97706' : '#92400E';
  return (
    <svg viewBox="0 0 400 140" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className={className} style={{ opacity: isDark ? 0.35 : 0.45 }}>
      {/* Mountain Ridge & Sky */}
      <path d="M0 65 Q90 35 180 50 Q270 20 400 45 L400 140 L0 140 Z" fill={isDark ? '#1C1917' : '#FEF3C7'} opacity="0.3" />
      {/* Narikala Fortress Battlements on the Hill */}
      <path d="M20 60 L20 48 H26 V52 H32 V48 H38 V52 H44 V48 H50 V62 L90 58 V45 H96 V50 H102 V45 H108 V58 L140 55" stroke={stroke} strokeWidth="1.5" />
      {/* Metekhi Cliff and Church Tower */}
      <polygon points="260,25 245,55 275,55" stroke={stroke} strokeWidth="1.5" fill="none" />
      <rect x="248" y="55" width="24" height="25" stroke={stroke} strokeWidth="1.5" />
      {/* Overhanging Balconies cascading down the cliff */}
      {[
        { x: 120, y: 70, w: 28, h: 22 },
        { x: 152, y: 75, w: 32, h: 24 },
        { x: 188, y: 68, w: 26, h: 20 },
        { x: 280, y: 70, w: 36, h: 26 },
        { x: 320, y: 64, w: 30, h: 22 },
        { x: 355, y: 72, w: 34, h: 24 }
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} stroke={stroke} strokeWidth="1.2" />
          <line x1={b.x} y1={b.y + b.h - 8} x2={b.x + b.w} y2={b.y + b.h - 8} stroke={stroke} strokeWidth="1" />
          {/* Railing balusters */}
          <line x1={b.x + 6} y1={b.y + b.h - 8} x2={b.x + 6} y2={b.y + b.h} stroke={stroke} strokeWidth="0.8" />
          <line x1={b.x + 14} y1={b.y + b.h - 8} x2={b.x + 14} y2={b.y + b.h} stroke={stroke} strokeWidth="0.8" />
          <line x1={b.x + 22} y1={b.y + b.h - 8} x2={b.x + 22} y2={b.y + b.h} stroke={stroke} strokeWidth="0.8" />
        </g>
      ))}
      {/* Stone Arch Bridge over Mtkvari River */}
      <path d="M40 120 C70 95 130 95 160 120 C190 95 250 95 280 120 C310 95 370 95 400 120" stroke={stroke} strokeWidth="2.5" fill="none" />
      <path d="M0 120 L400 120" stroke={stroke} strokeWidth="2" />
      {/* Water Ripples */}
      <line x1="60" y1="128" x2="100" y2="128" stroke={stroke} strokeWidth="1" strokeDasharray="6 3" />
      <line x1="180" y1="132" x2="230" y2="132" stroke={stroke} strokeWidth="1" strokeDasharray="6 3" />
      <line x1="290" y1="126" x2="340" y2="126" stroke={stroke} strokeWidth="1" strokeDasharray="6 3" />
    </svg>
  );
};
