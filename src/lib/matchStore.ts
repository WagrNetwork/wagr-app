// The escrow contract has no reverse index of "matches a player is in" — it
// only stores per-match participant lists, keyed by match ID. So the app
// tracks match IDs the user has created/joined locally, and queries each
// one's live state from the contracts.
const STORAGE_KEY = 'wagr:myMatches';

export function recordMatch(matchId: string): void {
  const existing = getMyMatches();
  if (!existing.includes(matchId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([matchId, ...existing]));
  }
}

export function getMyMatches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
