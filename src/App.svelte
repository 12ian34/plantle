<script>
  // don't be boring and look at my source code
  import Modal from './Modal.svelte';
  import { fly } from 'svelte/transition';
  import {
    backspaceLetter,
    boardStateShareMap,
    checkSuccess,
    createEmptyBoard,
    getLetterState,
    mapBoard,
    stringifyWord,
    updateStats,
  } from './lib/game.js';
  import { logError, logInfo, logWarn } from './lib/logger.js';

  let date = new Date().toISOString().slice(0, 10);
  // date below for debugging
  // let date = '2022-02-09';
  let indexWord = 0;
  let indexLetter = 0;
  let validationIndex = 0;
  let wordString;
  let usedLetters = [];
  let correctLetters = [];
  let presentLetters = [];
  let boardShare;
  let boardShareString;
  let lastPlayedDate;
  let showModal = false;
  let winState = false;
  let copied = false;
  let dailyWord = '';
  let isDailyWordLoading = true;
  let dailyWordError = '';
  let dictionaryError = '';
  let isValidating = false;
  let invalidWord = false;
  let stats = {
    history: [],
    played: 0,
    won: 0,
    average: 0,
  };
  let averageChange;

  let board = createEmptyBoard();
  let boardState = createEmptyBoard();
  let isSubmitDisabled = false;
  let isLightMode = false;

  function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCachedDailyWord(targetDate) {
    const cached = getFromLocalStorage('dailyWordCache');
    if (cached && cached.date === targetDate && cached.word) {
      return cached.word;
    }
    return '';
  }

  function setCachedDailyWord(targetDate, word) {
    saveToLocalStorage('dailyWordCache', { date: targetDate, word });
  }

  function triggerInvalidWordFeedback() {
    invalidWord = true;
    setTimeout(() => {
      invalidWord = false;
    }, 350);
  }

  function applyThemeClass() {
    if (isLightMode) {
      window.document.body.classList.add('light-mode');
    } else {
      window.document.body.classList.remove('light-mode');
    }
  }

  function toggleTheme() {
    isLightMode = !isLightMode;
    saveToLocalStorage('isLightMode', isLightMode);
    applyThemeClass();
  }

  // check if played before
  if (localStorage.getItem('lastPlayedDate')) {
    // if yes, get last played date
    lastPlayedDate = getFromLocalStorage('lastPlayedDate');
    logInfo('localStorage:lastPlayedDate', { lastPlayedDate });
    // check if it is the same day
    if (date == lastPlayedDate) {
      // if yes, get data if present
      // getting from localStorage if present
      logInfo('localStorage:resumeSession', { date });

      if (localStorage.getItem('board')) {
        board = getFromLocalStorage('board');
      }
      if (localStorage.getItem('indexWord')) {
        indexWord = getFromLocalStorage('indexWord');
      }
      if (localStorage.getItem('indexLetter')) {
        indexLetter = getFromLocalStorage('indexLetter');
      }
      if (localStorage.getItem('validationIndex')) {
        validationIndex = getFromLocalStorage('validationIndex');
      }
      if (localStorage.getItem('wordString')) {
        wordString = getFromLocalStorage('wordString');
      }
      if (localStorage.getItem('usedLetters')) {
        usedLetters = getFromLocalStorage('usedLetters');
      }
      if (localStorage.getItem('correctLetters')) {
        correctLetters = getFromLocalStorage('correctLetters');
      }
      if (localStorage.getItem('presentLetters')) {
        presentLetters = getFromLocalStorage('presentLetters');
      }
      if (localStorage.getItem('boardState')) {
        boardState = getFromLocalStorage('boardState');
      }
      if (localStorage.getItem('winState')) {
        winState = getFromLocalStorage('winState');
      }
      if (localStorage.getItem('boardShare')) {
        boardShare = getFromLocalStorage('boardShare');
      }
    } else {
      logInfo('localStorage:newSession', { date });
    }
    if (localStorage.getItem('stats')) {
      stats = getFromLocalStorage('stats');
      if (stats.averageChange) {
        averageChange = stats.averageChange;
      } else {
        averageChange = '↔️';
      }
    }
  }

  if (localStorage.getItem('isLightMode')) {
    isLightMode = getFromLocalStorage('isLightMode') === true;
  }
  applyThemeClass();
  dailyWord = getCachedDailyWord(date);

  // fetch word based on today's date
  async function loadDailyWord(targetDate) {
    isDailyWordLoading = true;
    dailyWordError = '';
    const requestUrl = `/.netlify/functions/getWord?date=${targetDate}`;
    try {
      const response = await fetch(requestUrl);
      const body = await response.json();

      if (response.ok && body && body.data && body.data.length > 0) {
        dailyWord = body.data[0].dailyWord;
        if (dailyWord) {
          setCachedDailyWord(targetDate, dailyWord);
          logInfo('dailyWord:loaded', { targetDate });
        } else {
          dailyWordError = 'No daily word found for the given date.';
          logWarn('dailyWord:empty', { targetDate });
        }
      } else {
        logWarn('dailyWord:badResponse', {
          targetDate,
          status: response.status,
        });
        const cachedWord = getCachedDailyWord(targetDate);
        if (cachedWord) {
          dailyWord = cachedWord;
          dailyWordError =
            'Using cached daily word due to a temporary network issue.';
          logWarn('dailyWord:usingCache', { targetDate });
        } else {
          dailyWordError = 'Unable to load today’s word. Please try again.';
        }
      }
    } catch (err) {
      logError('dailyWord:error', { targetDate, message: err.message });
      const cachedWord = getCachedDailyWord(targetDate);
      if (cachedWord) {
        dailyWord = cachedWord;
        dailyWordError =
          'Using cached daily word due to a temporary network issue.';
        logWarn('dailyWord:usingCache', { targetDate });
      } else {
        dailyWordError = 'Unable to load today’s word. Please try again.';
      }
    } finally {
      isDailyWordLoading = false;
    }
  }

  loadDailyWord(date);

  $: isSubmitDisabled =
    winState === true || isDailyWordLoading || isValidating || !dailyWord;

  // on each letter, increment index to move on to next letter
  // if last letter of word, stay on that letter
  function enter(enteredLetter) {
    dictionaryError = '';
    if (indexLetter < 5) {
      board[indexWord][indexLetter] = enteredLetter;
    }

    if (indexLetter == 5) {
      indexLetter = 4;
    } else {
      indexLetter += 1;
    }
    saveToLocalStorage('indexLetter', indexLetter);
    saveToLocalStorage('board', board);
  }

  function clear() {
    dictionaryError = '';
    board[indexWord] = ['', '', '', '', ''];
    indexLetter = 0;
    saveToLocalStorage('indexLetter', indexLetter);
    saveToLocalStorage('board', board);
  }

  function backspace() {
    dictionaryError = '';
    const result = backspaceLetter(board, indexWord, indexLetter);
    board = result.board;
    indexLetter = result.nextIndex;
    saveToLocalStorage('indexLetter', indexLetter);
    saveToLocalStorage('board', board);
  }

  function validateWord(enteredLetter) {
    const letterState = getLetterState(
      dailyWord,
      enteredLetter,
      validationIndex
    );
    if (letterState === 'correct') {
      // correct letter
      boardState[indexWord][validationIndex] = 'correct';
      correctLetters.push(enteredLetter);
      // reactivity is triggered by assignment only
      correctLetters = correctLetters;
      saveToLocalStorage('correctLetters', correctLetters);
    } else if (letterState === 'present') {
      // present letter
      boardState[indexWord][validationIndex] = 'present';
      presentLetters.push(enteredLetter);
      // reactivity is triggered by assignment only
      presentLetters = presentLetters;
      saveToLocalStorage('presentLetters', presentLetters);
    } else {
      // boardState[indexWord][validationIndex] = 'used';
      // store used letter
      usedLetters.push(enteredLetter);
      // reactivity is triggered by assignment only
      usedLetters = usedLetters;
      saveToLocalStorage('usedLetters', usedLetters);
    }
    validationIndex += 1;
    saveToLocalStorage('validationIndex', validationIndex);
  }

  // on submit of complete word
  async function submit(word) {
    dictionaryError = '';
    if (isDailyWordLoading) {
      dailyWordError = 'Loading today’s word. Please try again in a moment.';
      return;
    }

    if (!dailyWord) {
      dailyWordError = 'Unable to load today’s word. Please try again.';
      return;
    }

    wordString = stringifyWord(word);
    saveToLocalStorage('wordString', wordString);

    if (wordString.length == 5) {
      isValidating = true;
      // Check word against dictionary
      const requestUrl = `/.netlify/functions/dictionaryLookup?wordString=${wordString}`;
      try {
        const response = await fetch(requestUrl);

        // Handle different HTTP response codes
        if (response.status === 404) {
          // Word not found in dictionary
          dictionaryError = `'${wordString}' not found in dictionary. Try a real word!`;
          logInfo('dictionaryLookup:notFound', { wordString });
          triggerInvalidWordFeedback();
          clear();
        } else if (!response.ok) {
          // Other types of errors (e.g., 500 or network issues)
          dictionaryError =
            'Dictionary service is unavailable. Please try again.';
          logWarn('dictionaryLookup:badResponse', {
            status: response.status,
            wordString,
          });
        } else {
          // Word matched in dictionary
          await response.json();

          // Now check each letter against the solution
          word.forEach(validateWord);

          // Save state to localStorage
          saveToLocalStorage('board', board);
          saveToLocalStorage('boardState', boardState);

          // Then check if solution was reached and handle win state
          winState = checkSuccess(boardState[indexWord], 'correct');
          if (winState == true) {
            alert('🌽🌽🌽 Congratulations! 🌽🌽🌽');
            saveToLocalStorage('winState', winState);
            boardShare = mapBoard(boardState, boardStateShareMap);
            saveToLocalStorage('boardShare', boardShare);
            validationIndex = 0;
            saveToLocalStorage('validationIndex', validationIndex);
            stats = updateStats(stats, winState, date, indexWord + 1);
            averageChange = stats.averageChange;
            saveToLocalStorage('stats', stats);
          } else {
            // Move on to the next word and reset validation index
            indexWord += 1;
            indexLetter = 0;
            validationIndex = 0;
            saveToLocalStorage('indexWord', indexWord);
            saveToLocalStorage('indexLetter', indexLetter);
            saveToLocalStorage('validationIndex', validationIndex);

            if (indexWord == 6) {
              // Game over
              stats = updateStats(stats, winState, date, indexWord + 1);
              averageChange = stats.averageChange;
              saveToLocalStorage('stats', stats);
            }
          }
        }
      } catch (error) {
        logError('dictionaryLookup:error', {
          wordString,
          message: error.message,
        });
        dictionaryError =
          'Error connecting to the dictionary lookup service.';
      } finally {
        isValidating = false;
      }
    } else {
      dictionaryError = 'You must submit a full word!';
      logWarn('submit:shortWord', { length: wordString.length });
      triggerInvalidWordFeedback();
    }

    lastPlayedDate = date;
    saveToLocalStorage('lastPlayedDate', lastPlayedDate);
}

  // function toggle() {
  //   window.document.body.classList.toggle('light-mode');
  // }
  function copyText() {
    boardShareString = `plantle ${date}\n${indexWord + 1}/6\n${boardShare.join(
      '\n'
    )}\nplayed: ${stats.played} | won: ${stats.won}\naverage guesses: ${
      stats.average
    } ${averageChange}\nhttps://plantle.netlify.app `;
    navigator.clipboard.writeText(boardShareString);
    copied = true;
  }
