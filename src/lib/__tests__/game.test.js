import { describe, expect, it } from 'vitest';
import {
  boardStateShareMap,
  backspaceLetter,
  checkSuccess,
  getLetterState,
  mapBoard,
  stringifyWord,
  updateStats,
} from '../game.js';

describe('game utilities', () => {
  it('stringifyWord joins letters', () => {
    expect(stringifyWord(['p', 'l', 'a', 'n', 't'])).toBe('plant');
  });

  it('checkSuccess detects five correct letters', () => {
    const row = ['correct', 'correct', 'correct', 'correct', 'correct'];
    expect(checkSuccess(row, 'correct')).toBe(true);
  });

  it('checkSuccess fails when not all correct', () => {
    const row = ['correct', 'present', 'correct', 'correct', 'correct'];
    expect(checkSuccess(row, 'correct')).toBe(false);
  });

  it('mapBoard maps board state to share strings', () => {
    const boardState = [
      ['correct', 'present', '', '', 'correct'],
      ['present', 'present', 'correct', '', ''],
    ];
    const mapped = mapBoard(boardState, boardStateShareMap);
    expect(mapped).toEqual(['🟩🟧⬛⬛🟩', '🟧🟧🟩⬛⬛']);
  });

  it('getLetterState returns correct, present, or used', () => {
    expect(getLetterState('plant', 'p', 0)).toBe('correct');
    expect(getLetterState('plant', 'a', 2)).toBe('correct');
    expect(getLetterState('plant', 'n', 0)).toBe('present');
    expect(getLetterState('plant', 'z', 0)).toBe('used');
  });

  it('updateStats tracks wins and averages', () => {
    const baseStats = { history: [], played: 0, won: 0, average: 0 };
    const first = updateStats(baseStats, true, '2026-02-01', 3);
    expect(first.played).toBe(1);
    expect(first.won).toBe(1);
    expect(first.average).toBe(3);
    expect(first.averageChange).toBe('↔️');

    const second = updateStats(first, true, '2026-02-02', 4);
    expect(second.played).toBe(2);
    expect(second.won).toBe(2);
    expect(second.average).toBe(3.5);
    expect(second.averageChange).toBe('📈');
  });

  it('updateStats tracks losses without guesses', () => {
    const baseStats = { history: [], played: 0, won: 0, average: 0 };
    const next = updateStats(baseStats, false, '2026-02-01', 6);
    expect(next.played).toBe(1);
    expect(next.won).toBe(0);
    expect(next.average).toBe(0);
    expect(next.history[0]).toEqual({ date: '2026-02-01', winState: false });
  });

  it('backspaceLetter clears last entered slot', () => {
    const board = [
      ['p', 'l', 'a', 'n', 't'],
      ['', '', '', '', ''],
    ];
    const result = backspaceLetter(board, 0, 5);
    expect(result.nextIndex).toBe(4);
    expect(result.board[0][4]).toBe('');
  });
});
