import { describe, it, expect, beforeEach } from 'vitest';
import { recordMatch, getMyMatches } from '../lib/matchStore';

beforeEach(() => {
  localStorage.clear();
});

describe('matchStore', () => {
  it('returns an empty list when nothing has been recorded', () => {
    expect(getMyMatches()).toEqual([]);
  });

  it('records a match and returns it newest-first', () => {
    recordMatch('match-a');
    recordMatch('match-b');
    expect(getMyMatches()).toEqual(['match-b', 'match-a']);
  });

  it('does not duplicate an already-recorded match', () => {
    recordMatch('match-a');
    recordMatch('match-a');
    expect(getMyMatches()).toEqual(['match-a']);
  });
});
