/** InterINNL hub copy (English). Keep in sync with .cursor/content notes. */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=75&fit=crop&auto=format`;

const localWebp = (name: string) =>
  `/photos/${name.replace(/\.(png|jpe?g)$/i, '')}.webp`;

const linkedinGroup = 'https://www.linkedin.com/groups/42420002/';

export const interinnlContent = {
  name: 'InterINNL',
  tagline: 'INDIA • NETHERLANDS • NEXT LEVEL',
  motto: 'BUILD • SHARE • IMPACT',
  heroLine:
    'Families leave India for tech careers in the Netherlands. Students ship AI, LLMs and blockchain across time zones. Engineers meet over chai and stroopwafels. InterINNL is that bridge.',
  mission:
    'We bring together students, developers and engineers across India and the Netherlands to build open-source projects with real-world impact: AI, Rust, Python, and water / climate tech. From Bengaluru to Amsterdam, from Hyderabad to Eindhoven: talent travels, ideas stay shared.',
  bridge:
    'Indian talent ↔ engineers already in the Netherlands ↔ Dutch builders ↔ open source. The India–Netherlands connection is the point.',
  focus: [
    'AI',
    'LLMs',
    'Blockchain',
    'Rust',
    'Python',
    'Open source',
    'Water & climate',
  ],
  heroPhotos: [
    {
      src: u('photo-1581091226825-a6a2a5aee158', 900),
      alt: 'Engineer working at a laptop in a bright tech workspace',
    },
    {
      src: localWebp('team-office-logo-right.png'),
      alt: 'Indian engineers collaborating around a laptop with InterINNL sticker on the lid',
    },
    {
      src: localWebp('canal-meetup.png'),
      alt: 'Indian and Dutch builders meeting outdoors by a canal in the Netherlands',
    },
  ],
  missionPhoto: {
    src: localWebp('banner-tulips'),
    alt: 'InterINNL banner with India and Netherlands flags over Dutch tulips and a windmill',
  },
  stats: [
    { value: 2, suffix: '', label: 'countries' },
    { value: 50, suffix: '+', label: 'members' },
    { value: 1, suffix: '', label: 'project live' },
  ],
  stories: [
    {
      name: 'Priya S.',
      origin: 'Bengaluru → Amsterdam',
      role: 'ML Engineer · Python & Rust',
      quote:
        'Dutch teams need people who ship models, not slides. InterINNL is where Indian ML engineers meet real NL product work in Python and Rust.',
      photo: {
        src: localWebp('priya-passport-tulips.png'),
        alt: 'Indian woman in a tulip field holding an Indian passport, Dutch windmills behind',
        objectPosition: 'center center',
      },
    },
    {
      name: 'Arjun K.',
      origin: 'Hyderabad → Eindhoven',
      role: 'Embedded Systems',
      quote:
        'The Netherlands has a deep tech shortage. I moved for work; InterINNL helped me land among engineers who already live that gap every day.',
      photo: {
        src: u('photo-1507003211169-0a1dd7228f2d', 480),
        alt: 'Portrait of a South Asian man in a city setting',
      },
    },
    {
      name: 'Ananya & Vikram',
      origin: 'Pune → Rotterdam',
      role: 'Family · Tech',
      quote:
        'We relocated for careers in NL tech. Meeting other Indian families already in Dutch companies made the move feel real, not theoretical.',
      photo: {
        src: u('photo-1511895426328-dc8714191300', 480),
        alt: 'Family walking together outdoors',
      },
    },
    {
      name: 'Lars de Vries',
      origin: 'Utrecht',
      role: 'Rust Developer',
      quote:
        'Dutch industry needs Rust, systems and AI talent at scale. InterINNL connects us with builders from India who already write that stack.',
      photo: {
        src: u('photo-1472099645785-5658abf4ff4e', 480),
        alt: 'Portrait of a fair-haired European man smiling',
      },
    },
  ],
  mosaic: {
    left: [
      {
        src: localWebp('team-office-logo-right.png'),
        alt: 'Indian engineers collaborating on code around laptops',
        caption: 'Build together',
      },
      {
        src: localWebp('canal-meetup.png'),
        alt: 'Indian and Dutch builders meeting outdoors by a Dutch canal',
        caption: 'Canal collaboration',
      },
    ],
    right: [
      [
        {
          src: localWebp('india-tech-chip.jpg'),
          alt: 'Indian flag on a microchip on a circuit board',
          caption: 'India tech',
        },
        {
          src: localWebp('rust-india.png'),
          alt: 'Rust India community logo with Indian tricolour on the Rust gear',
          caption: 'Rust India',
        },
      ],
      [
        {
          src: localWebp('tulips-flags-woman.png'),
          alt: 'Indian woman smiling in a Dutch tulip field with flags behind her',
          caption: 'India in NL',
        },
        {
          src: localWebp('ces-team-nl.png'),
          alt: 'Netherlands startup ecosystem team at CES in orange Team NL shirts',
          caption: 'CES · Team NL',
        },
      ],
      [
        {
          src: localWebp('passport-rijksmuseum.jpg'),
          alt: 'Indian woman with passport in front of the Rijksmuseum in Amsterdam',
          caption: 'The move',
        },
        {
          src: localWebp('ces-nl-startup.png'),
          alt: 'Netherlands startup ecosystem booth at CES with innovate together banner',
          caption: 'NL startup ecosystem',
        },
      ],
      [
        {
          src: localWebp('agri-drone.jpg'),
          alt: 'Engineer operating an agricultural drone over a crop field in the Netherlands',
          caption: 'Agri drone',
        },
        {
          src: localWebp('drone-india-field.jpg'),
          alt: 'Farmer operating an agricultural drone in an Indian field',
          caption: 'Field tech · India',
        },
        {
          src: localWebp('drone-dealership.jpg'),
          alt: 'Drone dealership technician with agricultural drones',
          caption: 'Drone craft',
        },
        {
          src: localWebp('drone-crops.png'),
          alt: 'Agricultural drone flying over green crop rows',
          caption: 'Smart farming',
        },
        {
          src: localWebp('india-nl-diplomacy.png'),
          alt: 'Indian and Dutch leaders at an official India-Netherlands meeting',
          caption: 'IN · NL bridge',
        },
        {
          src: localWebp('students-workshop.jpg'),
          alt: 'Indian students raising hands at a tech workshop',
          caption: 'Build nights',
        },
        {
          src: localWebp('community-dinner.jpg'),
          alt: 'InterINNL community members sharing a meal together',
          caption: 'Community dinner',
        },
        {
          src: localWebp('haarlem-windmill-night.jpg'),
          alt: 'Haarlem windmill and church lit at night beside the Spaarne river',
          caption: 'Next to water',
        },
      ],
    ],
  },
  projects: [
    {
      name: 'AquaChain',
      blurb:
        'Open-source Rust + Python + Angular demo for smarter, more trusted water management: citizen sensors, water wells, and utility footprints.',
      demoPath: '/aquachain/',
      githubFrontend: 'https://github.com/InterINNL/frontend',
      githubContracts: 'https://github.com/InterINNL/Aquachain-contracts',
      modules: ['Citizen Science', 'Water Well', 'Utilities'],
      note: 'An InterINNL open-source project.',
    },
  ],
  founders: [
    {
      name: 'Gregory Roussac',
      role: 'Co-founder',
      location: 'Netherlands / France',
      linkedin: 'https://www.linkedin.com/in/gregoryroussac/',
      initials: 'GR',
    },
    {
      name: 'Reham Abdul Rauf',
      role: 'Co-founder',
      location: 'India / Netherlands / HK',
      linkedin: 'https://www.linkedin.com/in/reham-abdul-rauf-a0634b140/',
      initials: 'RA',
    },
  ],
  social: {
    badge: 'In progress',
    title: 'Community coming to life',
    body: "We're building a federated community space for InterINNL members. Share AI, LLM and blockchain projects, ask questions, and find collaborators across India and the Netherlands. No feed algorithm. Just people.",
    notifyLabel: 'Notify me',
    notifyHref: linkedinGroup,
  },
  links: {
    githubOrg: 'https://github.com/InterINNL',
    site: 'https://interinnl.interchouette.net/',
    contactEmail: 'contact+innl@interchouette.net',
    linkedinGroup,
  },
};
