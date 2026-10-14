import { Property, HostUser, PlatformMetric, StayFeedback, GuestRequest, ArrivalScheduleItem } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    slug: 'old-tbilisi-apartment',
    title: 'Old Tbilisi Apartment',
    subtitle: '19th-Century Heritage Residence with Historic Balcony',
    tagline: 'Gamarjoba! Welcome to your bohemian refuge above the cobbled streets of Old Tbilisi.',
    type: 'apartment',
    status: 'published',
    createdAt: '2026-01-15',
    updatedAt: '2026-03-28',
    viewsCount: 1420,
    sourcePlatform: 'airbnb',
    sourceUrl: 'https://airbnb.com/rooms/12345678',

    address: '14 Lado Asatiani Street, Apt 3',
    city: 'Tbilisi',
    country: 'Georgia',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    languages: ['en', 'ka'],

    hostName: 'Saba Beradze',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    hostRole: 'Host & Superhost',
    hostPhone: '+995 555 123 456',
    hostWhatsApp: '+995555123456',
    emergencyContact: '+995 555 987 654 (Nino / Co-host)',
    emergencyServicesNumber: '112',

    welcomeTitle: 'Welcome to Old Tbilisi!',
    welcomeGreeting: 'Make yourself at home. Everything you need for an unforgettable stay in the historic heart of Sololaki is right here.',

    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    checkInMethod: 'keypad',
    doorKeypadCode: '3829#',
    lockboxCode: '7419',
    parkingInstructions: 'Free street parking is available along Lado Asatiani St. If crowded, there is an open courtyard parking 50 meters up on the right side next to St. George church.',
    arrivalDirections: 'Push the heavy carved wooden front courtyard gate (it is unlocked during daytime). Climb the wrought-iron spiral staircase to the second floor. Apartment 3 is the teal door with the brass knocker. Enter 3829# on the smart lock.',

    wifiNetwork: 'OldTbilisi_5G',
    wifiPassword: 'MadlobaGuest2026!',

    appliances: [
      {
        id: 'app-1',
        title: 'Daikin Dual Inverter AC & Heating',
        icon: 'Thermometer',
        instructions: 'Remote is mounted beside the hallway arch. Press POWER. Mode button switches between Cool (snowflake) and Heat (sun). Optimal temperature is 22°C (72°F).',
        troubleshooting: 'If flashing amber, please ensure balcony French doors are fully clicked shut; unit pauses automatically when doors remain open.'
      },
      {
        id: 'app-2',
        title: 'DeLonghi Espresso Machine',
        icon: 'Coffee',
        instructions: 'Locate local roasted beans in the glass pantry jar. Press top-left power button. Wait 30 seconds for green readiness light. Slide porta-filter firmly and press single/double shot.',
        troubleshooting: 'Red indicator flashes when rear water reservoir is low. Fill with filtered tap water from the Brita pitcher.'
      },
      {
        id: 'app-3',
        title: 'Bosch Washer & Dryer Combo',
        icon: 'Shirt',
        instructions: 'Detergent pods are in the wicker basket under bathroom vanity. Place 1 pod inside drum. Turn dial to "Mix 40°" and press Start. Takes 2h 15m.',
        troubleshooting: 'Door unlocks automatically 90 seconds after chime finishes.'
      },
      {
        id: 'app-4',
        title: 'Samsung The Frame 4K TV & Soundbar',
        icon: 'Tv',
        instructions: 'Use the small solar remote. Click Home to access Netflix, HBO Max, and Spotify with pre-logged guest accounts.',
        troubleshooting: 'Soundbar auto-connects via eARC. Ensure soundbar display reads "TV eARC".'
      }
    ],

    trashSchedule: 'Municipal trash bins (green metal) are located 30 meters down the street towards Gudiashvili Square. Recycling bins for glass and cardboard are at the corner. Daily collection after 9:00 PM.',
    quietHours: '11:00 PM to 8:00 AM (Sololaki is an authentic residential quarter; please respect our lovely neighbors).',
    houseRules: [
      'No smoking inside the apartment (balcony with ashtray is fine).',
      'Please take off shoes upon entering; comfortable wool slippers are provided in the entrance basket.',
      'No unregistered overnight visitors or loud parties.',
      'Balcony antique wooden railing is 130 years old — please do not lean excessively over the edge.'
    ],

    recommendations: [
      {
        id: 'rec-1',
        name: 'Ezo (Organic Courtyard Dining)',
        category: 'food',
        description: 'Authentic farm-to-table Georgian classics served in a quiet 19th-century Sololaki courtyard. Outstanding khachapuri with artisanal Imeretian cheese.',
        hostTip: 'Order the Shkmeruli (garlic roast chicken) and ask for the unlabelled Kakhetian orange wine.',
        address: '16 Geronti Kikodze St, Tbilisi',
        distance: '4 min walk (300m)',
        mapsUrl: 'https://maps.google.com/?q=Ezo+Tbilisi'
      },
      {
        id: 'rec-2',
        name: 'Luka Polare & Coffee LAB Sololaki',
        category: 'coffee',
        description: 'Best specialty flat whites and hand-churned gelato in the neighborhood. Fantastic morning sun on the outdoor bench.',
        hostTip: 'Try the salted pistachio ice cream or the cold brew with cardamom.',
        address: '5 Lado Asatiani St, Tbilisi',
        distance: '2 min walk (150m)',
        mapsUrl: 'https://maps.google.com/?q=Coffee+LAB+Sololaki'
      },
      {
        id: 'rec-3',
        name: 'Vino Underground (Natural Wine Bar)',
        category: 'nightlife',
        description: 'Pioneering natural wine cellar opened by Georgian artisan winemakers. Pure qvevri fermented amber marvels.',
        hostTip: 'Ask the sommelier for a 3-wine flight of Chinuri and Rkatsiteli with sulguni cheese board.',
        address: '15 Galaktion Tabidze St, Tbilisi',
        distance: '5 min walk (400m)',
        mapsUrl: 'https://maps.google.com/?q=Vino+Underground+Tbilisi'
      },
      {
        id: 'rec-4',
        name: 'Europroduct Gourmet & Smart Express',
        category: 'groceries',
        description: 'Well-stocked neighborhood supermarket with fresh bread, dairy, water, wine, and imported gourmet goods.',
        hostTip: 'Open until 11:30 PM daily. Excellent local mineral water (Borjomi & Nabeghlavi).',
        address: '22 Leonidze St, Freedom Square',
        distance: '6 min walk (500m)',
        mapsUrl: 'https://maps.google.com/?q=Europroduct+Leonidze+Tbilisi'
      }
    ],

    taxiInfo: 'Download the Bolt app (widely used in Tbilisi, accepts card payments, reliable). Taxis directly outside on Freedom Square are also plentiful.',
    transitInfo: 'Liberty Square Metro Station is a 10-minute walk through Gudiashvili Square. You can tap any contactless Visa/Mastercard directly at the turnstiles.',
    airportTransit: 'Tbilisi International Airport (TBS) is 25 minutes by taxi (~35-40 GEL via Bolt) or take Bus #337 directly to Liberty Square.',

    departureChecklist: [
      'Turn off all air conditioning units and lights.',
      'Place used towels in the bathroom laundry basket.',
      'Take kitchen trash bag out to the green street bin.',
      'Check all drawers and sockets for phone chargers and passports.',
      'Close and lock the front door; press lock button on keypad.'
    ]
  },
  {
    id: 'prop-2',
    slug: 'sunny-sololaki',
    title: 'Sunny Sololaki',
    subtitle: 'Charming Old Town Sunlit Loft with Open Courtyard Balcony',
    tagline: 'Warm sunlight, bohemian art, and quiet garden courtyard in the heart of Sololaki.',
    type: 'apartment',
    status: 'published',
    createdAt: '2026-02-01',
    updatedAt: '2026-03-26',
    viewsCount: 890,
    sourcePlatform: 'airbnb',
    sourceUrl: 'https://airbnb.com/rooms/8920192',

    address: '8 Lado Asatiani Street, Apt 4',
    city: 'Tbilisi',
    country: 'Georgia',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    languages: ['en', 'ka'],

    hostName: 'Saba Beradze',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    hostRole: 'Host & Superhost',
    hostPhone: '+995 555 123 456',
    hostWhatsApp: '+995555123456',
    emergencyContact: '+995 555 987 654 (Nino / Co-host)',
    emergencyServicesNumber: '112',

    welcomeTitle: 'Welcome to Sunny Sololaki!',
    welcomeGreeting: 'Enjoy the light-filled rooms, freshly roasted coffee, and the authentic pulse of Old Tbilisi.',

    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    checkInMethod: 'keypad',
    doorKeypadCode: '4820#',
    lockboxCode: '6192',
    parkingInstructions: 'Free street parking along Asatiani St or open courtyard behind the building.',
    arrivalDirections: 'Push wooden courtyard gate, walk up iron staircase to 2nd floor, teal door on left. Enter 4820# on keypad.',

    wifiNetwork: 'SunnySololaki_5G',
    wifiPassword: 'SololakiSun2026!',

    appliances: [
      {
        id: 'app-s1',
        title: 'Toshiba Climate AC & Heat',
        icon: 'Thermometer',
        instructions: 'Remote on side table. Press green ON/OFF button. Set to 22°C for optimal temperature.',
        troubleshooting: 'Ensure courtyard French doors are fully closed for cooling.'
      },
      {
        id: 'app-s2',
        title: 'Nespresso Citiz Coffee Maker',
        icon: 'Coffee',
        instructions: 'Complimentary pods in ceramic bowl. Insert capsule, close lever, press lungo button.',
        troubleshooting: 'Empty drip tray underneath when amber light illuminates.'
      }
    ],

    trashSchedule: 'Green bins at the street corner. Daily collection after 9:00 PM.',
    quietHours: '11:00 PM to 8:00 AM.',
    houseRules: [
      'No indoor smoking (balcony is fine).',
      'Please take off shoes at the entryway.',
      'No unregistered overnight guests.'
    ],

    recommendations: [
      {
        id: 'rec-s1',
        name: 'Amo Rame Art Kitchen',
        category: 'food',
        description: 'Atmospheric bohemian bistro with legendary handmade khinkali and courtyard seating.',
        hostTip: 'Order the beef & pork khinkali and tarragon lemonade.',
        address: '4 Pavle Ingorokva St, Tbilisi',
        distance: '6 min walk (450m)',
        mapsUrl: 'https://maps.google.com/?q=Amo+Rame+Tbilisi'
      }
    ],

    taxiInfo: 'Bolt operates 24/7 in Tbilisi. Fares are usually 5-8 GEL within the center.',
    transitInfo: 'Liberty Square Metro Station is an 8-minute walk away.',
    airportTransit: '25 minutes to Tbilisi International Airport via Bolt (~35 GEL).',

    departureChecklist: [
      'Turn off AC and kitchen lights.',
      'Take trash bag down to the corner bin.',
      'Lock door and press padlock button on keypad.'
    ]
  },
  {
    id: 'prop-3',
    slug: 'batumi-sea-view',
    title: 'Batumi Sea View',
    subtitle: 'Panoramic Black Sea Sunsets & High-Rise Balcony',
    tagline: 'Wake up to the sound of waves. Your modern coastal retreat in Batumi.',
    type: 'apartment',
    status: 'published',
    createdAt: '2026-02-10',
    updatedAt: '2026-03-24',
    viewsCount: 1220,
    sourcePlatform: 'booking',
    sourceUrl: 'https://booking.com/hotel/ge/batumi-sea-view',

    address: '28 Rustaveli Avenue, Tower B, Unit 1804',
    city: 'Batumi',
    country: 'Georgia',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    languages: ['en', 'ka'],

    hostName: 'Saba Beradze',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    hostRole: 'Host & Superhost',
    hostPhone: '+995 555 123 456',
    hostWhatsApp: '+995555123456',
    emergencyContact: '+995 599 345 678 (Concierge Desk: Ext 0)',
    emergencyServicesNumber: '112',

    welcomeTitle: 'Welcome to Batumi Sea View!',
    welcomeGreeting: 'Enjoy panoramic Black Sea sunsets from your 18th-floor terrace. We hope you have a relaxing stay.',

    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    checkInMethod: 'keypad',
    doorKeypadCode: '9182#',
    lockboxCode: '8821',
    parkingInstructions: 'Underground parking stall #18B is reserved for you. Use entry ramp on Khimshiashvili side.',
    arrivalDirections: 'Check in with 24/7 lobby concierge in Tower B. Take elevator 3 to 18th floor. Unit 1804 is at the end of the north corridor. Enter 9182# on door keypad.',

    wifiNetwork: 'BatumiSea_Fiber',
    wifiPassword: 'BlackSeaBreeze26!',

    appliances: [
      {
        id: 'app-b1',
        title: 'Central Climate System',
        icon: 'Thermometer',
        instructions: 'Touchscreen on living room wall. Touch power icon and adjust temperature slider.',
        troubleshooting: 'Ensure balcony sliding doors are completely closed.'
      },
      {
        id: 'app-b2',
        title: 'Miele Induction Cooktop',
        icon: 'Utensils',
        instructions: 'Touch and hold power circle for 2s. Use induction pots stored in lower cabinet.',
        troubleshooting: 'Display flashes "U" if cookware is not magnetic.'
      }
    ],

    trashSchedule: 'Trash chute room is next to the service elevator on the 18th floor.',
    quietHours: '11:00 PM to 8:00 AM.',
    houseRules: [
      'No smoking inside unit or hallway.',
      'No loud music or parties on balcony.',
      'Please wipe sandy feet after beach trips.'
    ],

    recommendations: [
      {
        id: 'rec-b1',
        name: 'Old Boulevard Restaurant',
        category: 'food',
        description: 'Classic Batumi seaside dining with fresh Black Sea turbot and live piano music.',
        hostTip: 'Try the Adjarian Khachapuri with extra butter.',
        address: '23 Ninoshvili St, Batumi',
        distance: '4 min walk (300m)',
        mapsUrl: 'https://maps.google.com/?q=Old+Boulevard+Batumi'
      }
    ],

    taxiInfo: 'Bolt operates 24/7 across Batumi. Taxis are also stationed at the hotel boulevard roundabout.',
    transitInfo: 'Batumi seaside promenade electric bikes (Batumvelo) can be unlocked with the Batumvelo card or terminal.',
    airportTransit: 'Batumi International Airport (BUS) is 12 minutes by taxi (~15 GEL).',

    departureChecklist: [
      'Lock balcony sliding door.',
      'Turn off air conditioning.',
      'Leave keycards in the entryway tray or return to lobby reception.'
    ]
  },
  {
    id: 'prop-4',
    slug: 'kazbegi-cabin',
    title: 'Kazbegi Cabin',
    subtitle: 'Alpine Sanctuary Facing Mount Kazbek & Gergeti Trinity',
    tagline: 'Crisp mountain air, crackling wood fireplace, and panoramic Caucasus peaks.',
    type: 'villa',
    status: 'published',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-20',
    viewsCount: 710,
    sourcePlatform: 'direct',

    address: 'Gergeti Valley Road 12',
    city: 'Stepantsminda (Kazbegi)',
    country: 'Georgia',
    coverImage: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
    languages: ['en', 'ka'],

    hostName: 'Saba Beradze',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    hostRole: 'Host & Superhost',
    hostPhone: '+995 555 123 456',
    hostWhatsApp: '+995555123456',
    emergencyContact: '+995 577 987 654 (David / Co-host)',
    emergencyServicesNumber: '112',

    welcomeTitle: 'Welcome to Kazbegi Cabin!',
    welcomeGreeting: 'Breathe in the alpine air and warm up by the stone fireplace. The mountain views are yours to enjoy.',

    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    checkInMethod: 'keypad',
    doorKeypadCode: '7721#',
    lockboxCode: '3141',
    parkingInstructions: 'Private gated driveway on Gergeti road fits up to 3 SUVs. Winter 4WD recommended during snow.',
    arrivalDirections: 'Turn onto Gergeti lane past the bridge. The cedar gate is marked with Stumari sign #12. Enter 7721# on keypad.',

    wifiNetwork: 'Kazbegi_Peak_WiFi',
    wifiPassword: 'MountKazbek2026!',

    appliances: [
      {
        id: 'app-m1',
        title: 'Stone Wood Fireplace',
        icon: 'Flame',
        instructions: 'Open flue damper knob on the side. Birch firewood and fire-starters are in the copper bucket. Never leave burning unattended.',
        troubleshooting: 'If smoke drifts inward, open damper lever completely.'
      },
      {
        id: 'app-m2',
        title: 'Nordic Cedar Sauna',
        icon: 'Zap',
        instructions: 'Set timer dial to 45 mins. Heats to 75°C in 20 minutes. Pour water ladles over volcanic stones for steam.',
        troubleshooting: 'Sauna automatically turns off when timer expires.'
      }
    ],

    trashSchedule: 'Communal refuse bins are at the bottom of the Gergeti road intersection.',
    quietHours: '10:00 PM to 7:00 AM.',
    houseRules: [
      'No outdoor open bonfires.',
      'Remove muddy mountain hiking boots in the cedar boot room.',
      'Ensure sauna door is firmly closed when not in use.'
    ],

    recommendations: [
      {
        id: 'rec-m1',
        name: 'Rooms Hotel Kazbegi Restaurant & Terrace',
        category: 'food',
        description: 'Iconic panoramic lounge facing Mount Kazbek. High-end modern Georgian cuisine and fireside cocktails.',
        hostTip: 'Have a cocktail on the grand terrace at sunset. Reservations recommended for dinner.',
        address: 'Stepantsminda Center',
        distance: '12 min walk (1km)',
        mapsUrl: 'https://maps.google.com/?q=Rooms+Hotel+Kazbegi'
      }
    ],

    taxiInfo: 'Local 4x4 drivers in the town square can drive you up to Gergeti Trinity Church or Truso Valley.',
    transitInfo: 'Minibuses (Marshrutkas) leave Didube Station in Tbilisi every hour for Stepantsminda.',
    airportTransit: '2.5 hours scenic drive from Tbilisi International Airport via the Georgian Military Highway.',

    departureChecklist: [
      'Ensure wood fire is fully extinguished with mesh screen drawn.',
      'Turn off sauna switches.',
      'Return physical key to the lockbox and scramble dials.'
    ]
  },
  {
    id: 'prop-5',
    slug: 'vake-garden-house',
    title: 'Vake Garden House',
    subtitle: 'Sophisticated Urban Residence with Private Courtyard & Greenery',
    tagline: 'Quiet leafy elegance in Vake, moments from parks, cafes, and wine bars.',
    type: 'apartment',
    status: 'published',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-27',
    viewsCount: 980,
    sourcePlatform: 'airbnb',
    sourceUrl: 'https://airbnb.com/rooms/9981245',

    address: '12 Irakli Abashidze Street, Apt 6',
    city: 'Tbilisi',
    country: 'Georgia',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    languages: ['en', 'ka'],

    hostName: 'Saba Beradze',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    hostRole: 'Host & Superhost',
    hostPhone: '+995 555 123 456',
    hostWhatsApp: '+995555123456',
    emergencyContact: '+995 555 987 654 (Nino / Co-host)',
    emergencyServicesNumber: '112',

    welcomeTitle: 'Welcome to Vake Garden House!',
    welcomeGreeting: 'Relax in our tranquil green courtyard home in the most vibrant district of Tbilisi.',

    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    checkInMethod: 'keypad',
    doorKeypadCode: '5514#',
    lockboxCode: '7281',
    parkingInstructions: 'Assigned underground parking spot #6 in building basement.',
    arrivalDirections: 'Enter through building lobby on Abashidze St. Elevator to 2nd floor, Apt 6 is on right. Enter 5514# on keypad.',

    wifiNetwork: 'VakeGarden_Ultra',
    wifiPassword: 'VakeGreen2026!',

    appliances: [
      {
        id: 'app-v1',
        title: 'Mitsubishi Inverter Climate Control',
        icon: 'Thermometer',
        instructions: 'Wall thermostat controls both bedrooms and living room. Recommended 21°C.',
        troubleshooting: 'Filter cleaning indicator resets automatically.'
      },
      {
        id: 'app-v2',
        title: 'Siemens Espresso Barista Machine',
        icon: 'Coffee',
        instructions: 'Touch touchscreen for Cappuccino or Flat White. Milk container is in fridge.',
        troubleshooting: 'Add whole milk to frother attachment for velvety micro-foam.'
      }
    ],

    trashSchedule: 'Trash chute in stairwell corridor or street recycling bins.',
    quietHours: '11:00 PM to 8:00 AM.',
    houseRules: [
      'No smoking inside.',
      'Please respect neighbors in this residential building.',
      'Small well-behaved pets permitted with prior notice.'
    ],

    recommendations: [
      {
        id: 'rec-v1',
        name: 'Stamba & Lolita Dining',
        category: 'food',
        description: 'Vibrant modern courtyard bistro with wood-fired pizzas, cocktails, and great music.',
        hostTip: 'Sit by the open kitchen or outdoor patio under the fairy lights.',
        address: '14 Merab Kostava St, Tbilisi',
        distance: '10 min by car / Bolt',
        mapsUrl: 'https://maps.google.com/?q=Lolita+Tbilisi'
      }
    ],

    taxiInfo: 'Bolt and Yandex both arrive in 2-3 minutes on Abashidze Street.',
    transitInfo: 'Chavchavadze Ave bus lanes provide 5-minute express transit to Rustaveli.',
    airportTransit: '30 minutes to TBS Airport via George W. Bush highway.',

    departureChecklist: [
      'Turn off all AC split units.',
      'Close windows and garden patio doors.',
      'Press keypad lock icon when leaving.'
    ]
  }
];

