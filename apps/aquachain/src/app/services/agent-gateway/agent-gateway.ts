import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export interface GatewayCapabilities {
  phase: string;
  endpoints: Array<{
    method: string;
    path: string;
    price: string;
    description: string;
  }>;
  payment: {
    protocol: string;
    asset: string;
    network: string;
    price_usdc: string;
    facilitator: string;
    ready: boolean;
  };
  relay: {
    chain_id: string;
    rpc: string;
    contract: string | null;
    ready: boolean;
  };
  sample_payload: Record<string, unknown>;
}

export interface GatewayHealth {
  status: string;
  phase: string;
  relay_ready: boolean;
  x402_ready: boolean;
  stored_measurements: number;
}

@Injectable({ providedIn: 'root' })
export class AgentGatewayService {
  private readonly baseUrl = environment.agentGatewayUrl?.replace(/\/$/, '') ?? '';

  configured(): boolean {
    return this.baseUrl.length > 0;
  }

  async fetchCapabilities(): Promise<GatewayCapabilities> {
    return this.getJson<GatewayCapabilities>('/v1/capabilities');
  }

  async fetchHealth(): Promise<GatewayHealth> {
    return this.getJson<GatewayHealth>('/health');
  }

  private async getJson<T>(path: string): Promise<T> {
    if (!this.configured()) {
      throw new Error('Agent gateway URL is not configured');
    }
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) {
      throw new Error(`Gateway ${path} returned ${res.status}`);
    }
    return (await res.json()) as T;
  }
}
