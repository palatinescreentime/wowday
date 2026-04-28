import { useState, useEffect, useRef, useCallback } from "react";

// 25002500 Mobile detection hook 25002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500
const useMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
};

// ── Logo helper ──────────────────────────────────────────────────────────────
const Logo = ({ domain, alt, size = 40, style = {} }) => {
  const [src, setSrc] = useState(`https://logo.clearbit.com/${domain}`);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setSrc(`https://logo.clearbit.com/${domain}`);
    setErr(false);
  }, [domain]);

  const handleError = () => {
    if (src.includes("clearbit")) {
      setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setErr(true);
    }
  };

  if (err) {
    const letter = (alt || domain || "?")[0].toUpperCase();
    return (
      <div style={{
        width: size, height: size, borderRadius: 8,
        background: "#1f70c1", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: size * 0.45, fontWeight: "bold",
        color: "white", flexShrink: 0, ...style,
      }}>{letter}</div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      style={{
        width: size, height: size, objectFit: "contain",
        borderRadius: 8, background: "white", padding: 4, ...style,
      }}
    />
  );
};


// ── Michigan SVG ─────────────────────────────────────────────────────────────
const MichiganGraphic = ({ accent }) => (
  <div style={{ flexShrink: 0, width: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <svg viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" style={{ width: 200, height: "auto", filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.5))" }}>
      {/* Lower Peninsula */}
      <path
        d="M 108,12 L 122,14 L 138,20 L 150,28 L 158,40 L 160,54
           L 168,62 L 174,76 L 178,92 L 180,110 L 178,128
           L 182,144 L 186,160 L 188,175 L 184,190
           L 176,204 L 164,216 L 150,224 L 134,230
           L 116,234 L 98,232 L 82,226 L 68,216
           L 58,204 L 52,190 L 48,174 L 46,158
           L 48,142 L 50,126 L 52,110 L 56,94
           L 60,78 L 62,62 L 60,48 L 66,36
           L 78,24 L 92,16 Z"
        fill={accent + "28"}
        stroke={accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Upper Peninsula */}
      <path
        d="M 48,118 L 38,112 L 24,106 L 12,102 L 8,94
           L 12,86 L 24,82 L 38,86 L 48,94 L 52,106 Z"
        fill={accent + "18"}
        stroke={accent}
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity="0.75"
      />
      {/* Lake Michigan suggestion */}
      <path
        d="M 48,100 Q 36,130 38,160 Q 40,185 52,200"
        fill="none"
        stroke={accent}
        strokeWidth="0.8"
        strokeDasharray="3,3"
        opacity="0.3"
      />
      {/* SW shore star — Stevensville area */}
      <g transform="translate(56, 198)">
        <circle cx="0" cy="0" r="12" fill={accent} opacity="0.18" />
        <circle cx="0" cy="0" r="6" fill={accent} opacity="0.35" />
        <polygon
          points="0,-9 2.1,-2.9 8.6,-2.9 3.5,1.1 5.3,7.6 0,3.8 -5.3,7.6 -3.5,1.1 -8.6,-2.9 -2.1,-2.9"
          fill={accent}
          stroke="white"
          strokeWidth="0.7"
        />
      </g>
    </svg>
    <div style={{
      color: accent, fontFamily: "monospace", fontSize: 11,
      letterSpacing: 2, textTransform: "uppercase", opacity: 0.8,
    }}>Michigan</div>
  </div>
);

