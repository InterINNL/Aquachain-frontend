import { Injectable, inject } from '@angular/core';
import { ContractService, pageSize } from '../contract/contract';

export type ProposalStatus = 'open' | 'passed' | 'failed' | 'executed';
export type VoteChoice = 'yes' | 'no' | 'abstain';

export interface DaoProposal {
  id: number;
  proposer: string;
  title: string;
  description: string;
  action_tag: string;
  metadata_str: string;
  status: ProposalStatus;
  yes_votes: number | string;
  no_votes: number | string;
  abstain_votes: number | string;
  voting_end: number | string;
  created_at: number | string;
}

export interface DaoVoteRecord {
  proposal_id: number;
  voter: string;
  vote: VoteChoice | { yes?: null } | { no?: null } | { abstain?: null };
}

export interface ProposalMetadata {
  location?: string;
  summary?: string;
  [key: string]: unknown;
}

export interface ParsedProposal extends DaoProposal {
  metadata: ProposalMetadata;
  location: string;
}

@Injectable({ providedIn: 'root' })
export class LocalDaoService {
  private readonly contractService = inject(ContractService);

  async getProposal(contract: string, proposalId: number): Promise<DaoProposal> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_proposal: { proposal_id: proposalId },
    });
  }

  async listProposals(
    contract: string,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<DaoProposal[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_proposals: { start_after, limit },
    });
  }

  async getVote(
    contract: string,
    proposalId: number,
    voter: string,
  ): Promise<DaoVoteRecord> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_vote: { proposal_id: proposalId, voter },
    });
  }

  async createProposal(
    sender: string,
    contract: string,
    title: string,
    description: string,
    actionTag: string,
    metadata: ProposalMetadata,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      {
        create_proposal: {
          title,
          description,
          action_tag: actionTag,
          metadata,
        },
      },
      'create proposal',
    );
  }

  async vote(
    sender: string,
    contract: string,
    proposalId: number,
    choice: VoteChoice,
  ) {
    const votePayload =
      choice === 'yes'
        ? { yes: {} }
        : choice === 'no'
          ? { no: {} }
          : { abstain: {} };

    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { vote: { proposal_id: proposalId, vote: votePayload } },
      'cast vote',
    );
  }

  async executeProposal(sender: string, contract: string, proposalId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { execute_proposal: { proposal_id: proposalId } },
      'execute proposal',
    );
  }
}

export function parseProposal(proposal: DaoProposal): ParsedProposal {
  let metadata: ProposalMetadata = {};
  try {
    if (proposal.metadata_str) {
      const parsed = JSON.parse(proposal.metadata_str) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        metadata = parsed as ProposalMetadata;
      }
    }
  } catch {
    metadata = {};
  }
  return {
    ...proposal,
    metadata,
    location: String(metadata.location ?? '—'),
  };
}

export function proposalStatusLabel(status: ProposalStatus): string {
  switch (status) {
    case 'open':
      return 'Open';
    case 'passed':
      return 'Passed';
    case 'failed':
      return 'Failed';
    case 'executed':
      return 'Executed';
    default:
      return String(status);
  }
}

export function isVotingOpen(proposal: DaoProposal, nowSeconds: number): boolean {
  if (proposal.status !== 'open') {
    return false;
  }
  const end = Number(proposal.voting_end);
  return Number.isFinite(end) && nowSeconds <= end;
}

export function canExecute(proposal: DaoProposal, nowSeconds: number): boolean {
  if (proposal.status !== 'open') {
    return false;
  }
  const end = Number(proposal.voting_end);
  return Number.isFinite(end) && nowSeconds > end;
}

export function voteCount(value: number | string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
