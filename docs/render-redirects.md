# Render redirect and rewrite rules

Site: `interinnl.interchouette.net`  
Publish directory: `dist/apps/aquachain/browser`

## Render dashboard (top to bottom)

| Source | Destination | Action |
| --- | --- | --- |
| `/aquachain` | `/aquachain/` | **Redirect** |
| `/aquachain/` | `/aquachain/index.html` | **Rewrite** |
| `/aquachain/*` | `/aquachain/index.html` | **Rewrite** |
| `/*` | `/index.html` | **Rewrite** |

`/aquachain/*` matches deep links such as `/aquachain/citizen-science`. **Rewrite** serves AquaChain `index.html` while the URL stays the same.

Do not put `/*` above the AquaChain rules. Do not add a `_redirects` file under `/aquachain/` on the deployed site.

The build copies `apps/interinnl/public/_redirects` to the publish root. Use that file **or** the dashboard table above, not both with different order.

## URLs

| Browser URL | App |
| --- | --- |
| `/` | InterINNL hub |
| `/aquachain/` | AquaChain home |
| `/aquachain/citizen-science` | AquaChain Citizen Science |
