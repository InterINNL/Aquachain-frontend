# AquaChain

Blockchain-secured decision support for smart water management. AquaChain combines Cosmos / CosmWasm, AI analytics, and IoT so utilities, donors, and citizens can share verified water data and earn rewards for sustainable practices.

**Live demo:** [interinnl.interchouette.net](https://interinnl.interchouette.net)

## Modules

| Module | Purpose | UI status |
| --- | --- | --- |
| **Citizen Science** | Register sensors, submit readings, earn rewards for verified data | Wired to CosmWasm + Keplr |
| **Water Utilities** | On-chain sensor feeds and sustainability credits | Landing / stub |
| **Water Well Initiative** | Track funding for water projects and stake on AquaChain | Landing / stub |

## Stack

- Angular 20 + Nx
- CosmJS (`@cosmjs/cosmwasm-stargate`)
- Keplr wallet
- Bootstrap + Font Awesome

## Quick start (frontend)

```sh
npm install
npm run start
```

Dev server: [http://localhost:4200](http://localhost:4200)

RPC is proxied: browser calls `/rpc` → Tendermint RPC on `localhost:26657` (see `proxy.conf.json`).

| Script | Action |
| --- | --- |
| `npm run start` | Dev server with RPC proxy |
| `npm run build` | Production build → `dist/apps/aquachain` |
| `npm run test` | Unit tests |
| `npm run e2e` | Cypress against `:4200` |

### Render (static site)

| Setting | Value |
| --- | --- |
| Branch | `dev` |
| Build | `npm install; npm run build` |
| Publish directory | `dist/apps/aquachain/browser` |

Angular application builder puts `index.html` under `browser/`. Publishing the parent folder leaves `/` without an index and returns 404.

## Local chain the UI expects

Citizen Science talks to a CosmWasm-capable node with Keplr. Defaults in `apps/aquachain/src/environments/environment.ts`:

| Setting | Expected value |
| --- | --- |
| `chainId` | `testing` |
| Bech32 prefix | `wasm` |
| Fee / stake denom | `ustake` (display `STAKE`, 6 decimals) |
| Tendermint RPC | `http://localhost:26657` (via `/rpc` in the browser) |
| REST / LCD | `http://localhost:1317` |
| Gas price | `0.025ustake` |
| Contract | `CitizenScienceContractAddress` in the env file |

Keplr is suggested as **Local Testing Chain** with those parameters (`wallet` service).

Without a node on those ports, wallet connect and contract calls fail even if the Angular app loads.

## Boot a testnode quickly (checklist)

Goal: local `wasmd` (or compatible CosmWasm chain) so `/citizen-science` works end to end.

### 1. Install toolchain

- [wasmd](https://github.com/CosmWasm/wasmd) (CosmWasm-enabled Cosmos SDK binary) on `PATH`
- Rust **nightly** + `wasm32-unknown-unknown` (contract builds use `-Zbuild-std`)
- `jq`
- [Keplr](https://www.keplr.app/) browser extension

### 2. Start a single-node chain

Match the frontend:

- `chain-id`: `testing`
- Account prefix: `wasm` (wasmd default)
- Bond / fee denom: `ustake`
- RPC: `:26657`
- REST / API: `:1317`
- At least one funded key (genesis account or faucet) you can import into Keplr

Typical wasmd single-node flow (adjust key names and paths as needed):

```sh
wasmd init local --chain-id testing
# Configure genesis denom ustake, add genesis account(s), gentx, collect-gentxs
wasmd start
```

Confirm:

```sh
curl -s http://localhost:26657/status | head
curl -s http://localhost:1317/cosmos/base/tendermint/v1beta1/node_info | head
```

### 3. Deploy the Citizen Science contract

Build and instantiate the **citizen-science-registry** CosmWasm contract against this node (`CHAIN_ID=testing`, `NODE=http://localhost:26657`, `DENOM=ustake`). Store the resulting address.

### 4. Point the frontend at the contract

Set in `apps/aquachain/src/environments/environment.ts`:

```ts
CitizenScienceContractAddress: '<deployed-wasm-address>',
chainId: 'testing',
rpcEndpoint: 'http://localhost:4200/rpc',
restEndpoint: 'http://localhost:1317',
gasPrice: '0.025ustake',
```

### 5. Run the app and connect Keplr

```sh
npm run start
```

Open [http://localhost:4200/citizen-science](http://localhost:4200/citizen-science), approve the suggested chain, fund the Keplr account with `ustake` if needed, then register a sensor / submit data.

### Still missing in-repo (for a one-command boot)

These are not shipped as a single script yet:

- Documented / scripted `wasmd` genesis + start (Docker or Make)
- Local faucet for Keplr accounts
- Deploy Makefile defaults aligned to local `testing` / `ustake` (Citizen Science Makefile currently targets another network)
- Automatic write-back of `contract_addr.txt` into `environment.ts`
- Wired UI for Water Utilities and Water Well Initiative

Until those exist, follow the checklist above manually.

## Configuration files

| File | Role |
| --- | --- |
| `apps/aquachain/src/environments/environment.ts` | Dev chain + contract address |
| `apps/aquachain/src/environments/environment.prod.ts` | Production build env |
| `proxy.conf.json` | Dev proxy `/rpc` → `localhost:26657` |

## License

MIT