</script>

<div class="nav-top">
  <center>
    <a href="https://plantle.netlify.app">plantle</a>
    <button
      class="theme-toggle"
      aria-label="toggle theme"
      on:click={toggleTheme}
    >
      {isLightMode ? '🌞' : '🌙'}
    </button>
  </center>
</div>
<div class="intro">
  <p class="intro-title">guess any real word</p>
  <p class="intro-subtitle">solutions limited to:</p>
  <p class="intro-categories">
    herbs, spices, fruit, veg, beans, shrooms
  </p>
  <p class="intro-categories">
    plants, flowers, bushes, crops, trees
  </p>
</div>
<div class="status-stack" aria-live="polite">
  {#if isDailyWordLoading}
    <p class="status loading">loading today’s word…</p>
  {/if}
  {#if dailyWordError}
    <p class="status error" role="alert">{dailyWordError}</p>
  {/if}
  {#if dictionaryError}
    <p class="status error" role="alert">{dictionaryError}</p>
  {/if}
  {#if isValidating}
    <p class="status loading">checking word…</p>
  {/if}
</div>
<div id="row">
  {#each Array(6) as _, i}
    <div id="wordRow" class:shake={invalidWord && indexWord === i}>
      {#each Array(5) as _, j}
        <button
          aria-label="board tile"
          class:selected={indexWord === i}
          class:correct={boardState[i][j] === 'correct'}
          class:present={boardState[i][j] === 'present'}
          class:used={boardState[i][j] === 'used'}
          class:revealed={boardState[i][j] !== ''}>{board[i][j]}</button
        >
      {/each}
    </div>
  {/each}
</div>
<br />
<div id="keyboardRow1">
  {#each 'qwertyuiop'.split('') as letter}
    <button
      aria-label="keyboard row 1"
      on:click={() => enter(letter)}
      class="keyboard-key"
      class:correct={correctLetters.includes(letter)}
      class:present={presentLetters.includes(letter)}
      class:used={usedLetters.includes(letter)}>{letter}</button
    >
  {/each}
</div>
<div id="keyboardRow2">
  {#each 'asdfghjkl'.split('') as letter}
    <button
      aria-label="keyboard row 2"
      on:click={() => enter(letter)}
      class="keyboard-key"
      class:correct={correctLetters.includes(letter)}
      class:present={presentLetters.includes(letter)}
      class:used={usedLetters.includes(letter)}>{letter}</button
    >
  {/each}
</div>
<div id="keyboardRow3">
  {#each 'zxcvbnm'.split('') as letter}
    <button
      aria-label="keyboard row 3"
      on:click={() => enter(letter)}
      class="keyboard-key"
      class:correct={correctLetters.includes(letter)}
      class:present={presentLetters.includes(letter)}
      class:used={usedLetters.includes(letter)}>{letter}</button
    >
  {/each}
  <button
    aria-label="backspace"
    on:click={backspace}
    class="keyboard-key action-key"
  >
    ⌫
  </button>
</div>
<br />
<div id="keyboardAction">
  <button
    aria-label="submit"
    class:submitenabled={!isSubmitDisabled}
    class:submitdisabled={isSubmitDisabled}
    disabled={isSubmitDisabled}
    on:click={() => submit(board[indexWord])}>🚀 submit</button
  >
  <button
    aria-label="clear"
    class:clearenabled={winState == false}
    class:cleardisabled={winState == true}
    on:click={clear}
  >
    ♻ clear</button
  >
  <button
    aria-label="share"
    class:sharedisabled={winState == false}
    class:shareenabled={winState == true}
    on:click={() => (showModal = true)}>📤 &nbsp;share results...</button
  >
</div>
<p id="footer">
  made by: <a href="https://ianahuja.com">ian</a
  >&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;source:
  <a href="https://github.com/12ian34/plantle">12ian34/plantle</a>
</p>

{#if showModal}
  <Modal on:close={() => ((showModal = false), (copied = false))}>
    <div id="modal" transition:fly={{ y: 0, duration: 250 }}>
      <p>plantle {date}</p>
      {#each boardShare as boardShareRow}
        <div id="boardShareRow"><p>{boardShareRow}</p></div>
      {/each}
      <p>{indexWord + 1}/6</p>
      <p class="stats">
        played: {stats.played} | won: {stats.won}
      </p>
      <p class="stats">
        average guesses: {stats.average}
        {averageChange}
      </p>
      <center
        ><button aria-label="copy" on:click={copyText}
          >{copied === false
            ? '📋 copy result to clipboard...'
            : '✔️ copied!'}</button
        ></center
      >
      <p>click/tap outside to close</p>
    </div>
  </Modal>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&display=swap');
  :global(:root) {
    --bg: #070b09;
    --surface: #1c2f25;
    --surface-raised: #243a2e;
    --text: #f6fbf7;
    --muted: #c9d4c9;
    --accent: #7ad28d;
    --accent-strong: #3aa85b;
    --present: #d7a24a;
    --used: #3c3c3c;
    --key: #21352a;
    --key-shadow: rgba(0, 0, 0, 0.35);
    --tile-border: rgba(255, 255, 255, 0.18);
    --focus: #a8d5a3;
    --danger: #d47c6b;
    --info: #8db2a3;
  }
  .nav-top {
    /* overflow: hidden;
    display: block; */
    margin-top: -0.5em;
    border-bottom: 0.15em solid var(--muted);
  }
  .nav-top a {
    /* float: left; */
    color: var(--text);
    font-size: 1.5em;
    text-align: center;
    line-height: 1.5em;
    text-decoration: none !important;
    border-bottom: none !important;
  }

  /* .nav-top-right {
    float: right;
  } */

  :global(body) {
    background-color: var(--bg);
    color: var(--text);
    transition: background-color 0.3s;
  }
  :global(body.light-mode) {
    background-color: #f5f8f3;
    color: #173624;
  }

  :global(body.light-mode) {
    --bg: #f5f8f3;
    --surface: #e2ede3;
    --surface-raised: #d6e6d9;
    --text: #173624;
    --muted: #4a6b56;
    --accent: #3aa85b;
    --accent-strong: #2f8c4a;
    --present: #c4872c;
    --used: #7b7b7b;
    --key: #d7e7da;
    --key-shadow: rgba(0, 0, 0, 0.15);
    --tile-border: rgba(0, 0, 0, 0.12);
    --focus: #2f8c4a;
    --danger: #c6564a;
    --info: #4a6b56;
  }

  #row {
    display: block;
  }

  p,
  a,
  button {
    font-family: 'Rubik', sans-serif;
    font-size: 1em;
    text-align: center;
  }
  p {
    line-height: 1.4;
  }

  a:link {
    color: var(--text);
    border-bottom: 0.15em solid var(--muted);
  }

  a:visited {
    color: var(--accent);
    border-bottom: 0.15em solid var(--muted);
  }

  a:hover {
    color: var(--focus);
    text-decoration: none;
  }

  a:active {
    color: var(--present);
    background-color: transparent;
  }

  #wordRow {
    font-size: 1.5em;
    color: green;
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 0.12em;
  }

  #wordRow button {
    background-color: var(--surface);
    color: var(--text);
    border-radius: 0.3em;
    border: 1px solid var(--tile-border);
    margin: 0.05em;
    min-width: 2em;
    min-height: 2em;
    justify-content: center;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  #wordRow button.selected {
    box-shadow: 0 0 0 2px var(--focus);
  }

  #wordRow button.revealed {
    animation: tileReveal 220ms ease-out;
  }

  #keyboardRow1,
  #keyboardRow2,
  #keyboardRow3 {
    color: var(--text);
    padding: 0.3em;
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 0.3em;
  }

  #keyboardRow2,
  #keyboardRow3 {
    margin-top: 0.35em;
  }

  #keyboardRow1 button,
  #keyboardRow2 button,
  #keyboardRow3 button {
    background-color: var(--key);
    min-width: 2.2em;
    color: var(--text);
    border-radius: 0.4em;
    border: 1px solid var(--tile-border);
    margin: 0.1em;
    justify-content: center;
    box-shadow: 0 4px 0 var(--key-shadow);
    transition: transform 0.08s ease, box-shadow 0.08s ease,
      background-color 0.12s ease;
  }

  #keyboardRow1 button:hover,
  #keyboardRow2 button:hover,
  #keyboardRow3 button:hover {
    filter: brightness(1.08);
    box-shadow: 0 4px 0 var(--key-shadow), 0 0 0 2px var(--focus);
  }

  #keyboardRow1 button:active,
  #keyboardRow2 button:active,
  #keyboardRow3 button:active {
    background-color: var(--surface-raised) !important;
    transform: translateY(2px);
    box-shadow: 0 2px 0 var(--key-shadow);
  }

  #keyboardAction {
    flex-flow: row;
    display: flex;
    justify-content: center;
  }
  #keyboardAction button {
    min-width: 5em;
    margin: 0em 1.8em 0em 1.8em;
    color: var(--text);
    border-radius: 0.4em;
    border: 1px solid var(--tile-border);
    font-weight: 500;
    box-shadow: 0 4px 0 var(--key-shadow);
    transition: transform 0.08s ease, box-shadow 0.08s ease,
      background-color 0.12s ease;
  }

  #keyboardAction button:hover {
    background-color: var(--surface-raised);
  }

  #keyboardAction button:active {
    box-shadow: 0 2px 0 var(--key-shadow);
  }

  .sharedisabled,
  .cleardisabled {
    display: none;
  }

  .submitdisabled {
    opacity: 0.75;
    cursor: not-allowed;
    box-shadow: none;
    color: var(--muted);
    background-color: var(--surface);
  }

  .theme-toggle {
    margin-left: 0.6em;
    font-size: 0.85em;
    padding: 0.2em 0.6em;
    border-radius: 999px;
    border: 1px solid var(--tile-border);
    background-color: var(--surface);
    color: var(--text);
    box-shadow: 0 3px 0 var(--key-shadow);
  }

  .action-key {
    min-width: 2.6em;
    font-weight: 600;
  }

  .theme-toggle:hover {
    background-color: var(--surface-raised);
  }

  .theme-toggle:active {
    transform: translateY(1px);
    box-shadow: 0 2px 0 var(--key-shadow);
  }

  .shareenabled {
    background-color: var(--surface-raised);
  }

  .submitenabled {
    background-color: var(--accent-strong);
  }

  .clearenabled {
    background-color: var(--present);
  }
  #footer {
    margin-top: 0.8em;
    border-top: 0.15em solid var(--muted);
    padding-top: 0.8em;
    color: var(--muted);
    font-size: 0.9em !important;
    white-space: nowrap;
  }

  .correct {
    background-color: var(--accent-strong) !important;
  }

  .present {
    background-color: var(--present) !important;
  }

  .used {
    background-color: var(--used) !important;
  }

  #modal p {
    color: #1a1a1a;
    padding: 0.5em;
  }

  .stats {
    line-height: 0px !important;
  }

  #modal button {
    min-width: 5em;
    color: white;
    background-color: var(--accent-strong);

    border-radius: 0.4em;
    border: 0;
  }

  #modal button:hover {
    background-color: var(--accent);
  }

  #modal button:active {
    background-color: #16211c;
  }

  #boardShareRow p {
    letter-spacing: 0.08em;
    padding: 0em;
  }

  .status {
    color: var(--muted);
    margin-top: 0.4em;
  }

  .status-stack {
    min-height: 2.6em;
  }

  .intro {
    margin: 0.6em 0 0.2em;
  }

  .intro-title {
    font-size: 1.05em;
    margin: 0.2em 0 0.2em;
    letter-spacing: 0.01em;
  }

  .intro-subtitle {
    color: var(--muted);
    margin: 0 0 0.35em;
  }

  .intro-categories {
    margin: 0.1em 0;
    letter-spacing: 0.015em;
  }

  .status.error {
    color: var(--danger);
  }

  .status.loading {
    color: var(--info);
  }

  .shake {
    animation: rowShake 280ms ease-in-out;
  }

  @keyframes tileReveal {
    0% {
      transform: scale(0.94);
    }
    70% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes rowShake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-4px);
    }
    50% {
      transform: translateX(4px);
    }
    75% {
      transform: translateX(-4px);
    }
    100% {
      transform: translateX(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #wordRow button,
    #keyboardAction button,
    #keyboardRow1 button,
    #keyboardRow2 button,
    #keyboardRow3 button {
      transition: none;
    }

    #wordRow button.revealed,
    .shake {
      animation: none;
    }
  }
</style>