export const MOCK_HOST_USER: HostUser = {
  id: 'host-user-1',
  name: 'Saba Beradze',
  email: 'saba.beradze9@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  plan: 'pro',
  billingCycle: 'annual',
  stripeCustomerId: 'cus_Q98xLa72zKl01',
  joinedDate: 'Jan 2026',
  propertyCount: 5,
  status: 'active'
};

export const MOCK_ADMIN_HOSTS: HostUser[] = [
  {
    id: 'h-1',
    name: 'Saba Beradze',
    email: 'saba.beradze9@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    plan: 'pro',
    billingCycle: 'annual',
    joinedDate: 'Jan 15, 2026',
    propertyCount: 5,
    status: 'active'
  },
  {
    id: 'h-2',
    name: 'Nino Chikovani',
    email: 'nino.chikovani@batumistays.ge',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    plan: 'pro',
    billingCycle: 'monthly',
    joinedDate: 'Feb 10, 2026',
    propertyCount: 3,
    status: 'active'
  },
  {
    id: 'h-3',
    name: 'David Giorgadze',
    email: 'david.kazbegi@mountains.ge',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    plan: 'pro',
    billingCycle: 'monthly',
    joinedDate: 'Mar 01, 2026',
    propertyCount: 4,
    status: 'active'
  },
  {
    id: 'h-4',
    name: 'Ana Kalandadze',
    email: 'ana.kalandadze@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    plan: 'free',
    billingCycle: 'monthly',
    joinedDate: 'Mar 12, 2026',
    propertyCount: 1,
    status: 'active'
  },
  {
    id: 'h-5',
    name: 'Giorgi Meladze',
    email: 'giorgi.meladze@tbilisihosts.ge',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    plan: 'pro',
    billingCycle: 'annual',
    joinedDate: 'Jan 28, 2026',
    propertyCount: 6,
    status: 'active'
  }
];

