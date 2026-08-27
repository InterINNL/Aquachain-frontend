/** InterINNL hub copy (English). Keep in sync with .cursor/content notes. */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop&auto=format`;

export const interinnlContent = {
  name: 'InterINNL',
  tagline: 'INDIA • NETHERLANDS • NEXT LEVEL',
  motto: 'BUILD • SHARE • IMPACT',
  heroLine:
    'Families leave India for tech careers in the Netherlands. Students code across time zones. Engineers meet over chai and stroopwafels. InterINNL is that bridge.',
  mission:
    'We bring together students, developers and engineers across India and the Netherlands to build open-source projects with real-world impact. From Bengaluru to Amsterdam, from Hyderabad to Eindhoven: talent travels, ideas stay shared.',
  bridge:
    'Indian talent ↔ engineers already in the Netherlands ↔ Dutch builders ↔ open source. The India–Netherlands connection is the point.',
  heroPhoto: {
    src: u('photo-1581091226825-a6a2a5aee158', 1200),
    alt: 'Software engineer working at a laptop in a bright workspace',
  },
  missionPhoto: {
    src: u('photo-1534351590666-13e3e96b5017', 1200),
    alt: 'Amsterdam canal houses reflecting on the water at dusk',
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
      role: 'ML Engineer',
      quote:
        'I built my first CosmWasm contract at an AquaChain weekend. The community felt like home from day one.',
      photo: {
        src: u('photo-1573496359142-b8d87734a5a2', 600),
        alt: 'Portrait of an Indian woman professional smiling',
      },
    },
    {
      name: 'Arjun K.',
      origin: 'Hyderabad → Eindhoven',
      role: 'Embedded Systems',
      quote:
        'Moving for work was lonely until I found people who understood both chai and Dutch rain. InterINNL is that room.',
      photo: {
        src: u('photo-1507003211169-0a1dd7228f2d', 600),
        alt: 'Portrait of a South Asian man in a city setting',
      },
    },
    {
      name: 'Ananya & Vikram',
      origin: 'Pune → Rotterdam',
      role: 'Family · Tech',
      quote:
        'We relocated with two kids. Meeting other Indian families in NL tech made the move feel possible.',
      photo: {
        src: u('photo-1511895426328-dc8714191300', 600),
        alt: 'Family walking together outdoors',
      },
    },
    {
      name: 'Lars de Vries',
      origin: 'Utrecht',
      role: 'Rust Developer',
      quote:
        'I joined for the water hackathon and stayed for the people. Cross-border open source just works better.',
      photo: {
        src: u('photo-1472099645785-5658abf4ff4e', 600),
        alt: 'Portrait of a fair-haired European man smiling',
      },
    },
  ],
  mosaicPhotos: [
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
      src: u('photo-1522202176988-66273c2fd55f', 700),
      alt: 'Young professionals brainstorming at a table',
      caption: 'Hack nights',
    },
    {
      src: u('photo-1581092160562-40aa08e78837', 700),
      alt: 'Engineer reviewing code on dual monitors',
      caption: 'Deep work',
    },
    {
      src: u('photo-1467269204594-9661b134dd2b', 700),
      alt: 'Bicycles on a Dutch city street',
      caption: 'Dutch streets',
    },
    {
      src: u('photo-1600880292203-757bb62b4baf', 700),
      alt: 'Colleagues discussing a project in an office',
      caption: 'Office bridges',
    },
    {
      src: u('photo-1559827260-dc66d52bef19', 700),
      alt: 'Traditional Dutch windmills under a blue sky',
      caption: 'Next to water',
    },
    {
      src: u('photo-1519389950473-47ba0277781c', 700),
      alt: 'Desk with laptop, notes and coffee in a tech workspace',
      caption: 'Open source desks',
    },
  ],
  projects: [
    {
      name: 'AquaChain',
      blurb:
        'Open-source CosmWasm + Angular demo for smarter, more trusted water management: citizen sensors, water wells, and utility footprints.',
      demoPath: '/aquachain/',
      githubFrontend: 'https://github.com/InterINNL/Aquachain-frontend',
      githubContracts: 'https://github.com/InterINNL/Aquachain-contracts',
      modules: ['Citizen Science', 'Water Well', 'Utilities'],
      note: 'An InterINNL hackathon project.',
    },
  ],
  events: {
    badge: 'Coming soon',
    title: 'AquaChain Hackathon I',
    blurb:
      '48 hours to build tech for water challenges. India and the Netherlands, remote + Amsterdam. Public GitHub output. Real problems, not slides.',
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
    body: "We're building a federated community space for InterINNL members. Share projects, ask questions, and find collaborators across India and the Netherlands. No algorithm. Just people.",
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
