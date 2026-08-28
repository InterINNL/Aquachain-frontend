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
  | 'water-utilities'
  | 'sustainable-actions'
  | 'community-bounty'
  | 'water-credits'
  | 'local-dao';

export interface AcModule {
  id: string;
  name: string;
  kicker: string;
  blurb: string;
  route: string;
  icon: string;
  accent: 'teal' | 'amber' | 'slate';
  photos: AcPhoto[];
}

export interface AcIntegratedModule {
  id: string;
  title: string;
  body: string;
  route: string;
  icon: string;
  accent: 'teal' | 'amber' | 'slate';
  photos: AcPhoto[];
}

export interface HeaderBrand {
  label: string;
  icon: string;
  accent: 'teal' | 'amber' | 'slate';
}

const localDaoPhotos: AcPhoto[] = [
  {
    src: local('CS4Water-conference-2048x1536.jpg'),
    alt: 'Community workshop on water stewardship and local governance',
    objectPosition: 'center center',
  },
  {
    src: local('local-dao-forum.jpg'),
    alt: 'Community members discussing sustainability plans together',
    objectPosition: 'center center',
  },
];

const waterCreditsPhotos: AcPhoto[] = [
  {
    src: local('context-monitoring.jpg'),
    alt: 'Water monitoring dashboard with live sensor readings',
    objectPosition: 'center center',
  },
  {
    src: local('utilities-well-monitoring.jpg'),
    alt: 'Industrial sensors monitoring a production water well in India',
    objectPosition: 'center 45%',
  },
];

const communityBountyPhotos: AcPhoto[] = [
  {
    src: local('community-bounty-team.jpg'),
    alt: 'Community members collaborating over a shared meal after a volunteer event',
    objectPosition: 'center center',
  },
  {
    src: local('community-bounty-field.jpg'),
    alt: 'Agricultural drone over green fields near an Indian city skyline',
    objectPosition: 'center center',
  },
];

const sustainableActionsPhotos: AcPhoto[] = [
  {
    src: local('community-volunteers-india.jpg'),
    alt: 'Indian students raising hands during a community water workshop',
    objectPosition: 'center 35%',
  },
  {
    src: local('sustainable-farming-india.jpg'),
    alt: 'Farmer operating an agricultural drone over green fields near an Indian city',
    objectPosition: 'center center',
  },
  {
    src: local('field-irrigation.jpg'),
    alt: 'Irrigation sprinklers watering crops for efficient water use',
    objectPosition: 'center 55%',
  },
];

const citizenSciencePhotos: AcPhoto[] = [
  {
    src: local(
      'well-designed-citizen-science-projects-can-help-monitor-sdg-6-864986179.jpg',
    ),
    alt: 'Researchers and volunteers monitoring water quality in a field wetland',
    objectPosition: 'center 40%',
  },
  {
    src: local('CS4Water-conference-2048x1536.jpg'),
    alt: 'Conference audience at a citizen science for water session',
    objectPosition: 'center center',
  },
];

const waterWellPhotos: AcPhoto[] = [
  {
    src: local(
      'How-to-Make-a-Well-Produce-More-Water-Increase-Well-Yield-with-RAFSUN-Submersible-Pumps-1313991184.jpg',
    ),
    alt: 'Workers installing a submersible pump into a community well',
    objectPosition: 'center center',
  },
  {
    src: local('water-well-2-600x400-976489662.jpg'),
    alt: 'Rural WASH facility with overhead water tank and signage',
    objectPosition: 'center center',
  },
];

const utilitiesPhotos: AcPhoto[] = [
  {
    src: local(
      '800x400-combined-sewer-overflows-treatment-plant-3285836854.jpg',
    ),
    alt: 'Aerial view of circular wastewater treatment basins in a green field',
    objectPosition: 'center center',
  },
  {
    src: local(
      'Best-ETP-plant-supplier-Delhi-NCR-Call-Now-9653247121-08-28-2026_02_16_AM.png',
    ),
    alt: 'Effluent treatment plant with aeration tanks and yellow safety walkways',
    objectPosition: 'center center',
  },
  {
    src: local(
      'Best-Water-Filtration-Plant-Manufacturer-in-Delhi-08-28-2026_02_14_AM.png',
    ),
    alt: 'Industrial water filtration plant with blue piping and storage tanks',
    objectPosition: 'center center',
  },
  {
    src: local(
      'Best-ZLD-Plant-Manufacturers-Near-Connaught-Place-Delhi-08-28-2026_02_15_AM.png',
    ),
    alt: 'Zero liquid discharge plant with reverse osmosis skids and clear water basin',
    objectPosition: 'center center',
  },
];

