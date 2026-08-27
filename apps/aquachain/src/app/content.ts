/** AquaChain site copy and photo catalog (English). */

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
  | 'citizen-science'
  | 'water-well-initiative'
  | 'water-utilities';

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
      src: local('hero-river.jpg'),
      alt: 'Lake and forest landscape at dawn with calm water surface',
      objectPosition: 'center 35%',
    },
    primaryCta: { label: 'Explore Citizen Science', route: '/citizen-science' },
    secondaryCta: { label: 'How it works', anchor: '#how-it-works' },
  },

  context: {
    title: 'Why water needs a shared record',
    body: 'Water quality and access vary sharply between regions. Field readings, funding pledges, and utility savings are often scattered across spreadsheets and siloed systems. AquaChain demos how Cosmos smart contracts can anchor that data so donors, regulators, and communities read the same numbers.',
    photo: {
      src: local('context-monitoring.jpg'),
      alt: 'Water quality monitoring dashboard with smart sensor readings',
    },
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
        src: local('module-citizen-sensors.png'),
        alt: 'Network diagram of IoT water quality sensors in the field',
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
        src: local('community-well.jpg'),
        alt: 'Community hand pump and well used for daily water access',
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
        src: local('utilities-well-monitoring.jpg'),
        alt: 'Industrial IoT sensors monitoring production water well levels',
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

  fieldStrip: {
    photo: {
      src: local('field-irrigation.jpg'),
      alt: 'IoT-based irrigation system monitoring soil moisture and water flow',
    },
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
        src: local('citizen-sensor-kit.jpg'),
        alt: 'Portable water quality sensor kit for field measurements',
      },
    },
    'water-well-initiative': {
      kicker: 'Module 2',
      title: 'Water Well Initiative',
      lead: 'Crowdfund well projects on-chain: create, validate, donate, unlock, and disburse.',
      photo: {
        src: local('community-well.jpg'),
        alt: 'Community hand pump and well used for daily water access',
        objectPosition: 'center center',
      },
    },
    'water-utilities': {
      kicker: 'Module 3',
      title: 'Water Utilities',
      lead: 'Register utilities, log usage and savings, validate entries, and issue footprint certificates.',
      photo: {
        src: local('hero-utilities-plant.jpg'),
        alt: 'Water treatment facility with pipes and monitoring equipment',
      },
    },
  } satisfies Record<ModuleHeroKey, ModuleHero>,
};
