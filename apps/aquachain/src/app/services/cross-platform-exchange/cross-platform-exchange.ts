import { Injectable, inject } from '@angular/core';
import type { Coin } from '@cosmjs/stargate';
import { ContractService, pageSize } from '../contract/contract';

export type SwapDirection = 'base_to_partner' | 'partner_to_base';

export interface ExchangePartner {
  denom: string;
  label: string;
  region: string;
  active: boolean;
}

export interface ExchangeRate {
  partner_denom: string;
  base_amount: string;
  partner_amount: string;
}

@Injectable({ providedIn: 'root' })
export class CrossPlatformExchangeService {
  private readonly contractService = inject(ContractService);

  async getPartner(contract: string, partnerDenom: string): Promise<ExchangePartner> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_partner: { partner_denom: partnerDenom },
    });
  }

  async listPartners(
    contract: string,
    activeOnly = true,
    start_after?: string,
    limit: number = pageSize,
  ): Promise<ExchangePartner[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_partners: { active_only: activeOnly, start_after, limit },
    });
  }

  async getRate(contract: string, partnerDenom: string): Promise<ExchangeRate> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_rate: { partner_denom: partnerDenom },
    });
  }

  async getLockedBalance(
    contract: string,
    address: string,
    partnerDenom: string,
  ): Promise<string> {
    const client = await this.contractService.getqueryClient();
    const res = await client.queryContractSmart(contract, {
      get_locked_balance: { address, partner_denom: partnerDenom },
    });
    return String(res);
  }

  async swap(
    sender: string,
    contract: string,
    partnerDenom: string,
    direction: SwapDirection,
    amount: string,
    funds: readonly Coin[] = [],
  ) {
    const directionPayload =
      direction === 'base_to_partner'
        ? { base_to_partner: {} }
        : { partner_to_base: {} };

    return this.contractService.simulateAndExecute(
      sender,
      contract,
      {
        swap: {
          partner_denom: partnerDenom,
          direction: directionPayload,
          amount,
        },
      },
      'swap',
      funds,
    );
  }

  async withdraw(
    sender: string,
    contract: string,
    partnerDenom: string,
    amount: string,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      {
        withdraw: {
          partner_denom: partnerDenom,
          amount,
        },
      },
      'withdraw partner balance',
    );
  }
}

export function formatRate(rate: ExchangeRate, baseSymbol: string): string {
  const base = Number(rate.base_amount);
  const partner = Number(rate.partner_amount);
  if (!Number.isFinite(base) || !Number.isFinite(partner) || base <= 0) {
    return '—';
  }
  return `${base} ${baseSymbol} = ${partner} partner units`;
}

export function amountCount(value: string | number | undefined | null): string {
  if (value == null || value === '') {
    return '0';
  }
  return String(value);
}
