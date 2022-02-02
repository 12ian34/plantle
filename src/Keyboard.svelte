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

  function enter(letter) {
    if (index_letter < 5) {
      board[indexWord][index_letter] = letter;
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

  function validateWord(letter) {
    if (dailyWord.charAt(validationIndex) == letter) {
      // correct letter
      console.log('letter ' + "'" + letter + "'" + ' correct!');
      boardState[indexWord][validationIndex] = 'correct';
      correctLetters.push(letter);
    } else if (dailyWord.includes(letter)) {
      // present letter
      console.log('letter ' + "'" + letter + "'" + ' present!');
      boardState[indexWord][validationIndex] = 'present';
      presentLetters.push(letter);
    }
    validationIndex += 1;
  }

  function stringifyWord(word) {
    wordString = word.join('');
    return wordString;
  }

  function checkSuccess(correct) {
    var count = 0;
    for (var i = 0; i < boardState[indexWord].length; i++) {
      if (boardState[indexWord][i] === correct) {
        count++;
      }
    }
    if (count == 5) {
      alert('🌽🌽🌽 congratulations 🌽🌽🌽');
      return true;
    } else {
      indexWord += 1;
      index_letter = 0;
      validationIndex = 0;
      return false;
    }
  }

  async function getDailyWord(date) {
    const requestUrl = `/.netlify/functions/getWord?date=${date}`;
    var response = await fetch(requestUrl);
    var body = await response.json();
    dailyWord = body.data[0].dailyWord;
    return dailyWord;
  }

  async function submit(word) {
    wordString = stringifyWord(word);
    if (wordString == 'kuntz') {
      alert('nice try dan');
    }
    if (wordString == 'nicee') {
      alert('nicee try');
    }
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
        'something else went seriously wrong. please contact ian to fix, providing: the current time, the word you tried and what happened.'
      );
    } else {
      // word matched dictionary
      word.forEach(validateWord);
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
            class:present={boardState[i][j] === 'present'}>{board[i][j]}</button
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
        class:present={presentLetters.includes(letter)}>{letter}</button
      >
    {/each}
  </div>

  <div id="keyboardRow2">
    {#each 'asdfghjkl'.split('') as letter}
      <button
        on:click={() => enter(letter)}
        class:correct={correctLetters.includes(letter)}
        class:present={presentLetters.includes(letter)}>{letter}</button
      >
    {/each}
  </div>

  <div id="keyboardRow3">
    {#each 'zxcvbnm'.split('') as letter}
      <button
        on:click={() => enter(letter)}
        class:correct={correctLetters.includes(letter)}
        class:present={presentLetters.includes(letter)}>{letter}</button
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

  #keyboardRow2 {
    margin-left: 1.1em;
  }

  #keyboardRow3 {
    margin-left: 3.3em;
  }
</style>
