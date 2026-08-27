import { describe, expect, it, vi } from 'vitest';
import { canGoNext, canGoPrev, totalPages } from '../../utils/pagination';
import { sensorCoords, statusClass } from '../../utils/sensor-parse';
import type { ParsedSensor } from '@services/contract/contract';

vi.mock('@services/wallet/wallet', () => ({
  WalletService: class {
    connectWallet = vi.fn();
    getQueryClient = vi.fn();
    getSigningClient = vi.fn();
  },
}));

vi.mock('@services/contract/contract', () => ({
  ContractService: class {
    simulateAndExecute = vi.fn();
    listSensors = vi.fn();
    getTotalSensors = vi.fn();
    listDataEntries = vi.fn();
    countDataEntries = vi.fn();
  },
  pageSize: 10,
}));

vi.mock('@cosmjs/cosmwasm-stargate', () => ({
  SigningCosmWasmClient: {
    connect: vi.fn(),
    connectWithSigner: vi.fn(),
  },
  CosmWasmClient: {
    connect: vi.fn(),
  },
}));

describe('CitizenScience', () => {
  it('loads after CosmJS mocks', async () => {
    const { CitizenScience } = await import('./citizen-science');
    expect(CitizenScience).toBeTruthy();
  });
});

describe('pagination helpers', () => {
  it('computes total pages and next/prev guards', () => {
    expect(totalPages(0, 10)).toBe(1);
    expect(totalPages(10, 10)).toBe(1);
    expect(totalPages(11, 10)).toBe(2);
    expect(canGoPrev(1)).toBe(false);
    expect(canGoPrev(2)).toBe(true);
    expect(canGoNext(1, 1)).toBe(false);
    expect(canGoNext(1, 2)).toBe(true);
    expect(canGoNext(2, 2)).toBe(false);
  });
});

describe('sensor-parse helpers', () => {
  it('parses coords and status classes', () => {
    const sensor = {
      id: 1,
      location: { lat: '48.85', lng: '2.35' },
      status: 'Active',
    } as ParsedSensor;
    expect(sensorCoords(sensor)).toEqual({ lat: 48.85, lng: 2.35 });
    expect(
      sensorCoords({ ...sensor, location: { lat: 'x', lng: 'y' } }),
    ).toBeNull();
    expect(statusClass('active')['bg-success']).toBe(true);
    expect(statusClass('Proposed')['bg-warning']).toBe(true);
  });
});
