import { describe, expect, it } from 'vitest';

import {
  AQUACHAIN_MODULE_PATHS,
  contactText,
  listProjectsText,
  siteOverviewText,
} from './webmcp.tools';

describe('interinnl webmcp.tools', () => {
  it('overview mentions hub and AquaChain', () => {
    const text = siteOverviewText();
    expect(text).toContain('interinnl.interchouette.net');
    expect(text).toContain('/aquachain/');
    expect(text).toContain('agent-ops');
  });

  it('contact includes both plus-address emails', () => {
    const text = contactText();
    expect(text).toContain('contact+innl@interchouette.net');
    expect(text).toContain('contact+aquachain@interchouette.net');
  });

  it('projects mention agent gateway repo', () => {
    expect(listProjectsText()).toContain('Aquachain-agent-gateway');
  });

  it('lists all aquachain module paths including agent-ops', () => {
    expect(AQUACHAIN_MODULE_PATHS).toContain('aquachain/agent-ops');
    expect(AQUACHAIN_MODULE_PATHS.length).toBeGreaterThanOrEqual(10);
  });
});
