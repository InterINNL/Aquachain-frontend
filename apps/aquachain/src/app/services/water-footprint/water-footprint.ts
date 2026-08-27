import { Injectable, inject } from '@angular/core';
import { ContractService, pageSize } from '../contract/contract';

export interface FootprintCompany {
  id: number;
  owner: string;
  name: string;
  metadata_str: string;
}

export interface UsageLog {
  id: number;
  company_id: number;
  period: string;
  usage: string;
  savings: string;
  validated: boolean;
  validator?: string | null;
  created_at: number | string;
}

export interface FootprintCertificate {
  id: number;
  company_id: number;
  period: string;
  total_usage: string;
  total_savings: string;
  issuer: string;
  issued_at: number | string;
}

export interface CompanyMetadata {
  sector?: string;
  region?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface ParsedCompany extends FootprintCompany {
  metadata: CompanyMetadata;
  sector: string;
  region: string;
}

@Injectable({ providedIn: 'root' })
export class WaterFootprintService {
  private readonly contractService = inject(ContractService);

  async getCompany(contract: string, companyId: number): Promise<FootprintCompany> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_company: { company_id: companyId },
    });
  }

  async listCompanies(
    contract: string,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<FootprintCompany[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_companies: { start_after, limit },
    });
  }

  async listLogs(
    contract: string,
    companyId?: number,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<UsageLog[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_logs: {
        company_id: companyId,
        start_after,
        limit,
      },
    });
  }

  async getCertificate(
    contract: string,
    certificateId: number,
  ): Promise<FootprintCertificate> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_certificate: { certificate_id: certificateId },
    });
  }

  async listCertificates(
    contract: string,
    companyId?: number,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<FootprintCertificate[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_certificates: {
        company_id: companyId,
        start_after,
        limit,
      },
    });
  }

  async isVerifier(contract: string, address: string): Promise<boolean> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      is_verifier: { address },
    });
  }

  async registerCompany(
    sender: string,
    contract: string,
    name: string,
    metadata: CompanyMetadata,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { register_company: { name, metadata } },
      'register company',
    );
  }

  async logUsage(
    sender: string,
    contract: string,
    companyId: number,
    period: string,
    usage: string,
    savings: string,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      {
        log_usage: {
          company_id: companyId,
          period,
          usage,
          savings,
        },
      },
      'log usage',
    );
  }

  async validateLog(sender: string, contract: string, logId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { validate_log: { log_id: logId } },
      'validate log',
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

  async issueCertificate(
    sender: string,
    contract: string,
    companyId: number,
    period: string,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { issue_certificate: { company_id: companyId, period } },
      'issue certificate',
    );
  }
}

export function parseCompany(company: FootprintCompany): ParsedCompany {
  let metadata: CompanyMetadata = {};
  try {
    if (company.metadata_str) {
      const parsed = JSON.parse(company.metadata_str) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        metadata = parsed as CompanyMetadata;
      }
    }
  } catch {
    metadata = {};
  }
  return {
    ...company,
    metadata,
    sector: String(metadata.sector ?? '—'),
    region: String(metadata.region ?? '—'),
  };
}

export function formatLogTime(value: number | string | undefined): number | string {
  if (value === undefined || value === null) {
    return '';
  }
  const n = Number(value);
  if (Number.isFinite(n) && n > 1_000_000_000 && n < 10_000_000_000) {
    return n * 1000;
  }
  return value;
}
