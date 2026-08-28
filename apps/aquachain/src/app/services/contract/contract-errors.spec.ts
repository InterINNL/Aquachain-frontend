import { describe, expect, it } from 'vitest';
import { humanizeContractError } from './contract-errors';

describe('humanizeContractError', () => {
  it('maps already voted', () => {
    expect(humanizeContractError(new Error('Generic error: Already voted'))).toBe(
      'You already voted on this proposal.',
    );
  });

  it('maps voting not ended', () => {
    expect(humanizeContractError('Voting period has not ended')).toBe(
      'Voting is still open. Finalize after the end time.',
    );
  });
});
