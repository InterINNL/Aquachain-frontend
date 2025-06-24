import { Injectable } from '@angular/core';
import { GasPrice } from '@cosmjs/stargate';
import { WalletService } from '../wallet/wallet';
import { environment } from '@env/environment';

export interface Sensor {
  id: number;
  owner: string;
  data_str: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SensorLocation {
  lat: number;
  lng: number;
  description?: string;
}

export interface SensorSubmission {
  type: string;
  model: string;
  location: SensorLocation;
}

export interface ParsedSensor extends Sensor, SensorSubmission {}

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

    const feeAmount = (
      gasLimit * parseFloat(gasPrice.amount.toString())
    ).toFixed(0);

    const fee = {
      amount: [{ denom: gasPrice.denom, amount: feeAmount }],
      gas: gasLimit.toString(),
    };

    // Execute
    const result = await client.execute(sender, contract, msg, fee, memo);

    return result;
  }

  async listSensors(
    contract: string,
    owner?: string,
    status?: string,
    start_after?: number,
    limit: number = 20,
  ): Promise<Sensor[]> {
    const query = {
      list_sensors: {
        start_after,
        limit,
        owner,
        status,
      },
    };
    const client = await this.getSigningClient();
    return await client.queryContractSmart(contract, query);
  }
}
