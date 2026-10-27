import { ApplianceGuide, PropertyTemplate, PropertyPhotoAsset } from '../types';

export const DEFAULT_INSTRUCTION_LIBRARY: ApplianceGuide[] = [
  {
    id: 'lib-ac-daikin',
    title: 'Daikin Dual Inverter AC & Heating',
    icon: 'Thermometer',
    category: 'climate',
    instructions: 'Wall remote is mounted beside the hallway arch. Press POWER. Mode button toggles between Cool (snowflake) and Heat (sun). Optimal temperature is 22°C (72°F).',
    troubleshooting: 'If amber indicator flashes, ensure the balcony door is fully clicked shut; unit auto-pauses when doors are ajar.',
    mediaType: 'video',
    mediaUrl: '/tbilisi-twilight.mp4',
    mediaPoster: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    videoDurationSeconds: 16,
    isLibraryPreset: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Locate remote on wall mount',
        description: 'Magnetic dock is next to the bedroom door. Slide unit upward to release.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 2,
        title: 'Select Mode (Cool vs Heat)',
        description: 'Press MODE until you see the snowflake icon for summer cooling or sun icon for winter heating.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 3,
        title: 'Confirm balcony doors closed',
        description: 'Safety sensors pause cooling when French windows are open.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'lib-espresso-delonghi',
    title: 'DeLonghi Espresso Machine',
    icon: 'Coffee',
    category: 'kitchen',
    instructions: 'Locate fresh roasted beans in the glass pantry jar. Press top-left power button. Wait 25 seconds for green readiness light. Slide portafilter firmly and press single or double shot.',
    troubleshooting: 'Red indicator flashes when rear water reservoir is low. Fill with filtered tap water from the Brita pitcher.',
    mediaType: 'video',
    mediaUrl: '/tbilisi-twilight.mp4',
    mediaPoster: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    videoDurationSeconds: 18,
    isLibraryPreset: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Power on & pre-heat',
        description: 'Turn top switch on. The amber light warms up and turns solid green in 30 seconds.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 2,
        title: 'Fill grounded coffee basket',
        description: 'Use 1 level scoop for single shot or 2 scoops for double. Tamp lightly with black tamper.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 3,
        title: 'Lock portafilter & pull shot',
        description: 'Insert handle at 45 degrees and rotate right until firmly snug. Place ceramic cup and press button.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'lib-washer-bosch',
    title: 'Bosch Serie 6 Eco Washer',
    icon: 'Shirt',
    category: 'laundry',
    instructions: 'Eco liquid detergent pods are stored in the basket beneath the sink. Turn dial clockwise to "Quick 30°" (30 minutes). Push door firmly until it clicks before pressing Start.',
    troubleshooting: 'Key symbol on screen means child-lock is on. Hold the Start/Pause button for 3 seconds to unlock.',
    mediaType: 'video',
    mediaUrl: '/tbilisi-twilight.mp4',
    mediaPoster: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    videoDurationSeconds: 22,
    isLibraryPreset: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Add pod directly into drum',
        description: 'Place 1 detergent pod at the back of the stainless steel drum before loading clothes.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 2,
        title: 'Select Quick 30° cycle',
        description: 'Rotate dial to Quick 30. It washes and spins in 30 minutes, ideal for holiday freshening.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 3,
        title: 'Click door shut and press Start',
        description: 'Push door until metallic latch audibly clicks, then tap touch start button.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'lib-boiler-baxi',
    title: 'Baxi Eco Four Gas Boiler & Water Heater',
    icon: 'Flame',
    category: 'climate',
    instructions: 'Central heating and endless hot water are driven by the Baxi combi unit in the kitchen cabinet. Pressure gauge should read between 1.2 and 1.5 bar.',
    troubleshooting: 'If display flashes error E01, turn dial to R (Reset) for 2 seconds. The flame re-ignites automatically.',
    mediaType: 'video',
    mediaUrl: '/tbilisi-twilight.mp4',
    mediaPoster: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    videoDurationSeconds: 15,
    isLibraryPreset: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Locate boiler inside kitchen cabinet',
        description: 'Open the ventilated white pantry door to the right of the refrigerator.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 2,
        title: 'Check pressure dial',
        description: 'Needle should sit comfortably in the green zone (1.2 to 1.5 bar).',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 3,
        title: 'Reset if flame goes out',
        description: 'Turn dial counter-clockwise to R for 2 seconds, then return to tap icon. You will hear ignition clicks.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'lib-gate-courtyard',
    title: 'Courtyard Wrought Iron Gate & Digital Keypad',
    icon: 'KeyRound',
    category: 'access',
    instructions: 'Enter code followed by #. The electric latch buzzes for 5 seconds. Push firmly while buzzing.',
    troubleshooting: 'If code fails, press * to clear keypad buffer and re-enter digits slowly.',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    isLibraryPreset: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Locate keypad on stone pillar',
        description: 'Backlit keypad is mounted on the left stone archway.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 2,
        title: 'Type digits and hash mark',
        description: 'Wait for green LED confirmation flash.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 3,
        title: 'Push door while latch hums',
        description: 'The latch remains released for 5 seconds. Give gate a steady push.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'lib-smart-tv',
    title: 'Samsung 55" Smart TV & Streaming',
    icon: 'Tv',
    category: 'entertainment',
    instructions: 'Universal remote with Netflix / Prime buttons. Guest accounts are active. Please log into your own accounts via guest mode or browse free YouTube.',
    troubleshooting: 'Press Home button if HDMI input ever changes by accident.',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    isLibraryPreset: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Turn on via Red Power button',
        description: 'Aim remote towards bottom-center sensor under TV frame.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 2,
        title: 'Select Netflix or YouTube',
        description: 'Use navigation ring to pick apps or tap the dedicated Netflix hotkey.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'lib-find-entrance',
    title: 'How to Find the Apartment Entrance',
    icon: 'KeyRound',
    category: 'access',
    instructions: 'Enter through the carved wooden archway on the main cobblestone street, cross the inner courtyard past the fig tree, and walk up the spiral staircase to the 2nd floor.',
    troubleshooting: 'Look for brass plaque #14 next to the street lantern if arriving after dark.',
    mediaType: 'video',
    mediaUrl: '/tbilisi-twilight.mp4',
    mediaPoster: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    videoDurationSeconds: 18,
    isLibraryPreset: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Street Archway & Brass Plaque #14',
        description: 'Stop at the historic brick facade with the black lantern above the wooden double doors.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 2,
        title: 'Cross Courtyard to Iron Staircase',
        description: 'Walk straight across the stone courtyard towards the traditional carved balcony.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 3,
        title: '2nd Floor Teal Apartment Door',
        description: 'At the top of the stairs, your apartment is the teal door on the left with the smart keypad.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'lib-checkout-keys',
    title: 'Where to Leave Keys at Checkout',
    icon: 'KeyRound',
    category: 'access',
    instructions: 'Before departing, place the physical key fob on the oak entryway tray or lock it inside the wall-mounted MasterLock box by the door and scramble the dials.',
    troubleshooting: 'Make sure you have all luggage outside before pulling the self-locking front door shut.',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    isLibraryPreset: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Place courtyard fob on console tray',
        description: 'Leave the leather keychain and gate fob in the ceramic dish by the entrance mirror.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 2,
        title: 'Pull apartment door firmly shut',
        description: 'The smart latch engages automatically when closed—no key needed to lock from outside.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
      },
      {
        stepNumber: 3,
        title: 'Press Exit button at street gate',
        description: 'Press the silver release button on the right wall to open the courtyard gate on your way out.',
        mediaType: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export const DEFAULT_PROPERTY_TEMPLATES: PropertyTemplate[] = [
  {
    id: 'tmpl-historic-old-town',
    name: 'Historic Old Town Studio',
    description: 'Perfect for boutique apartments with courtyard gates, historic architecture, boiler heating, and balcony latch locks.',
    propertyType: 'apartment',
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    quietHours: '11:00 PM – 8:00 AM',
    trashSchedule: 'Municipal green bins on the corner. Daily evening collection after 9 PM.',
    houseRules: [
      'No indoor smoking (balcony with ashtray is welcome)',
      'Quiet courtyard hours after 11 PM for neighboring residents',
      'Please remove shoes in the foyer entryway',
      'Turn off AC/heating when leaving for full-day excursions'
    ],
    departureChecklist: [
      'Leave keys on the dining table or inside keypad lockbox',
      'Ensure balcony doors and windows are latched',
      'Place used towels inside laundry hamper in bathroom',
      'Turn off lights and climate remotes'
    ],
    appliances: [
      DEFAULT_INSTRUCTION_LIBRARY[0], // AC
      DEFAULT_INSTRUCTION_LIBRARY[1], // Espresso
      DEFAULT_INSTRUCTION_LIBRARY[2], // Washer
      DEFAULT_INSTRUCTION_LIBRARY[3]  // Boiler
    ],
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'tmpl-modern-highrise',
    name: 'Modern High-Rise Luxury Penthouse',
    description: 'Tailored for contemporary towers with digital keypads, smart thermostats, concierge desks, and central trash chutes.',
    propertyType: 'apartment',
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    quietHours: '10:00 PM – 8:00 AM',
    trashSchedule: 'Trash chute located next to elevator bank on each floor. Recyclables bin on P1 garage level.',
    houseRules: [
      'Strictly non-smoking throughout property and building corridors',
      'No unregistered visitors after 11 PM',
      'Keep music at moderate volume at all hours',
      'Building gym & rooftop pool access requires electronic key fob'
    ],
    departureChecklist: [
      'Click door locked upon exit (deadbolt auto-engages)',
      'Run dishwasher cycle with pod if dirty dishes remain',
      'Return key cards to 24/7 lobby concierge desk'
    ],
    appliances: [
      DEFAULT_INSTRUCTION_LIBRARY[0], // AC
      DEFAULT_INSTRUCTION_LIBRARY[1], // Espresso
      DEFAULT_INSTRUCTION_LIBRARY[2], // Washer
      DEFAULT_INSTRUCTION_LIBRARY[5]  // Smart TV
    ],
    createdAt: '2026-03-05T12:00:00Z'
  },
  {
    id: 'tmpl-alpine-chalet',
    name: 'Alpine Chalet & Mountain Retreat',
    description: 'Designed for countryside and mountain villas with wood stoves, Starlink satellite internet, outdoor grills, and mudrooms.',
    propertyType: 'villa',
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    quietHours: '10:00 PM – 7:00 AM',
    trashSchedule: 'Secure outdoor metal bin to keep wildlife away. Latch closed at all times.',
    houseRules: [
      'Never leave fireplace or outdoor fire pit unattended',
      'Remove muddy hiking boots in entrance mudroom',
      'Conserve hot water during winter cold snaps',
      'Pets allowed on main floor only; please keep off upholstered furniture'
    ],
    departureChecklist: [
      'Ensure fireplace embers are completely cold and glass closed',
      'Lock all exterior doors and place key in combination lockbox',
      'Turn thermostat down to eco mode (18°C)'
    ],
    appliances: [
      DEFAULT_INSTRUCTION_LIBRARY[0], // AC/Heat
      DEFAULT_INSTRUCTION_LIBRARY[1], // Espresso
      DEFAULT_INSTRUCTION_LIBRARY[3]  // Boiler
    ],
    createdAt: '2026-03-10T14:00:00Z'
  }
];

export const SAMPLE_PHOTO_BUNDLES: { name: string; photos: Omit<PropertyPhotoAsset, 'id'>[] }[] = [
  {
    name: 'Tbilisi Historic Residence',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'High-ceiling living room with vintage Persian rug and original arched windows',
        roomCategory: 'living',
        isCover: true,
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Open kitchen with marble counters, Italian espresso bar, and induction cooktop',
        roomCategory: 'kitchen',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
        caption: 'Master bedroom with king bed, linen sheets, and Daikin silent climate control',
        roomCategory: 'bedroom',
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Soaking tub bathroom with rain shower and complimentary organic botanical soaps',
        roomCategory: 'bathroom',
        order: 4
      },
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Historic carved wooden balcony overlooking quiet Sololaki courtyard vines',
        roomCategory: 'balcony',
        order: 5
      },
      {
        url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
        caption: 'Building entrance with wrought-iron gate and digital keypad on stone pillar',
        roomCategory: 'entrance',
        order: 6
      }
    ]
  },
  {
    name: 'Batumi Waterfront Penthouse',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sun-drenched living room with panoramic Black Sea coastal views',
        roomCategory: 'living',
        isCover: true,
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
        caption: 'Modern minimalist bedroom with floor-to-ceiling glass and blackout shades',
        roomCategory: 'bedroom',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sunset dining terrace with teak outdoor seating and sea breeze',
        roomCategory: 'balcony',
        order: 3
      }
    ]
  }
];
