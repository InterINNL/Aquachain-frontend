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

  async getPartner(
    contract: string,
    partnerDenom: string,
  ): Promise<ExchangePartner> {
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
        ? { base_to_partner: null }
        : { partner_to_base: null };

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

export function formatRate(rate: ExchangeRate, coinDecimals = 6): string {
  return formatRateHuman(rate, coinDecimals);
}

export function formatRateHuman(rate: ExchangeRate, coinDecimals = 6): string {
  const baseMicro = BigInt(rate.base_amount || '0');
  const partner = BigInt(rate.partner_amount || '0');
  if (baseMicro <= 0n || partner <= 0n) {
    return '—';
  }
  const scale = 10n ** BigInt(coinDecimals);
  const osmoWhole = baseMicro / scale;
  const osmoFrac = baseMicro % scale;
  const osmoLabel =
    osmoFrac === 0n ? `${osmoWhole} OSMO` : `${baseMicro} uosmo`;
  return `${osmoLabel} = ${partner} ledger units`;
}

export function osmoToUosmo(
  osmoAmount: string,
  coinDecimals = 6,
): string | null {
  const trimmed = osmoAmount.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }
  const [whole, frac = ''] = trimmed.split('.');
  if (frac.length > coinDecimals) {
    return null;
  }
  const padded = frac.padEnd(coinDecimals, '0');
  const micro =
    BigInt(whole) * 10n ** BigInt(coinDecimals) + BigInt(padded || '0');
  if (micro <= 0n) {
    return null;
  }
  return micro.toString();
}

export interface SwapPreview {
  exact: boolean;
  chainAmount: string;
  outputLabel: string;
  hint: string;
}

export function previewSwap(
  direction: SwapDirection,
  rate: ExchangeRate,
  input: string,
  coinDecimals = 6,
): SwapPreview | null {
  if (!input.trim()) {
    return null;
  }

  const base = BigInt(rate.base_amount);
  const partnerRate = BigInt(rate.partner_amount);
  if (base <= 0n || partnerRate <= 0n) {
    return null;
  }

  if (direction === 'base_to_partner') {
    const uosmo = osmoToUosmo(input, coinDecimals);
    if (!uosmo) {
      return {
        exact: false,
        chainAmount: '0',
        outputLabel: '—',
        hint: 'Enter a valid OSMO amount (e.g. 1 or 2.5)',
      };
    }
    const amount = BigInt(uosmo);
    const product = amount * partnerRate;
    const exact = product % base === 0n;
    const out = exact ? product / base : product / base;
    return {
      exact,
      chainAmount: uosmo,
      outputLabel: `${out} ledger units`,
      hint: exact
        ? `Send ${input} OSMO → receive ${out} ${rate.partner_denom} units`
        : 'Amount does not match the fixed rate. Try a whole OSMO value.',
    };
  }

  if (!/^[1-9]\d*$/.test(input.trim())) {
    return {
      exact: false,
      chainAmount: '0',
      outputLabel: '—',
      hint: 'Enter whole ledger units (e.g. 50 or 100)',
    };
  }
  const amount = BigInt(input.trim());
  const product = amount * base;
  const exact = product % partnerRate === 0n;
  const outMicro = exact ? product / partnerRate : product / partnerRate;
  const osmoOut = formatMicroAsOsmo(outMicro, coinDecimals);
  return {
    exact,
    chainAmount: input.trim(),
    outputLabel: `${osmoOut} OSMO`,
    hint: exact
      ? `Redeem ${input} ledger units → receive about ${osmoOut} OSMO`
      : 'Amount does not match the fixed rate. Try a value from the quick picks.',
  };
}

export function formatMicroAsOsmo(micro: bigint, coinDecimals = 6): string {
  const scale = 10n ** BigInt(coinDecimals);
  const whole = micro / scale;
  const frac = micro % scale;
  if (frac === 0n) {
    return whole.toString();
  }
  const fracStr = frac
    .toString()
    .padStart(coinDecimals, '0')
    .replace(/0+$/, '');
  return `${whole}.${fracStr}`;
}

export function suggestedOsmoAmounts(
  rate: ExchangeRate,
  coinDecimals = 6,
): string[] {
  const base = BigInt(rate.base_amount);
  const scale = 10n ** BigInt(coinDecimals);
  if (base <= 0n) {
    return ['1', '2', '5'];
  }
  const osmoPerStep = Number(base / scale);
  if (!Number.isFinite(osmoPerStep) || osmoPerStep <= 0) {
    return ['1', '2', '5'];
  }
  const step = osmoPerStep >= 1 ? osmoPerStep : 1;
  return [step, step * 2, step * 5].map((n) => String(n));
}

export function suggestedPartnerAmounts(rate: ExchangeRate): string[] {
  const partner = BigInt(rate.partner_amount || '0');
  if (partner <= 0n) {
    return ['25', '50', '100'];
  }
  const step = Number(partner);
  return [step, step * 2, step * 5].map((n) => String(n));
}

export function amountCount(value: string | number | undefined | null): string {
  if (value == null || value === '') {
    return '0';
  }
  return String(value);
}
