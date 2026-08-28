import { describe, expect, it } from 'vitest';

import {
  AQUACHAIN_ROUTES,
  aquachainOverviewText,
  contactText,
  listModulesText,
  siteDiscoveryText,
} from './webmcp.tools';

describe('aquachain webmcp.tools', () => {
  it('overview mentions x402 agent ops and gateway', () => {
    const text = aquachainOverviewText();
    expect(text).toContain('agent-ops');
    expect(text).toContain('Aquachain-agent-gateway');
    expect(text).toContain('x402');
  });

  it('lists nine modules including Agent Ops', () => {
    const text = listModulesText();
    expect(text).toContain('Agent Ops');
    expect(text).toContain('x402');
  });

  it('contact includes aquachain plus address', () => {
    expect(contactText()).toContain('contact+aquachain@interchouette.net');
  });

  it('discovery includes scoped aquachain llms.txt', () => {
    expect(siteDiscoveryText()).toContain('/aquachain/llms.txt');
  });

  it('routes include agent-ops', () => {
    expect(AQUACHAIN_ROUTES).toContain('agent-ops');
  });
});
