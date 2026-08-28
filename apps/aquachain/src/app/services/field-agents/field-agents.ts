import { Injectable, inject } from '@angular/core';
import { ContractService } from '../contract/contract';

export interface FieldAgent {
  id: number;
  name: string;
  agent_type: string | { drone?: null } | { verifier?: null };
  operator: string;
  pubkey: string;
  policy_json: string;
  registered_at: number | string;
}

@Injectable({ providedIn: 'root' })
export class FieldAgentsService {
  private readonly contractService = inject(ContractService);

  async listAgents(contract: string, limit = 10): Promise<FieldAgent[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_agents: { limit },
    });
  }
}

export function agentTypeLabel(
  agentType: FieldAgent['agent_type'],
): string {
  if (typeof agentType === 'string') {
    return agentType;
  }
  if (agentType && typeof agentType === 'object') {
    if ('drone' in agentType) {
      return 'drone';
    }
    if ('verifier' in agentType) {
      return 'verifier';
    }
  }
  return 'unknown';
}
