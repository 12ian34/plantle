<script>
  import { createEventDispatcher } from 'svelte';

  let index_word = 0;
  let index_letter = 0;
  let submitstate = 1;

  let board = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    alert(`submitted ${pin}`);
  }

  function clear() {
    board[index_word] = ['', '', '', '', ''];
    index_letter = 0;
  }

  function enter(letter) {
    console.log(index_word);
    console.log(index_letter);
    console.log(letter);

    board[index_word][index_letter] = letter;

    if (index_letter == 4) {
      index_letter = 0;
      index_word += 1;
    } else {
      index_letter += 1;
    }
  }

  const submit = () => dispatch('submit');

  let m = { x: 0, y: 0 };

  function handleMousemove(event) {
    m.x = event.clientX;
    m.y = event.clientY;
  }
</script>

<div class="wordRow">
  <button>{board[0][0]}</button>
  <button>{board[0][1]}</button>
  <button>{board[0][2]}</button>
  <button>{board[0][3]}</button>
  <button>{board[0][4]}</button>
</div>

<div class="wordRow">
  <button>{board[1][0]}</button>
  <button>{board[1][1]}</button>
  <button>{board[1][2]}</button>
  <button>{board[1][3]}</button>
  <button>{board[1][4]}</button>
</div>

<div class="wordRow">
  <button>{board[2][0]}</button>
  <button>{board[2][1]}</button>
  <button>{board[2][2]}</button>
  <button>{board[2][3]}</button>
  <button>{board[2][4]}</button>
</div>

<div class="wordRow">
  <button>{board[3][0]}</button>
  <button>{board[3][1]}</button>
  <button>{board[3][2]}</button>
  <button>{board[3][3]}</button>
  <button>{board[3][4]}</button>
</div>

<div class="wordRow">
  <button>{board[4][0]}</button>
  <button>{board[4][1]}</button>
  <button>{board[4][2]}</button>
  <button>{board[4][3]}</button>
  <button>{board[4][4]}</button>
</div>

<div class="wordRow">
  <button>{board[5][0]}</button>
  <button>{board[5][1]}</button>
  <button>{board[5][2]}</button>
  <button>{board[5][3]}</button>
  <button>{board[5][4]}</button>
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
  <button on:click={submit}>submit</button>
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
