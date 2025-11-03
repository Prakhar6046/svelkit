<script lang="ts">
  import Icon from '@iconify/svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let open = false;

  function openChat() {
    dispatch('toggle');
  }
</script>

<div class="flex gap-6 fixed bottom-6 right-6 md:bottom-10 z-50 text-bland-950">
  <div
    class="h-full bg-white p-5 rounded-[24px] shadow-lg border border-bland-300/30 hidden sm:block"
  >
    <p>Need Help? We’re Here for You.</p>
  </div>

  <button
    on:click={openChat}
    aria-label={open ? 'Close chat' : 'Open chat'}
    class="bg-primary-400 text-white rounded-full p-5 shadow-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
  >
    <Icon icon="iconoir:message-solid" width="24" height="24" />
  </button>
</div>
