/** AquaChain site copy and photo catalog (English). */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop&auto=format`;

const local = (name: string) => `photos/${name}`;

export interface AcPhoto {
  src: string;
  alt: string;
  objectPosition?: string;
}

export interface ModuleHero {
  kicker: string;
  title: string;
  lead: string;
  photo: AcPhoto;
}

export type ModuleHeroKey =
  'citizen-science' | 'water-well-initiative' | 'water-utilities';

export interface AcModule {
  id: string;
  name: string;
  kicker: string;
  blurb: string;
  route: string;
  icon: string;
  accent: 'teal' | 'amber' | 'slate';
  photo: AcPhoto;
}

export const aquachainContent = {
  name: 'AquaChain',
  tagline: 'Trusted water data on Cosmos',
  description:
    'On-chain decision support for water: citizen sensors, well crowdfunding, and utility footprint certificates.',
  interinnlUrl: '/',
  githubFrontend: 'https://github.com/InterINNL/Aquachain-frontend',
  githubContracts: 'https://github.com/InterINNL/Aquachain-contracts',

  hero: {
    kicker: 'Open source · Cosmos · InterINNL',
    title: 'Water decisions backed by verifiable data',
    lead: 'Citizens deploy sensors, communities fund wells, utilities log usage and earn certificates. Every step can be recorded on-chain for transparency.',
    photo: {
      src: u('photo-1548839140-b79d966adcfa', 1400),
      alt: 'Clear river water flowing over rocks in natural light',
      objectPosition: 'center 40%',
    } as AcPhoto,
    primaryCta: { label: 'Explore Citizen Science', route: '/citizen-science' },
    secondaryCta: { label: 'How it works', anchor: '#how-it-works' },
  },

  context: {
    title: 'Why water needs a shared record',
    body: 'Water quality and access vary sharply between regions. Field readings, funding pledges, and utility savings are often scattered across spreadsheets and siloed systems. AquaChain demos how Cosmos smart contracts can anchor that data so donors, regulators, and communities read the same numbers.',
    photo: {
      src: local('canal-meetup.png'),
      alt: 'Indian and Dutch builders meeting outdoors by a canal in the Netherlands',
    } as AcPhoto,
  },

  modules: [
    {
      id: 'citizen-science',
      name: 'Citizen Science',
      kicker: 'Field sensors',
      blurb:
        'Register sensors, submit readings, and earn rewards when data is verified on-chain.',
      route: '/citizen-science',
      icon: 'microscope',
      accent: 'teal' as const,
      photo: {
        src: local('agri-drone.jpg'),
        alt: 'Agricultural drone surveying crops for precision water management',
      },
    },
    {
      id: 'water-well',
      name: 'Water Well Initiative',
      kicker: 'Community funding',
      blurb:
        'Create well projects, collect donations, unlock funds when milestones are met, and disburse to beneficiaries.',
      route: '/water-well-initiative',
      icon: 'hand-holding-droplet',
      accent: 'amber' as const,
      photo: {
        src: local('community-dinner.jpg'),
        alt: 'Community members sharing a meal together at an InterINNL gathering',
      },
    },
    {
      id: 'utilities',
      name: 'Water Utilities',
      kicker: 'Footprint certificates',
      blurb:
        'Register companies, log water usage and savings, validate entries, and issue footprint certificates.',
      route: '/water-utilities',
      icon: 'chart-line',
      accent: 'slate' as const,
      photo: {
        src: local('students-workshop.jpg'),
        alt: 'Students collaborating at a workshop with laptops and notes',
      },
    },
  ] satisfies AcModule[],

  howItWorks: {
    title: 'How it works',
    steps: [
      {
        title: 'Collect',
        body: 'Sensors, donors, and utilities submit readings, pledges, or usage logs.',
        icon: 'satellite-dish',
      },
      {
        title: 'Record',
        body: 'CosmWasm contracts store proposals, transactions, and state on the chain.',
        icon: 'link',
      },
      {
        title: 'Verify',
        body: 'Verifiers approve sensor data, well milestones, or utility savings.',
        icon: 'clipboard-check',
      },
      {
        title: 'Reward',
        body: 'Tokens, certificates, or disbursements follow verified outcomes.',
        icon: 'award',
      },
    ],
  },

  stack: {
    title: 'Built with',
    items: ['Cosmos SDK', 'CosmWasm', 'CosmJS', 'Keplr', 'Angular'],
  },

  closingCta: {
    title: 'Try the live demo',
    body: 'Connect Keplr on a local chain or test deployment and walk through each module.',
    primary: { label: 'Open Citizen Science', route: '/citizen-science' },
    secondary: {
      label: 'Water Well projects',
      route: '/water-well-initiative',
    },
  },

  teamStrip: {
    photo: {
      src: local('team-office-logo-right.png'),
      alt: 'Indian engineers collaborating around a laptop with InterINNL sticker on the lid',
    } as AcPhoto,
  },

  nav: [
    { label: 'Home', route: '/' },
    { label: 'Citizen Science', route: '/citizen-science' },
    { label: 'Water Well', route: '/water-well-initiative' },
    { label: 'Utilities', route: '/water-utilities' },
  ],

  moduleHeroes: {
    'citizen-science': {
      kicker: 'Module 1',
      title: 'Citizen Science',
      lead: 'Monitor water quality and quantity. Submit readings and earn rewards when data is verified.',
      photo: {
        src: local('drone-india-field.jpg'),
        alt: 'Drone over agricultural fields in India for water and crop monitoring',
      },
    },
    'water-well-initiative': {
      kicker: 'Module 2',
      title: 'Water Well Initiative',
      lead: 'Crowdfund well projects on-chain: create, validate, donate, unlock, and disburse.',
      photo: {
        src: u('photo-1593115915325-f973ccfaec75', 1400),
        alt: 'Village water pump with people collecting water at a communal tap',
        objectPosition: 'center center',
      },
    },
    'water-utilities': {
      kicker: 'Module 3',
      title: 'Water Utilities',
      lead: 'Register utilities, log usage and savings, validate entries, and issue footprint certificates.',
      photo: {
        src: local('community-networking-nl.jpg'),
        alt: 'Professionals networking at a community event in the Netherlands',
      },
    },
  } satisfies Record<ModuleHeroKey, ModuleHero>,
};
