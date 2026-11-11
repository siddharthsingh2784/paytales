// PayTales: Sample Chapters Dataset & Realtime Seed Data

// Clean and normalize image URLs (handles raw links, markdown links [url](url), quotes, brackets)
export function cleanImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  let clean = url.trim();
  // Match markdown link e.g. [text](https://example.com/photo.jpg)
  const mdMatch = clean.match(/\((https?:\/\/[^\s\)]+)\)/);
  if (mdMatch) return mdMatch[1];
  // Match raw URL embedded in brackets or text
  const urlMatch = clean.match(/https?:\/\/[^\s"'\]\)]+/);
  if (urlMatch) return urlMatch[0];
  return clean.replace(/[\[\]"']/g, "").trim();
}

export const SAMPLE = [
  {
    id: "chapter-1",
    title: "When the Hills Fell Asleep",
    cause: "Wayanad Landslide Relief",
    location: "Meppadi & Chooralmala, Kerala, India",
    coords: "11.5564° N, 76.1340° E",
    grad: ["#2b1e1a", "#8c3b2b"],
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "At 2 AM the tea estate was quiet.\nBy 2:15 AM the mountain had swallowed Chooralmala whole.",
      "Bridges collapsed like toothpicks.\nEntire families woke up in riverbeds three kilometers downstream.",
      "Relief workers cut through boulder fields by hand.\nTemporary shelters now hold thousands waiting for a sign of hope.",
      "A single relief packet brings warmth to a child\nwho lost everything before dawn."
    ],
    ai: "Tell us a name to dedicate this relief shelter kit.",
    tags: ["landslide", "Kerala", "emergency shelter", "rebuilding"],
    goal: 45000,
    raised: 18200,
    stats: [
      { n: "850+", l: "families relocated" },
      { n: "2,400", l: "medical kits" },
      { n: "15", l: "temporary bridges" }
    ],
    tiers: [
      "$5 buys emergency blanket and trauma care supplies.",
      "$10 funds warm meals for a family in relief camps for 3 days.",
      "$25 helps construct temporary modular housing units."
    ],
    checkpoints: [
      { label: "Target Set & Emergency Fund Opened", status: "completed", date: "Aug 2, 2024" },
      { label: "75% Funds Dispatched to Local First Responders", status: "completed", date: "Aug 14, 2024" },
      { label: "Supplies & Medical Kits Purchased", status: "in-progress", date: "Sep 1, 2024" },
      { label: "On-Ground Shelter Construction Delivery", status: "upcoming", date: "Expected Oct 2024" }
    ],
    verifiedReports: [
      {
        date: "2 days ago",
        headline: "1,200 Water Kits & Insulated Tents Dispatched to Chooralmala",
        agency: "Kerala Voluntary Disaster Force & PayTales Verified",
        hash: "0x8F3b...9E21",
        description: "Emergency logistics convoy reached Sector 4 despite mud-blocked bridges using Bailey temporary spans. Over 400 mothers and infants received trauma supplies."
      },
      {
        date: "1 week ago",
        headline: "Community Kitchen Installed at Meppadi Relief Base",
        agency: "Wayanad Community Relief Coalition",
        hash: "0x4C7a...1109",
        description: "Delivered 3 commercial grain pots, gas stoves, and 1,800 kg of lentils and rice providing 3 hot meals daily to 650 displaced estate workers."
      }
    ]
  },
  {
    id: "chapter-2",
    title: "The Water That Breathes Salt",
    cause: "Sundarbans Cyclone Recovery",
    location: "Gosaba & Satkhira, Sundarbans Delta",
    coords: "21.9497° N, 88.9000° E",
    grad: ["#0f282f", "#3a7d8c"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "When coastal cyclones breach the dykes,\nthe river doesn't just bring water—it brings salt.",
      "Paddy fields turn white with brine.\nWell water burns the throat instead of quenching thirst.",
      "Women walk six kilometers every morning\ncarrying heavy clay pots to find sweet water.",
      "Solar desalination units convert salty mud\ninto pure, drinkable water in minutes."
    ],
    ai: "Focus on women-led clean water initiatives.",
    tags: ["cyclone", "salinity", "clean water", "West Bengal"],
    goal: 35000,
    raised: 22800,
    stats: [
      { n: "4,100", l: "people drinking clean water" },
      { n: "12", l: "solar filtration hubs" },
      { n: "80", l: "acres of desalted farmland" }
    ],
    tiers: [
      "$5 buys a high-capacity water purification bucket.",
      "$10 repairs a breached earthen embankment wall.",
      "$25 funds a community solar-powered water filtration unit."
    ],
    checkpoints: [
      { label: "Community Water Needs Audit Completed", status: "completed", date: "May 20, 2024" },
      { label: "75% Desalination Hardware Procured", status: "completed", date: "Jun 12, 2024" },
      { label: "Women-Led Water Committees Trained", status: "in-progress", date: "Jul 28, 2024" },
      { label: "12 Solar Filtration Hubs Fully Commissioned", status: "in-progress", date: "Aug 2024" }
    ],
    verifiedReports: [
      {
        date: "3 days ago",
        headline: "Solar Filtration Unit Installed in Satkhira Embankment Ward",
        agency: "Delta Water Guardians & PayTales Verified",
        hash: "0x1A2b...77DE",
        description: "Installed a 1,500 L/day solar reverse osmosis unit powered by 4 PV panels. Salinity dropped from 14,000 ppm to 180 ppm pure mineral water."
      }
    ]
  },
  {
    id: "chapter-3",
    title: "The Sky Breaks Open",
    cause: "Himachal Cloudburst Recovery",
    location: "Samej & Rampur Valley, Himachal Pradesh",
    coords: "31.4290° N, 77.6322° E",
    grad: ["#1c2d37", "#4a6fa5"],
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "A cloudburst over Samej village turned a small stream\ninto a roaring wall of mud and trees.",
      "Connecting roads vanished overnight,\nisolating mountain hamlets from food and medical care.",
      "Local villagers formed human chains\nto rope food supplies across raging river gorges.",
      "Ropeway cable cars now zip medical crates\nstraight across the valley to stranded elderly residents."
    ],
    ai: "Set a hopeful tone for rebuilding mountain infrastructure.",
    tags: ["cloudburst", "Himachal", "flash flood", "mountains"],
    goal: 40000,
    raised: 14500,
    stats: [
      { n: "320", l: "families re-connected" },
      { n: "450", l: "emergency ration crates" },
      { n: "5", l: "ropeway lines built" }
    ],
    tiers: [
      "$5 provides a high-efficiency solar flashlight.",
      "$10 funds a 15-day dry ration emergency box.",
      "$25 supports setting up high-altitude ropeway lines."
    ],
    checkpoints: [
      { label: "Emergency Aerial Assessment & Hazard Mapping", status: "completed", date: "Jul 15, 2024" },
      { label: "Ropeway Hardware & Steel Cables Sourced", status: "completed", date: "Aug 02, 2024" },
      { label: "Installation of Gravity Cable Transporters", status: "in-progress", date: "Aug 20, 2024" },
      { label: "Permanent Foot Suspension Bridge Construction", status: "upcoming", date: "Nov 2024" }
    ],
    verifiedReports: [
      {
        date: "5 days ago",
        headline: "Gravity Cable Line #3 Operational Across Sutlej Tributary",
        agency: "Himalayan Mountain Rescue Taskforce",
        hash: "0x98FE...0234",
        description: "Successfully carried 85 emergency ration boxes and insulin supplies across the 240-meter gorge directly into isolated Samej Hamlet."
      }
    ]
  },
  {
    id: "chapter-4",
    title: "Dust Before Rain",
    cause: "Horn of Africa Drought Relief",
    location: "Turkana & Wajir County, Kenya",
    coords: "3.1167° N, 35.6000° E",
    grad: ["#3a1c0d", "#b5651d"],
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "Five consecutive rainy seasons failed.\nThe red earth cracked into a mosaic of dry bone.",
      "Amina lost her entire herd of goats,\nthe only bank account her family ever owned.",
      "Villages now depend on solar-drilled boreholes\nthat dig hundreds of meters deep into ancient aquifers.",
      "A single well brings life back to pastoralist herds\nand keeps children in local schools."
    ],
    ai: "Weave an uplifting narrative of community resilience.",
    tags: ["drought", "Kenya", "livestock", "food security"],
    goal: 60000,
    raised: 41000,
    stats: [
      { n: "12,000", l: "livestock saved" },
      { n: "18", l: "deep solar boreholes" },
      { n: "9,500", l: "people served" }
    ],
    tiers: [
      "$5 supplies emergency hydration salts.",
      "$10 provides emergency fodder for livestock.",
      "$25 helps maintain solar-powered deepwater boreholes."
    ],
    checkpoints: [
      { label: "Hydrogeological Deep Aquifer Survey", status: "completed", date: "Mar 10, 2024" },
      { label: "75% Solar Pumping Stations Procured", status: "completed", date: "May 18, 2024" },
      { label: "Drilling & Solar Well Fitting (Boreholes 1-12)", status: "completed", date: "Jul 22, 2024" },
      { label: "Pastoralist Trough & Livestock Feeder Stations", status: "in-progress", date: "Sep 2024" }
    ],
    verifiedReports: [
      {
        date: "1 week ago",
        headline: "Deep Borehole #14 Drilled & Solar Pump Activated in Turkana",
        agency: "Oasis Pastoralist Trust & PayTales Donor Circle",
        hash: "0x55AA...8910",
        description: "Reaching 180 meters down into subterranean sandstone, water output measured at 42,000 liters/hour, supplying 2,300 nomads and their herds."
      }
    ]
  },
  {
    id: "chapter-5",
    title: "When the Earth Shivered at Noon",
    cause: "Afghan Rural Earthquake Relief",
    location: "Zenda Jan District, Herat, Afghanistan",
    coords: "34.3419° N, 61.7454° E",
    grad: ["#2d1b14", "#8b4513"],
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "In Zenda Jan, thousands of mud-brick homes collapsed in thirty seconds.\nEntire villages were turned to dust before afternoon prayer.",
      "Families are sleeping in open fields as sub-zero mountain winds arrive.\nSurvivors dig through rubble using bare hands.",
      "Emergency winterized tents provide insulated shelter\nand keep children warm through freezing desert nights.",
      "A single winter survival kit protects a vulnerable family\nuntil permanent homes can be built."
    ],
    ai: "Weave a story of courage and winter survival.",
    tags: ["earthquake", "Afghanistan", "shelter", "winter survival"],
    goal: 50000,
    raised: 33400,
    stats: [
      { n: "1,500+", l: "winter tents pitched" },
      { n: "4,200", l: "thermal blankets" },
      { n: "28", l: "community wells restored" }
    ],
    tiers: [
      "$5 buys two heavy thermal wool blankets.",
      "$10 provides a 1-month family emergency ration.",
      "$25 delivers a weatherproof winterized emergency shelter tent."
    ],
    checkpoints: [
      { label: "Emergency Field Clearing & Survivor Registry", status: "completed", date: "Oct 12, 2023" },
      { label: "Winter Tent Shipments Received at Herat Hub", status: "completed", date: "Nov 04, 2023" },
      { label: "Sub-Zero Thermal Insulation Distribution", status: "completed", date: "Jan 15, 2024" },
      { label: "Earthquake-Resistant Stone Foundation Construction", status: "in-progress", date: "May 2024" }
    ],
    verifiedReports: [
      {
        date: "4 days ago",
        headline: "Winterized Tent Village Completed for 450 Displaced Families",
        agency: "Herat Humanitarian Shelter Alliance",
        hash: "0x77EE...3398",
        description: "Double-walled thermal canvas tents with insulated sub-floor pallets successfully erected. Heavy stoves and coal briquettes delivered before cold snap."
      }
    ]
  },
  {
    id: "chapter-6",
    title: "The Mountain That Came Down",
    cause: "Rural Vietnam Typhoon Relief",
    location: "Lang Nu, Lao Cai Province, Vietnam",
    coords: "22.3364° N, 104.1481° E",
    grad: ["#0f3022", "#2d6a4f"],
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "When Typhoon Yagi swept across Lao Cai,\nthe mountainside dissolved into a fast-moving torrent of mud.",
      "Lang Nu village was erased in minutes.\nFields of terraced rice were buried beneath meters of heavy clay.",
      "Farmers who lost their harvests now row small bamboo rafts\nto drop emergency supplies off to cut-off hilltop hamlets.",
      "Clean water purification systems and dry food packs\nreach isolated families who lost every crop."
    ],
    ai: "Highlight community resilience in mountain farming villages.",
    tags: ["typhoon", "landslide", "Vietnam", "emergency food"],
    goal: 38000,
    raised: 19200,
    stats: [
      { n: "950", l: "families fed" },
      { n: "14", l: "footbridges rebuilt" },
      { n: "3,000", l: "water purification units" }
    ],
    tiers: [
      "$5 buys a water filter kit for mountain homes.",
      "$10 provides 20kg of emergency rice and dried fish.",
      "$25 helps rebuild collapsed agricultural footbridges."
    ],
    checkpoints: [
      { label: "Typhoon Impact Assessment & Debris Clearing", status: "completed", date: "Sep 15, 2024" },
      { label: "Emergency Food Flotillas Deployed", status: "completed", date: "Sep 22, 2024" },
      { label: "Bamboo & Steel Cable Bridge Restorations", status: "in-progress", date: "Oct 10, 2024" },
      { label: "Rice Terrace Silt Dredging & Reseeding", status: "upcoming", date: "Dec 2024" }
    ],
    verifiedReports: [
      {
        date: "6 days ago",
        headline: "Footbridge #4 Restored Connecting Upper Lang Nu to Market",
        agency: "Northern Highlands Rural Relief",
        hash: "0x22DC...7112",
        description: "Local youth engineers replaced washed-out bamboo spans with galvanized steel wire ropes, allowing motorbikes and emergency medical deliveries to pass safely."
      }
    ]
  },
  {
    id: "chapter-7",
    title: "The Empty Bowl of Baidoa",
    cause: "Somalia Child Malnutrition Emergency",
    location: "Baidoa IDP Settlement, Bay Region, Somalia",
    coords: "3.1138° N, 43.6498° E",
    grad: ["#2d1a0e", "#8b4e28"],
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "In the camps outside Baidoa, mothers wait under acacia shade\ncarrying children whose weight drops week by week.",
      "Five failed rainy seasons dried up the sorghum fields\nand left pastoralist families without a single goat.",
      "At the mobile health clinic, nurses measure upper-arm bands\nthat slip straight into the red zone of severe acute malnutrition.",
      "Ready-to-use therapeutic food sachets deliver 500 calories of nutrients\nthat pull a child back from critical weakness in 6 weeks."
    ],
    ai: "Highlight mobile health clinics in rural camps.",
    tags: ["malnutrition", "Somalia", "RUTF", "Horn of Africa"],
    goal: 50000,
    raised: 28400,
    stats: [
      { n: "3,200", l: "children in active recovery" },
      { n: "1,500", l: "RUTF therapeutic food cartons" },
      { n: "24", l: "mobile nutrition teams" }
    ],
    tiers: [
      "$5 buys a 1-week supply of RUTF therapeutic peanut paste packets.",
      "$10 funds high-energy milk formula and medical screening.",
      "$25 equips a mobile clinic worker with diagnostic tools."
    ],
    checkpoints: [
      { label: "MUAC Screening Registry for 5,000 Children", status: "completed", date: "Feb 10, 2024" },
      { label: "1,500 Cartons of Plumpy'Nut (RUTF) Airlifted", status: "completed", date: "Apr 04, 2024" },
      { label: "Outpatient Therapeutic Program Expansion", status: "in-progress", date: "Jul 18, 2024" },
      { label: "Maternal Nutrition Education & Clean Kitchens", status: "upcoming", date: "Nov 2024" }
    ],
    verifiedReports: [
      {
        date: "2 days ago",
        headline: "450 Children Discharged from Red to Green Nutrition Band",
        agency: "Baidoa Maternal Health Network",
        hash: "0x8891...44CA",
        description: "Mobile nurse squads completed weekly rounds across Sector B camps. Zero relapse recorded among children on the 6-week intensive RUTF regimen."
      }
    ]
  },
  {
    id: "chapter-8",
    title: "The School That Floated Away",
    cause: "Rural Assam Flood Education & Relief",
    location: "Majuli Island, Brahmaputra Basin, Assam",
    coords: "26.9606° N, 94.2185° E",
    grad: ["#0b3954", "#2a9d8f"],
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "Every monsoon, the Brahmaputra river rises above its banks\nand turns the valley into a vast sea of brown water.",
      "This year, the current swept away the village school's bamboo walls\nand drowned the local textbook library.",
      "Children now row small bamboo rafts to class,\nwriting their lessons on whatever dry wood they can salvage.",
      "Solar-powered boat classrooms now pick children up directly\nfrom their flooded doorsteps to keep school going."
    ],
    ai: "Dedicate a floating classroom supply kit.",
    tags: ["Assam", "flood relief", "education", "boat schools"],
    goal: 30000,
    raised: 15400,
    stats: [
      { n: "1,400", l: "children keeping up with school" },
      { n: "16", l: "solar boat classrooms" },
      { n: "100%", l: "flood attendance" }
    ],
    tiers: [
      "$5 provides water-resistant school bags and books.",
      "$10 buys solar fuel and battery power for one school boat trip.",
      "$25 maintains a solar workstation on a boat classroom for one month."
    ],
    checkpoints: [
      { label: "Wooden Hull Construction & Water-Sealing", status: "completed", date: "Apr 28, 2024" },
      { label: "Solar Roof Panels & Tablet Stations Fitted", status: "completed", date: "May 30, 2024" },
      { label: "Floating Library & Science Desk Stocked", status: "in-progress", date: "Jul 15, 2024" },
      { label: "Dry Season Community Maintenance Cooperative", status: "upcoming", date: "Nov 2024" }
    ],
    verifiedReports: [
      {
        date: "Yesterday",
        headline: "Boat School #4 Commences Daily River Route in Majuli",
        agency: "Brahmaputra River Education Mission",
        hash: "0x3344...9090",
        description: "Carrying 35 students per morning shift, equipped with battery-backed LED study lamps, digital tablets, and life vests donated by PayTales contributors."
      }
    ]
  },
  {
    id: "chapter-9",
    title: "The Classroom on the River",
    cause: "Bangladesh Climate-Resilient Education",
    location: "Chalan Beel, Natore & Pabna, Bangladesh",
    coords: "24.3636° N, 89.2319° E",
    grad: ["#0b2b30", "#2a7b88"],
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "During the five-month flood season in the wetlands,\nroads disappear completely and land-based schools submerge.",
      "Instead of staying home, children gather along riverbanks\nwaiting for custom wooden boat schools to dock.",
      "Fitted with solar panels, laptop stations, and flood-proof books,\nthese floating classrooms bring teachers straight to the children.",
      "Learning on the water keeps kids safe from drowning hazards\nwhile keeping their education on track."
    ],
    ai: "Tell us a location to route a floating school boat.",
    tags: ["climate resilience", "education", "Bangladesh"],
    goal: 42000,
    raised: 29800,
    stats: [
      { n: "2,100", l: "children reading" },
      { n: "26", l: "solar floating classrooms" },
      { n: "100%", l: "retention rate" }
    ],
    tiers: [
      "$5 funds water-resistant school bags and books.",
      "$10 buys solar fuel for one school boat trip.",
      "$25 maintains a solar workstation for one month."
    ],
    checkpoints: [
      { label: "Monsoon Boat Fleet Retrofit Completed", status: "completed", date: "May 10, 2024" },
      { label: "Broadband Wi-Fi Receiver Antennas Mounted", status: "completed", date: "Jun 20, 2024" },
      { label: "Floating Science Laboratory Pilot Launched", status: "in-progress", date: "Aug 02, 2024" },
      { label: "End-of-Year Regional Wetland Academic Fair", status: "upcoming", date: "Dec 2024" }
    ],
    verifiedReports: [
      {
        date: "3 days ago",
        headline: "Satellite Wi-Fi Node Activated on Chalan Beel Fleet",
        agency: "Wetland Innovations Initiative",
        hash: "0x66B1...1200",
        description: "Students in 4 submerged villages accessed interactive mathematics and climate science modules without interruption during peak high tide."
      }
    ]
  },
  {
    id: "chapter-10",
    title: "The Van That Arrived Before Dawn",
    cause: "Remote Maternal & Infant Health Care",
    location: "Cachar Tea Gardens, Silchar, Assam",
    coords: "24.8333° N, 92.7789° E",
    grad: ["#1e2d24", "#4a7c59"],
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      "Deep inside remote tea gardens, medical clinics are miles away\nacross unpaved tracks and flooded stream beds.",
      "Pregnant mothers often missed critical prenatal checkups,\nfacing dangerous risks during emergency deliveries at home.",
      "Mobile health vans equipped with solar power, portable diagnostic equipment,\nand trained midwives now travel to isolated hamlets.",
      "A single checkup in a mobile van ensures a safe delivery\nand protects both mother and newborn from preventable harm."
    ],
    ai: "Dedicate an emergency safe-delivery kit in a mother's name.",
    tags: ["maternal health", "Assam", "healthcare access"],
    goal: 35000,
    raised: 21400,
    stats: [
      { n: "1,200+", l: "safe deliveries facilitated" },
      { n: "3,400", l: "prenatal health checkups" },
      { n: "14", l: "mobile health vans active" }
    ],
    tiers: [
      "$5 buys prenatal iron-folic supplements.",
      "$10 funds a portable medical diagnostic kit.",
      "$25 sponsors complete prenatal care for one mother."
    ],
    checkpoints: [
      { label: "Van Retrofit with Solar Cold-Chain Fridges", status: "completed", date: "Jan 12, 2024" },
      { label: "Portable Ultrasound Scanners Procured", status: "completed", date: "Mar 19, 2024" },
      { label: "Weekly Clinical Routing Across 35 Tea Estates", status: "in-progress", date: "May 25, 2024" },
      { label: "Community Emergency Delivery Tele-Link Station", status: "upcoming", date: "Oct 2024" }
    ],
    verifiedReports: [
      {
        date: "5 days ago",
        headline: "Mobile Van Unit #9 Conducted 42 High-Risk Screenings",
        agency: "Tea Garden Health Vanguard",
        hash: "0x44FE...5521",
        description: "Detected early pre-eclampsia in 3 mothers and successfully transferred them to the regional tertiary hospital, avoiding critical complications."
      }
    ]
  }
];

export const APP_CONFIG = {
  appName: "PayTales",
  tagline: "Turn a story into real impact",
  subTagline: "Story-Driven Micro-Donation Platform for Rural Tragedies & Climate Disasters",
  version: "2.4.0",
  firebaseTimeoutMs: 6000
};
