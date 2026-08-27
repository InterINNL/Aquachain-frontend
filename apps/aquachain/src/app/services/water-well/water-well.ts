import { Injectable, inject } from '@angular/core';
import type { Coin } from '@cosmjs/stargate';
import { ContractService, pageSize } from '../contract/contract';

export type ProjectStatus =
  | 'proposed'
  | 'fundraising'
  | 'funded'
  | 'disbursable'
  | 'completed'
  | 'cancelled';

export interface WellProject {
  id: number;
  owner: string;
  goal: string;
  data_str: string;
  total_donated: string;
  status: string;
}

export interface ProjectMetadata {
  title?: string;
  location?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ParsedWellProject extends WellProject {
  title: string;
  location: string;
  description: string;
  metadata: ProjectMetadata;
}

export type ProjectStatusCounts = Record<string, number>;

@Injectable({ providedIn: 'root' })
export class WaterWellService {
  private readonly contractService = inject(ContractService);

  async getProject(contract: string, projectId: number): Promise<WellProject> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_project: { project_id: projectId },
    });
  }

  async listProjects(
    contract: string,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<WellProject[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_projects: { start_after, limit },
    });
  }

  async getProjectStatusCounts(contract: string): Promise<ProjectStatusCounts> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_project_status_counts: {},
    });
  }

  async getProjectsByStatus(
    contract: string,
    status: ProjectStatus,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<WellProject[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_projects_by_status: { status, start_after, limit },
    });
  }

  async createProject(
    sender: string,
    contract: string,
    goal: string,
    data: ProjectMetadata,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { create_project: { goal, data } },
      'create project',
    );
  }

  async validate(sender: string, contract: string, projectId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { validate: { project_id: projectId } },
      'validate project',
    );
  }

  async donate(
    sender: string,
    contract: string,
    projectId: number,
    funds: readonly Coin[],
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { donate: { project_id: projectId } },
      'donate',
      funds,
    );
  }

  async unlock(sender: string, contract: string, projectId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { unlock: { project_id: projectId } },
      'unlock project',
    );
  }

  async disburse(sender: string, contract: string, projectId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { disburse: { project_id: projectId } },
      'disburse project',
    );
  }

  async cancel(sender: string, contract: string, projectId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { cancel: { project_id: projectId } },
      'cancel project',
    );
  }

  async refund(sender: string, contract: string, projectId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { refund: { project_id: projectId } },
      'refund donation',
    );
  }
}

export function parseWellProject(project: WellProject): ParsedWellProject {
  let metadata: ProjectMetadata = {};
  try {
    if (typeof project.data_str === 'string' && project.data_str) {
      const parsed = JSON.parse(project.data_str) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        metadata = parsed as ProjectMetadata;
      } else if (typeof parsed === 'string') {
        try {
          const nested = JSON.parse(parsed) as ProjectMetadata;
          if (nested && typeof nested === 'object') {
            metadata = nested;
          }
        } catch {
          metadata = { description: parsed };
        }
      }
    }
  } catch {
    metadata = {};
  }

  return {
    ...project,
    metadata,
    title: String(
      metadata.title ?? metadata['name'] ?? `Project #${project.id}`,
    ),
    location: String(metadata.location ?? '—'),
    description: String(metadata.description ?? ''),
  };
}

export function projectProgressPercent(project: WellProject): number {
  const goal = Number(project.goal);
  const donated = Number(project.total_donated);
  if (!Number.isFinite(goal) || goal <= 0) {
    return 0;
  }
  if (!Number.isFinite(donated) || donated <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((donated / goal) * 100));
}

export function sumStatusCounts(counts: ProjectStatusCounts): number {
  return Object.values(counts).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

export function statusBadgeClass(
  status: string | undefined,
): Record<string, boolean> {
  const s = (status ?? '').toLowerCase();
  return {
    'bg-secondary': s === 'proposed',
    'bg-primary': s === 'fundraising',
    'bg-info': s === 'funded',
    'bg-warning': s === 'disbursable',
    'bg-success': s === 'completed',
    'bg-dark': s === 'cancelled',
  };
}
