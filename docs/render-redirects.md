# Render redirect and rewrite rules

Site: `interinnl.interchouette.net`  
Publish directory: `dist/apps/aquachain/browser` (combined hub + AquaChain tree)

The build copies `apps/interinnl/public/_redirects` to the publish root. You can use that file **or** paste the same rules in the Render dashboard. Do not configure both differently.

## Render dashboard (Redirect and Rewrite Rules)

Add rules **in this order** (most specific first). Render runs top to bottom.

| Source | Destination | Action in Render UI |
| --- | --- | --- |
| `/aquachain` | `/aquachain/` | **Redirect** |
| `/aquachain/` | `/aquachain/index.html` | **Rewrite** |
| `/aquachain/*` | `/aquachain/index.html` | **Rewrite** |
| `/citizen-science` | `/aquachain/citizen-science` | **Redirect** |
| `/water-well-initiative` | `/aquachain/water-well-initiative` | **Redirect** |
| `/water-utilities` | `/aquachain/water-utilities` | **Redirect** |
| `/demo` | `/aquachain/citizen-science` | **Redirect** |
| `/*` | `/index.html` | **Rewrite** |

### What `/aquachain/*` means

The `*` is a wildcard. It matches any path **under** `/aquachain/`, for example:

- `/aquachain/citizen-science`
- `/aquachain/water-well-initiative`
- `/aquachain/contact`

**Rewrite** to `/aquachain/index.html` means: keep the URL in the browser, but serve the AquaChain `index.html` file. The Angular app (base href `/aquachain/`) then routes to the correct page.

**Redirect** means: browser URL changes (301) to the destination path.

### What each app gets

| Browser URL | SPA loaded |
| --- | --- |
| `/` | InterINNL hub (`/index.html`) |
| `/aquachain/` | AquaChain home |
| `/aquachain/citizen-science` | AquaChain Citizen Science |
| `/citizen-science` | Redirects to `/aquachain/citizen-science` |

### Do not add

- A `_redirects` file inside `/aquachain/` on the deployed site (`/*` → `/index.html` there would load the **hub** and break AquaChain).

`scripts/build-site.sh` removes that nested file after assembly.

## `_redirects` file (same rules)

Equivalent Netlify/Render static file format (already in repo):

```text
/aquachain              /aquachain/                         301
/aquachain/             /aquachain/index.html               200
/aquachain/*            /aquachain/index.html               200
/citizen-science        /aquachain/citizen-science          301
/water-well-initiative  /aquachain/water-well-initiative    301
/water-utilities        /aquachain/water-utilities          301
/demo                   /aquachain/citizen-science          301
/*                      /index.html                         200
```

`200` in the file = **Rewrite** in Render. `301` in the file = **Redirect** in Render.