// ── Travel map ────────────────────────────────────────────────────────────────
const TRAVEL_CITIES = [
  { name: "London",        lat: 51.5074,  lng:  -0.1278,  type: "intl" },
  { name: "Vevey",         lat: 46.4631,  lng:   6.8424,  type: "intl" },
  { name: "Tokyo",         lat: 35.6762,  lng: 139.6503,  type: "intl" },
  { name: "Hyderabad",     lat: 17.3850,  lng:  78.4867,  type: "intl" },
  { name: "Chennai",       lat: 13.0827,  lng:  80.2707,  type: "intl" },
  { name: "Bangalore",     lat: 12.9716,  lng:  77.5946,  type: "intl" },
  { name: "Munich",        lat: 48.1351,  lng:  11.5820,  type: "intl" },
  { name: "Dublin",        lat: 53.3498,  lng:  -6.2603,  type: "intl" },
  { name: "Bordeaux",      lat: 44.8378,  lng:  -0.5792,  type: "intl" },
  { name: "Krakow",        lat: 50.0647,  lng:  19.9450,  type: "intl" },
  { name: "New York",      lat: 40.7128,  lng: -74.0060,  type: "us"   },
  { name: "W. Palm Beach", lat: 26.7153,  lng: -80.0534,  type: "us"   },
  { name: "Orlando",       lat: 28.5383,  lng: -81.3792,  type: "us"   },
  { name: "Atlanta",       lat: 33.7490,  lng: -84.3880,  type: "us"   },
  { name: "Dallas",        lat: 32.7767,  lng: -96.7970,  type: "us"   },
  { name: "St. Louis",     lat: 38.6270,  lng: -90.1994,  type: "us"   },
  { name: "Springfield",   lat: 37.2090,  lng: -93.2923,  type: "us"   },
  { name: "Oxford",        lat: 33.6143,  lng: -85.8347,  type: "us"   },
  { name: "Newberry",      lat: 34.2779,  lng: -81.6179,  type: "us"   },
  { name: "Chicago",       lat: 41.8781,  lng: -87.6298,  type: "us"   },
  { name: "Schaumburg",    lat: 42.0334,  lng: -88.0834,  type: "us"   },
  { name: "Urbana",        lat: 40.1106,  lng: -88.2073,  type: "us"   },
  { name: "Pittsburgh",    lat: 40.4406,  lng: -79.9959,  type: "us"   },
  { name: "Philadelphia",  lat: 39.9526,  lng: -75.1652,  type: "us"   },
  { name: "Tulare",        lat: 36.2077,  lng:-119.3473,  type: "us"   },
  { name: "San Francisco", lat: 37.7749,  lng:-122.4194,  type: "us"   },
  { name: "Issaquah",      lat: 47.5301,  lng:-122.0326,  type: "us"   },
  { name: "Seattle",       lat: 47.6062,  lng:-122.3321,  type: "us"   },
];

const US_COUNT = TRAVEL_CITIES.filter(c => c.type === "us").length;
const INTL_COUNT = TRAVEL_CITIES.filter(c => c.type === "intl").length;

const MapSlide = ({ accent }) => {
  const wrapRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapHeight, setMapHeight] = useState(320);

  // Measure available height after render
  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) {
        const h = wrapRef.current.getBoundingClientRect().height;
        if (h > 50) setMapHeight(h);
      }
    };
    measure();
    const t = setTimeout(measure, 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mapHeight) return;

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;

      const map = L.map(mapRef.current, {
        center: [28, 10],
        zoom: 2,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      TRAVEL_CITIES.forEach(city => {
        const color = city.type === "intl" ? "#e94560" : "#1f70c1";
        L.circleMarker([city.lat, city.lng], {
          radius: 8,
          fillColor: color,
          color: "white",
          weight: 1.5,
          fillOpacity: 0.9,
        }).addTo(map).bindTooltip(city.name, {
          permanent: false,
          direction: "top",
          className: "city-tooltip",
          offset: [0, -8],
        });
      });

      const legend = L.control({ position: "bottomleft" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div");
        div.style.cssText = "background:rgba(5,10,26,0.88);padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);font-family:monospace;font-size:12px;color:white;line-height:2;";
        div.innerHTML =
          "<div style=\"display:flex;align-items:center;gap:8px;\">" +
          "<div style=\"width:11px;height:11px;border-radius:50%;background:#1f70c1;flex-shrink:0;\"></div>" +
          "US Cities (" + US_COUNT + ")" +
          "</div>" +
          "<div style=\"display:flex;align-items:center;gap:8px;\">" +
          "<div style=\"width:11px;height:11px;border-radius:50%;background:#e94560;flex-shrink:0;\"></div>" +
          "International (" + INTL_COUNT + ")" +
          "</div>";
        return div;
      };
      legend.addTo(map);
      mapInstanceRef.current = map;
    };

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (window.L) {
      initMap();
    } else {
      const existing = document.getElementById("leaflet-js");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        existing.addEventListener("load", initMap);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapHeight]);

  return (
    <div ref={wrapRef} style={{ flex: 1, position: "relative", borderRadius: 12, overflow: "hidden", minHeight: 260 }}>
      <style>{".city-tooltip{background:#050a1a !important;color:white !important;border:1px solid rgba(255,255,255,0.25) !important;font-family:monospace !important;font-size:11px !important;padding:4px 10px !important;border-radius:5px !important;box-shadow:0 2px 8px rgba(0,0,0,0.5) !important;}.city-tooltip::before{display:none !important;}.leaflet-control-zoom a{background:#0a1628 !important;color:white !important;border-color:rgba(255,255,255,0.2) !important;}"}</style>
      <div ref={mapRef} style={{ width: "100%", height: mapHeight, minHeight: 260 }} />
    </div>
  );
};

