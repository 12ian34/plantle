<script>
  // don't be boring and look at my source code

  import Time from 'svelte-time';
  let date = new Date().toISOString().slice(0, 10);
  let dailyWord = getDailyWord(date);
  let indexWord = 0;
  let indexLetter = 0;
  let validationIndex = 0;
  let wordString;
  let usedLetters = [];
  let correctLetters = [];
  let presentLetters = [];
  let board;
  let boardState;
  let lastPlayedDate;

  board = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  boardState = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  // check if played before
  if (localStorage.getItem('lastPlayedDate') != null) {
    // if yes, get last played date
    lastPlayedDate = getFromLocalStorage('lastPlayedDate');
    // check if it is the same day
    if (date == lastPlayedDate) {
      // if yes, get data if present
      // getting from localStorage if present
      if (localStorage.getItem('board') != null) {
        board = getFromLocalStorage('board');
      }
      if (localStorage.getItem('indexWord') != null) {
        indexWord = getFromLocalStorage('indexWord');
      }
      if (localStorage.getItem('indexLetter') != null) {
        indexLetter = getFromLocalStorage('indexLetter');
      }
      if (localStorage.getItem('validationIndex') != null) {
        validationIndex = getFromLocalStorage('validationIndex');
      }
      if (localStorage.getItem('wordString') != null) {
        wordString = getFromLocalStorage('wordString');
      }
      if (localStorage.getItem('usedLetters') != null) {
        usedLetters = getFromLocalStorage('usedLetters');
      }
      if (localStorage.getItem('correctLetters') != null) {
        correctLetters = getFromLocalStorage('correctLetters');
      }
      if (localStorage.getItem('presentLetters') != null) {
        presentLetters = getFromLocalStorage('presentLetters');
      }
      if (localStorage.getItem('boardState') != null) {
        boardState = getFromLocalStorage('boardState');
      }
    }
  }
  lastPlayedDate = date;
  saveToLocalStorage('lastPlayedDate', lastPlayedDate);

  function getFromLocalStorage(key) {
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
      alert('🌽🌽🌽 congratulations 🌽🌽🌽');
      saveToLocalStorage('success', 'true');
      return true;
      // TODO: do something here to end game
    } else {
      // otherwise, move on to next word and reset validation index
      indexWord += 1;
      indexLetter = 0;
      validationIndex = 0;
      saveToLocalStorage('indexWord', indexWord);
      saveToLocalStorage('indexLetter', indexLetter);
      saveToLocalStorage('validationIndex', validationIndex);
      return false;
    }
  }

  // fetch word based on today's date
  async function getDailyWord(date) {
    const requestUrl = `/.netlify/functions/getWord?date=${date}`;
    var response = await fetch(requestUrl);
    var body = await response.json();
    dailyWord = body.data[0].dailyWord;
    return dailyWord;
  }

  // on submit of complete word
  async function submit(word) {
    wordString = stringifyWord(word);
    if (wordString.length == 5) {
      // check word against dictionary
      const requestUrl = `/.netlify/functions/dictionaryLookup?wordString=${wordString}`;
      const response = await fetch(requestUrl);
      if (response.statusText == 'Not Found') {
        // word not found
        alert(
          "'" + wordString + "'" + ' not found in dictionary. try a real word!'
        );
        clear();
      } else if (response.status != 200) {
        // other error
        alert(
          'something else went seriously wrong. please contact to fix, providing: the current time, the word you tried and what happened.'
        );
      } else {
        // word matched dictionary
        // now check each letter against solution
        word.forEach(validateWord);
        // save state to localStorage]
        saveToLocalStorage('board', board);
        saveToLocalStorage('boardState', boardState);
        // then check if solution was reached and handle
        checkSuccess('correct');
      }
    } else {
      alert('you must submit a full word!');
    }
  }

  function toggle() {
    window.document.body.classList.toggle('light-mode');
  }
</script>

<div class="nav-top">
  <a href="https://plantle.netlify.app">plant-based word game</a>
  <div class="nav-top-right">
    <button on:click={toggle}>☀️</button>
  </div>
</div>

<p>you can guess any real word,</p>
<p>but solutions are limited to:</p>
<ul>
  <li>herbs and spices</li>
  <li>fruit, veg, beans and mushrooms</li>
  <li>flowers, bushes, trees and crops</li>
</ul>

<div id="row">
  {#each Array(6) as _, i}
    <div id="wordRow">
      {#each Array(5) as _, j}
        <button
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
      on:click={() => enter(letter)}
      class:correct={correctLetters.includes(letter)}
      class:present={presentLetters.includes(letter)}
      class:used={usedLetters.includes(letter)}>{letter}</button
    >
  {/each}
</div>

<br />

<div class="keyboardAction">
  <button on:click={clear}>clear</button>
  <button on:click={() => submit(board[indexWord])}>submit</button>
</div>

<style>
  * {
    /* margin: 0.2em 0.2em 0.2em 0.2em; */
    /* padding: 0.2em; */
    /* border: 0.5em 0.5em 0.5em 0.5em; */
    /* outline: 0.5em 0.5em 0.5em 0.5em; */
    /* font-size: 100%; */
    /* vertical-align: baseline; */
    /* background: transparent; */
  }

  .nav-top {
    overflow: hidden;
    border-bottom: 2px solid white;
  }
  .nav-top a {
    float: left;
    color: white;
    font-size: 1.5em;
  }
  .nav-top-right {
    float: right;
  }
  :global(body) {
    background-color: #031805;
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

  /* #selected {
    background-color: #286f35;
  } */

  p {
    line-height: 20%;
    font-size: 1em;
  }
  #wordRow {
    font-size: 1.5em;
    display: grid;
    grid-template-columns: repeat(5, 2.5em);
    max-width: 50em;
    grid-template-rows: repeat(1, 2.5em);
    grid-gap: 0.1em;
    color: green;
  }

  #wordRow button {
    background-color: #112704;
    color: white;
    border-radius: 8px;
    border: 0px;
  }

  #keyboardRow1,
  #keyboardRow2,
  #keyboardRow3 {
    display: grid;
    grid-template-columns: repeat(10, 2em);
    grid-template-rows: repeat(1, 3em);
    grid-gap: 0.4em;
    max-width: 100%;
    color: white;
  }

  .correct {
    background-color: green !important;
  }

  .present {
    background-color: rgba(255, 166, 0, 0.741) !important;
  }

  .used {
    background-color: rgb(79, 16, 0) !important;
  }

  #keyboardRow1 button,
  #keyboardRow2 button,
  #keyboardRow3 button {
    background-color: #6a6a6a;
    color: white;
    border-radius: 8px;
    border: 0px;
  }

  #keyboardRow2 {
    margin-left: 1.1em;
  }

  #keyboardRow3 {
    margin-left: 3.5em;
  }
</style>
