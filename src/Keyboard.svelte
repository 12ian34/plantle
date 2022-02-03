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

  // let storedData = [
  //   indexWord,
  //   indexLetter,
  //   validationIndex,
  //   wordString,
  //   usedLetters,
  //   correctLetters,
  //   presentLetters,
  //   board,
  //   boardState,
  // ];
  // storedData.forEach(getFromLocalStorage());

  // initialise board, state and variables
  // getting from localStorage if present
  if (localStorage.getItem('board') === null) {
    board = [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ];
  } else {
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

  if (localStorage.getItem('boardState') === null) {
    boardState = [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ];
  } else {
    boardState = getFromLocalStorage('boardState');
  }

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
      console.log('letter ' + "'" + enteredLetter + "'" + ' correct!');
      boardState[indexWord][validationIndex] = 'correct';
      correctLetters.push(enteredLetter);
      // reactivity is triggered by assignment only
      correctLetters = correctLetters;
      saveToLocalStorage('correctLetters', correctLetters);
    } else if (dailyWord.includes(enteredLetter)) {
      // present letter
      console.log('letter ' + "'" + enteredLetter + "'" + ' present!');
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
    console.log(correctLetters.includes(enteredLetter));
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
      console.log(typeof board);
      saveToLocalStorage('board', board);
      saveToLocalStorage('boardState', boardState);
      // then check if solution was reached and handle
      checkSuccess('correct');
    }
  }

  function toggle() {
    window.document.body.classList.toggle('light-mode');
  }
</script>

<button on:click={toggle}>☀️</button>

<div class="container size">
  <div id="row">
    {#each Array(6) as _, i}
      <div id="wordRow" class:selected={indexWord === i}>
        {#each Array(5) as _, j}
          <button
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
</div>

<style>
  :global(body) {
    background-color: #276332;
    color: #214626;
    transition: background-color 0.3s;
  }
  :global(body.light-mode) {
    background-color: #f2eee2;
    color: #0084f6;
  }
  .size {
    max-width: 1100px;
    width: 100%;
  }
  #wordRow {
    font-size: 1.5em;
    display: grid;
    grid-template-columns: repeat(5, 2em);
    grid-template-rows: repeat(1, 2.5em);
    grid-gap: 0.1em;
    color: green;
  }

  .selected {
    font-size: 1.5em;
    display: grid;
    grid-template-columns: repeat(5, 2em);
    grid-template-rows: repeat(1, 3em);
    grid-gap: 0.1em;
    background-color: #f6f6f6;
    color: green;
  }

  #keyboardRow1,
  #keyboardRow2,
  #keyboardRow3 {
    display: grid;
    grid-template-columns: repeat(10, 2em);
    grid-template-rows: repeat(1, 3em);
    grid-gap: 0.4em;
    max-width: 100%;
  }

  .correct {
    color: green;
  }

  .present {
    color: orange;
  }

  .used {
    color: red;
  }

  #keyboardRow2 {
    margin-left: 1.1em;
  }

  #keyboardRow3 {
    margin-left: 3.3em;
  }
</style>
