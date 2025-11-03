<!-- src/routes/(protected)/+layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authToken } from '$lib/stores/auth';
  import { browser } from '$app/environment';

  let token: string | null = null;
  const unsubscribe = authToken.subscribe((value) => (token = value));

  onMount(() => {
    if (!browser) return;

    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      goto('/login', { replaceState: true });
    }

    return () => unsubscribe();
  });
</script>

{#if token}
  <slot />
{:else}
  <div class="flex justify-center items-center h-screen">
    <p>Checking authentication...</p>
  </div>
{/if}
