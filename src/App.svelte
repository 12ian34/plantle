<script>
  import Keyboard from './Keyboard.svelte';

  let pin;
  $: view = pin ? pin : 'plantle';

  function handleSubmit() {
    alert(`submitted ${pin}`);
  }
  function enter(letter) {
    console.log(letter);
    console.log(index_letter);
    console.log(index_word);
    console.log(current_letter);
    letter_1_1 = letter;
    if (index_letter == 5) {
      index_letter = 1;
      index_word += 1;
    }
    index_letter += 1;
    console.log(letter);
    console.log(index_letter);
    console.log(index_word);
    console.log(current_letter);
  }
</script>

<h1 style="color: {pin ? '#333' : '#ccc'}">{view}</h1>

<Keyboard bind:value={pin} on:submit={handleSubmit} />