export const MOCK_ADMIN_PROPERTIES_SUMMARY = [
  { id: 'p-1', title: 'Old Tbilisi Apartment', host: 'Saba Beradze', type: 'Apartment', status: 'Published', views: 1420 },
  { id: 'p-2', title: 'Sunny Sololaki', host: 'Saba Beradze', type: 'Apartment', status: 'Published', views: 890 },
  { id: 'p-3', title: 'Batumi Sea View', host: 'Saba Beradze', type: 'Apartment', status: 'Published', views: 1220 },
  { id: 'p-4', title: 'Kazbegi Cabin', host: 'Saba Beradze', type: 'Villa', status: 'Published', views: 710 },
  { id: 'p-5', title: 'Vake Garden House', host: 'Saba Beradze', type: 'Apartment', status: 'Published', views: 980 }
];

export const MOCK_PLATFORM_STATS = {
  totalHosts: 42,
  totalProperties: 87,
  activeGuests: 1284,
  qrNfcScans: 12436,
  avgRating: 4.92,
  totalReviews: 1248,
  publishedProperties: 81,
  draftProperties: 6
};

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Starter',
    priceMonthly: 0,
    priceAnnual: 0,
    badge: 'Free Forever',
    description: 'Perfect for independent hosts with 1 property getting started with digital guides.',
    features: [
      '1 Active Property Guide',
      'QR Code generation & download',
      'Instant Wi-Fi 1-tap copy',
      'Appliance guides & house rules',
      'Local curated recommendations',
      'Offline caching for guests'
    ],
    cta: 'Start Free',
    isPopular: false
  },
  {
    id: 'pro',
    name: 'Pro Host',
    priceMonthly: 9,
    priceAnnual: 7,
    badge: 'Most Popular',
    description: 'For active hosts looking to save time, elevate reviews, and deploy custom branded QR & NFC tags.',
    features: [
      'Unlimited Properties',
      'Custom vanity URL (stumari.app/g/your-name)',
      'NFC contactless tag linking',
      'High-res printable frame flyers',
      'Multilingual guest guides (EN, KA, etc.)',
      'WhatsApp host chat integration',
      'Priority support'
    ],
    cta: 'Start 14-Day Free Trial',
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Property Manager',
    priceMonthly: 29,
    priceAnnual: 24,
    badge: 'For Teams',
    description: 'For boutique hotels, guesthouses, and managers handling 10+ doors with custom branding.',
    features: [
      'Everything in Pro',
      'Multi-unit room numbers & lockbox mapping',
      'Bulk QR & NFC tag ordering discounts',
      'Custom branding & colors',
      'Dedicated account manager'
    ],
    cta: 'Contact Sales',
    isPopular: false
  }
];

