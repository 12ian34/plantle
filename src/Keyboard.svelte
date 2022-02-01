<script>
  let indexWord = 0;
  let index_letter = 0;
  let solution = 'asian';
  let validationIndex = 0;
  let wordString;

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
    if (solution.charAt(validationIndex) == letter) {
      console.log('letter ' + "'" + letter + "'" + ' correct!');
      boardState[indexWord][validationIndex] = 'correct';
    } else if (solution.includes(letter)) {
      console.log('letter ' + "'" + letter + "'" + ' present!');
      boardState[indexWord][validationIndex] = 'present';
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
      alert('congratulations');
      return true;
    } else {
      indexWord += 1;
      index_letter = 0;
      validationIndex = 0;
      return false;
    }
  }

  async function submit(word) {
    wordString = stringifyWord(word);
    const requestUrl = `/.netlify/functions/dictionaryLookup?wordString=${wordString}`;
    const response = await fetch(requestUrl);
    const data = await response;
    if (response.statusText == 'Not Found') {
      // word not found
      alert(
        "'" + wordString + "'" + ' not found in dictionary. try a real word!'
      );
      clear();
    } else if (response.status != 200) {
      // other error
      alert(
        'something else went seriously wrong. contact ian to fix providing current time, the word you tried and what happened!'
      );
    } else {
      // word matched dictionary
      word.forEach(validateWord);
      checkSuccess('correct');
    }
  }
</script>

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

<div class="keyboardRow1">
  {#each 'qwertyuiop'.split('') as letter}
    <button on:click={() => enter(letter)}>{letter}</button>
  {/each}
</div>

<div class="keyboardRow2">
  {#each 'asdfghjkl'.split('') as letter}
    <button on:click={() => enter(letter)}>{letter}</button>
  {/each}
</div>

<div class="keyboardRow3">
  {#each 'zxcvbnm'.split('') as letter}
    <button on:click={() => enter(letter)}>{letter}</button>
  {/each}
</div>

<div class="keyboardAction">
  <button on:click={clear}>clear</button>
  <button on:click={() => submit(board[indexWord])}>submit</button>
</div>

<style>
  #wordRow {
    font-size: 1.5em;
    display: grid;
    grid-template-columns: repeat(5, 2em);
    grid-template-rows: repeat(1, 3em);
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

  .correct {
    color: green;
  }

  .present {
    color: orange;
  }

  .keyboardRow1,
  .keyboardRow2,
  .keyboardRow3 {
    display: grid;
    grid-template-columns: repeat(10, 3em);
    grid-template-rows: repeat(1, 3em);
    grid-gap: 0.2em;
  }

  .keyboardRow2 {
    margin-left: 1.6em;
  }

  .keyboardRow3 {
    margin-left: 4.8em;
  }
</style>
