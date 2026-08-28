/** Map CosmWasm / RPC errors to short user-facing copy. */
export function humanizeContractError(raw: unknown): string {
  const text =
    raw instanceof Error ? raw.message : typeof raw === 'string' ? raw : String(raw);

  const rules: readonly [RegExp, string][] = [
    [/Already voted/i, 'You already voted on this proposal.'],
    [/Voting period has not ended/i, 'Voting is still open. Finalize after the end time.'],
    [/Voting period has ended/i, 'Voting has ended. You can no longer cast a vote.'],
    [/Already finalized|Proposal already finalized/i, 'This proposal is already finalized.'],
    [/Proposal is not open/i, 'This proposal is no longer open for votes.'],
    [/Quorum not reached/i, 'Quorum was not reached. This proposal failed.'],
    [/Proposal did not pass/i, 'The proposal did not pass.'],
    [/Missing funds|Attached funds are required/i, 'Attach the reward OSMO amount in Keplr.'],
    [/Invalid funds|do not match the proposal reward/i, 'Attached OSMO must match the proposal reward.'],
    [/Invalid type map/i, 'App version mismatch. Hard-refresh the page and try again.'],
    [/Keplr extension not found/i, 'Install and unlock the Keplr extension.'],
    [/insufficient funds|spendable balance/i, 'Not enough OSMO for gas or the attached reward.'],
  ];

  for (const [pattern, message] of rules) {
    if (pattern.test(text)) {
      return message;
    }
  }

  if (text.length > 180) {
    const generic = text.match(/Generic error: ([^:]+)/i)?.[1]?.trim();
    if (generic) {
      return generic;
    }
    return 'Transaction failed. Check Keplr and try again.';
  }

  return text;
}
