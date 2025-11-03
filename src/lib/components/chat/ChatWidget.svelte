<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  export let open = false;
  // optional prop callback for backwards compatibility
  export let onClose: () => void = () => {};

  let message = '';

  function sendMessage() {
    // For now just clear the input - integration with backend is future work
    message = '';
  }

  function close() {
    // call prop if provided
    try {
      onClose && onClose();
    } catch (e) {
      // ignore
    }
    // dispatch event so parent can listen with on:close
    dispatch('close');
  }
</script>

{#if open}
  <div
    class="fixed right-6 bottom-24 md:bottom-32 z-50 w-[320px] md:w-[380px]"
    in:fly={{ y: 16, duration: 400 }}
    out:fly={{ y: 12, duration: 400 }}
  >
    <div
      class="bg-white rounded-[24px] shadow-xl overflow-hidden text-bland-950"
      in:fade={{ duration: 160 }}
      out:fade={{ duration: 120 }}
    >
      <div class="flex items-center gap-3 p-5 bg-primary-50 text-white">
        <div class="flex-1">
          <div class="font-semibold text-lg">Help Desk</div>
        </div>
        <button on:click={close} aria-label="Close chat">
          <Icon icon="mdi:close" class="size-5" />
        </button>
      </div>

      <div
        class="p-5 min-h-[420px] overflow-auto flex flex-col justify-between"
      >
        <div>
          <div class="flex gap-2 mb-14">
            <div
              class="bg-primary-50 p-3 px-4 text-white rounded-full inline-block text-2xl mb-3 h-fit"
            >
              ss
            </div>
            <div class="bg-primary-200 px-4 py-2.5 rounded-xl text-sm">
              <p>
                👋 Hi there! Thanks for reaching out to Shipping.CA Support. How
                can we help today?
              </p>
            </div>
          </div>
          <div class="text-center text-xs text-bland-300 mb-3">
            QUICK SUGGESTION
          </div>
        </div>
        <div class="h-[200px] overflow-auto">
          <div class="flex-1 flex flex-col gap-3">
            <div class="flex justify-end">
              <p
                class="py-2 px-3 rounded-xl text-sm border border-bland-200 w-fit"
              >
                Hello
              </p>
            </div>
            <div class="flex justify-start">
              <p class="py-2 px-3 rounded-xl text-sm bg-primary-200 w-fit">
                Hey! How can I assist you today?
              </p>
            </div>
            <div class="flex justify-end">
              <p
                class="py-2 px-3 rounded-xl text-sm border border-bland-200 w-fit"
              >
                Hello
              </p>
            </div>
            <div class="flex justify-start">
              <p class="py-2 px-3 rounded-xl text-sm bg-primary-200 w-fit">
                Hey! How can I assist you today?
              </p>
            </div>
            <div class="flex justify-end">
              <p
                class="py-2 px-3 rounded-xl text-sm border border-bland-200 w-fit"
              >
                Hello
              </p>
            </div>
            <div class="flex justify-start">
              <p class="py-2 px-3 rounded-xl text-sm bg-primary-200 w-fit">
                Hey! How can I assist you today?
              </p>
            </div>
            <div class="flex justify-end">
              <p
                class="py-2 px-3 rounded-xl text-sm border border-bland-200 w-fit"
              >
                Hello
              </p>
            </div>
            <div class="flex justify-start">
              <p class="py-2 px-3 rounded-xl text-sm bg-primary-200 w-fit">
                Hey! How can I assist you today?
              </p>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <div class="relative">
            <input
              bind:value={message}
              placeholder="Your Message Here . . ."
              class="w-full rounded-xl border border-bland-200 px-3 pr-12 py-2 text-sm"
            />

            <button
              on:click={sendMessage}
              class="absolute right-1 top-1/2 -translate-y-1/2 px-1.5 cursor-pointer"
              aria-label="Send message"
            >
              <Icon
                class="text-bland-300"
                icon="mynaui:send"
                width="20"
                height="20"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* component uses Tailwind classes; keep minor fallbacks here */
</style>
