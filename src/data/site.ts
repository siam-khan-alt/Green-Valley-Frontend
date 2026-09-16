export const siteConfig = {
  name: "Green Valley Developers",
  tagline: "Building sustainable communities since 2008",
  description: "Construction cost, progress, and profitability control platform.",
  address: "House 12, Road 7, Sector 4, Uttara, Dhaka 1230, Bangladesh",
  phone: "+880 1711 000 000",
  email: "info@greenvalley.dev",
  hours: "Sat–Thu 9:00–18:00",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/company/greenvalley", icon: "linkedin" },
    { label: "Facebook", href: "https://facebook.com/greenvalleydevelopers", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com/greenvalley.dev", icon: "instagram" },
  ],
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export const heroStats = [
  { value: "120+", label: "Projects Delivered" },
  { value: "2.4M+", label: "Sq Ft Completed" },
  { value: "18+", label: "Years Experience" },
  { value: "96%", label: "On-Time Handover" },
];

export const services = [
  {
    id: "residential",
    title: "Residential Development",
    desc: "Apartments, residencies and housing societies built to smart-living standards.",
    icon: "home",
    features: ["High-rise towers", "Gated communities", "Smart-home integration", "Rooftop amenities"],
  },
  {
    id: "commercial",
    title: "Commercial & Office",
    desc: "Grade-A office towers, retail podiums, and mixed-use commercial complexes.",
    icon: "building",
    features: ["Basement parking", "Central HVAC", "Retail arcade", "Flexible floor plates"],
  },
  {
    id: "industrial",
    title: "Industrial & Logistics",
    desc: "Warehouses, factories, and distribution campuses with approach infrastructure.",
    icon: "factory",
    features: ["Steel structure", "Approach roads", "Utility provisioning", "Steel procurement"],
  },
  {
    id: "mixed",
    title: "Mixed-Use & Regeneration",
    desc: "Urban regeneration transforming heritage blocks into vibrant live-work-play hubs.",
    icon: "city",
    features: ["Heritage preservation", "Retail arcades", "Residential lofts", "Public plazas"],
  },
  {
    id: "renovation",
    title: "Renovation & Fit-Out",
    desc: "Interior fit-out and renovation for commercial and residential spaces.",
    icon: "hammer",
    features: ["Turnkey fit-out", "MEP upgrades", "Fast-track delivery", "Minimal disruption"],
  },
  {
    id: "consulting",
    title: "Design & BOQ Consulting",
    desc: "End-to-end design management and BOQ preparation for cost certainty.",
    icon: "file-text",
    features: ["BOQ preparation", "Tender management", "Value engineering", "Cost planning"],
  },
];

export const featuredProjects = [
  {
    id: "p_001",
    name: "Green Valley Heights",
    type: "Residential",
    location: "Uttara, Dhaka",
    status: "Active",
    description: "12-storied premium residential tower with 2 basements, rooftop amenities, and smart-home standard finishing.",
    area: "185,000 sq ft",
    budget: "৳48 Cr",
    progress: 62.5,
    imageSeed: "gv-project-1",
  },
  {
    id: "p_002",
    name: "Shyamoli Breeze Residency",
    type: "Residential",
    location: "Shyamoli, Dhaka",
    status: "Delayed",
    description: "Mid-rise apartment complex; foundation works delayed by groundwater issues, revised schedule under review.",
    area: "118,000 sq ft",
    budget: "৳29 Cr",
    progress: 48,
    imageSeed: "gv-project-2",
  },
  {
    id: "p_003",
    name: "City Point Commercial",
    type: "Commercial",
    location: "Gulshan, Dhaka",
    status: "Active",
    description: "Grade-A office tower with basement parking, retail podium, and central HVAC for rental investment.",
    area: "320,000 sq ft",
    budget: "৳72 Cr",
    progress: 44,
    imageSeed: "gv-project-3",
  },
  {
    id: "p_004",
    name: "Old Town Revival",
    type: "Mixed-Use",
    location: "Wari, Dhaka",
    status: "Planning",
    description: "Regeneration of a heritage block into retail arcade plus residential lofts; BOQ under preparation.",
    area: "74,000 sq ft",
    budget: "৳16 Cr",
    progress: 5,
    imageSeed: "gv-project-4",
  },
  {
    id: "p_005",
    name: "Riverside Crest Ph-1",
    type: "Residential",
    location: "Badda, Dhaka",
    status: "Completed",
    description: "Completed riverfront housing society; final handover and snag-resolution completed June 2026.",
    area: "142,000 sq ft",
    budget: "৳35 Cr",
    progress: 100,
    imageSeed: "gv-project-5",
  },
  {
    id: "p_006",
    name: "Bypass Logistics Hub",
    type: "Infrastructure",
    location: "Savar, Dhaka",
    status: "Active",
    description: "Warehouse and distribution campus with approach roads and utilities; steel procurement variance active.",
    area: "410,000 sq ft",
    budget: "৳61 Cr",
    progress: 37,
    imageSeed: "gv-project-6",
  },
];

export const whyUs = [
  {
    icon: "shield-check",
    title: "Transparent Cost Control",
    desc: "Real-time BOQ vs budget tracking, variance alerts, and automated RAB bill validation keep finances visible.",
  },
  {
    icon: "clock",
    title: "Proven On-Time Delivery",
    desc: "18+ years of scheduling discipline — 96% of our projects handover on or before the committed date.",
  },
  {
    icon: "award",
    title: "Stringent Quality & Safety",
    desc: "Third-party audits, daily inspections, and certified safety protocols protect workers and occupants.",
  },
  {
    icon: "users",
    title: "Dedicated Project Management",
    desc: "Single point of contact from inception to handover — no handoff gaps, no finger-pointing.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Consultation & Feasibility",
    desc: "We assess site potential, regulatory constraints, and financial viability before any commitment.",
  },
  {
    number: "02",
    title: "Design & Planning",
    desc: "Architectural design, structural engineering, BOQ preparation, and regulatory approvals (RAJUK/City Corp).",
  },
  {
    number: "03",
    title: "Construction & Quality Control",
    desc: "Daily progress reports, material verification, MEP inspections, and milestone-based RAB billing.",
  },
  {
    number: "04",
    title: "Handover & Aftercare",
    desc: "Snag resolution, as-built documentation, warranty registration, and 12-month defect liability support.",
  },
];

export const capabilities = [
  { icon: "building-2", title: "Structural Engineering", desc: "RCC, steel, and hybrid systems designed for seismic zone 2." },
  { icon: "cpu", title: "MEP & Smart Systems", desc: "HVAC, fire protection, BMS, and IoT-enabled building automation." },
  { icon: "shield", title: "Safety & Compliance", desc: "ISO 45001-aligned site safety, fire audits, and environmental permits." },
  { icon: "bar-chart-2", title: "Cost & Schedule Control", desc: "Earned-value tracking, variance analysis, and cash-flow forecasting." },
];

export const safetyRows = [
  {
    imageSeed: "gv-safety-1",
    title: "Engineering & Quality Assurance",
    desc: "Our in-house QA/QC team conducts stage-gate inspections — concrete cube tests, rebar verification, waterproofing flood tests — documented in digital checklists linked to each work package. Non-conformances trigger corrective-action workflows within 24 hours.",
    reversed: false,
  },
  {
    imageSeed: "gv-safety-2",
    title: "Sustainability & Green Building",
    desc: "Rainwater harvesting, solar-ready roofs, low-VOC finishes, and construction-waste recycling are standard. We target LEED Silver equivalency on all new commercial towers and EDGE certification on residential blocks.",
    reversed: true,
  },
];

export const team = [
  {
    name: "Rehana Rahman",
    role: "Chief Executive Officer",
    bio: "20+ years leading complex infrastructure and real-estate development across Bangladesh. Pioneer of digital cost-control adoption.",
    imageSeed: 12,
  },
  {
    name: "Sajid Hasan",
    role: "Projects Director",
    bio: "Managed 50+ high-rise and commercial projects. Expert in earned-value management and multi-stakeholder coordination.",
    imageSeed: 13,
  },
  {
    name: "Tanvir Ahmed",
    role: "Chief Engineer",
    bio: "Structural engineer with PhD in earthquake-resistant design. Oversees all structural integrity and third-party audit compliance.",
    imageSeed: 14,
  },
  {
    name: "Nusrat Jahan",
    role: "Chief Financial Officer",
    bio: "Chartered accountant specializing in construction finance, tax optimization, and banking syndication for large developments.",
    imageSeed: 15,
  },
];

export const testimonials = [
  {
    quote: "Green Valley delivered our 12-storey tower three weeks ahead of schedule with zero budget overrun. Their cost-control platform gave us confidence every month.",
    author: "Mr. Faruk Ahmed",
    role: "MD, Green Valley Properties",
    project: "Green Valley Heights",
    stars: 5,
  },
  {
    quote: "The team&apos;s professionalism during the groundwater crisis at Shyamoli was exceptional. Transparent communication and swift remedial action saved the project.",
    author: "Ms. Nasreen Begum",
    role: "Director, Breeze Development",
    project: "Shyamoli Breeze Residency",
    stars: 5,
  },
  {
    quote: "From design approvals to final handover, Green Valley was a true partner. Their BOQ accuracy and RAB bill discipline made financing seamless.",
    author: "Mr. Karim Uddin",
    role: "VP Projects, CityPoint Holdings",
    project: "City Point Commercial",
    stars: 5,
  },
];

export const faqs = [
  {
    q: "What is the typical timeline for a residential project?",
    a: "A 12-storey residential tower (≈100 units) typically takes 24–30 months from groundbreaking to handover, depending on soil conditions and approval cycles.",
  },
  {
    q: "Do you handle all regulatory approvals (RAJUK, City Corporation, DoE)?",
    a: "Yes. Our in-house approvals team manages building permits, environmental clearances, utility connections, and fire licences end-to-end.",
  },
  {
    q: "What warranty do you provide after handover?",
    a: "12-month defect liability period on all works, plus 10-year structural warranty per BNBC. Extended MEP warranties available per manufacturer terms.",
  },
  {
    q: "Can I visit an ongoing site before committing?",
    a: "Absolutely. We arrange guided site visits with our project managers on Saturdays. Contact us to schedule.",
  },
  {
    q: "How do you ensure cost certainty?",
    a: "Fixed-price BOQ, monthly RAB bills validated against actual measurements, and real-time variance dashboard — no surprise invoices.",
  },
];

export const partners = [
  "RAJUK",
  "Dhaka North City Corporation",
  "BIDA",
  "Bangladesh Bank",
  "Green Building Council Bangladesh",
  "Institute of Engineers Bangladesh",
];

export const history = [
  { year: "2008", title: "Founded", desc: "Started as a boutique residential builder in Uttara." },
  { year: "2012", title: "First Housing Society", desc: "Delivered Riverside Crest Phase-1, our first completed gated community." },
  { year: "2016", title: "Commercial Expansion", desc: "Entered Grade-A commercial with City Point Commercial in Gulshan." },
  { year: "2021", title: "Digital Cost Control", desc: "Launched proprietary BOQ vs Budget tracking platform for all projects." },
  { year: "2026", title: "120+ Projects", desc: "Surpassed 2.4M sq ft delivered across residential, commercial, and infrastructure." },
];

export const values = [
  { icon: "heart-handshake", title: "Integrity", desc: "We honour every commitment — to clients, partners, and our people." },
  { icon: "shield", title: "Safety First", desc: "Zero-compromise site safety; every worker goes home unharmed." },
  { icon: "gem", title: "Craftsmanship", desc: "Details define durability. We build for the next 50 years, not the next 5." },
  { icon: "users", title: "Collaboration", desc: "Best outcomes emerge when architects, engineers, and owners work as one team." },
];

export const contactInfo = {
  address: "House 12, Road 7, Sector 4, Uttara, Dhaka 1230, Bangladesh",
  phone: "+880 1711 000 000",
  email: "info@greenvalley.dev",
  hours: "Saturday–Thursday 9:00–18:00",
};

export const subjectOptions = [
  { value: "new-project", label: "New Project Inquiry" },
  { value: "site-visit", label: "Schedule Site Visit" },
  { value: "partnership", label: "Partnership / JV" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other" },
];