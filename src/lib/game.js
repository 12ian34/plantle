export const boardStateShareMap = {
  correct: '🟩',
  present: '🟧',
  used: '⬛',
  '': '⬛',
};

export const createEmptyBoard = () =>
  Array.from({ length: 6 }, () => Array(5).fill(''));

export const stringifyWord = (word) => word.join('');

export const checkSuccess = (boardStateRow, expected = 'correct') =>
  boardStateRow.filter((state) => state === expected).length === 5;

export const mapBoard = (boardState, map = boardStateShareMap) =>
  boardState.map((row) =>
    row.map((state) => map[state] ?? map[''] ?? '⬛').join('')
  );

export const getLetterState = (dailyWord, enteredLetter, index) => {
  if (!dailyWord) {
    return 'used';
  }

  if (dailyWord.charAt(index) === enteredLetter) {
    return 'correct';
  }

  if (dailyWord.includes(enteredLetter)) {
    return 'present';
  }

  return 'used';
};

export const updateStats = (stats, winState, date, guessesCount) => {
  const nextStats = {
    ...stats,
    history: [...stats.history],
    played: stats.played || 0,
    won: stats.won || 0,
    average: stats.average || 0,
  };

  if (winState === true) {
    nextStats.history.push({
      date,
      winState,
      guesses: guessesCount,
    });
    nextStats.won += 1;
  } else {
    nextStats.history.push({ date, winState });
  }

  nextStats.played += 1;

  const guesses = nextStats.history.reduce(
    (total, entry) => total + (entry.guesses || 0),
    0
  );
  const oldAverage = nextStats.average;
  nextStats.average = Math.round((guesses / nextStats.played) * 10) / 10;

  let averageChange = '↔️';
  if (oldAverage > 0) {
    if (oldAverage > nextStats.average) {
      averageChange = '📉';
    } else if (oldAverage < nextStats.average) {
      averageChange = '📈';
    }
  }

  nextStats.averageChange = averageChange;
  return nextStats;
};

export const backspaceLetter = (board, indexWord, indexLetter) => {
  const nextIndex = Math.max(0, Math.min(4, indexLetter - 1));
  board[indexWord][nextIndex] = '';
  return { board, nextIndex };
};
