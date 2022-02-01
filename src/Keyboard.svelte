<script>
  let indexWord = 0;
  let index_letter = 0;
  let solution = 'daisy';
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
      alert('press submit when ready!');
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
    console.log(letter);
    console.log(solution.charAt(validationIndex));
    if (solution.charAt(validationIndex) == letter) {
      console.log('letter correct!');
      console.log('state' + boardState);
      console.log('indexWord' + indexWord);
      console.log('validation index' + validationIndex);
      boardState[indexWord][validationIndex] = 'correct';
      console.log(boardState);
    } else if (solution.includes(letter)) {
      boardState[indexWord][validationIndex] = 'present';
    }
    validationIndex += 1;
  }

  // function submitold(word) {
  //   var wordString = word.join('');
  //   alert('submitted: ' + wordString);
  //   fetch('https://wordsapiv1.p.rapidapi.com/words/' + wordString, {
  //     method: 'GET',
  //     headers: {
  //       'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
  //       'x-rapidapi-key': process.env.WORDSAPI_KEY,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       word.forEach(validateWord);
  //       indexWord += 1;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       alert(
  //         "'" + wordString + "'" + ' not found in dictionary. try a real word!'
  //       );
  //       return [];
  //     });
  // }

  function stringifyWord(word) {
    wordString = word.join('');
    return wordString;
  }

  async function submit(word) {
    wordString = stringifyWord(word);
    alert('submitted: ' + wordString);
    const requestUrl = `/.netlify/functions/dictionaryLookup?wordString=${wordString}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    console.log(data);
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
