import { Injectable, inject } from '@angular/core';
import type { Coin } from '@cosmjs/stargate';
import { ContractService, pageSize } from '../contract/contract';

export interface EcoAction {
  id: number;
  actor: string;
  evidence_str: string;
  impact_points: string;
  verified: boolean;
  rewarded: boolean;
  validator?: string | null;
  created_at: number | string;
}

export interface ActionEvidence {
  title?: string;
  location?: string;
  description?: string;
  impact_points: string;
  [key: string]: unknown;
}

export interface ParsedEcoAction extends EcoAction {
  title: string;
  location: string;
  description: string;
  evidence: ActionEvidence;
}

@Injectable({ providedIn: 'root' })
export class SustainableActionRewardsService {
  private readonly contractService = inject(ContractService);

  async getAction(contract: string, actionId: number): Promise<EcoAction> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_action: { action_id: actionId },
    });
  }

  async listActions(
    contract: string,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<EcoAction[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_actions: { start_after, limit },
    });
  }

  async getActorImpact(contract: string, actor: string): Promise<string> {
    const client = await this.contractService.getqueryClient();
    const res = await client.queryContractSmart(contract, {
      get_actor_impact: { actor },
    });
    return String(res);
  }

  async isVerifier(contract: string, address: string): Promise<boolean> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      is_verifier: { address },
    });
  }

  async submitAction(
    sender: string,
    contract: string,
    evidence: ActionEvidence,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { submit_action: { evidence } },
      'submit action',
    );
  }

  async verifyAction(sender: string, contract: string, actionId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { verify_action: { action_id: actionId } },
      'verify action',
    );
  }

  async rewardActor(
    sender: string,
    contract: string,
    actionId: number,
    funds: readonly Coin[],
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { reward_actor: { action_id: actionId } },
      'reward actor',
      funds,
    );
  }

  async addVerifier(sender: string, contract: string, verifier: string) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { add_verifier: { verifier } },
      'add verifier',
    );
  }

  async removeVerifier(sender: string, contract: string, verifier: string) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { remove_verifier: { verifier } },
      'remove verifier',
    );
  }
}

export function parseEcoAction(action: EcoAction): ParsedEcoAction {
  let evidence: ActionEvidence = { impact_points: action.impact_points };
  try {
    if (action.evidence_str) {
      const parsed = JSON.parse(action.evidence_str) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        evidence = parsed as ActionEvidence;
      }
    }
  } catch {
    evidence = { impact_points: action.impact_points };
  }
  return {
    ...action,
    evidence,
    title: String(evidence.title ?? `Action #${action.id}`),
    location: String(evidence.location ?? '—'),
    description: String(evidence.description ?? ''),
  };
}
