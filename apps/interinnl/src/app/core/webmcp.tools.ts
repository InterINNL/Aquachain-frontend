import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { interinnlContent } from '../content';
import { AQUACHAIN_ORIGIN, SITE_ORIGIN } from '@site-seo';

export const HUB_PUBLIC_PATHS = ['', 'aquachain/'] as const;
export type HubPublicPath = (typeof HUB_PUBLIC_PATHS)[number];

export const AQUACHAIN_MODULE_PATHS = [
  'aquachain/',
  'aquachain/agent-ops',
  'aquachain/contact',
  'aquachain/citizen-science',
  'aquachain/water-well-initiative',
  'aquachain/water-utilities',
  'aquachain/sustainable-actions',
  'aquachain/community-bounty',
  'aquachain/water-credits',
  'aquachain/local-dao',
  'aquachain/cross-exchange',
] as const;

const EMPTY_INPUT_SCHEMA = {
  type: 'object' as const,
  properties: {},
  additionalProperties: false as const,
};

const OPEN_PAGE_INPUT_SCHEMA = {
  type: 'object' as const,
  properties: {
    path: {
      type: 'string' as const,
      description: 'Public path without leading slash (empty for hub home, or aquachain/...).',
      enum: [...AQUACHAIN_MODULE_PATHS, ''] as const,
    },
  },
  required: ['path'] as const,
  additionalProperties: false as const,
};

export function hubPageUrl(path: HubPublicPath): string {
  return path === '' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${path}`;
}

export function siteOverviewText(): string {
  const c = interinnlContent;
  return [
    `${c.name} - ${c.tagline}`,
    c.heroLine,
    `Hub: ${SITE_ORIGIN}/`,
    `AquaChain demo: ${AQUACHAIN_ORIGIN}/`,
    `Agent Ops (x402): ${AQUACHAIN_ORIGIN}/agent-ops`,
    `Contact: ${c.links.contactEmail}`,
  ].join('\n');
}

export function contactText(): string {
  const c = interinnlContent.links;
  return [
    `Email: ${c.contactEmail}`,
    `LinkedIn group: ${c.linkedinGroup}`,
    `GitHub org: ${c.githubOrg}`,
    `AquaChain contact: contact+aquachain@interchouette.net`,
  ].join('\n');
}

export function listPublicPagesText(): string {
  const lines = [`- hub home: ${SITE_ORIGIN}/`];
  for (const path of AQUACHAIN_MODULE_PATHS) {
    lines.push(`- ${path || 'home'}: ${SITE_ORIGIN}/${path}`);
  }
  return lines.join('\n');
}

export function listProjectsText(): string {
  const lines = ['InterINNL public projects:'];
  for (const project of interinnlContent.projects) {
    lines.push(`- ${project.name}: ${SITE_ORIGIN}${project.demoPath}`);
    lines.push(`  Frontend: ${project.githubFrontend}`);
    lines.push(`  Contracts: ${project.githubContracts}`);
  }
  lines.push('- AquaChain agent gateway (x402 USDC): https://github.com/InterINNL/Aquachain-agent-gateway');
  lines.push(`  Module: ${AQUACHAIN_ORIGIN}/agent-ops`);
  return lines.join('\n');
}

export function createHubInfoWebMcpTools() {
  return [
    {
      name: 'get_site_overview',
      description: 'InterINNL mission, hub URL, and AquaChain demo link.',
      inputSchema: EMPTY_INPUT_SCHEMA,
      execute: () => siteOverviewText(),
    },
    {
      name: 'get_contact',
      description: 'InterINNL contact email, LinkedIn group, and GitHub org.',
      inputSchema: EMPTY_INPUT_SCHEMA,
      execute: () => contactText(),
    },
    {
      name: 'list_public_pages',
      description: 'Canonical public URLs for the hub and AquaChain modules.',
      inputSchema: EMPTY_INPUT_SCHEMA,
      execute: () => listPublicPagesText(),
    },
    {
      name: 'list_projects',
      description: 'AquaChain and related GitHub repositories.',
      inputSchema: EMPTY_INPUT_SCHEMA,
      execute: () => listProjectsText(),
    },
  ];
}

export function createHubOpenPageWebMcpTools() {
  return [
    {
      name: 'open_public_page',
      description: 'Navigate to a hub or AquaChain public page.',
      inputSchema: OPEN_PAGE_INPUT_SCHEMA,
      execute: ({ path }: { path: string }) => {
        const allowed = [...AQUACHAIN_MODULE_PATHS, ''] as readonly string[];
        if (!allowed.includes(path)) {
          return `Unknown path: ${path}`;
        }
        const url = path === '' ? '/' : `/${path.replace(/\/$/, '')}/`;
        inject(Router).navigateByUrl(url);
        return `Navigated to ${SITE_ORIGIN}${url === '/' ? '/' : url}`;
      },
    },
  ];
}
