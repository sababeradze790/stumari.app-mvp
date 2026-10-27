export type PropertyType = 'apartment' | 'guesthouse' | 'hotel' | 'villa' | 'resort';
export type PropertyStatus = 'published' | 'draft';
export type SourcePlatform = 'airbnb' | 'booking' | 'vrbo' | 'direct' | 'other';

export interface Recommendation {
  id: string;
  name: string;
  category: 'coffee' | 'food' | 'groceries' | 'activity' | 'nightlife';
  description: string;
  hostTip?: string;
  address: string;
  distance: string;
  mapsUrl: string;
  latitude?: number;
  longitude?: number;
  walkingTimeMinutes?: number;
  walkingDirections?: string;
}

export interface HowToStep {
  stepNumber: number;
  title: string;
  titleKa?: string;
  titleRu?: string;
  description: string;
  descriptionKa?: string;
  descriptionRu?: string;
  mediaType: 'photo' | 'video';
  mediaUrl?: string;
  posterUrl?: string;
}

export interface PropertyPhotoAsset {
  id: string;
  url: string;
  caption?: string;
  roomCategory: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'entrance' | 'balcony' | 'amenity' | 'other';
  isCover?: boolean;
  order: number;
}

export interface ApplianceGuide {
  id: string;
  title: string;
  name?: string;
  icon: 'Thermometer' | 'Coffee' | 'Shirt' | 'Tv' | 'Flame' | 'Sparkles' | 'Utensils' | 'Zap' | 'KeyRound';
  instructions: string;
  troubleshooting?: string;
  troubleshootingTip?: string;
  category?: 'climate' | 'kitchen' | 'laundry' | 'entertainment' | 'access' | 'other';
  mediaType?: 'video' | 'photo';
  mediaUrl?: string;
  videoUrl?: string;
  mediaPoster?: string;
  videoDurationSeconds?: number;
  steps?: HowToStep[];
  stepsText?: string[];
  isLibraryPreset?: boolean;
}

export interface PropertyTemplate {
  id: string;
  name: string;
  description: string;
  propertyType: PropertyType;
  checkInTime: string;
  checkOutTime: string;
  quietHours: string;
  trashSchedule: string;
  houseRules: string[];
  appliances: ApplianceGuide[];
  departureChecklist?: string[];
  createdAt: string;
  updatedAt?: string;
}

// ==========================================
// 2. STUMARI GEMS & EXPERIENCES
// ==========================================
export type GemExperience = 
  | 'eat'        // Best khinkali, Best khachapuri, Cheap local, Family, Late-night, Georgian breakfast, Bakeries, Vegetarian, Modern Georgian, Wine bars
  | 'drink'      // Best coffee, Wine, Cocktails, Georgian wine, Quiet places, Rooftops
  | 'explore'    // Famous places, Hidden courtyards, Old Tbilisi, Markets, Museums, Architecture, Photography spots
  | 'escape'     // Parks, Views, Nature, Quiet places, Sunset spots
  | 'experience' // Sulfur baths, Cooking, Wine tasting, Markets, Art, Local workshops, Nightlife
  | 'local_life';// Markets, Georgian products, Souvenirs, Vintage, Handmade

export type GemMood = 
  | 'hungry'     // 🍽 I'm hungry
  | 'coffee'     // ☕ I want coffee
  | 'explore'    // 🗺 I want to explore
  | 'romantic'   // ❤️ I want something romantic
  | 'cheap'      // 💰 I want something cheap
  | 'authentic'  // 🇬🇪 I want something authentic
  | 'nightlife'  // 🌙 I want nightlife
  | 'quiet'      // 🌿 I want somewhere quiet
  | 'quick'      // ⏱ I have 2 hours
  | 'nearby';    // 📍 I want something nearby

export interface StumariGem {
  id: string;
  ownerId?: string;
  title: string;
  subtitle: string;
  type: 'host' | 'stumari'; // 🏠 Host Gem vs ✨ Stumari Gem
  experience: GemExperience;
  subCategory?: string; // e.g. "Best Khinkali", "Hidden Courtyards", "Wine Bars"
  moods: GemMood[];
  distance: string; // e.g. "12 min walk"
  priceLevel: '$' | '$$' | '$$$' | 'Free';
  timeNeeded: string; // e.g. "30–45 min", "1–2 hours"
  bestTime: string; // e.g. "Best after 19:00", "Morning or late afternoon"
  whyWeRecommend: string; // "A neighborhood-style place where you can experience Georgian food..."
  whatToTry: string[]; // ["🥟 Khinkali", "🧀 Khachapuri", "🥗 Badrijani", "🍷 Local wine"]
  localTip: string; // "Don't order everything at once. Start with khinkali and add dishes after."
  address: string;
  mapsUrl: string;
  image: string;
  rating?: number; // e.g. 5
  hostQuote?: string; // "Saba's favorite khinkali in Old Tbilisi"
  isHostFavorite?: boolean;
}

// ==========================================
// 3. STAY FEEDBACK & REVIEW ENGINE
// ==========================================
export type GuestSentiment = 'amazing' | 'good' | 'could_be_better' | 'problem';

export type StayFeedbackCategory = 
  | 'cleanliness'
  | 'check_in'
  | 'wifi'
  | 'noise'
  | 'temperature'
  | 'location'
  | 'communication'
  | 'equipment'
  | 'other';

