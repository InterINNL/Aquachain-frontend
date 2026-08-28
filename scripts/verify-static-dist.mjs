#!/usr/bin/env node
/**
 * Assert assembled dist/site layout after `npm run build:site`.
 */
import { access, constants, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(process.cwd(), 'dist', 'site');

const required = [
  'index.html',
  'sitemap.xml',
  'robots.txt',
  'llms.txt',
  '.well-known/mcp.json',
  '_redirects',
  'og-interinnl.svg',
  'aquachain/index.html',
  'aquachain/contact/index.html',
  'aquachain/citizen-science/index.html',
  'aquachain/agent-ops/index.html',
];

const htmlSamples = [
  'index.html',
  'aquachain/index.html',
  'aquachain/contact/index.html',
  'aquachain/citizen-science/index.html',
];

async function mustExist(rel) {
  const full = join(root, rel);
  try {
    await access(full, constants.R_OK);
  } catch {
    console.error(`missing publish file: ${rel}`);
    process.exitCode = 1;
  }
}

async function mustHaveHydrationMarker(rel) {
  const html = await readFile(join(root, rel), 'utf8');
  if (!html.includes('<!--nghm-->')) {
    console.error(`missing Angular hydration marker <!--nghm-->: ${rel}`);
    process.exitCode = 1;
  }
}

async function mustDiscoverAgents() {
  const card = JSON.parse(
    await readFile(join(root, '.well-known/mcp.json'), 'utf8'),
  );
  if (!card?.serverInfo?.name) {
    console.error('mcp.json missing serverInfo.name');
    process.exitCode = 1;
  }
  if (card?.transport?.endpoint) {
    console.error('mcp.json must not declare a remote transport endpoint');
    process.exitCode = 1;
  }

  const llms = await readFile(join(root, 'llms.txt'), 'utf8');
  if (!/^#\s+.+/m.test(llms)) {
    console.error('llms.txt must start with an H1 heading');
    process.exitCode = 1;
  }
  if (!/\[[^\]]+\]\(https?:\/\//.test(llms)) {
    console.error('llms.txt must use markdown links [title](https://...)');
    process.exitCode = 1;
  }
  for (const needle of [
    'contact+innl@interchouette.net',
    'contact+aquachain@interchouette.net',
    'get_site_overview',
    'get_aquachain_overview',
    'list_modules',
    'agent-ops',
    'Aquachain-agent-gateway',
    'x402',
    '[Hub home]',
  ]) {
    if (!llms.includes(needle)) {
      console.error(`llms.txt must mention: ${needle}`);
      process.exitCode = 1;
    }
  }

  const hubIndex = await readFile(join(root, 'index.html'), 'utf8');
  if (!hubIndex.includes('/llms.txt') || !hubIndex.includes('/.well-known/mcp.json')) {
    console.error('hub index.html must link describedby llms.txt and mcp.json');
    process.exitCode = 1;
  }

  const contactHtml = await readFile(join(root, 'aquachain/contact/index.html'), 'utf8');
  if (!contactHtml.includes('Contact AquaChain')) {
    console.error('prerendered aquachain/contact must have route-specific title');
    process.exitCode = 1;
  }
}

await Promise.all(required.map(mustExist));
await Promise.all(htmlSamples.map(mustHaveHydrationMarker));
await mustDiscoverAgents();

if (process.exitCode) {
  console.error(`static publish check failed under ${root}`);
  process.exit(process.exitCode);
}
console.log(`static publish ok (${required.length} paths under ${root})`);
