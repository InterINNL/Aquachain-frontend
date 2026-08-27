import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet';
import { environment } from '@env/environment';
import { calculateFee, GasPrice } from '@cosmjs/stargate';

export interface Sensor {
  id: number;
  owner: string;
  data_str: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SensorLocation {
  lat: string | number;
  lng: string | number;
  description?: string;
}

export interface SensorSubmission {
  type: string;
  model: string;
  location: SensorLocation;
}

export interface DataEntry {
  id: number;
  sensor_id: number;
  submitter: string;
  data_str: string;
  verified: boolean;
  verifier?: string | null;
  rewarded: boolean;
  created_at: number;
  updated_at: number;
}

export interface ParsedSensor extends Sensor, SensorSubmission {}

export interface ParsedDataEntry extends DataEntry {
  value: string;
}

export const pageSize = 10;

@Injectable({ providedIn: 'root' })
export class ContractService {
  private gasMultiplier = environment.gasMultiplier;
  private gasPriceStr = environment.gasPrice;

  constructor(private walletService: WalletService) {}

  async getqueryClient() {
    return await this.walletService.getQueryClient();
  }

  async getSigningClient() {
    return await this.walletService.getSigningClient();
  }

  /**
   * Simulates and executes a contract message.
   * @param sender the wallet address
   * @param contract the contract address
   * @param msg the contract message (JS object)
   * @param gasMultiplier optional multiplier on simulated gas, default 1.1
   * @param memo optional tx memo
   */
  async simulateAndExecute(
    sender: string,
    contract: string,
    msg: Record<string, unknown>,
    memo = '',
  ) {
    if (!sender) throw new Error('Sender wallet address is not defined');

    const client = await this.getSigningClient();
    // Simulate
    const simulatedGas = await client.simulate(
      sender,
      [
        {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: {
            sender,
            contract,
            msg: new TextEncoder().encode(JSON.stringify(msg)),
            funds: [],
          },
        },
      ],
      memo,
    );

    if (typeof simulatedGas !== 'number' || simulatedGas <= 0) {
      throw new Error('Invalid gas estimate from simulate');
    }

    const gasLimit = Math.ceil(simulatedGas * this.gasMultiplier);
    const gasPrice = GasPrice.fromString(this.gasPriceStr);
    const fee = calculateFee(gasLimit, gasPrice);

    // Execute
    const result = await client.execute(sender, contract, msg, fee, memo);

    return result;
  }

  async listSensors(
    contract: string,
    owner?: string,
    status?: string,
    start_after?: number,
    limit: number = pageSize,
  ): Promise<Sensor[]> {
    const query = {
      list_sensors: {
        start_after,
        limit,
        owner,
        status,
      },
    };
    const client = await this.getqueryClient();
    return await client.queryContractSmart(contract, query);
  }

  async listDataEntries(
    contract: string,
    options?: {
      submitter?: string;
      sensor_id?: number;
      start_after?: number;
      limit?: number;
    },
  ): Promise<any[]> {
    const query = {
      list_data_entries: {
        start_after: options?.start_after,
        limit: options?.limit ?? pageSize,
        submitter: options?.submitter,
        sensor_id: options?.sensor_id,
      },
    };
    const client = await this.getqueryClient();
    return await client.queryContractSmart(contract, query);
  }

  async getTotalSensors(contract: string, owner?: string): Promise<number> {
    const query = owner ? { count_sensors: { owner } } : { count_sensors: {} };
    const client = await this.getqueryClient();
    return await client.queryContractSmart(contract, query);
  }
}
