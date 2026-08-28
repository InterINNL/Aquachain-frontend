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
  deadline?: number | string;
  reward?: string;
  recipient?: string;
  amount?: string;
  entry_id?: number | string;
  [key: string]: unknown;
}

export interface DaoActionDefinition {
  tag: string;
  label: string;
  moduleRoute: string;
  moduleLabel: string;
  requiresReward: boolean;
  requiresRecipient: boolean;
  requiresCreditAmount: boolean;
  requiresEntryId: boolean;
  requiresDeadline: boolean;
}

export const DAO_ACTIONS: readonly DaoActionDefinition[] = [
  {
    tag: 'post_bounty',
    label: 'Post community bounty',
    moduleRoute: '/community-bounty',
    moduleLabel: 'Community Bounty',
    requiresReward: true,
    requiresRecipient: false,
    requiresCreditAmount: false,
    requiresEntryId: false,
    requiresDeadline: true,
  },
  {
    tag: 'mint_credits',
    label: 'Mint water credits',
    moduleRoute: '/water-credits',
    moduleLabel: 'Water Credits',
    requiresReward: false,
    requiresRecipient: true,
    requiresCreditAmount: true,
    requiresEntryId: false,
    requiresDeadline: false,
  },
  {
    tag: 'reward_sensor',
    label: 'Reward sensor submitter',
    moduleRoute: '/citizen-science',
    moduleLabel: 'Citizen Science',
    requiresReward: true,
    requiresRecipient: false,
    requiresCreditAmount: false,
    requiresEntryId: true,
    requiresDeadline: false,
  },
] as const;

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

  async executeProposal(
    sender: string,
    contract: string,
    proposalId: number,
    funds: readonly { denom: string; amount: string }[] = [],
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { execute_proposal: { proposal_id: proposalId } },
      'execute proposal',
      funds,
    );
  }
}

export function daoActionDefinition(actionTag: string): DaoActionDefinition | undefined {
  return DAO_ACTIONS.find((action) => action.tag === actionTag);
}

export function moduleLinkForAction(actionTag: string): string | null {
  return daoActionDefinition(actionTag)?.moduleRoute ?? null;
}

export function moduleLabelForAction(actionTag: string): string | null {
  return daoActionDefinition(actionTag)?.moduleLabel ?? null;
}

export function previewProposalEffect(
  actionTag: string,
  metadata: ProposalMetadata,
  title: string,
  coinDenom: string,
): string {
  const action = daoActionDefinition(actionTag);
  if (!action) {
    return 'Select an action to preview the on-chain effect.';
  }

  switch (actionTag) {
    case 'post_bounty': {
      const reward = String(metadata.reward ?? '0');
      const location = String(metadata.location ?? 'the selected site');
      return `If passed: posts a ${reward} ${coinDenom} bounty titled "${title}" for ${location}.`;
    }
    case 'mint_credits': {
      const amount = String(metadata.amount ?? '0');
      const recipient = String(metadata.recipient ?? 'beneficiary');
      return `If passed: mints ${amount} water credits to ${recipient}.`;
    }
    case 'reward_sensor': {
      const reward = String(metadata.reward ?? '0');
      const entryId = String(metadata.entry_id ?? '—');
      return `If passed: rewards citizen-science entry #${entryId} with ${reward} ${coinDenom}.`;
    }
    default:
      return 'If passed: executes the configured on-chain action.';
  }
}

export function buildProposalMetadata(form: {
  location: string;
  summary?: string;
  deadline?: string | number;
  reward?: string;
  recipient?: string;
  amount?: string;
  entry_id?: string | number;
}): ProposalMetadata {
  const metadata: ProposalMetadata = {
    location: String(form.location ?? '').trim(),
  };
  const summary = String(form.summary ?? '').trim();
  if (summary) {
    metadata.summary = summary;
  }
  if (form.deadline !== undefined && form.deadline !== '') {
    metadata.deadline = Number(form.deadline);
  }
  if (form.reward?.trim()) {
    metadata.reward = form.reward.trim();
  }
  if (form.recipient?.trim()) {
    metadata.recipient = form.recipient.trim();
  }
  if (form.amount?.trim()) {
    metadata.amount = form.amount.trim();
  }
  if (form.entry_id !== undefined && form.entry_id !== '') {
    metadata.entry_id = Number(form.entry_id);
  }
  return metadata;
}

export function executeFundsForProposal(
  actionTag: string,
  metadata: ProposalMetadata,
  coinMinimalDenom: string,
): { denom: string; amount: string }[] {
  if (actionTag !== 'post_bounty' && actionTag !== 'reward_sensor') {
    return [];
  }
  const reward = String(metadata.reward ?? '').trim();
  if (!reward) {
    return [];
  }
  return [{ denom: coinMinimalDenom, amount: reward }];
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
