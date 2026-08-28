/** AquaChain site copy and photo catalog (English). */

const localPhoto = (name: string) => {
  if (/\.(svg|webp)$/i.test(name)) {
    return `photos/${name}`;
  }
  return `photos/${name.replace(/\.(png|jpe?g)$/i, '')}.webp`;
};

export interface AcPhoto {
  src: string;
  alt: string;
  objectPosition?: string;
  fit?: 'cover' | 'contain';
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
  | 'local-dao'
  | 'cross-exchange'
  | 'agent-ops';

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

export interface NavLink {
  label: string;
  route: string;
}

export interface SiteNav {
  home: NavLink;
  contact: NavLink;
  featuredModules: NavLink[];
  moreModules: NavLink[];
  moreMenuLabel: string;
}

export interface AgentOpsStep {
  title: string;
  body: string;
  icon: string;
}

export interface AgentOpsContent {
  kicker: string;
  title: string;
  lead: string;
  body: string;
  photo: AcPhoto;
  samplePayload: Record<string, string | number>;
  sampleNote: string;
  loop: {
    title: string;
    lead: string;
    steps: AgentOpsStep[];
  };
  hybrid: {
    title: string;
    paragraphs: string[];
    layers: Array<{ label: string; detail: string }>;
  };
  gateway: {
    title: string;
    lead: string;
    notConfigured: string;
  };
  links: {
    dao: NavLink;
    citizenScience: NavLink;
  };
}

const crossExchangePhotos: AcPhoto[] = [
  {
    src: localPhoto('hero-river.jpg'),
    alt: 'River flowing through an Indian watershed used for cross-region water accounting',
    objectPosition: 'center center',
  },
  {
    src: localPhoto('field-irrigation.jpg'),
    alt: 'Irrigation channels linking farm districts to shared water ledgers',
    objectPosition: 'center center',
  },
];

const agentOpsPhotos: AcPhoto[] = [
  {
    src: localPhoto('nqi1nt0hbsw67p315qj4-4111816589.webp'),
    alt: 'x402 Protocol for developers: monetize APIs in USDC',
    objectPosition: 'center top',
  },
  {
    src: localPhoto('agent-x402-pay-router.svg'),
    alt: 'Diagram: AquaChain Pay Router with x402 agent-to-agent USDC paid toll calls',
    objectPosition: 'center center',
    fit: 'contain',
  },
];

const localDaoPhotos: AcPhoto[] = [
  {
    src: localPhoto('CS4Water-conference-2048x1536.jpg'),
    alt: 'Community workshop on water stewardship and local governance',
    objectPosition: 'center center',
  },
  {
    src: localPhoto('local-dao-forum.jpg'),
    alt: 'Community members discussing sustainability plans together',
    objectPosition: 'center center',
  },
];

const waterCreditsPhotos: AcPhoto[] = [
  {
    src: localPhoto('context-monitoring.jpg'),
    alt: 'Water monitoring dashboard with live sensor readings',
    objectPosition: 'center center',
  },
  {
    src: localPhoto('utilities-well-monitoring.jpg'),
    alt: 'Industrial sensors monitoring a production water well in India',
    objectPosition: 'center 45%',
  },
];

const communityBountyPhotos: AcPhoto[] = [
  {
    src: localPhoto('community-bounty-team.jpg'),
    alt: 'Community members collaborating over a shared meal after a volunteer event',
    objectPosition: 'center center',
  },
  {
    src: localPhoto('community-bounty-field.jpg'),
    alt: 'Agricultural drone over green fields near an Indian city skyline',
    objectPosition: 'center center',
  },
];

const sustainableActionsPhotos: AcPhoto[] = [
  {
    src: localPhoto('community-volunteers-india.jpg'),
    alt: 'Indian students raising hands during a community water workshop',
    objectPosition: 'center 35%',
  },
  {
    src: localPhoto('sustainable-farming-india.jpg'),
    alt: 'Farmer operating an agricultural drone over green fields near an Indian city',
    objectPosition: 'center center',
  },
  {
    src: localPhoto('field-irrigation.jpg'),
    alt: 'Irrigation sprinklers watering crops for efficient water use',
    objectPosition: 'center 55%',
  },
];

const citizenSciencePhotos: AcPhoto[] = [
  {
    src: localPhoto(
      'well-designed-citizen-science-projects-can-help-monitor-sdg-6-864986179.jpg',
    ),
    alt: 'Researchers and volunteers monitoring water quality in a field wetland',
    objectPosition: 'center 40%',
  },
  {
    src: localPhoto('CS4Water-conference-2048x1536.jpg'),
    alt: 'Conference audience at a citizen science for water session',
    objectPosition: 'center center',
  },
];

const waterWellPhotos: AcPhoto[] = [
  {
    src: localPhoto(
      'How-to-Make-a-Well-Produce-More-Water-Increase-Well-Yield-with-RAFSUN-Submersible-Pumps-1313991184.jpg',
    ),
    alt: 'Workers installing a submersible pump into a community well',
    objectPosition: 'center center',
  },
  {
    src: localPhoto('water-well-2-600x400-976489662.jpg'),
    alt: 'Rural WASH facility with overhead water tank and signage',
    objectPosition: 'center center',
  },
];

const utilitiesPhotos: AcPhoto[] = [
  {
    src: localPhoto(
      '800x400-combined-sewer-overflows-treatment-plant-3285836854.jpg',
    ),
    alt: 'Aerial view of circular wastewater treatment basins in a green field',
    objectPosition: 'center center',
  },
  {
    src: localPhoto(
      'Best-ETP-plant-supplier-Delhi-NCR-Call-Now-9653247121-08-28-2026_02_16_AM.png',
    ),
    alt: 'Effluent treatment plant with aeration tanks and yellow safety walkways',
    objectPosition: 'center center',
  },
  {
    src: localPhoto(
      'Best-Water-Filtration-Plant-Manufacturer-in-Delhi-08-28-2026_02_14_AM.png',
    ),
    alt: 'Industrial water filtration plant with blue piping and storage tanks',
    objectPosition: 'center center',
  },
  {
    src: localPhoto(
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
  githubFrontend: 'https://github.com/InterINNL/frontend',
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
    '/cross-exchange': {
      label: 'Cross Exchange',
      icon: 'right-left',
      accent: 'amber',
    },
    '/contact': {
      label: 'Contact',
      icon: 'envelope',
      accent: 'teal',
    },
    '/agent-ops': {
      label: 'Agent Ops',
      icon: 'robot',
      accent: 'amber',
    },
  } as Record<string, HeaderBrand>,

  hero: {
    kicker: 'Open source · Cosmos · InterINNL',
    title: 'Water decisions backed by verifiable data',
    lead: 'Citizens deploy sensors, communities fund wells, utilities log usage and earn certificates. Every step can be recorded on-chain for transparency.',
    photo: {
      src: localPhoto('hero-river.jpg'),
      alt: 'Mountain lake at dawn with forest shoreline and calm reflective water',
      objectPosition: 'center 40%',
    },
    primaryCta: { label: 'Explore Citizen Science', route: '/citizen-science' },
    secondaryCta: { label: 'Agent Ops (Module 9)', route: '/agent-ops' },
  },

  context: {
    title: 'Why water needs a shared record',
    lead: 'Water quality and access vary sharply between regions. Field readings, funding pledges, and utility savings are often scattered across spreadsheets and siloed systems.',
    body: 'AquaChain demos how Cosmos smart contracts can anchor that data so donors, regulators, and communities read the same numbers from one on-chain source.',
    photo: {
      src: localPhoto('context-monitoring.jpg'),
      alt: 'Water quality monitoring dashboard with smart sensor readings',
      objectPosition: 'center center',
    },
  },

  modulesSection: {
    title: 'Nine modules',
    lead: 'Eight CosmWasm demos on Osmosis plus Agent Ops: x402 USDC pay router for autonomous field agents.',
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
    {
      id: 'cross-exchange',
      name: 'Cross Exchange',
      kicker: 'IBC partner ledgers',
      blurb:
        'Demo IBC-style regional water ledgers: swap OSMO against registered Indian partner units at fixed on-chain rates, lock balances, and redeem for off-chain stewardship credits.',
      route: '/cross-exchange',
      icon: 'right-left',
      accent: 'amber' as const,
      photos: crossExchangePhotos,
    },
    {
      id: 'agent-ops',
      name: 'Agent Ops',
      kicker: 'Module 9 · x402 Pay Router',
      blurb:
        'Autonomous agents pay USDC per API call via HTTP 402. AquaChain Pay Router verifies x402, relays drone readings to Osmosis, and supports agent-to-agent paid toll calls.',
      route: '/agent-ops',
      icon: 'robot',
      accent: 'amber' as const,
      photos: agentOpsPhotos,
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
      src: localPhoto('utilities-well-monitoring.jpg'),
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
      src: localPhoto('field-irrigation.jpg'),
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
        label: 'IBC',
        href: 'https://ibc.cosmos.network/',
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
    recipientEmail: 'contact+aquachain@interchouette.net',
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

  nav: {
    home: { label: 'Home', route: '/' },
    contact: { label: 'Contact', route: '/contact' },
    featuredModules: [
      { label: 'Agent Ops', route: '/agent-ops' },
      { label: 'Citizen Science', route: '/citizen-science' },
      { label: 'Water Well', route: '/water-well-initiative' },
    ],
    moreModules: [
      { label: 'Water Utilities', route: '/water-utilities' },
      { label: 'Sustainable Actions', route: '/sustainable-actions' },
      { label: 'Community Bounty', route: '/community-bounty' },
      { label: 'Water Credits', route: '/water-credits' },
      { label: 'Local DAO', route: '/local-dao' },
      { label: 'Cross Exchange', route: '/cross-exchange' },
    ],
    moreMenuLabel: 'More modules',
  } satisfies SiteNav,

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
    {
      key: 'cross-exchange' as ModuleHeroKey,
      label: 'Cross Exchange',
      hint: 'Swap base tokens for partner ledger units',
      route: '/cross-exchange',
    },
    {
      key: 'agent-ops' as ModuleHeroKey,
      label: 'Agent Ops',
      hint: 'x402 USDC pay router for autonomous agents',
      route: '/agent-ops',
    },
  ],

  moduleHeroes: {
    'citizen-science': {
      kicker: 'Module 1',
      title: 'Citizen Science',
      lead: 'Monitor water quality and quantity. Submit readings and earn rewards when data is verified.',
      photo: {
        src: localPhoto('citizen-sensor-kit.jpg'),
        alt: 'Portable water quality sensor kit for field measurements',
      },
    },
    'water-well-initiative': {
      kicker: 'Module 2',
      title: 'Water Well Initiative',
      lead: 'Crowdfund well projects on-chain: create, validate, donate, unlock, and disburse.',
      photo: {
        src: localPhoto('community-well.jpg'),
        alt: 'Community hand pump and well used for daily water access',
        objectPosition: 'center center',
      },
    },
    'water-utilities': {
      kicker: 'Module 3',
      title: 'Water Utilities',
      lead: 'Register utilities, log usage and savings, validate entries, and issue footprint certificates.',
      photo: {
        src: localPhoto('hero-utilities-plant.jpg'),
        alt: 'Water treatment facility with pipes and monitoring equipment',
      },
    },
    'sustainable-actions': {
      kicker: 'Module 4',
      title: 'Sustainable Actions',
      lead: 'Submit community conservation actions with evidence, verify impact, and reward contributors on-chain.',
      photo: {
        src: localPhoto('community-volunteers-india.jpg'),
        alt: 'Indian students volunteering during a community water workshop',
        objectPosition: 'center 35%',
      },
    },
    'community-bounty': {
      kicker: 'Module 5',
      title: 'Community Bounty',
      lead: 'Fund sustainability tasks with on-chain escrow. Workers submit before the deadline; the poster approves the winner for payout.',
      photo: {
        src: localPhoto('community-bounty-team.jpg'),
        alt: 'Volunteer team sharing a meal after a community sustainability event',
        objectPosition: 'center center',
      },
    },
    'water-credits': {
      kicker: 'Module 6',
      title: 'Water Credits',
      lead: 'Mint and trade internal conservation credits. List credits for sale, pay with OSMO, and settle transfers atomically on-chain.',
      photo: {
        src: localPhoto('context-monitoring.jpg'),
        alt: 'Utility dashboard tracking verified water savings and credit balances',
        objectPosition: 'center center',
      },
    },
    'local-dao': {
      kicker: 'Module 7',
      title: 'Local DAO',
      lead: 'Govern neighbourhood water priorities on-chain. Members submit proposals, cast votes, and finalize passed actions after the voting window closes.',
      photo: {
        src: localPhoto('CS4Water-conference-2048x1536.jpg'),
        alt: 'Community workshop on water stewardship and local governance',
        objectPosition: 'center center',
      },
    },
    'cross-exchange': {
      kicker: 'Module 8',
      title: 'Cross Exchange',
      lead: 'IBC-ready demo: swap OSMO for registered Indian regional water ledgers, lock partner units on-chain, and redeem for off-chain stewardship credits.',
      photo: {
        src: localPhoto('hero-river.jpg'),
        alt: 'River watershed connecting communities to shared water accounting',
        objectPosition: 'center center',
      },
    },
    'agent-ops': {
      kicker: 'Module 9 · Agent Ops',
      title: 'Agent Ops',
      lead: 'AquaChain Pay Router: x402 USDC micropayments for drone agents, with agent-to-agent paid toll calls and Osmosis relay.',
      photo: {
        src: localPhoto('agent-x402-pay-router.svg'),
        alt: 'AquaChain Pay Router diagram',
        fit: 'contain',
      },
    },
  } satisfies Record<ModuleHeroKey, ModuleHero>,

  agentOps: {
    kicker: 'Module 9 · x402 Pay Router',
    title: 'Agent Ops',
    lead: 'Drone agents pay USDC via HTTP 402. Measurements land on Osmosis CosmWasm. Communities govern what happens next.',
    body: 'AquaChain keeps human wallets on Cosmos while autonomous agents use x402 micropayments on Base Sepolia. The Pay Router validates toll payments, normalizes drone JSON, and relays submit_data to citizen-science-registry.',
    photo: {
      src: localPhoto('nqi1nt0hbsw67p315qj4-4111816589.webp'),
      alt: 'x402 Protocol for developers: monetize APIs in USDC',
      objectPosition: 'center top',
    },
    samplePayload: {
      lat: '28.70',
      lon: '77.22',
      turbidity: '14.2',
      image_hash: 'sha256:demo-yamuna-frame-001',
      flight_id: 'yamuna-drone-001',
      sensor_id: 1,
      unit: 'NTU',
      site: 'Yamuna Wazirabad barrage, Delhi NCR, India',
    },
    sampleNote:
      'Numeric fields are strings so CosmWasm JSON accepts them when the gateway relays submit_data.',
    loop: {
      title: 'Pay · Measure · Record · Verify · Govern',
      lead: 'One loop from autonomous capture to community decisions.',
      steps: [
        {
          title: 'Pay',
          body: 'Agent receives HTTP 402, signs USDC authorization via x402, retries with PAYMENT-SIGNATURE.',
          icon: 'credit-card',
        },
        {
          title: 'Measure',
          body: 'Drone posts turbidity, coordinates, and an image hash for a river segment.',
          icon: 'helicopter',
        },
        {
          title: 'Record',
          body: 'Gateway relays submit_data to citizen-science-registry on osmo-test-5.',
          icon: 'link',
        },
        {
          title: 'Verify',
          body: 'Registered verifiers or policy agents approve readings inside acceptable bounds.',
          icon: 'clipboard-check',
        },
        {
          title: 'Govern',
          body: 'Local DAO proposals can fund bounties or rewards when thresholds are met (G2).',
          icon: 'landmark',
        },
      ],
    },
    hybrid: {
      title: 'Why USDC on Base while the chain is Osmosis',
      paragraphs: [
        'x402 is an HTTP-native payment rail. Facilitators settle USDC on EVM networks today, which is what autonomous agents expect.',
        'Aquachain stewardship data stays on CosmWasm. The gateway is the deliberate bridge: agents never need Keplr; humans never need an EVM wallet to read the same on-chain record.',
      ],
      layers: [
        {
          label: 'Agents',
          detail: 'USDC or USDT via x402 on Base Sepolia (demo network)',
        },
        {
          label: 'Gateway',
          detail:
            'Verifies payment, normalizes drone JSON, signs Osmosis relay tx',
        },
        {
          label: 'Humans',
          detail:
            'Keplr + OSMO on osmo-test-5 for wells, DAO votes, and bounties',
        },
      ],
    },
    gateway: {
      title: 'AquaChain Pay Router',
      lead: 'Live x402 verify/settle on Base Sepolia. Agent-to-agent USDC toll calls. Osmosis relay to citizen-science-registry when configured.',
      notConfigured:
        'Set agentGatewayUrl in the app environment to probe a running gateway (/v1/capabilities).',
    },
    links: {
      dao: { label: 'Local DAO', route: '/local-dao' },
      citizenScience: { label: 'Citizen Science', route: '/citizen-science' },
    },
  } satisfies AgentOpsContent,
};