// ── Slide data ───────────────────────────────────────────────────────────────
const slides = [
  {
    id: 0,
    type: "intro",
    year: "Plum Grove WOW Day",
    label: "Welcome",
    icon: "🎒",
    color: "#1a1a2e",
    accent: "#e94560",
    title: "Thank you",
    body: "Today I'll share an overview of the company I work for, what I actually do there every day, and how I got there.",
    stat: null,
    tag: null,
    logo: null,
  },
  {
    id: "ibm-overview",
    type: "ibm",
    year: "About IBM",
    label: "The Company",
    icon: "🏢",
    color: "#050a1a",
    accent: "#1f70c1",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "What Is IBM?",
    body: "IBM is one of the oldest and largest technology companies in the world — founded in 1911. Today it operates across three major divisions, each solving different problems for businesses worldwide.",
    pillars: [
      { icon: "💾", label: "Software", desc: "AI & automation tools businesses run on" },
      { icon: "🖥️", label: "Infrastructure", desc: "The hardware & cloud that powers enterprises" },
      { icon: "🤝", label: "Consulting", desc: "The people who make it all work — that's me" },
    ],
    stat: "~280,000 employees in 170+ countries",
    tag: "Founded 1911",
  },
  {
    id: "ibm-infra",
    type: "ibm",
    year: "IBM Infrastructure",
    label: "Division 1",
    icon: "🖥️",
    color: "#050a1a",
    accent: "#1f70c1",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "IBM Infrastructure:\nThe Muscle Behind the Curtain",
    body: "When a bank processes millions of transactions per second, or a hospital stores millions of patient records securely — IBM Infrastructure is often what makes that possible.",
    bullets: [
      "IBM Z (mainframes) — the most reliable computers ever built, used by 45 of the world's top 50 banks",
      "IBM Power Systems — high-performance servers for data-heavy industries",
      "IBM Storage — keeping critical data safe, fast, and always available",
      "Hybrid Cloud infrastructure connecting on-premise systems to the cloud",
      "🔬 IBM Research — one of the world's largest corporate research organizations, with 3,000+ researchers across 6 continents. Their discoveries feed directly into Infrastructure products and many Software innovations — from quantum computing to AI chips",
    ],
    stat: "~$15B annual revenue",
    tag: "Servers • Mainframes • Hybrid Cloud",
  },
  {
    id: "ibm-software",
    type: "ibm",
    year: "IBM Software",
    label: "Division 2",
    icon: "💾",
    color: "#050a1a",
    accent: "#1f70c1",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "IBM Software:\nThe Brains of the Operation",
    body: "IBM builds AI and automation software that companies embed directly into their operations — tools that think, learn, and automate tasks that used to require armies of people.",
    bullets: [
      "watsonx — IBM's AI platform for building enterprise AI models",
      "Red Hat — open-source software used to build cloud applications",
      "Automation tools that replace repetitive, manual business processes",
      "Data & security software protecting thousands of companies worldwide",
    ],
    stat: "~$25B annual revenue",
    tag: "AI • Cloud • Automation",
  },
  {
    id: "ibm-consulting-what",
    type: "ibm",
    year: "IBM Consulting",
    label: "Division 3 — Where I Work",
    icon: "🤝",
    color: "#0a1628",
    accent: "#e94560",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "IBM Consulting:\nWe Make It All Actually Work",
    body: "Having great software and infrastructure means nothing if a company doesn't know how to use it. That's where IBM Consulting comes in — we're the bridge between cutting-edge technology and real business results.",
    bullets: [
      "Strategy — helping executives decide WHAT to change and WHY",
      "Technology implementation — building and deploying AI, data, and cloud solutions",
      "Business transformation — redesigning how companies operate end-to-end",
      "Managed services — running and improving systems after they go live",
    ],
    stat: "$20B+ consulting revenue annually",
    tag: "~160,000 Consultants Worldwide",
  },
  {
    id: "ibm-consulting-deep",
    type: "ibm",
    year: "IBM Consulting",
    label: "What We Actually Do",
    icon: "📊",
    color: "#0a1628",
    accent: "#e94560",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "A Day in My Life\nas a Partner",
    body: "No two days are the same — that's what makes it exciting. Here's what I actually do:",
    bullets: [
      "Meet with clients to understand their biggest business challenges",
      "Lead a team of 20+ consultants across multiple client projects simultaneously",
      "Use AI and data analytics to find solutions worth millions in savings or revenue",
      "Solution, sell, and deliver services engagements to win for our clients and IBM",
    ],
    stat: "✈️  I work at my clients' offices — which means I travel frequently",
    tag: "Healthcare • Life Sciences • Consumer Goods",
  },
  {
    id: "ibm-travel",
    type: "map",
    year: "Work Travel",
    label: "Where the Job Takes Me",
    icon: "✈️",
    color: "#050a1a",
    accent: "#1f70c1",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "Consulting Takes You\nAround the World",
    body: "This is every city I've worked in as a consultant. When you solve problems for global companies, the office is wherever the client is.",
    stat: null,
    tag: null,
  },
  {
    id: "ibm-clients",
    type: "clients",
    year: "Client Work",
    label: "Real Companies. Real Impact.",
    icon: "🌍",
    color: "#0a1628",
    accent: "#e94560",
    title: "Companies I've\nHelped Transform",
    body: "From kitchen cabinets to cancer drugs — the problems are wildly different, but the approach is the same: find the data, find the insight, build the solution.",
    industries: [
      {
        label: "Consumer Goods & Food",
        icon: "🛒",
        clients: [
          { name: "Kraft Heinz",  note: "AI-powered supply chain & innovation scaling",         logo: "kraftheinzcompany.com" },
          { name: "Mondelez",     note: "Advanced analytics & managed services",                 logo: "mondelezinternational.com" },
          { name: "Nestlé",       note: "Data & digital transformation",                         logo: "nestle.com" },
          { name: "PFG",          note: "Performance Food Group — operations & analytics",       logo: "pfgc.com" },
        ],
      },
      {
        label: "Beauty & Luxury",
        icon: "✨",
        clients: [
          { name: "Estée Lauder", note: "Scaling innovation across global markets",  logo: "elcompanies.com" },
          { name: "L'Oréal",      note: "Data & digital transformation",              logo: "loreal.com" },
          { name: "Chanel",       note: "Luxury brand analytics & strategy",          logo: "chanel.com" },
        ],
      },
      {
        label: "Pharma & Life Sciences",
        icon: "💊",
        clients: [
          { name: "Pfizer",       note: "Data platforms & AI model deployment",                  logo: "pfizer.com" },
          { name: "Mylan",        note: "HR & compliance transformation",                        logo: "viatris.com" },
          { name: "Abbott",       note: "Life sciences analytics",                               logo: "abbott.com" },
          { name: "GSK",          note: "NLP & sales rep AI scoring",                            logo: "gsk.com" },
        ],
      },
      {
        label: "Healthcare Systems",
        icon: "🏥",
        clients: [
          { name: "National Health Service", note: "UK's public health system — one of the largest employers on earth", logo: "nhs.uk" },
        ],
      },
    ],
    stat: null,
    tag: null,
  },
  {
    id: "ibm-hierarchy",
    type: "hierarchy",
    year: "The Career Ladder",
    label: "IBM Consulting",
    icon: "📈",
    color: "#0a1628",
    accent: "#00d4aa",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "How You Climb\nthe Consulting Ladder",
    levels: [
      { title: "Consultant",           years: "0–3 yrs",   desc: "Execute project work, build technical skills, learn the business",          me: false },
      { title: "Senior Consultant",    years: "3–6 yrs",   desc: "Lead workstreams, mentor junior staff, client-facing delivery",             me: false },
      { title: "Managing Consultant",  years: "6–9 yrs",   desc: "Manage full project teams, own client relationships day-to-day",            me: false },
      { title: "Associate Partner",    years: "9–13 yrs",  desc: "Lead large engagements, start selling work, build a practice",              me: false },
      { title: "Partner",              years: "13–20 yrs", desc: "Own accounts worth $6M–$20M+, set strategy, grow the business",             me: true  },
      { title: "Senior Partner",       years: "20+ yrs",   desc: "Industry-level leadership, multi-account responsibility, IBM's top tier",   me: false },
    ],
    stat: null,
    tag: "Where I Started → Where I Am",
  },
  {
    id: 1,
    type: "milestone",
    year: "2003",
    label: "Purdue University",
    icon: "🎓",
    color: "#0f3460",
    accent: "#cfb991",
    logo: "purdue.edu",
    logoAlt: "Purdue University",
    title: "College: B.S. in Economics",
    body: "I studied Economics at Purdue University. I learned how businesses work, how money flows, and how decisions get made — skills I use every single day.",
    stat: "4 years of study",
    tag: "West Lafayette, IN",
  },
  {
    id: 2,
    type: "milestone",
    year: "2003–2006",
    label: "Steak 'n Shake",
    icon: "🍔",
    color: "#16213e",
    accent: "#e94560",
    logo: "steaknshake.com",
    logoAlt: "Steak 'n Shake",
    title: "My First Real Job:\nGeneral Manager",
    body: "I ran an entire restaurant — managing schedules, budgets, and teams. I learned leadership by doing it, not just reading about it.",
    stat: "Managed full restaurant operations",
    tag: "General Manager",
  },
  {
    id: 3,
    type: "milestone",
    year: "2006–2009",
    label: "Steak 'n Shake",
    icon: "📋",
    color: "#1a1a2e",
    accent: "#00b4d8",
    logo: "steaknshake.com",
    logoAlt: "Steak 'n Shake",
    title: "Level Up: Regional\nHR Manager",
    body: "I moved from managing one restaurant to overseeing people across an entire region. I discovered I loved figuring out how to help people grow in their careers.",
    stat: "Multi-location leadership",
    tag: "HR & People",
  },
  {
    id: 4,
    type: "milestone",
    year: "2010",
    label: "University of Notre Dame",
    icon: "🏆",
    color: "#0c2340",
    accent: "#c99700",
    logo: "nd.edu",
    logoAlt: "University of Notre Dame",
    title: "MBA from Notre Dame",
    body: "I went back to school to specialize in Analytics and Corporate Finance. The world was changing fast — data was becoming everything — and I wanted to lead that change.",
    stat: "Analytics & Corporate Finance",
    tag: "Graduate School",
  },
  {
    id: 5,
    type: "milestone",
    year: "2010–2020",
    label: "IBM Consulting",
    icon: "💡",
    color: "#16213e",
    accent: "#f5a623",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "IBM: Senior Consultant\n& Associate Partner",
    body: "I worked with some of the world's biggest companies — Kraft Heinz, Estée Lauder, Eli Lilly — helping them use AI and data to solve massive business problems.",
    stat: "$6M–$20M annual accounts",
    tag: "10 Years at IBM",
  },
  {
    id: 6,
    type: "milestone",
    year: "2021–Now",
    label: "IBM Consulting",
    icon: "🚀",
    color: "#1a1a2e",
    accent: "#e94560",
    logo: "ibm.com",
    logoAlt: "IBM",
    title: "Partner at IBM",
    body: "Today I lead a team of 20+ consultants and mentor the next generation of business leaders. I help Fortune 500 companies transform using cutting-edge technology.",
    stat: "$230M+ team target",
    tag: "Partner",
  },
  {
    id: 7,
    type: "lessons",
    year: "The Lessons",
    label: "What I Learned",
    icon: "✨",
    color: "#0f3460",
    accent: "#00d4aa",
    logo: null,
    title: "What I'd Tell\nMiddle School Me",
    body: null,
    bullets: [
      "Intelligence isn't fixed — it grows with effort, curiosity, and experience.",
      "Have strong opinions, hold them loosely.",
      "Perception is relative.",
      "Technology has been democratized — the opportunity in front of you is unlike any generation before.",
      "I've never regretted being nice.",
    ],
    stat: null,
    tag: null,
  },
  {
    id: 8,
    type: "questions",
    year: "Your Turn",
    label: "Q&A",
    icon: "🙋",
    color: "#16213e",
    accent: "#f5a623",
    logo: null,
    title: "What Questions\nDo You Have?",
    body: null,
    stat: null,
    tag: "Let's Talk",
  },
];

