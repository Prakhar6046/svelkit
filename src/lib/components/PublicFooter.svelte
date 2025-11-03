<script lang="ts">
  import Icon from '@iconify/svelte';
  import whiteLogo from '$lib/assets/static/img/app-logo-white.svg';
  import { Input } from './ui/input';
  import { Button } from './ui/button';
  import { cubicOut } from 'svelte/easing';

  let email = '';
  let submitting = false;
  let submitted = false;

  function handleSubmit() {
    if (!email) return;

    submitting = true;

    // simulate submission locally
    setTimeout(() => {
      submitting = false;
      submitted = true;
    }, 1000);
  }
</script>

<footer class="pt-12 lg:pt-[100px] bg-bland-950">
  <div class="max-w-[1296px] px-4 mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0">
      <div>
        <img src={whiteLogo} alt="Logo" />

        <p class="text-sm sm:text-base text-bland-150 mt-4 mb-10">
          Your partner in smarter shipping.
        </p>

        <div class="flex items-center gap-2 sm:gap-4">
          {#if !submitted}
            <Input
              bind:value={email}
              type="email"
              placeholder="Your Email"
              class="max-w-3xs py-2 sm:py-2.5 md:py-3 xl:py-3.5 text-bland-25 !text-sm border border-bland-200 rounded-xl !h-full placeholder:text-bland-300"
            />

            <button
              class="flex items-center font-semibold text-xs sm:text-sm md:text-base text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-4 sm:!px-6 h-auto cursor-pointer hover:shadow-md"
              on:click={handleSubmit}
              disabled={submitting}
            >
              {#if submitting}
                <svg
                  class="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Submitting...
              {:else}
                Subscribe
              {/if}
            </button>
          {:else}
            <div
              class="flex items-center gap-2 bg-green-100 border border-green-300 rounded-xl py-2 px-4"
            >
              <!-- White tick icon only -->
              <svg
                class="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="text-green-700 font-medium"
                >Subscribed successfully!</span
              >
            </div>
          {/if}
        </div>
      </div>

      <div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 class="font-semibold text-sm sm:text-base text-primary-400">
              Explore
            </h4>

            <ul class="flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-7">
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base">Home</a
                >
              </li>
              <li>
                <a
                  href="/pricing"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Pricing</a
                >
              </li>
              <li>
                <a
                  href="/about"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >About Us</a
                >
              </li>
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base">Blog</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-sm sm:text-base text-primary-400">
              Shipping
            </h4>

            <ul class="flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-7">
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Canada</a
                >
              </li>
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base">USA</a
                >
              </li>
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >International</a
                >
              </li>
              <li>
                <a
                  href="/ship-return"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Returns</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-sm sm:text-base text-primary-400">
              Resources
            </h4>

            <ul class="flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-7">
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Get Estimate</a
                >
              </li>
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >How to Ship</a
                >
              </li>
              <li>
                <a
                  href="/ship-return"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Shipping Guide</a
                >
              </li>
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Integrations</a
                >
              </li>
              <li>
                <a
                  href="/get-estimate-tracking"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Tracking</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-sm sm:text-base text-primary-400">
              Support
            </h4>

            <ul class="flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-7">
              <li>
                <a
                  href="/support"
                  class="text-bland-150 text-xs sm:text-sm md:text-base">FAQ</a
                >
              </li>
              <li>
                <a
                  href="/help-center"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Help Center</a
                >
              </li>
              <li>
                <a
                  href="/"
                  class="text-bland-150 text-xs sm:text-sm md:text-base"
                  >Contact Us</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col md:flex-row justify-between items-center gap-4 mt-10 py-8 border-t border-bland-150/10"
    >
      <p class="text-sm sm:text-base text-bland-150 text-center md:text-start">
        Copyright © 2025 Shipping.CA. All Rights Reserved.
      </p>

      <div class="flex items-center gap-4">
        <Icon icon="ri:twitter-x-line" class="size-5 text-bland-150" />

        <Icon icon="akar-icons:facebook-fill" class="size-5 text-bland-150" />

        <Icon icon="uil:linkedin" class="size-5 text-bland-150" />
      </div>
    </div>
  </div>
</footer>
