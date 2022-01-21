<script>
	import { createEventDispatcher } from 'svelte';

	export let value = '';

	const dispatch = createEventDispatcher();

	const select = num => () => value += num;
	const clear  = () => value = '';
	const submit = () => dispatch('submit');
</script>


<div class="wordRow">
<button id="1.1"> </button>
<button> </button>
<button> </button>
<button> </button>
<button> </button>
</div>

<div class="wordRow">
<button> </button>
<button> </button>
<button> </button>
<button> </button>
<button> </button>
</div>

<div class="wordRow">
<button> </button>
<button> </button>
<button> </button>
<button> </button>
<button> </button>
</div>

<div class="wordRow">
<button> </button>
<button> </button>
<button> </button>
<button> </button>
<button> </button>
</div>

<div class="wordRow">
<button> </button>
<button> </button>
<button> </button>
<button> </button>
<button> </button>
</div>

<div class="wordRow">
<button> </button>
<button> </button>
<button> </button>
<button> </button>
<button> </button>
</div>

<div class="keyboardRow1">
	<button on:click={select(1)}>q</button>
	<button on:click={select(2)}>w</button>
	<button on:click={select(3)}>e</button>
	<button on:click={select(4)}>r</button>
	<button on:click={select(5)}>t</button>
	<button on:click={select(6)}>y</button>
	<button on:click={select(7)}>u</button>
	<button on:click={select(8)}>i</button>
	<button on:click={select(9)}>o</button>
	<button on:click={select(9)}>p</button>
</div>

<div class="keyboardRow2">
	<button on:click={select(1)}>a</button>
	<button on:click={select(2)}>s</button>
	<button on:click={select(3)}>d</button>
	<button on:click={select(4)}>f</button>
	<button on:click={select(5)}>g</button>
	<button on:click={select(6)}>h</button>
	<button on:click={select(7)}>j</button>
	<button on:click={select(8)}>k</button>
	<button on:click={select(9)}>l</button>
</div>

<div class="keyboardRow3">
	<button on:click={select(1)}>z</button>
	<button on:click={select(2)}>x</button>
	<button on:click={select(3)}>c</button>
	<button on:click={select(4)}>v</button>
	<button on:click={select(5)}>b</button>
	<button on:click={select(6)}>n</button>
	<button on:click={select(7)}>m</button>
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
		grid-template-rows: repeat(1, 2em);
		grid-gap: 0.1em
	}
	
	.keyboardRow1, .keyboardRow2, .keyboardRow3 {
		display: grid;
		grid-template-columns: repeat(10, 3em);
		grid-template-rows: repeat(1, 3em);
		grid-gap: 0.2em
	}
	
	.keyboardRow2 {
		margin-left: 1.6em;
	}

	.keyboardRow3 {
		margin-left: 4.8em;
	}

</style>