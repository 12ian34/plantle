<script>
  import { createEventDispatcher } from 'svelte';

  export let value = '';

  var index_word = 1;
  var index_letter = 1;
  var current_letter = 'letter_' + index_word + '_' + index_letter;

  var board = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  const dispatch = createEventDispatcher();

  function enter(letter) {
    console.log(letter);
    console.log(current_letter);
    console.log(index_word);
    console.log(index_letter);
    board[index_word][index_letter] = letter;
    if (index_letter == 5) {
      index_letter = 1;
      index_word += 1;
    }
    index_letter += 1;
    console.log(letter);
    console.log(current_letter);
    console.log(index_word);
    console.log(index_letter);
  }

  const clear = () => (value = '');
  const submit = () => dispatch('submit');
</script>

<div class="wordRow">
  <button id="letter_1_1"> {board[0][0]}</button>
  <button id="letter_1_2"> {board[0][1]}</button>
  <button id="letter_1_3"> {board[0][2]}</button>
  <button id="letter_1_4"> {board[0][3]}</button>
  <button id="letter_1_5"> {board[0][4]}</button>
</div>

<div class="wordRow">
  <button id="letter_2_1"> {board[1][0]}</button>
  <button id="letter_2_2"> {board[1][1]}</button>
  <button id="letter_2_3"> {board[1][2]}</button>
  <button id="letter_2_4"> {board[1][3]}</button>
  <button id="letter_2_5"> {board[1][4]}</button>
</div>

<div class="wordRow">
  <button id="letter_3_1"> {board[2][0]}</button>
  <button id="letter_3_2"> {board[2][1]}</button>
  <button id="letter_3_3"> {board[2][2]}</button>
  <button id="letter_3_4"> {board[2][3]}</button>
  <button id="letter_3_5"> {board[2][4]}</button>
</div>

<div class="wordRow">
  <button id="letter_4_1"> {board[3][0]}</button>
  <button id="letter_4_2"> {board[3][1]}</button>
  <button id="letter_4_3"> {board[3][2]}</button>
  <button id="letter_4_4"> {board[3][3]}</button>
  <button id="letter_4_5"> {board[3][4]}</button>
</div>

<div class="wordRow">
  <button id="letter_5_1"> {board[4][0]}</button>
  <button id="letter_5_2"> {board[4][1]}</button>
  <button id="letter_5_3"> {board[4][2]}</button>
  <button id="letter_5_4"> {board[4][3]}</button>
  <button id="letter_5_5"> {board[4][4]}</button>
</div>

<div class="wordRow">
  <button id="letter_6_1"> {board[5][0]}</button>
  <button id="letter_6_2"> {board[5][1]}</button>
  <button id="letter_6_3"> {board[5][2]}</button>
  <button id="letter_6_4"> {board[5][3]}</button>
  <button id="letter_6_5"> {board[5][4]}</button>
</div>

<div class="keyboardRow1">
  <button on:click={enter('q')}>q</button>
  <button on:click={enter('w')}>w</button>
  <button on:click={enter('e')}>e</button>
  <button on:click={enter('r')}>r</button>
  <button on:click={enter('t')}>t</button>
  <button on:click={enter('y')}>y</button>
  <button on:click={enter('u')}>u</button>
  <button on:click={enter('i')}>i</button>
  <button on:click={enter('o')}>o</button>
  <button on:click={enter('p')}>p</button>
</div>

<div class="keyboardRow2">
  <button on:click={enter('a')}>a</button>
  <button on:click={enter('s')}>s</button>
  <button on:click={enter('d')}>d</button>
  <button on:click={enter('f')}>f</button>
  <button on:click={enter('g')}>g</button>
  <button on:click={enter('h')}>h</button>
  <button on:click={enter('j')}>j</button>
  <button on:click={enter('k')}>k</button>
  <button on:click={enter('l')}>l</button>
</div>

<div class="keyboardRow3">
  <button on:click={enter('z')}>z</button>
  <button on:click={enter('x')}>x</button>
  <button on:click={enter('c')}>c</button>
  <button on:click={enter('v')}>v</button>
  <button on:click={enter('b')}>b</button>
  <button on:click={enter('n')}>n</button>
  <button on:click={enter('m')}>m</button>
</div>

<div class="keyboardAction">
  <button disabled={!value} on:click={clear}>clear</button>
  <button disabled={!value} on:click={submit}>submit</button>
</div>

<style>
  .wordRow {
    font-size: 1.5em;
    display: grid;
    grid-template-columns: repeat(5, 2em);
    grid-template-rows: repeat(1, 3em);
    grid-gap: 0.1em;
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
