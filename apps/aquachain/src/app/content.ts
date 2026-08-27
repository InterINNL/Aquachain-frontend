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
  copyrightYear: 2025,

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
    paragraphs: [
      'Water quality, groundwater levels, and access to safe drinking water vary sharply between regions and seasons. Field teams capture readings in notebooks, donors track pledges in spreadsheets, and utilities report savings in internal dashboards. None of these sources agree by default, and none of them give communities a durable proof that work was done or money was spent as promised.',
      'AquaChain is an InterINNL hackathon demo that shows how a Cosmos chain can act as a neutral ledger for water data. CosmWasm smart contracts store sensor registrations, well project state, donation balances, and utility footprint entries so every participant reads the same numbers from the same contract state.',
      'The frontend is an Angular app connected through CosmJS and Keplr. You can walk through three modules without changing how the contracts behave: register field hardware, crowdfund wells, or log corporate water savings and certificates.',
    ],
  },

  platform: {
    title: 'What you can explore in the demo',
    lead: 'Each module maps to a deployed CosmWasm contract. Tabs, tables, and maps are UI only; writes go through wallet-signed transactions.',
    points: [
      {
        title: 'Citizen Science',
        body: 'Register sensors with location and metadata, submit water quality or quantity readings, and route them through an on-chain verification flow. Approved data can trigger token rewards so contributors see a direct link between accurate field work and settlement.',
      },
      {
        title: 'Water Well Initiative',
        body: 'Communities propose well projects with targets and milestones. Donors pledge funds that stay in contract escrow until validators confirm progress photos, drill depth, or pump installation. Released funds disburse to beneficiaries with an auditable history of every transfer.',
      },
      {
        title: 'Water Utilities',
        body: 'Industrial and municipal actors register companies, log baseline usage, record conservation measures, and request validation of savings. Successful reviews issue footprint certificates that summarize verified reductions without exposing raw operational detail on every public query.',
      },
    ],
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
      photo: {
        src: local('citizen-sensor-kit.jpg'),
        alt: 'Portable water quality sensor kit for field measurements',
        objectPosition: 'center 45%',
      },
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
        'Register utility accounts, log usage and savings events, pass validator review, and mint footprint certificates for verified reductions.',
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
    title: 'How AquaChain works',
    lead: 'The demo follows one pattern across all three modules: capture intent on-chain, let independent verifiers approve it, then settle outcomes automatically.',
    intro: [
      'Field contributors, donors, and utility operators each interact through the same wallet flow. CosmJS builds transactions, Keplr signs them, and wasmd executes CosmWasm logic that no single frontend can rewrite after submission.',
      'That separation matters for water programs where trust is scarce. A community sees pledged well funds locked in contract escrow, not in a database row. A regulator can query certificate issuance without trusting a vendor portal. A sensor owner can prove a reading hash was recorded before a dispute arises.',
      'Below is the lifecycle every module shares. Citizen Science emphasizes collection and rewards, Water Well emphasizes escrow and disbursement, and Water Utilities emphasizes audited savings and certificates.',
    ],
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
    closing:
      'Connect Keplr on the configured test chain to try the full loop. Read-only views still load contract state through CosmJS queries so you can inspect maps, KPIs, and tables before signing anything.',
  },

  technology: {
    title: 'Powered by advanced technology',
    items: [
      {
        title: 'Blockchain Security',
        body:
          'All data and transactions are secured on the Cosmos blockchain, ensuring transparency and immutability.',
        icon: 'link',
      },
      {
        title: 'AI-Powered Analytics',
        body:
          'Advanced algorithms analyze water data to provide insights and recommendations for sustainable practices.',
        icon: 'brain',
      },
      {
        title: 'IoT Integration',
        body:
          'Seamless connection with IoT sensors for real-time water quality and quantity monitoring.',
        icon: 'satellite-dish',
      },
      {
        title: 'Reward Mechanisms',
        body:
          'Token-based incentives for sustainable water management practices and data contributions.',
        icon: 'award',
      },
    ],
  },

  integratedModules: {
    title: 'Three Integrated Modules',
    lead:
      'Blockchain-secured workflows for utilities, community wells, and citizen sensors. Each path is a live CosmWasm demo you can open below.',
    items: [
      {
        id: 'utilities',
        title: 'Water Utilities',
        body:
          'Sensor data is sent to the blockchain and utilities receive water credits for complying with sustainability requirements.',
        route: '/water-utilities',
        icon: 'chart-line',
        accent: 'slate' as const,
      },
      {
        id: 'water-well',
        title: 'Water Well Initiative',
        body:
          'Donors and investors can track where their money is going for water projects and stake tokens in AquaChain.',
        route: '/water-well-initiative',
        icon: 'hand-holding-droplet',
        accent: 'amber' as const,
      },
      {
        id: 'citizen-science',
        title: 'Citizen Science',
        body:
          'Citizens can buy specific sensors to monitor water quality or quantity and get rewarded for verified data.',
        route: '/citizen-science',
        icon: 'microscope',
        accent: 'teal' as const,
      },
    ],
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
