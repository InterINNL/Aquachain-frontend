/** InterINNL hub copy (English). Keep in sync with .cursor/content notes. */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop&auto=format`;

const local = (name: string) => `/photos/${name}`;

export const interinnlContent = {
  name: 'InterINNL',
  tagline: 'INDIA • NETHERLANDS • NEXT LEVEL',
  motto: 'BUILD • SHARE • IMPACT',
  heroLine:
    'Families leave India for tech careers in the Netherlands. Students ship AI, LLMs and blockchain across time zones. Engineers meet over chai and stroopwafels. InterINNL is that bridge.',
  mission:
    'We bring together students, developers and engineers across India and the Netherlands to build open-source projects with real-world impact: AI and LLMs, blockchain and CosmWasm, Rust, and water / climate tech. From Bengaluru to Amsterdam, from Hyderabad to Eindhoven: talent travels, ideas stay shared.',
  bridge:
    'Indian talent ↔ engineers already in the Netherlands ↔ Dutch builders ↔ open source. The India–Netherlands connection is the point.',
  focus: [
    'AI',
    'LLMs',
    'Blockchain',
    'CosmWasm',
    'Rust',
    'Open source',
    'Water & climate',
  ],
  heroPhoto: {
    src: local('team-office.png'),
    alt: 'Indian engineers collaborating around laptops with code on screens behind them',
  },
  missionPhoto: {
    src: local('canal-meetup.png'),
    alt: 'Indian and Dutch builders meeting outdoors with a laptop in a Dutch city',
  },
  stats: [
    { value: 2, suffix: '', label: 'countries' },
    { value: 50, suffix: '+', label: 'members' },
    { value: 1, suffix: '', label: 'project live' },
    { value: 0, suffix: '', label: 'first hackathon', display: 'Soon' },
  ],
  stories: [
    {
      name: 'Priya S.',
      origin: 'Bengaluru → Amsterdam',
      role: 'ML / LLM Engineer',
      quote:
        'I care about models that ship. InterINNL is where AI builders from India meet Dutch product and open-source culture.',
      photo: {
        src: local('passport-tulips.png'),
        alt: 'Indian woman in a tulip field holding an Indian passport, Dutch windmills behind',
      },
    },
    {
      name: 'Arjun, Neel & Lars',
      origin: 'Hyderabad · Mumbai · Utrecht',
      role: 'Builders · India × NL',
      quote:
        'A laptop by the canal, half the jokes in English, half in Hindi. Blockchain prototypes and product talk in the same afternoon.',
      photo: {
        src: local('canal-meetup.png'),
        alt: 'Two Indian engineers and a blond Dutch colleague collaborating outdoors',
      },
    },
    {
      name: 'Dev squad',
      origin: 'India → Netherlands tech',
      role: 'AI · Backend · Full stack',
      quote:
        'Late nights on LLMs and CosmWasm. Finding a room of Indian engineers who already live the NL move changed everything.',
      photo: {
        src: local('team-office.png'),
        alt: 'Four Indian engineers collaborating at desks with code on large monitors',
      },
    },
    {
      name: 'Ananya',
      origin: 'Pune → Rotterdam',
      role: 'Family · Relocating for tech',
      quote:
        'Passport in one hand, windmills behind me. InterINNL is for people who crossed that bridge for real careers, not tourism.',
      photo: {
        src: local('passport-tulips.png'),
        alt: 'Young Indian woman with Indian passport among Dutch tulips and windmills',
      },
    },
  ],
  mosaicPhotos: [
    {
      src: local('banner-tulips.png'),
      alt: 'InterINNL banner with India and Netherlands flags over Dutch tulips and a windmill',
      caption: 'India · Netherlands · Together',
    },
    {
      src: local('team-office.png'),
      alt: 'Indian engineers collaborating in a tech office',
      caption: 'AI & code nights',
    },
    {
      src: local('canal-meetup.png'),
      alt: 'Indian and Dutch builders meeting by a Dutch canal',
      caption: 'Build by the canal',
    },
    {
      src: local('passport-tulips.png'),
      alt: 'Indian passport held in a Dutch tulip field',
      caption: 'The move is real',
    },
    {
      src: u('photo-1522071820081-009f0129c71c', 700),
      alt: 'Diverse team collaborating around laptops',
      caption: 'Build together',
    },
    {
      src: u('photo-1558551649-de46bebae2f0', 700),
      alt: 'Amsterdam canal lined with historic houses',
      caption: 'Amsterdam mornings',
    },
    {
      src: u('photo-1581092160562-40aa08e78837', 700),
      alt: 'Engineer reviewing code on dual monitors',
      caption: 'Deep work',
    },
    {
      src: u('photo-1559827260-dc66d52bef19', 700),
      alt: 'Traditional Dutch windmills under a blue sky',
      caption: 'Next to water',
    },
  ],
  projects: [
    {
      name: 'AquaChain',
      blurb:
        'Open-source CosmWasm + Angular demo for smarter, more trusted water management: IoT sensors, blockchain verification, and room for AI analytics. Citizen science, water wells, and utility footprints.',
      demoPath: '/aquachain/',
      githubFrontend: 'https://github.com/InterINNL/Aquachain-frontend',
      githubContracts: 'https://github.com/InterINNL/Aquachain-contracts',
      modules: ['Citizen Science', 'Water Well', 'Utilities', 'Blockchain'],
      note: 'An InterINNL hackathon project: AI, IoT and blockchain for water.',
    },
  ],
  events: {
    badge: 'Coming soon',
    title: 'AquaChain Hackathon I',
    blurb:
      '48 hours to build tech for water challenges with AI, LLMs, IoT and blockchain. India and the Netherlands, remote + Amsterdam. Public GitHub output. Real problems, not slides.',
    when: 'Date to be announced',
    ctaLabel: 'Register interest',
    ctaHref:
      'mailto:contact@interchouette.net?subject=AquaChain%20Hackathon%20interest',
  },
  founders: [
    {
      name: 'Gregory Roussac',
      role: 'Co-founder',
      location: 'Netherlands',
      linkedin: 'https://www.linkedin.com/in/gregoryroussac/',
      initials: 'GR',
    },
    {
      name: 'Reham Abdul Rauf',
      role: 'Co-founder',
      location: 'India / Netherlands',
      linkedin: 'https://www.linkedin.com/in/reham-abdul-rauf-a0634b140/',
      initials: 'RA',
    },
  ],
  social: {
    badge: 'In progress',
    title: 'Community coming to life',
    body: "We're building a federated community space for InterINNL members. Share AI, LLM and blockchain projects, ask questions, and find collaborators across India and the Netherlands. No feed algorithm. Just people.",
    notifyLabel: 'Notify me',
    notifyHref:
      'mailto:contact@interchouette.net?subject=InterINNL%20community%20notify',
  },
  links: {
    githubOrg: 'https://github.com/InterINNL',
    site: 'https://interinnl.interchouette.net/',
    linkedinGroup: 'https://www.linkedin.com/groups/42420002/',
  },
};