const totalSlides = slides.length;


export default function CareerTimeline() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mobile = useMobile();
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const containerRef = useRef(null);

  const goTo = useCallback((index, dir = "forward") => {
    if (animating || index < 0 || index >= totalSlides) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => { setCurrent(index); setAnimating(false); }, 300);
  }, [animating]);

  const next = useCallback(() => goTo(current + 1, "forward"), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, "back"), [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  // Touch / swipe support
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only register horizontal swipes that are more horizontal than vertical
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Fullscreen API
  const toggleFullscreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  };
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  const slide = slides[current];
  const pad = mobile ? "16px 18px" : "30px 60px";
  const topPad = mobile ? "12px 18px" : "18px 40px";

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        fontFamily: "'Georgia', serif",
        background: slide.color,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.6s ease",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 80% 20%, ${slide.accent}22 0%, transparent 50%),
                          radial-gradient(circle at 10% 80%, ${slide.accent}15 0%, transparent 40%)`,
        transition: "all 0.6s ease",
      }} />

      {/* Top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: topPad, borderBottom: `1px solid ${slide.accent}33`,
        position: "relative", zIndex: 2, flexShrink: 0,
      }}>
        {/* Dot progress — hide on very small screens */}
        {!mobile && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => goTo(i, i > current ? "forward" : "back")}
                style={{
                  width: i === current ? 28 : 8, height: 8, borderRadius: 4,
                  background: i === current ? slide.accent : `${slide.accent}44`,
                  transition: "all 0.4s ease", cursor: "pointer",
                }} />
            ))}
          </div>
        )}
        {mobile && (
          <span style={{ color: `${slide.accent}cc`, fontSize: 11, fontFamily: "monospace", fontWeight: "bold" }}>
            {current + 1} / {totalSlides}
          </span>
        )}

        {/* Logo + counter + fullscreen button */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
          {slide.logo && (
            <Logo domain={slide.logo} alt={slide.logoAlt || ""} size={mobile ? 28 : 38}
              style={{ borderRadius: 8, padding: 4, boxShadow: `0 0 0 1px ${slide.accent}33` }} />
          )}
          {!mobile && (
            <span style={{
              color: `${slide.accent}cc`, fontSize: 13, letterSpacing: 2,
              fontFamily: "monospace", fontWeight: "bold",
            }}>{current + 1} / {totalSlides}</span>
          )}
          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen (F)" : "Go fullscreen (F)"}
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: `1px solid ${slide.accent}55`,
              background: `${slide.accent}18`,
              color: "white", fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {isFullscreen ? "⛶" : "⛶"}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "block" }}>
              {isFullscreen
                ? <path d="M5 1H1v4M9 1h4v4M5 13H1V9M9 13h4V9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                : <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: pad, position: "relative", zIndex: 2,
        opacity: animating ? 0 : 1,
        transform: animating ? (direction === "forward" ? "translateX(30px)" : "translateX(-30px)") : "translateX(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        overflowY: slide.type === "map" ? "hidden" : "auto",
      }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: `${slide.accent}22`, border: `1px solid ${slide.accent}55`,
          borderRadius: 30, padding: mobile ? "5px 12px" : "8px 20px",
          marginBottom: mobile ? 14 : 26, width: "fit-content",
        }}>
          <span style={{ fontSize: mobile ? 14 : 17 }}>{slide.icon}</span>
          <span style={{
            color: slide.accent, fontSize: mobile ? 9 : 12, letterSpacing: 2,
            fontFamily: "monospace", fontWeight: "bold", textTransform: "uppercase",
          }}>{slide.year}</span>
          {slide.tag && !mobile && <>
            <span style={{ color: `${slide.accent}55`, fontSize: 11 }}>•</span>
            <span style={{ color: `${slide.accent}aa`, fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>{slide.tag}</span>
          </>}
        </div>

        {/* Title + large logo */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: mobile ? 12 : 22 }}>
          <h1 style={{
            color: "white",
            fontSize: mobile ? "clamp(22px, 6vw, 36px)" : "clamp(26px, 4vw, 54px)",
            fontWeight: 700, lineHeight: 1.15, margin: 0,
            whiteSpace: "pre-line", flex: 1,
          }}>{slide.title}</h1>
          {slide.logo && slide.type === "milestone" && !mobile && (
            <div style={{
              background: "white", borderRadius: 16, padding: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: `0 4px 24px ${slide.accent}30`,
              width: 80, height: 80,
            }}>
              <Logo domain={slide.logo} alt={slide.logoAlt || ""} size={62}
                style={{ background: "transparent", padding: 0, borderRadius: 0 }} />
            </div>
          )}
          {slide.type === "intro" && !mobile && (
            <MichiganGraphic accent={slide.accent} />
          )}

        </div>

        {/* Body */}
        {slide.body && (
          <p style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: mobile ? "clamp(12px, 3.5vw, 15px)" : "clamp(14px, 1.6vw, 19px)",
            lineHeight: 1.7, maxWidth: 680, margin: `0 0 ${mobile ? 14 : 22}px 0`,
          }}>{slide.body}</p>
        )}

        {/* Pillars */}
        {slide.pillars && (
          <div style={{ display: "flex", gap: 10, marginBottom: mobile ? 14 : 22, flexWrap: "wrap" }}>
            {slide.pillars.map((p, i) => (
              <div key={i} style={{
                background: `${slide.accent}15`, border: `1px solid ${slide.accent}40`,
                borderRadius: 12, padding: mobile ? "10px 12px" : "15px 18px",
                flex: "1 1 120px", minWidth: 100,
              }}>
                <div style={{ fontSize: mobile ? 18 : 24, marginBottom: 5 }}>{p.icon}</div>
                <div style={{ color: slide.accent, fontWeight: "bold", fontSize: mobile ? 11 : 14, marginBottom: 3, fontFamily: "monospace", letterSpacing: 1 }}>{p.label}</div>
                <div style={{ color: "rgba(255,255,255,0.58)", fontSize: mobile ? 10 : 12, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Travel map */}
        {slide.type === "map" && (
          <MapSlide accent={slide.accent} />
        )}

        {/* Client industries */}
        {slide.industries && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: mobile ? 12 : 18 }}>
            {slide.industries.map((ind, i) => (
              <div key={i} style={{
                flex: mobile ? "1 1 140px" : "1 1 185px",
                background: `${slide.accent}0e`,
                border: `1px solid ${slide.accent}35`, borderRadius: 12, padding: mobile ? "10px 11px" : "13px 15px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
                  paddingBottom: 6, borderBottom: `1px solid ${slide.accent}25` }}>
                  <span style={{ fontSize: 12 }}>{ind.icon}</span>
                  <span style={{
                    color: slide.accent, fontSize: 8, fontFamily: "monospace",
                    fontWeight: "bold", letterSpacing: 1.2, textTransform: "uppercase",
                  }}>{ind.label}</span>
                </div>
                {ind.clients.map((c, j) => (
                  <div key={j} style={{ marginBottom: 7, display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{
                      width: mobile ? 26 : 34, height: mobile ? 26 : 34,
                      borderRadius: 6, background: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}>
                      <Logo domain={c.logo} alt={c.name} size={mobile ? 20 : 28}
                        style={{ background: "transparent", padding: 0, borderRadius: 0 }} />
                    </div>
                    <div>
                      <div style={{ color: "white", fontSize: mobile ? 10 : 12, fontWeight: "bold", marginBottom: 1 }}>{c.name}</div>
                      {!mobile && <div style={{ color: "rgba(255,255,255,0.42)", fontSize: 10, lineHeight: 1.35 }}>{c.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Bullets */}
        {slide.bullets && (
          <ul style={{ padding: 0, margin: `0 0 ${mobile ? 14 : 22}px 0`, listStyle: "none", maxWidth: 680 }}>
            {slide.bullets.map((b, i) => (
              <li key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start", marginBottom: mobile ? 8 : 11,
                color: "rgba(255,255,255,0.82)",
                fontSize: mobile ? "clamp(11px, 3vw, 14px)" : "clamp(13px, 1.5vw, 17px)",
                lineHeight: 1.5,
              }}>
                <span style={{ color: slide.accent, fontSize: mobile ? 13 : 16, marginTop: 2, flexShrink: 0 }}>→</span>
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Hierarchy ladder */}
        {slide.levels && (
          <div style={{ display: "flex", gap: 0, alignItems: "stretch", flexWrap: mobile ? "wrap" : "nowrap", marginBottom: mobile ? 12 : 18 }}>
            {slide.levels.map((lv, i) => (
              <div key={i} style={{
                flex: mobile ? "1 1 44%" : "1 1 110px",
                minWidth: mobile ? "44%" : 95,
                background: lv.me ? `${slide.accent}28` : `${slide.accent}0d`,
                border: lv.me ? `2px solid ${slide.accent}` : `1px solid ${slide.accent}30`,
                borderRadius: 10, margin: mobile ? "6px 3px" : "0 4px",
                padding: mobile ? "10px 8px" : "13px 10px", position: "relative",
              }}>
                {lv.me && (
                  <div style={{
                    position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                    background: slide.accent, color: "#050a1a", fontSize: 8,
                    fontFamily: "monospace", fontWeight: "bold", letterSpacing: 1,
                    padding: "2px 7px", borderRadius: 8, whiteSpace: "nowrap",
                  }}>← ME</div>
                )}
                <div style={{
                  width: mobile ? 20 : 24, height: mobile ? 20 : 24, borderRadius: "50%",
                  background: lv.me ? slide.accent : `${slide.accent}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: "bold",
                  color: lv.me ? "#050a1a" : slide.accent,
                  marginBottom: 5, fontFamily: "monospace",
                }}>{i + 1}</div>
                <div style={{ color: lv.me ? slide.accent : "white", fontSize: mobile ? 10 : 11, fontWeight: "bold", marginBottom: 2, lineHeight: 1.3 }}>{lv.title}</div>
                <div style={{ color: `${slide.accent}cc`, fontSize: 8, fontFamily: "monospace", marginBottom: 3, letterSpacing: 0.5 }}>{lv.years}</div>
                {!mobile && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, lineHeight: 1.4 }}>{lv.desc}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Stat */}
        {slide.stat && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `${slide.accent}18`, border: `1px solid ${slide.accent}44`,
            borderRadius: 10, padding: mobile ? "8px 14px" : "11px 20px", width: "fit-content",
          }}>
            <div style={{ width: 3, height: mobile ? 20 : 26, background: slide.accent, borderRadius: 2 }} />
            <span style={{ color: slide.accent, fontFamily: "monospace", fontSize: mobile ? 11 : 13, fontWeight: "bold", letterSpacing: 1 }}>
              {slide.stat}
            </span>
          </div>
        )}
      </div>

      {/* Timeline strip — hide on mobile */}
      {!mobile && (
        <div style={{
          padding: "11px 40px", borderTop: `1px solid ${slide.accent}22`,
          display: "flex", alignItems: "center", overflowX: "auto",
          position: "relative", zIndex: 2, flexShrink: 0,
        }}>
          {slides.map((s, i) => (
            <div key={i} onClick={() => goTo(i, i > current ? "forward" : "back")}
              style={{ display: "flex", alignItems: "center", cursor: "pointer", opacity: i === current ? 1 : 0.38, transition: "opacity 0.3s", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 9px" }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i === current ? slide.accent : "rgba(255,255,255,0.32)",
                  transition: "background 0.3s",
                }} />
                <span style={{
                  color: i === current ? slide.accent : "rgba(255,255,255,0.4)",
                  fontSize: 8, marginTop: 3, fontFamily: "monospace", letterSpacing: 0.5,
                  textAlign: "center", maxWidth: 52, lineHeight: 1.2,
                }}>{s.year}</span>
              </div>
              {i < totalSlides - 1 && <div style={{ width: 22, height: 1, background: "rgba(255,255,255,0.15)" }} />}
            </div>
          ))}
        </div>
      )}

      {/* Mobile bottom nav bar */}
      {mobile && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 20px", borderTop: `1px solid ${slide.accent}22`,
          position: "relative", zIndex: 2, flexShrink: 0,
          background: `${slide.color}ee`,
        }}>
          <button onClick={prev} disabled={current === 0} style={{
            width: 44, height: 44, borderRadius: "50%",
            border: `1px solid ${slide.accent}55`, background: `${slide.accent}18`,
            color: current === 0 ? "rgba(255,255,255,0.2)" : "white",
            fontSize: 20, cursor: current === 0 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>←</button>

          {/* Mobile dot indicators */}
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => goTo(i, i > current ? "forward" : "back")}
                style={{
                  width: i === current ? 18 : 6, height: 6, borderRadius: 3,
                  background: i === current ? slide.accent : `${slide.accent}44`,
                  transition: "all 0.3s", cursor: "pointer",
                }} />
            ))}
          </div>

          <button onClick={next} disabled={current === totalSlides - 1} style={{
            width: 44, height: 44, borderRadius: "50%",
            border: `1px solid ${slide.accent}`, background: slide.accent, color: "white",
            fontSize: 20, cursor: current === totalSlides - 1 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: current === totalSlides - 1 ? 0.4 : 1,
          }}>→</button>
        </div>
      )}

      {/* Desktop nav buttons */}
      {!mobile && (
        <div style={{ position: "fixed", bottom: 68, right: 34, display: "flex", gap: 11, zIndex: 10 }}>
          <button onClick={prev} disabled={current === 0} style={{
            width: 44, height: 44, borderRadius: "50%",
            border: `1px solid ${slide.accent}55`, background: `${slide.accent}18`,
            color: current === 0 ? "rgba(255,255,255,0.2)" : "white",
            fontSize: 18, cursor: current === 0 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
          }}>←</button>
          <button onClick={next} disabled={current === totalSlides - 1} style={{
            width: 44, height: 44, borderRadius: "50%",
            border: `1px solid ${slide.accent}`, background: slide.accent, color: "white",
            fontSize: 18, cursor: current === totalSlides - 1 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
            opacity: current === totalSlides - 1 ? 0.4 : 1,
          }}>→</button>
        </div>
      )}

      {current === 0 && !mobile && (
        <div style={{
          position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace",
          letterSpacing: 1, zIndex: 10,
        }}>Press → or Space to advance • F for fullscreen</div>
      )}
      {current === 0 && mobile && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, 120px)",
          color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace",
          letterSpacing: 1, zIndex: 10, whiteSpace: "nowrap",
        }}>Swipe to navigate</div>
      )}
    </div>
  );
}