export const MOCK_STAY_FEEDBACKS: StayFeedback[] = [
  {
    id: 'fb-1',
    propertyId: 'prop-1',
    propertyName: 'Old Tbilisi Apartment',
    createdAt: '2026-03-29 14:20',
    guestName: 'Elena & Lucas (Berlin)',
    sentiment: 'amazing',
    comment: 'Best Airbnb stay we have ever had! The heating instructions and Amo Rame khinkali tip made our whole weekend. Left a 5-star review on Airbnb!',
    publicReviewPlatformChosen: 'airbnb',
    status: 'reviewed'
  },
  {
    id: 'fb-2',
    propertyId: 'prop-1',
    propertyName: 'Old Tbilisi Apartment',
    createdAt: '2026-03-25 11:05',
    guestName: 'David K. (London)',
    sentiment: 'could_be_better',
    categories: ['temperature', 'equipment'],
    comment: 'The apartment was slightly chilly when we arrived late at night because we did not realize the French doors had to be clicked firmly shut for the AC heater to kick in. The host manual helped, but good to know in advance!',
    status: 'resolved'
  },
  {
    id: 'fb-3',
    propertyId: 'prop-1',
    propertyName: 'Old Tbilisi Apartment',
    createdAt: '2026-03-22 09:40',
    guestName: 'Sophie M. (Paris)',
    sentiment: 'amazing',
    comment: 'The Leghvtakhevi waterfall and Dadi wine recommendations were pure gold. We felt like locals from day 1.',
    publicReviewPlatformChosen: 'google',
    status: 'reviewed'
  },
  {
    id: 'fb-4',
    propertyId: 'prop-1',
    propertyName: 'Old Tbilisi Apartment',
    createdAt: '2026-03-18 16:30',
    guestName: 'Michael T. (Warsaw)',
    sentiment: 'problem',
    categories: ['wifi'],
    comment: 'Wi-Fi cut off briefly during a morning Zoom call. We used the router reset instructions in the guide and it came back in 2 minutes. Glad we did not have to wake Saba up!',
    status: 'resolved'
  }
];

