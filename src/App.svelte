<script>
	import { loaded } from './app/store';

	import Home from './views/Home.svelte';
	import Loader from './views/Loader.svelte';
</script>

<main class="app">
	{#if $loaded}
		<Home />
	{:else}
		<Loader />
	{/if}
</main>

<style>
	.app {
		width: 100vw;
		height: 100vh;
	}
</style>
