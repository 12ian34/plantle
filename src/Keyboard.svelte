<script>
  // don't be boring and look at my source code

  import Time from 'svelte-time';
  let date = new Date().toISOString().slice(0, 10);
  let indexWord = 0;
  let index_letter = 0;
  let validationIndex = 0;
  let wordString;
  let usedLetters = [];
  let correctLetters = [];
  let presentLetters = [];
  let dailyWord = getDailyWord(date);

  // initialise board and board state arrays
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

  // on each letter, increment index to move on to next letter
  // if last letter of word, stay on that letter
  function enter(enteredLetter) {
    if (index_letter < 5) {
      board[indexWord][index_letter] = enteredLetter;
    }

    if (index_letter == 5) {
      index_letter = 4;
    } else {
      index_letter += 1;
    }
  }

  function clear() {
    board[indexWord] = ['', '', '', '', ''];
    index_letter = 0;
  }

  function validateWord(enteredLetter) {
    if (dailyWord.charAt(validationIndex) == enteredLetter) {
      // correct letter
      console.log('letter ' + "'" + enteredLetter + "'" + ' correct!');
      boardState[indexWord][validationIndex] = 'correct';
      correctLetters.push(enteredLetter);
      // reactivity is triggered by assignment only
      correctLetters = correctLetters;
    } else if (dailyWord.includes(enteredLetter)) {
      // present letter
      console.log('letter ' + "'" + enteredLetter + "'" + ' present!');
      boardState[indexWord][validationIndex] = 'present';
      presentLetters.push(enteredLetter);
      // reactivity is triggered by assignment only
      presentLetters = presentLetters;
    } else {
      // boardState[indexWord][validationIndex] = 'used';
      // store used letter
      usedLetters.push(enteredLetter);
      // reactivity is triggered by assignment only
      usedLetters = usedLetters;
    }
    validationIndex += 1;
    console.log(correctLetters.includes(enteredLetter));
  }

  // concatenate word array to string
  function stringifyWord(word) {
    wordString = word.join('');
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
      return true;
      // TODO: do something here to end game
    } else {
      // otherwise, move on to next word and reset validation index
      indexWord += 1;
      index_letter = 0;
      validationIndex = 0;
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
      // then check if solution was reached and handle
      checkSuccess('correct');
    }
  }
</script>

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
