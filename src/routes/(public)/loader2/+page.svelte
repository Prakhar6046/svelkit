<script lang="ts">
    import { onMount } from 'svelte';
  
    let progress = 0;
    let dotCount = 0;
  
    onMount(() => {
      const progressInterval = setInterval(() => {
        if (progress < 100) {
          progress += 1;
        } else {
          clearInterval(progressInterval);
        }
      }, 50);
  
      const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
      }, 500);
  
      return () => {
        clearInterval(progressInterval);
        clearInterval(dotInterval);
      };
    });
  
    $: dots = '.'.repeat(dotCount);
  </script>
  
  <main
    class="bg-white min-h-screen flex flex-col items-center justify-between py-10"
  >
    <img src="/img/app-logo.svg" alt="logo" />
    <!-- Loading Text -->
    <div class="flex flex-col items-center justify-center">
      <img src="/assets/images/loader2.svg" alt="loader" />
      <!-- Loading title -->
      <h2 class="text-4xl font-bold mb-12 min-w-[170px]" style="color: #583D72;">
        Loading{dots}
      </h2>
  
      <p class="text-base" style="color: #888888;">
        Great Things Take Time to Load...
      </p>
    </div>
  
    <div class="flex gap-2 mt-16">
      <div class="w-3 h-3 bg-primary-400 rounded-full"></div>
      <div class="w-3 h-3 bg-bland-200 rounded-full"></div>
      <div class="w-3 h-3 bg-bland-200 rounded-full"></div>
    </div>
  </main>
  