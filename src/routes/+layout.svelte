<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	let { children } = $props();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>
</div>
