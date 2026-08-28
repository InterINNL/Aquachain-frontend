import { Injectable, inject } from '@angular/core';
import type { Coin } from '@cosmjs/stargate';
import { ContractService, pageSize } from '../contract/contract';

export type BountyStatus = 'open' | 'completed' | 'cancelled';

export interface Bounty {
  id: number;
  poster: string;
  title: string;
  description: string;
  location: string;
  deadline: number | string;
  reward_amount: string;
  status: BountyStatus;
  winner?: string | null;
  approved_submission_id?: number | null;
  created_at: number | string;
}

export interface WorkSubmission {
  id: number;
  bounty_id: number;
  worker: string;
  work_str: string;
  submitted_at: number | string;
  approved: boolean;
}

export interface WorkPayload {
  summary?: string;
  location?: string;
  evidence?: string;
  hours_spent?: string;
  [key: string]: unknown;
}

export interface ParsedSubmission extends WorkSubmission {
  summary: string;
  location: string;
  evidence: string;
  hours_spent: string;
  payload: WorkPayload;
}

@Injectable({ providedIn: 'root' })
export class CommunityBountyService {
  private readonly contractService = inject(ContractService);

  async getBounty(contract: string, bountyId: number): Promise<Bounty> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_bounty: { bounty_id: bountyId },
    });
  }

  async listBounties(
    contract: string,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<Bounty[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_bounties: { start_after, limit },
    });
  }

  async listSubmissions(
    contract: string,
    bountyId?: number,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<WorkSubmission[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_submissions: { bounty_id: bountyId, start_after, limit },
    });
  }

  async postBounty(
    sender: string,
    contract: string,
    title: string,
    description: string,
    location: string,
    deadline: number,
    rewardAmount: string,
    denom: string,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      {
        post_bounty: { title, description, location, deadline },
      },
      'post bounty',
      [{ denom, amount: rewardAmount }],
    );
  }

  async submitWork(
    sender: string,
    contract: string,
    bountyId: number,
    work: WorkPayload,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { submit_work: { bounty_id: bountyId, work } },
      'submit work',
    );
  }

  async approveWork(
    sender: string,
    contract: string,
    bountyId: number,
    submissionId: number,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { approve_work: { bounty_id: bountyId, submission_id: submissionId } },
      'approve work',
    );
  }

  async cancelBounty(sender: string, contract: string, bountyId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { cancel_bounty: { bounty_id: bountyId } },
      'cancel bounty',
    );
  }
}

export function parseSubmission(sub: WorkSubmission): ParsedSubmission {
  let payload: WorkPayload = {};
  try {
    if (sub.work_str) {
      const parsed = JSON.parse(sub.work_str) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        payload = parsed as WorkPayload;
      }
    }
  } catch {
    payload = {};
  }
  return {
    ...sub,
    payload,
    summary: String(payload.summary ?? `Submission #${sub.id}`),
    location: String(payload.location ?? '—'),
    evidence: String(payload.evidence ?? ''),
    hours_spent: String(payload.hours_spent ?? ''),
  };
}

export function bountyStatusLabel(status: BountyStatus): string {
  switch (status) {
    case 'open':
      return 'Open';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return String(status);
  }
}

export function isBountyOpen(bounty: Bounty, nowSeconds: number): boolean {
  if (bounty.status !== 'open') {
    return false;
  }
  const deadline = Number(bounty.deadline);
  return Number.isFinite(deadline) && nowSeconds <= deadline;
}
