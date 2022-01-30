<script>
  import Keyboard from './Keyboard.svelte';

  let pin;
  $: view = pin ? pin : 'word game';

  function handleSubmit() {
    alert(`submitted ${pin}`);
  }
</script>

<h1>{view}</h1>

<Keyboard bind:value={pin} on:submit={handleSubmit} />