export const MOCK_TODAY_ARRIVALS: ArrivalScheduleItem[] = [
  {
    id: 'arr-1',
    time: '15:00',
    guestName: 'Anna Müller',
    guestAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    propertyId: 'prop-1',
    propertyName: 'Old Tbilisi Apartment',
    status: 'confirmed',
    doorKeypadCode: '3829#',
    wifiNetwork: 'OldTbilisi_5G',
    guideOpened: true,
    phone: '+49 170 1234567'
  },
  {
    id: 'arr-2',
    time: '16:30',
    guestName: 'Mark Johnson',
    guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    propertyId: 'prop-2',
    propertyName: 'Sunny Sololaki',
    status: 'confirmed',
    doorKeypadCode: '4820#',
    wifiNetwork: 'SunnySololaki_5G',
    guideOpened: true,
    phone: '+1 415 555 2671'
  },
  {
    id: 'arr-3',
    time: '18:00',
    guestName: 'Elena Petrova',
    guestAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    propertyId: 'prop-3',
    propertyName: 'Batumi Sea View',
    status: 'pending',
    doorKeypadCode: '9182#',
    wifiNetwork: 'BatumiSea_Fiber',
    guideOpened: false,
    phone: '+380 50 123 4567'
  }
];

export const MOCK_GUEST_REQUESTS: GuestRequest[] = [
  {
    id: 'req-1',
    propertyId: 'prop-1',
    propertyName: 'Old Tbilisi Apartment',
    guestName: 'Elena Petrova',
    category: 'wifi',
    title: 'Wi-Fi არ მუშაობს (Wi-Fi drop)',
    description: 'Connection dropped during morning video call. Router restarted.',
    createdAt: '10 წუთის წინ',
    status: 'new',
    urgency: 'high',
    assignedTo: 'Saba Beradze'
  },
  {
    id: 'req-2',
    propertyId: 'prop-2',
    propertyName: 'Sunny Sololaki',
    guestName: 'Mark Johnson',
    category: 'climate',
    title: 'AC არ გრილდება (AC cooling)',
    description: 'Living room AC seems to be on fan mode instead of cool.',
    createdAt: '1 საათის წინ',
    status: 'in_progress',
    urgency: 'medium',
    assignedTo: 'Nino Chikovani'
  },
  {
    id: 'req-3',
    propertyId: 'prop-3',
    propertyName: 'Batumi Sea View',
    guestName: 'Sophie Laurent',
    category: 'cleaning',
    title: 'დამატებითი პირსახოცები (Extra towels)',
    description: 'Need 2 extra bath towels for our child.',
    createdAt: '3 საათის წინ',
    status: 'resolved',
    urgency: 'low',
    assignedTo: 'Cleaning Team'
  },
  {
    id: 'req-4',
    propertyId: 'prop-4',
    propertyName: 'Kazbegi Cabin',
    guestName: 'David Kim',
    category: 'access',
    title: 'კარის საკეტი (Keypad assistance)',
    description: 'Keypad battery light flashed amber upon entering.',
    createdAt: '5 საათის წინ',
    status: 'new',
    urgency: 'high',
    assignedTo: 'Maintenance'
  },
  {
    id: 'req-5',
    propertyId: 'prop-1',
    propertyName: 'Old Tbilisi Apartment',
    guestName: 'Michael T.',
    category: 'other',
    title: 'გვიანი check-out მოთხოვნა (Late check-out)',
    description: 'Requested 1:00 PM check-out due to afternoon flight.',
    createdAt: '1 დღის წინ',
    status: 'resolved',
    urgency: 'low',
    assignedTo: 'Saba Beradze'
  }
];
