import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { aquachainContent } from '../content';
import { AQUACHAIN_ORIGIN, SITE_ORIGIN } from '@site-seo';

export const AQUACHAIN_ROUTES = aquachainContent.modules.map((mod) =>
  mod.route.replace(/^\//, ''),
);

const EMPTY_INPUT_SCHEMA = {
  type: 'object' as const,
  properties: {},
  additionalProperties: false as const,
};

const OPEN_MODULE_INPUT_SCHEMA = {
  type: 'object' as const,
  properties: {
    path: {
      type: 'string' as const,
      description: 'AquaChain module route without leading slash.',
      enum: ['', ...AQUACHAIN_ROUTES] as const,
    },
  },
  required: ['path'] as const,
  additionalProperties: false as const,
};

export function aquachainOverviewText(): string {
  const c = aquachainContent;
  return [
    `${c.name} - ${c.tagline}`,
    c.description,
    `Demo: ${AQUACHAIN_ORIGIN}/`,
    `InterINNL hub: ${SITE_ORIGIN}/`,
    `Agent Ops (Module 9, x402 USDC): ${AQUACHAIN_ORIGIN}/agent-ops`,
    `Agent gateway repo: https://github.com/InterINNL/Aquachain-agent-gateway`,
    `Stack: CosmWasm on Osmosis (Keplr) + x402 agents on Base Sepolia`,
  ].join('\n');
}

export function listModulesText(): string {
  return aquachainContent.modules
    .map(
      (mod, index) =>
        `${index + 1}. ${mod.name} (${mod.kicker}) - ${AQUACHAIN_ORIGIN}${mod.route}\n   ${mod.blurb}`,
    )
    .join('\n');
}

export function contactText(): string {
  return [
    `Email: ${aquachainContent.contact.recipientEmail}`,
    `InterINNL hub contact: contact+innl@interchouette.net`,
    `GitHub frontend: ${aquachainContent.githubFrontend}`,
    `GitHub contracts: ${aquachainContent.githubContracts}`,
  ].join('\n');
}

export function siteDiscoveryText(): string {
  return [
    `Site map: ${SITE_ORIGIN}/llms.txt`,
    `MCP card: ${SITE_ORIGIN}/.well-known/mcp.json`,
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    `Hub: ${SITE_ORIGIN}/`,
  ].join('\n');
}

export function createAquachainInfoWebMcpTools() {
  return [
    {
      name: 'get_aquachain_overview',
      description: 'AquaChain tagline, stack, and InterINNL context.',
      inputSchema: EMPTY_INPUT_SCHEMA,
      execute: () => aquachainOverviewText(),
    },
    {
      name: 'list_modules',
      description: 'Nine AquaChain modules with routes and blurbs.',
      inputSchema: EMPTY_INPUT_SCHEMA,
      execute: () => listModulesText(),
    },
    {
      name: 'get_contact',
      description: 'AquaChain contact email and GitHub repos.',
      inputSchema: EMPTY_INPUT_SCHEMA,
      execute: () => contactText(),
    },
    {
      name: 'get_site_discovery',
      description: 'Hub llms.txt, mcp.json, and sitemap URLs.',
      inputSchema: EMPTY_INPUT_SCHEMA,
      execute: () => siteDiscoveryText(),
    },
  ];
}

export function createAquachainOpenModuleWebMcpTools() {
  return [
    {
      name: 'open_module',
      description: 'Navigate to an AquaChain module route.',
      inputSchema: OPEN_MODULE_INPUT_SCHEMA,
      execute: ({ path }: { path: string }) => {
        const allowed = ['', ...AQUACHAIN_ROUTES] as readonly string[];
        if (!allowed.includes(path)) {
          return `Unknown module path: ${path}`;
        }
        const url = path === '' ? '/' : `/${path}`;
        inject(Router).navigateByUrl(url);
        return `Navigated to ${AQUACHAIN_ORIGIN}${url === '/' ? '/' : url}`;
      },
    },
  ];
}
