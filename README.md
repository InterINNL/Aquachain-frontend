# InterINNL website (Nx)

This repository is the **InterINNL** community site monorepo. AquaChain is one hackathon project app inside it, not the org itself.

| URL                                                                                     | App              |
| --------------------------------------------------------------------------------------- | ---------------- |
| [interinnl.interchouette.net](https://interinnl.interchouette.net/)                     | `apps/interinnl` |
| [interinnl.interchouette.net/aquachain](https://interinnl.interchouette.net/aquachain/) | `apps/aquachain` |

CosmWasm contracts live in a sibling checkout: `../aquachain/contracts` ([Aquachain-contracts](https://github.com/InterINNL/Aquachain-contracts)).

## Apps

| App           | Role                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| **interinnl** | Community hub (AI, LLMs, blockchain, mission, projects, join)           |
| **aquachain** | Water management CosmWasm demo (Citizen Science, Water Well, Utilities) |

## Stack

- Angular 22 + Nx 23
- CosmJS / Keplr (AquaChain only)
- Bootstrap + Font Awesome (AquaChain)

## Quick start

```sh
npm install
npm start                 # InterINNL hub :4200
npm run start:aquachain   # AquaChain alone :4200 (dev baseHref /)
npm run build:site        # Combined static site → dist/site
```

| Script                      | Action                                         |
| --------------------------- | ---------------------------------------------- |
| `npm start`                 | Serve InterINNL hub                            |
| `npm run start:aquachain`   | Serve AquaChain (local RPC proxy)              |
| `npm run build:site`        | Production hub + AquaChain under `/aquachain/` |
| `npm test` / `npm run lint` | Both apps                                      |

### Render (static site)

| Setting           | Value                                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| Branch            | `dev`                                                                  |
| Build             | `npm install; npm run build` (`build` runs `build:site`)               |
| Publish directory | `dist/apps/aquachain/browser` (mirrored combined site; or `dist/site`) |

`build:site` builds both apps, writes `dist/site/`, and mirrors that tree into `dist/apps/aquachain/browser` so the existing Render publish path keeps working.

SPA routing is defined in `apps/interinnl/public/_redirects` (copied to the publish root). AquaChain must not ship a nested `_redirects` under `/aquachain/` (that would rewrite to the InterINNL hub `index.html`). Full Render dashboard table: `docs/render-redirects.md`.

## AquaChain modules

| Module                    | Purpose                            | UI status                 |
| ------------------------- | ---------------------------------- | ------------------------- |
| **Citizen Science**       | Sensors, readings, rewards         | Wired to CosmWasm + Keplr |
| **Water Utilities**       | Usage logs, footprint certificates | Wired to CosmWasm + Keplr |
| **Water Well Initiative** | Crowdfund water projects           | Wired to CosmWasm + Keplr |
| **Sustainable Actions**   | Eco community actions + rewards    | Wired to CosmWasm + Keplr |
| **Community Bounty**      | Escrowed sustainability tasks      | Wired to CosmWasm + Keplr |
| **Water Credits**         | Conservation credit marketplace    | Wired to CosmWasm + Keplr |
| **Local DAO**             | Community proposals and voting     | Wired to CosmWasm + Keplr |

Demo geography in seeds and copy uses Indian cities and regions (Delhi, Bengaluru, Udaipur, Mumbai, etc.).

## Local chain (AquaChain)

Defaults in `apps/aquachain/src/environments/environment.ts`:

| Setting           | Expected value                        |
| ----------------- | ------------------------------------- |
| `chainId`         | `testing`                             |
| Bech32 prefix     | `wasm`                                |
| Fee / stake denom | `ustake`                              |
| Tendermint RPC    | `http://localhost:26657` (via `/rpc`) |
| REST / LCD        | `http://localhost:1317`               |

RPC is proxied for AquaChain serve: browser calls `/rpc` → Tendermint on `localhost:26657` (`proxy.conf.json`).