export interface StayFeedback {
  id: string;
  propertyId: string;
  hostId?: string;
  propertyName?: string;
  createdAt: string;
  guestName?: string;
  sentiment: GuestSentiment;
  categories?: StayFeedbackCategory[];
  comment?: string;
  publicReviewPlatformChosen?: 'airbnb' | 'google' | 'booking' | 'none';
  status: 'new' | 'reviewed' | 'resolved';
}

// ==========================================
// 3.5. GUEST REQUESTS & ARRIVALS (STAGE 1 OPERATIONAL)
// ==========================================
export type RequestCategory = 'wifi' | 'climate' | 'water' | 'electricity' | 'access' | 'cleaning' | 'room' | 'other';
export type RequestStatus = 'new' | 'in_progress' | 'resolved';

export interface GuestRequest {
  id: string;
  propertyId: string;
  hostId?: string;
  propertyName: string;
  guestName: string;
  category: RequestCategory;
  title: string;
  description?: string;
  createdAt: string;
  status: RequestStatus;
  urgency: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface ArrivalScheduleItem {
  id: string;
  time: string;
  checkInTime?: string;
  guestCount?: number;
  guestName: string;
  guestAvatar?: string;
  propertyId: string;
  propertyName: string;
  status: 'confirmed' | 'checked_in' | 'pending';
  doorKeypadCode: string;
  wifiNetwork: string;
  guideOpened: boolean;
  phone?: string;
}

// ==========================================
// 4. STAY JOURNEY MOMENTS
// ==========================================
export type StayMoment = 
  | 'before_arrival'  // Welcome, check-in instructions, address, parking, Wi-Fi prep
  | 'first_10_min'    // Wi-Fi, apartment appliances, "What should I do first?"
  | 'first_evening'   // "Where should I eat tonight?" (best local dinner)
  | 'next_morning'    // "Where should I have breakfast & coffee?"
  | 'during_stay'     // Gems, moods, explore, transport, questions
  | 'before_checkout' // Check-out instructions, luggage, airport transfer
  | 'after_checkout'; // How was your stay? Review engine

export interface PropertyPrivateAccess {
  wifiNetwork: string;
  wifiPassword: string;
  doorKeypadCode: string;
  lockboxCode: string;
  arrivalDirections: string;
  parkingInstructions: string;
  address?: string;
  hostPhone?: string;
  hostWhatsApp?: string;
  emergencyContact?: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  type: PropertyType;
  status: PropertyStatus;
  createdAt: string;
  updatedAt?: string;
  viewsCount: number;

  // Ownership and Demo metadata
  ownerId?: string;
  isDemo?: boolean;
  /**
   * High-entropy capability token (48 hex chars) held only in memory for the owning host
   * or authorized guest session. Never written to the public /properties/{propertyId} document.
   */
  accessToken?: string;
  /**
   * Indicates whether the property has private check-in/Wi-Fi credentials configured
   * in its protected subcollection.
   */
  hasPrivateCredentials?: boolean;

  // Source import placeholders (for Airbnb/Booking without breaking V1)
  sourcePlatform?: SourcePlatform;
  sourceUrl?: string;

  // Location & Imagery
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  coverImage: string;
  photos?: PropertyPhotoAsset[];
  templateId?: string;
  languages: string[]; // e.g. ['en', 'ka']

  // Host Details
  hostName: string;
  hostAvatar: string;
  hostRole: string;
  hostPhone: string;
  hostWhatsApp: string;
  emergencyContact: string;

  // 1. Welcome
  welcomeTitle?: string;
  welcomeGreeting?: string;

  // 2. Check-in
  checkInTime: string;
  checkInMethod: 'lockbox' | 'keypad' | 'in-person' | 'concierge';
  doorKeypadCode: string;
  lockboxCode: string;
  parkingInstructions: string;
  arrivalDirections: string;

  // 3. Wi-Fi
  wifiNetwork: string;
  wifiPassword: string;

  // 4. How Things Work
  appliances: ApplianceGuide[];

  // 5. House Rules
  houseRules: string[];
  quietHours: string;
  trashSchedule: string;

  // 6. Explore / Recommendations & Stumari Gems
  recommendations: Recommendation[];
  gemIds?: string[];
  customGems?: StumariGem[];
  publicReviewLinks?: {
    airbnb?: string;
    google?: string;
    booking?: string;
  };

  // 7. Transport
  taxiInfo: string;
  transitInfo: string;
  airportTransit: string;

  // 8. Check-out
  checkOutTime: string;
  departureChecklist: string[];

  // 9. Contact / Emergency
  emergencyServicesNumber: string; // e.g. "112"
}

export interface HostUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  stripeCustomerId?: string;
  joinedDate: string;
  propertyCount: number;
  status?: 'active' | 'suspended';
}

export interface PlatformMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'neutral' | 'down';
}

export type AppRoute =
  // 1. Marketing
  | '/'
  | '/features'
  | '/for-properties'
  | '/pricing'
  | '/demo'
  // 2. Host SaaS
  | '/app'
  | '/app/analytics'
  | '/app/properties'
  | '/app/templates'
  | '/app/reviews'
  | '/app/requests'
  | '/app/properties/:id'
  // 3. Onboarding
  | '/onboarding'
  // 4. Guest Experience
  | '/g/:propertySlug'
  // 5. Admin
  | '/admin'
  | '/admin/hosts'
  | '/admin/properties'
  | '/admin/settings';
