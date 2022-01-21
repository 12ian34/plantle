<script>
	import Keyboard from './Keyboard.svelte';

	let pin;
	$: view = pin ? pin: 'enter your pin';

	function handleSubmit() {
		alert(`submitted ${pin}`);
	}
</script>

<h1 style="color: {pin ? '#333' : '#ccc'}">{view}</h1>

<Keyboard bind:value={pin} on:submit={handleSubmit}/>