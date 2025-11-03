<script lang="ts">
    import { onMount } from 'svelte';
  
    let progress = 0;
  
    onMount(() => {
      // Animate progress from 0 to 100%
      const interval = setInterval(() => {
        if (progress < 100) {
          progress += 1;
        } else {
          clearInterval(interval);
        }
      }, 50); // Adjust speed as needed
  
      return () => clearInterval(interval);
    });
  </script>
  
  <main
    class="bg-white min-h-screen flex flex-col items-center justify-between py-10"
  >
    <img src="/static/img/app-logo.svg" alt="logo" />
  
    <!-- Loading Text -->
    <div class="flex flex-col items-center justify-center">
      <!-- Loading title -->
      <h2 class="text-4xl font-bold mb-12 min-w-[170px]" style="color: #583D72;">
        Loading...
      </h2>
  
      <!-- Circular Progress -->
      <div
        class="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center"
      >
        <div
          class="w-full h-full bg-auto bg-center p-2 bg-no-repeat {progress ===
          100
            ? ''
            : 'animate-spin'}"
          style="background-image: url({progress === 100
            ? '/static/img/loader-complete.svg'
            : '/static/img/loader.svg'})"
        ></div>
        <span class="absolute text-2xl font-bold" style="color: #583D72;">
          {progress}%
        </span>
      </div>
  
      <!-- Subtitle -->
      <p class="text-base" style="color: #888888;">
        Great Things Take Time to Load...
      </p>
    </div>
  
    <!-- Three dots indicator -->
    <div class="flex gap-2 mt-16">
      <div class="w-3 h-3 rounded-full" style="background-color: #FF9416;"></div>
      <div class="w-3 h-3 rounded-full" style="background-color: #E0E0E0;"></div>
      <div class="w-3 h-3 rounded-full" style="background-color: #E0E0E0;"></div>
    </div>
  </main>
  