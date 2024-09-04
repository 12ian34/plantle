<script>
  // don't be boring and look at my source code
  import Modal from './Modal.svelte';
  import Time from 'svelte-time';
  import { fly } from 'svelte/transition';

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
  let dailyWord = getDailyWord(date);
  let stats = {
    history: [],
    played: 0,
    won: 0,
    average: 0,
  };
  let averageChange;
  let oldAverage;

  const boardStateShareMap = {
    correct: '🟩',
    present: '🟧',
    '': '⬛',
  };

  let board = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  let boardState = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  // check if played before
  if (localStorage.getItem('lastPlayedDate')) {
    // if yes, get last played date
    lastPlayedDate = getFromLocalStorage('lastPlayedDate');
    console.log(`last played: ${lastPlayedDate}`);
    // check if it is the same day
    if (date == lastPlayedDate) {
      // if yes, get data if present
      // getting from localStorage if present
      console.log(`(today)`);

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
      console.log(`date: ${date}`);
    }
    if (localStorage.getItem('stats')) {
      stats = getFromLocalStorage('stats');
      if (stats.averageChange) {
        averageChange = stats.averageChange;
      }
    }
  }
  console.log(averageChange);

  // fetch word based on today's date
  async function getDailyWord(date) {
  const requestUrl = `/.netlify/functions/getWord?date=${date}`;
  try {
    var response = await fetch(requestUrl);
    var body = await response.json();
    
    if (body && body.data && body.data.length > 0) {
      dailyWord = body.data[0].dailyWord;
    } else {
      console.log('No daily word found for the given date.');
      dailyWord = ''; // or handle it as you see fit
    }

    return dailyWord;
  } catch (err) {
    console.log('Error fetching daily word:', err);
    dailyWord = ''; // Handle the error case
    return dailyWord;
  }
}

  function getFromLocalStorage(key) {
    // for debugging
    // console.log(`${key}: ${JSON.parse(localStorage.getItem(key))}`);
    return JSON.parse(localStorage.getItem(key));
  }

  function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // on each letter, increment index to move on to next letter
  // if last letter of word, stay on that letter
  function enter(enteredLetter) {
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
    board[indexWord] = ['', '', '', '', ''];
    indexLetter = 0;
    saveToLocalStorage('indexLetter', indexLetter);
    saveToLocalStorage('board', board);
  }

  function validateWord(enteredLetter) {
    if (dailyWord.charAt(validationIndex) == enteredLetter) {
      // correct letter
      boardState[indexWord][validationIndex] = 'correct';
      correctLetters.push(enteredLetter);
      // reactivity is triggered by assignment only
      correctLetters = correctLetters;
      saveToLocalStorage('correctLetters', correctLetters);
    } else if (dailyWord.includes(enteredLetter)) {
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

  // concatenate word array to string
  function stringifyWord(word) {
    wordString = word.join('');
    saveToLocalStorage('wordString', wordString);
    return wordString;
  }

  // check each letter of word and update board state array
  function checkSuccess(correct) {
    var count = 0;
    for (var i = 0; i < boardState[indexWord].length; i++) {
      if (boardState[indexWord][i] === correct) {
        count++;
      }
    }
    // if there are 5 corrects in the array, win!
    if (count == 5) {
      return true;
    } else {
      return false;
    }
  }

  function mapBoard(boardState) {
    var boardShare = boardState.map(function (nested) {
      return nested
        .map(function (element) {
          return boardStateShareMap[element];
        })
        .join('');
    });
    return boardShare;
  }

  function saveStats(stats, winState) {
    if (winState == true) {
      stats.history.push({
        date: date,
        winState: winState,
        guesses: indexWord + 1,
      });
      stats.won++;
    }
    if (winState == false) {
      stats.history.push({ date: date, winState: winState });
    }

    stats.played++;
    let guesses = stats.history.reduce((total, obj) => obj.guesses + total, 0);
    oldAverage = stats.average;
    stats.average = Math.round((guesses / stats.played) * 10) / 10;
    if (oldAverage > 0) {
      if (oldAverage > stats.average) {
        averageChange = '📉';
      } else if (oldAverage < stats.average) {
        averageChange = '📈';
      } else {
        averageChange = '↔️';
      }
    } else {
      averageChange = '↔️';
    }
    stats.averageChange = averageChange;
    saveToLocalStorage('stats', stats);

    return stats;
  }

  // on submit of complete word
  async function submit(word) {
  wordString = stringifyWord(word);
  if (wordString.length == 5) {
    // Check word against dictionary
    const requestUrl = `/.netlify/functions/dictionaryLookup?wordString=${wordString}`;
    try {
      const response = await fetch(requestUrl);
      
      // Handle different HTTP response codes
      if (response.status === 404) {
        // Word not found in dictionary
        alert(`'${wordString}' not found in dictionary. Try a real word!`);
        clear();
      } else if (!response.ok) {
        // Other types of errors (e.g., 500 or network issues)
        alert(
          'Something went wrong. Please contact support with details about the current time, the word you tried, and what happened.'
        );
      } else {
        // Word matched in dictionary
        const responseData = await response.json();
        
        // Now check each letter against the solution
        word.forEach(validateWord);
        
        // Save state to localStorage
        saveToLocalStorage('board', board);
        saveToLocalStorage('boardState', boardState);

        // Then check if solution was reached and handle win state
        winState = checkSuccess('correct');
        if (winState == true) {
          alert('🌽🌽🌽 Congratulations! 🌽🌽🌽');
          saveToLocalStorage('winState', winState);
          boardShare = mapBoard(boardState);
          saveToLocalStorage('boardShare', boardShare);
          validationIndex = 0;
          saveToLocalStorage('validationIndex', validationIndex);
          stats = saveStats(stats, winState);
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
            stats = saveStats(stats, winState);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching from dictionaryLookup:', error);
      alert('Error connecting to the dictionary lookup service.');
    }
  } else {
    alert('You must submit a full word!');
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
  <center
    ><a href="https://plantle.netlify.app">plant-based word game</a>
    <!-- <div class="nav-top-right"><button on:click={toggle}>☀️</button></div>-->
  </center>
</div>
<p>guess any real word. solutions limited to:</p>
<p>herbs/spices/fruit/veg/beans/shrooms</p>
<p>plants/flowers/bushes/crops/trees</p>
<div id="row">
  {#each Array(6) as _, i}
    <div id="wordRow">
      {#each Array(5) as _, j}
        <button
          aria-label="board tile"
          id:selected={indexWord === i}
          class:correct={boardState[i][j] === 'correct'}
          class:present={boardState[i][j] === 'present'}
          class:used={boardState[i][j] === 'used'}>{board[i][j]}</button
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
      class:correct={correctLetters.includes(letter)}
      class:present={presentLetters.includes(letter)}
      class:used={usedLetters.includes(letter)}>{letter}</button
    >
  {/each}
</div>
<br />
<div id="keyboardAction">
  <button
    aria-label="submit"
    class:submitenabled={winState == false}
    class:submitdisabled={winState == true}
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
  @import url('https://fonts.googleapis.com/css2?family=Bitter&display=swap');
  .nav-top {
    /* overflow: hidden;
    display: block; */
    margin-top: -0.5em;
    border-bottom: 0.15em solid white;
  }
  .nav-top a {
    /* float: left; */
    color: white;
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
    background-color: #345938;
    color: #ffffff;
    transition: background-color 0.3s;
  }
  :global(body.light-mode) {
    background-color: #f2eee2;
    color: #0084f6;
  }

  #row {
    display: block;
  }

  p,
  a,
  button {
    font-family: 'Bitter', serif;
    font-size: 1em;
    text-align: center;
  }
  p {
    line-height: 20%;
  }

  a:link {
    color: white;
    border-bottom: 0.15em solid white;
  }

  a:visited {
    color: #ff6c1e;
    border-bottom: 0.15em solid white;
  }

  a:hover {
    color: #0084f6;
    text-decoration: none;
  }

  a:active {
    color: yellow;
    background-color: transparent;
  }

  #wordRow {
    font-size: 1.5em;
    color: green;
    display: flex;
    flex-flow: row;
    justify-content: center;
  }

  #wordRow button {
    background-color: #15250e;
    color: white;
    border-radius: 0.2em;
    border: 0em;
    margin: 0.05em;
    min-width: 2em;
    min-height: 2em;
    justify-content: center;
  }

  #keyboardRow1,
  #keyboardRow2,
  #keyboardRow3 {
    color: white;
    padding: 0.15em;
    display: flex;
    flex-flow: row;
    justify-content: center;
  }

  #keyboardRow1 button,
  #keyboardRow2 button,
  #keyboardRow3 button {
    background-color: #15250e;
    min-width: 2em;
    color: white;
    border-radius: 0.2em;
    border: 0em;
    margin: 0.15em;
    justify-content: center;
  }

  #keyboardRow1 button:hover,
  #keyboardRow2 button:hover,
  #keyboardRow3 button:hover {
    background-color: #0084f6 !important;
  }

  #keyboardRow1 button:active,
  #keyboardRow2 button:active,
  #keyboardRow3 button:active {
    background-color: #000000 !important;
  }

  #keyboardAction {
    flex-flow: row;
    display: flex;
    justify-content: center;
  }
  #keyboardAction button {
    min-width: 5em;
    margin: 0em 1.8em 0em 1.8em;
    color: black;
    border-radius: 0.2em;
    border: 0em;
    font-weight: bold;
  }

  #keyboardAction button:hover {
    background-color: #1436bb;
    color: white;
  }

  #keyboardAction button:active {
    background-color: #000000;
  }

  .sharedisabled,
  .submitdisabled,
  .cleardisabled {
    display: none;
  }

  .shareenabled {
    background-color: #0084f6;
  }

  .submitenabled {
    background-color: #0084f6;
  }

  .clearenabled {
    background-color: #ff6c1e;
  }
  #footer {
    margin-top: 0.8em;
    border-top: 0.15em solid white;
    padding-top: 0.8em;
    color: white;
    font-size: 0.9em !important;
    white-space: nowrap;
  }

  .correct {
    background-color: #048a04 !important;
  }

  .present {
    background-color: #ffa600bd !important;
  }

  .used {
    background-color: #b33111 !important;
  }

  #modal p {
    color: black;
    padding: 0.5em;
  }

  .stats {
    line-height: 0px !important;
  }

  #modal button {
    color: black;
    min-width: 5em;
    color: white;
    background-color: #0084f6;

    border-radius: 0.2em;
    border: 0em;
  }

  #modal button:hover {
    background-color: #1436bb;
  }

  #modal button:active {
    background-color: #000000;
  }

  #boardShareRow p {
    letter-spacing: 0.08em;
    padding: 0em;
  }
</style>