export const aquachainContent = {
  name: 'AquaChain',
  tagline: 'Trusted water data on Cosmos',
  description:
    'On-chain decision support for water: citizen sensors, well crowdfunding, and utility footprint certificates.',
  interinnlUrl: '/',
  githubFrontend: 'https://github.com/InterINNL/Aquachain-frontend',
  githubContracts: 'https://github.com/InterINNL/Aquachain-contracts',
  copyrightYear: 2025,

  headerBrands: {
    '/citizen-science': {
      label: 'Citizen Science',
      icon: 'microscope',
      accent: 'teal',
    },
    '/water-well-initiative': {
      label: 'Water Well Initiative',
      icon: 'hand-holding-droplet',
      accent: 'amber',
    },
    '/water-utilities': {
      label: 'Water Utilities',
      icon: 'chart-line',
      accent: 'slate',
    },
    '/sustainable-actions': {
      label: 'Sustainable Actions',
      icon: 'leaf',
      accent: 'teal',
    },
    '/community-bounty': {
      label: 'Community Bounty',
      icon: 'people-group',
      accent: 'amber',
    },
    '/water-credits': {
      label: 'Water Credits',
      icon: 'coins',
      accent: 'slate',
    },
    '/local-dao': {
      label: 'Local DAO',
      icon: 'landmark',
      accent: 'teal',
    },
    '/contact': {
      label: 'Contact',
      icon: 'envelope',
      accent: 'teal',
    },
  } as Record<string, HeaderBrand>,

  hero: {
    kicker: 'Open source · Cosmos · InterINNL',
    title: 'Water decisions backed by verifiable data',
    lead: 'Citizens deploy sensors, communities fund wells, utilities log usage and earn certificates. Every step can be recorded on-chain for transparency.',
    photo: {
      src: local('hero-river.jpg'),
      alt: 'Mountain lake at dawn with forest shoreline and calm reflective water',
      objectPosition: 'center 40%',
    },
    primaryCta: { label: 'Explore Citizen Science', route: '/citizen-science' },
    secondaryCta: { label: 'How it works', anchor: '#how-it-works' },
  },

  context: {
    title: 'Why water needs a shared record',
    lead: 'Water quality and access vary sharply between regions. Field readings, funding pledges, and utility savings are often scattered across spreadsheets and siloed systems.',
    body: 'AquaChain demos how Cosmos smart contracts can anchor that data so donors, regulators, and communities read the same numbers from one on-chain source.',
    photo: {
      src: local('context-monitoring.jpg'),
      alt: 'Water quality monitoring dashboard with smart sensor readings',
      objectPosition: 'center center',
    },
  },

  modulesSection: {
    title: 'Seven modules',
    lead: 'Pick a demo path. Each module maps to a CosmWasm contract.',
  },

  modules: [
    {
      id: 'citizen-science',
      name: 'Citizen Science',
      kicker: 'Field sensors',
      blurb:
        'Register sensors with GPS and metadata, stream readings into the chain, and earn rewards after validators approve trustworthy data.',
      route: '/citizen-science',
      icon: 'microscope',
      accent: 'teal' as const,
      photos: citizenSciencePhotos,
    },
    {
      id: 'water-well',
      name: 'Water Well Initiative',
      kicker: 'Community funding',
      blurb:
        'Propose wells, collect pledged donations in escrow, unlock tranches when milestones pass review, and disburse to beneficiaries on-chain.',
      route: '/water-well-initiative',
      icon: 'hand-holding-droplet',
      accent: 'amber' as const,
      photos: waterWellPhotos,
    },
    {
      id: 'utilities',
      name: 'Water Utilities',
      kicker: 'Footprint certificates',
      blurb:
        'Register utility accounts, log usage and savings events, pass validator review, and mint footprint certificates for verified reductions.',
      route: '/water-utilities',
      icon: 'chart-line',
      accent: 'slate' as const,
      photos: utilitiesPhotos,
    },
    {
      id: 'sustainable-actions',
      name: 'Sustainable Actions',
      kicker: 'Community rewards',
      blurb:
        'Log cleanups and conservation work with evidence, earn verifier approval, and receive on-chain rewards for verified impact.',
      route: '/sustainable-actions',
      icon: 'leaf',
      accent: 'teal' as const,
      photos: sustainableActionsPhotos,
    },
    {
      id: 'community-bounty',
      name: 'Community Bounty',
      kicker: 'Escrowed tasks',
      blurb:
        'Post sustainability bounties with escrowed rewards, collect worker submissions before the deadline, and approve a winner for automatic payout.',
      route: '/community-bounty',
      icon: 'people-group',
      accent: 'amber' as const,
      photos: communityBountyPhotos,
    },
    {
      id: 'water-credits',
      name: 'Water Credits',
      kicker: 'Conservation marketplace',
      blurb:
        'Trade internal water-conservation credits on a simple ledger. List balances for sale, buy with native tokens, or transfer credits peer to peer.',
      route: '/water-credits',
      icon: 'coins',
      accent: 'slate' as const,
      photos: waterCreditsPhotos,
    },
    {
      id: 'local-dao',
      name: 'Local DAO',
      kicker: 'Community governance',
      blurb:
        'Create proposals for local water projects, vote yes/no/abstain, and finalize outcomes once voting ends and quorum is met.',
      route: '/local-dao',
      icon: 'landmark',
      accent: 'teal' as const,
      photos: localDaoPhotos,
    },
  ] satisfies AcModule[],

  howItWorks: {
    title: 'How AquaChain works',
    lead: 'The demo follows one pattern across all three modules: capture intent on-chain, let independent verifiers approve it, then settle outcomes automatically.',
    intro:
      'Field contributors, donors, and utility operators sign transactions with Keplr. CosmWasm on wasmd stores the state so no single frontend can rewrite history after submission.',
    closing:
      'Connect Keplr on the configured test chain to try the full loop. Read-only views still load contract state through CosmJS queries so you can inspect maps, KPIs, and tables before signing anything.',
    photo: {
      src: local('utilities-well-monitoring.jpg'),
      alt: 'Industrial sensors monitoring a production water well',
      objectPosition: 'center 45%',
    },
    steps: [
      {
        title: 'Collect',
        body: 'Participants register the entities the chain must track: sensors with coordinates, well projects with funding goals, or company accounts with baseline usage. Each registration is a signed transaction that creates on-chain state other users can query immediately.',
        icon: 'satellite-dish',
      },
      {
        title: 'Record',
        body: 'Day-to-day events land as contract messages: sensor readings, donation pledges, milestone evidence, usage logs, or certificate requests. CosmWasm stores them in contract storage with deterministic ordering so history can be replayed from block events.',
        icon: 'link',
      },
      {
        title: 'Verify',
        body: 'Designated verifiers or validators review submissions against policy rules: plausible sensor ranges, photo proof for drilled wells, or reconciled meter data for utility savings. Approval messages flip flags in contract state; rejections keep funds locked or readings unrewarded.',
        icon: 'clipboard-check',
      },
      {
        title: 'Reward',
        body: 'Once rules pass, the contract settles: token payouts to sensor operators, escrow releases to well beneficiaries, or footprint certificates summarizing verified savings. Every payout or certificate hash is visible to wallets and indexers without exporting a private CSV.',
        icon: 'award',
      },
    ],
  },

  technology: {
    title: 'Powered by advanced technology',
    photo: {
      src: local('field-irrigation.jpg'),
      alt: 'Irrigation sprinklers watering crops in a green field',
      objectPosition: 'center 55%',
    },
    items: [
      {
        title: 'Blockchain Security',
        body: 'All data and transactions are secured on the Cosmos blockchain, ensuring transparency and immutability.',
        icon: 'link',
      },
      {
        title: 'AI-Powered Analytics',
        body: 'Advanced algorithms analyze water data to provide insights and recommendations for sustainable practices.',
        icon: 'brain',
      },
      {
        title: 'IoT Integration',
        body: 'Seamless connection with IoT sensors for real-time water quality and quantity monitoring.',
        icon: 'satellite-dish',
      },
      {
        title: 'Reward Mechanisms',
        body: 'Token-based incentives for sustainable water management practices and data contributions.',
        icon: 'award',
      },
    ],
  },

  integratedModules: {
    title: 'Blockchain-secured workflows',
    lead: 'Utilities, community wells, and citizen sensors on Cosmos. Each path is a live CosmWasm demo you can open below.',
    items: [
      {
        id: 'utilities',
        title: 'Water Utilities',
        body: 'Sensor data is sent to the blockchain and utilities receive water credits for complying with sustainability requirements.',
        route: '/water-utilities',
        icon: 'chart-line',
        accent: 'slate' as const,
        photos: utilitiesPhotos,
      },
      {
        id: 'water-well',
        title: 'Water Well Initiative',
        body: 'Donors and investors can track where their money is going for water projects and stake tokens in AquaChain.',
        route: '/water-well-initiative',
        icon: 'hand-holding-droplet',
        accent: 'amber' as const,
        photos: waterWellPhotos,
      },
      {
        id: 'citizen-science',
        title: 'Citizen Science',
        body: 'Citizens can buy specific sensors to monitor water quality or quantity and get rewarded for verified data.',
        route: '/citizen-science',
        icon: 'microscope',
        accent: 'teal' as const,
        photos: citizenSciencePhotos,
      },
    ] satisfies AcIntegratedModule[],
  },

  stack: {
    title: 'Built with',
    items: [
      {
        label: 'Cosmos SDK',
        href: 'https://github.com/cosmos/cosmos-sdk',
      },
      {
        label: 'CosmWasm',
        href: 'https://cosmwasm.com/',
      },
      {
        label: 'CosmJS',
        href: 'https://github.com/cosmos/cosmjs',
      },
      {
        label: 'Keplr',
        href: 'https://www.keplr.app/',
      },
      {
        label: 'Angular',
        href: 'https://angular.dev/',
      },
    ],
  },

  ecosystem: [
    { label: 'Cosmos', href: 'https://cosmos.network/' },
    { label: 'CosmWasm', href: 'https://cosmwasm.com/' },
    { label: 'wasmd', href: 'https://github.com/CosmWasm/wasmd' },
    { label: 'Confio', href: 'https://confio.xyz/' },
  ],

  interchouetteUrl: 'https://interchouette.net/',

  contact: {
    kicker: 'Get in touch',
    title: 'Contact AquaChain',
    lead: 'Questions about the demo, contracts, deployments, or InterINNL collaboration?',
    paragraphs: [
      'Use the form to reach Gregory Roussac. Typical topics: wiring AquaChain to your testnet, extending a CosmWasm module, or partnering on water and climate open source through InterINNL.',
      'Include enough context for a useful reply: which module you tried, chain ID, wallet address (if relevant), and what you expected versus what you saw.',
    ],
    recipientEmail: 'contact@interchouette.net',
    successMessage: 'Thanks. Your message was sent.',
    errorMessage:
      'Could not send your message. Try again or use the email link below.',
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

  nav: [
    { label: 'Home', route: '/' },
    { label: 'Citizen Science', route: '/citizen-science' },
    { label: 'Water Well', route: '/water-well-initiative' },
    { label: 'Water Utilities', route: '/water-utilities' },
    { label: 'Contact', route: '/contact' },
  ],

  moduleLinks: [
    {
      key: 'citizen-science' as ModuleHeroKey,
      label: 'Citizen Science',
      hint: 'Sensors and on-chain rewards',
      route: '/citizen-science',
    },
    {
      key: 'water-well-initiative' as ModuleHeroKey,
      label: 'Water Well Initiative',
      hint: 'Crowdfund well projects',
      route: '/water-well-initiative',
    },
    {
      key: 'water-utilities' as ModuleHeroKey,
      label: 'Water Utilities',
      hint: 'Usage logs and footprint certificates',
      route: '/water-utilities',
    },
    {
      key: 'sustainable-actions' as ModuleHeroKey,
      label: 'Sustainable Actions',
      hint: 'Verify eco actions and reward impact',
      route: '/sustainable-actions',
    },
    {
      key: 'community-bounty' as ModuleHeroKey,
      label: 'Community Bounty',
      hint: 'Escrow tasks and pay winners',
      route: '/community-bounty',
    },
    {
      key: 'water-credits' as ModuleHeroKey,
      label: 'Water Credits',
      hint: 'Buy and sell conservation credits',
      route: '/water-credits',
    },
    {
      key: 'local-dao' as ModuleHeroKey,
      label: 'Local DAO',
      hint: 'Propose and vote on local water projects',
      route: '/local-dao',
    },
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
    'sustainable-actions': {
      kicker: 'Module 4',
      title: 'Sustainable Actions',
      lead: 'Submit community conservation actions with evidence, verify impact, and reward contributors on-chain.',
      photo: {
        src: local('community-volunteers-india.jpg'),
        alt: 'Indian students volunteering during a community water workshop',
        objectPosition: 'center 35%',
      },
    },
    'community-bounty': {
      kicker: 'Module 5',
      title: 'Community Bounty',
      lead: 'Fund sustainability tasks with on-chain escrow. Workers submit before the deadline; the poster approves the winner for payout.',
      photo: {
        src: local('community-bounty-team.jpg'),
        alt: 'Volunteer team sharing a meal after a community sustainability event',
        objectPosition: 'center center',
      },
    },
    'water-credits': {
      kicker: 'Module 6',
      title: 'Water Credits',
      lead: 'Mint and trade internal conservation credits. List credits for sale, pay with OSMO, and settle transfers atomically on-chain.',
      photo: {
        src: local('context-monitoring.jpg'),
        alt: 'Utility dashboard tracking verified water savings and credit balances',
        objectPosition: 'center center',
      },
    },
    'local-dao': {
      kicker: 'Module 7',
      title: 'Local DAO',
      lead: 'Govern neighbourhood water priorities on-chain. Members submit proposals, cast votes, and finalize passed actions after the voting window closes.',
      photo: {
        src: local('CS4Water-conference-2048x1536.jpg'),
        alt: 'Community workshop on water stewardship and local governance',
        objectPosition: 'center center',
      },
    },
  } satisfies Record<ModuleHeroKey, ModuleHero>,
};
