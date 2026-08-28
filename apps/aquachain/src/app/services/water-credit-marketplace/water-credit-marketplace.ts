import { Injectable, inject } from '@angular/core';
import type { Coin } from '@cosmjs/stargate';
import { ContractService, pageSize } from '../contract/contract';

export interface CreditListing {
  id: number;
  seller: string;
  credits: string;
  price: string;
  region: string;
  expires_at?: number | string | null;
  active: boolean;
  created_at: number | string;
}

@Injectable({ providedIn: 'root' })
export class WaterCreditMarketplaceService {
  private readonly contractService = inject(ContractService);

  async getBalance(contract: string, address: string): Promise<string> {
    const client = await this.contractService.getqueryClient();
    const res = await client.queryContractSmart(contract, {
      get_balance: { address },
    });
    return String(res);
  }

  async getListing(contract: string, listingId: number): Promise<CreditListing> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      get_listing: { listing_id: listingId },
    });
  }

  async listListings(
    contract: string,
    activeOnly = false,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<CreditListing[]> {
    const client = await this.contractService.getqueryClient();
    return client.queryContractSmart(contract, {
      list_listings: { active_only: activeOnly, start_after, limit },
    });
  }

  async mintCredits(
    sender: string,
    contract: string,
    recipient: string,
    amount: string,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { mint_credits: { recipient, amount } },
      'mint credits',
    );
  }

  async listCredit(
    sender: string,
    contract: string,
    credits: string,
    price: string,
    region: string,
    expiresAt?: number,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      {
        list_credit: {
          credits,
          price,
          region,
          expires_at: expiresAt,
        },
      },
      'list credits',
    );
  }

  async buyCredit(
    sender: string,
    contract: string,
    listingId: number,
    funds: readonly Coin[],
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { buy_credit: { listing_id: listingId } },
      'buy credits',
      funds,
    );
  }

  async cancelListing(sender: string, contract: string, listingId: number) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { cancel_listing: { listing_id: listingId } },
      'cancel listing',
    );
  }

  async transferCredit(
    sender: string,
    contract: string,
    recipient: string,
    amount: string,
  ) {
    return this.contractService.simulateAndExecute(
      sender,
      contract,
      { transfer_credit: { recipient, amount } },
      'transfer credits',
    );
  }
}

export function listingIsBuyable(
  listing: CreditListing,
  nowSeconds: number,
): boolean {
  if (!listing.active) {
    return false;
  }
  const expires = listing.expires_at != null ? Number(listing.expires_at) : null;
  if (expires != null && Number.isFinite(expires) && nowSeconds > expires) {
    return false;
  }
  return true;
}

export function formatExpiry(expiresAt: number | string | null | undefined): string {
  if (expiresAt == null || expiresAt === '') {
    return 'No expiry';
  }
  const ts = Number(expiresAt);
  if (!Number.isFinite(ts)) {
    return '—';
  }
  return new Date(ts * 1000).toLocaleString();
}
