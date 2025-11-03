<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { isAuthenticated } from '../stores/auth';
  import Home from '../../routes/(public)/Home.svelte';
  export let component;
</script>

{#if isAuthenticated()}
  <svelte:component this={component} />
{:else}
  <Home />
  {navigate('/')}
{/if}
