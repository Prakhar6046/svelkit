<script lang="ts">
  // import { authStore } from '$lib/stores/auth.js';
  import PublicNavbar from '$lib/components/PublicNavbar.svelte';
  import { Button } from '$lib/components/ui/button';
  import ThemeTest from '$lib/components/ThemeTest.svelte';
  import Icon from '@iconify/svelte';
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '$lib/components/ui/accordion';
  import easyShopping from '$lib/assets/images/start-shipping-today.svg';
  import * as Carousel from '$lib/components/ui/carousel/index.js';
  import canadaShipping from '$lib/assets/images/canada-shipping.svg';
  import usShipping from '$lib/assets/images/us-shipping.svg';
  import internatinalShipping from '$lib/assets/images/international-shipping.svg';
  import step1 from '$lib/assets/images/step-1.svg';
  import step2 from '$lib/assets/images/step-2.svg';
  import step3 from '$lib/assets/images/step-3.svg';
  import step4 from '$lib/assets/images/step-4.svg';
  import PublicFooter from '$lib/components/PublicFooter.svelte';
  import ShippingEstimator from '$lib/components/Shipping.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { writable } from 'svelte/store';
  import { cubicInOut } from 'svelte/easing';
  import image1 from '$lib/assets/images/Group71.svg';
  import image2 from '$lib/assets/images/Group72.svg';
  import image3 from '$lib/assets/images/Group81.svg';
  import image4 from '$lib/assets/images/Group86.svg';
  import { browser } from '$app/environment';


  import { _ } from 'svelte-i18n';
  const totalSlides = 4;
  const activeIndex = writable(0);
  let interval: NodeJS.Timeout;
  // per-slide active dot colors (hex). Index corresponds to slide index
  const dotColors = ['#7C7CFF', '#91B85C', '#82B6B8', '#C7A75F'];

  // per-slide accent colors for slide-specific UI
  const slideColors = ['#3B82F6', '#10B981', '#F59E0B', '#F97316'];

const BASE_URL = import.meta.env.VITE_SITE_URL || (browser ? window.location.origin : '');

  onMount(() => {
    interval = setInterval(() => {
      activeIndex.update(n => (n + 1) % totalSlides);
    }, 10000);

    return () => clearInterval(interval);
  });
 

  function goToSlide(i: number) {
    activeIndex.set(i);
  }

  let value = $state('');
  let desiredHeight = $state('');
  let estimatorEl: HTMLElement | null = null;

  function updateHeightByClass() {
    if (estimatorEl) {
      desiredHeight = `${estimatorEl.offsetHeight + 117}px`;
    }
  }
  const triggerContent = $derived('Select a from');
  onMount(() => {
    estimatorEl = document.querySelector('.estimator') as HTMLElement;
    updateHeightByClass();

    // Watch for resize of the estimator element
    const observer = new ResizeObserver(() => {
      updateHeightByClass();
    });
    if (estimatorEl) observer.observe(estimatorEl);

    return () => observer.disconnect();
  });

  $effect(() => {
    updateHeightByClass();
  });

  let activeImage = $state(easyShopping);
  let openAccordion = $state('item-1');

  $effect(() => {
    console.log('openAccordion changed to:', openAccordion);
    switch (openAccordion) {
      case 'item-1':
        activeImage = easyShopping;
        break;
      case 'item-2':
        activeImage = image1;
        break;
      case 'item-3':
        activeImage = image2;
        break;
      case 'item-4':
        activeImage = image3;
        break;
      case 'item-5':
        activeImage = image4;
        break;
      default:
        activeImage = easyShopping;
    }
    console.log('activeImage set to:', activeImage);
  });

  function handleAccordionChange(value: string) {
    console.log('handleAccordionChange called with:', value);
    openAccordion = value;
  }
  console.log('activeIndex:', $activeIndex);
</script>

<PublicNavbar />

<main>
  <!-- Hero Section Start -->
  <Carousel.Root>
    <Carousel.Content>
      <!-- Slide 1 -->

      {#if $activeIndex === 0}
        <Carousel.Item>
          <div
            style="--accent: {slideColors[0]}; padding-bottom: {desiredHeight}"
            class="herobg-slide1 px-4 h-full"
            transition:fade={{ duration: 400, easing: cubicInOut }}
          >
            <div
              class={`max-w-[1280px] mx-auto px-4 flex flex-col justify-between pb-[${desiredHeight}] pt-10 pb-4 md:pt-14 lg:pt-[85px] min-h[80vh] gap-5`}
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20">
                <div class="">
                  <h1
                    class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 lg:mb-8 leading-[1.2em]"
                  >
                    {$_('hero.slide1.title')}
                  </h1>
                  <p
                    class="text-sm sm:text-base md:text-lg lg:text-xl max-w-[500px]"
                  >
                    {$_('hero.slide1.description')}
                  </p>
                </div>
                <div
                  class="flex md:justify-end justify-center bg-img-slide1 rounded-2xl"
                >
                  <div
                    class="bg-[url(/assets/images/hero-img-1.svg)] bg-contain bg-bottom-right bg-no-repeat h-[360px] flex items-start md:items-center justify-start w-full rounded-2xl"
                  >
                    <div
                      class="bg-white border-4 w-fit rounded-4xl p-5 md:-m-16 mx-auto mt-10 shadow-2xl"
                      style="border-color: var(--accent);"
                    >
                      <p
                        class="text-sm sm:text-lg font-bold mb-2"
                        style="color: var(--accent)"
                      >
                        {$_('hero.slide1.saved')}
                      </p>
                      <div class="flex gap-5 items-center">
                        <p
                          class="text-lg sm:text-2xl font-semibold text-bland-950"
                        >
                          {$_('hero.slide1.currentPrice')}
                        </p>
                        <del
                          class="text-sm sm:text-lg font-normal text-bland-950"
                          >{$_('hero.slide1.originalPrice')}</del
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="-mt-14">
                <div class="flex gap-6 flex-col sm:flex-row">
                  <p class="font-semibold">
                    {$_('hero.slide1.partneredWith')}
                  </p>
                  <div class="flex gap-6">
                    <img src="$lib/assets/images/$lib" alt="postmark" />
                    <img src="/assets/images/fedex.png" alt="fedex" />
                    <img src="/assets/images/purolator.png" alt="purolator" />
                    <img src="/assets/images/ups.png" alt="ups" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      {/if}
      <!-- Slide 2 -->
      {#if $activeIndex === 1}
        <Carousel.Item>
          <div
            style="--accent: {slideColors[1]}; padding-bottom: {desiredHeight}"
            class="herobg-slide2 px-4 h-full"
            transition:fade={{ duration: 400, easing: cubicInOut }}
          >
            <div
              class="max-w-[1280px] mx-auto px-4 flex flex-col justify-between pb-[${desiredHeight}]pt-10 pb-4 md:pt-14 lg:pt-[85px] min-h[80vh] gap-5"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20">
                <div class="">
                  <h1
                    class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 lg:mb-8 leading-[1.2em]"
                  >
                    {$_('hero.slide2.title')}
                  </h1>
                  <p
                    class="text-sm sm:text-base md:text-lg lg:text-xl max-w-[500px]"
                  >
                    {$_('hero.slide2.description')}
                  </p>
                </div>
                <div
                  class="flex md:justify-end justify-center bg-img-slide2 rounded-2xl"
                >
                  <div
                    class="bg-[url(/assets/images/hero-img-2.svg)] bg-contain bg-bottom bg-no-repeat h-[360px] flex items-center justify-start w-full rounded-2xl"
                  ></div>
                </div>
              </div>
              <div class="-mt-14">
                <div class="flex gap-6 flex-col sm:flex-row">
                  <p class="font-semibold">
                    {$_('hero.slide1.partneredWith')}
                  </p>
                  <div class="flex gap-6">
                    <img src="/assets/images/postmark.png" alt="postmark" />
                    <img src="/assets/images/fedex.png" alt="fedex" />
                    <img src="/assets/images/purolator.png" alt="purolator" />
                    <img src="/assets/images/ups.png" alt="ups" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      {/if}
      <!-- Slide 3 -->
      {#if $activeIndex === 2}
        <Carousel.Item>
          <div
            style="--accent: {slideColors[2]}; padding-bottom: {desiredHeight}"
            class="herobg-slide3 px-4 h-full"
            transition:fade={{ duration: 400, easing: cubicInOut }}
          >
            <div
              class="max-w-[1280px] mx-auto px-4 flex flex-col justify-between pb-[${desiredHeight}]pt-10 pb-4 md:pt-14 lg:pt-[85px] min-h[80vh] gap-5"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20">
                <div class="">
                  <h1
                    class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 lg:mb-8 leading-[1.2em]"
                  >
                    {$_('hero.slide3.title')}
                  </h1>
                  <p
                    class="text-sm sm:text-base md:text-lg lg:text-xl max-w-[500px]"
                  >
                    {$_('hero.slide3.description')}
                  </p>
                </div>
                <div
                  class="flex md:justify-end justify-center bg-img-slide3 rounded-2xl"
                >
                  <div class=" h-[360px] w-full flex flex-col gap-4 p-6 pb-0">
                    <div
                      class="grid grid-cols-2 lg:grid-cols-4 gap-2 p-6 bg-white h-fit w-full rounded-xl"
                    >
                      <div>
                        <p class="text-xs">{$_('hero.slide3.spending')}</p>
                        <h2
                          class="text-xl md:text-2xl xl:text-3xl font-semibold"
                        >
                          $1000
                        </h2>
                      </div>
                      <div>
                        <p class="text-xs">{$_('hero.slide3.earning')}</p>
                        <h2
                          class="text-xl md:text-2xl xl:text-3xl font-semibold"
                        >
                          $8000
                        </h2>
                      </div>
                      <div>
                        <p class="text-xs">{$_('hero.slide3.delivered')}</p>
                        <h2
                          class="text-xl md:text-2xl xl:text-3xl font-semibold"
                        >
                          10K
                        </h2>
                      </div>
                      <div>
                        <p class="text-xs">{$_('hero.slide3.return')}</p>
                        <h2
                          class="text-xl md:text-2xl xl:text-3xl font-semibold"
                        >
                          200
                        </h2>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-white h-fit w-full rounded-xl">
                        <img src="/assets/images/hero-img-32.svg" alt="" />
                      </div>
                      <div
                        class="bg-white h-fit w-full rounded-xl flex justify-center"
                      >
                        <img
                          src="/assets/images/hero-img-33.svg"
                          alt=""
                          class="size-40"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="-mt-14">
                <div class="flex gap-6 flex-col sm:flex-row">
                  <p class="font-semibold">Partnered With</p>
                  <p class="font-semibold">
                    {$_('hero.slide1.partneredWith')}
                  </p>
                  <div class="flex gap-6">
                    <img src="/assets/images/postmark.png" alt="postmark" />
                    <img src="/assets/images/fedex.png" alt="fedex" />
                    <img src="/assets/images/purolator.png" alt="purolator" />
                    <img src="/assets/images/ups.png" alt="ups" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      {/if}
      <!-- Slide 4 -->
      {#if $activeIndex === 3}
        <Carousel.Item>
          <div
            style="--accent: {slideColors[3]}; padding-bottom: {desiredHeight}"
            class="herobg-slide4 px-4 h-full"
            transition:fade={{ duration: 400, easing: cubicInOut }}
          >
            <div
              class="max-w-[1280px] mx-auto px-4 flex flex-col justify-between pb-[${desiredHeight}]pt-10 pb-4 md:pt-14 lg:pt-[85px] min-h[80vh] gap-5"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20">
                <div class="">
                  <h1
                    class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 lg:mb-8 leading-[1.2em]"
                  >
                    {$_('hero.slide4.title')}
                  </h1>
                  <p
                    class="text-sm sm:text-base md:text-lg lg:text-xl max-w-[500px]"
                  >
                    {$_('hero.slide4.description')}
                  </p>
                </div>
                <div
                  class="flex md:justify-end justify-center bg-img-slide4 rounded-2xl"
                >
                  <div
                    class="bg-[url(/assets/images/hero-img-4.svg)] bg-contain bg-right-bottom bg-no-repeat h-[360px] flex items-center justify-start w-full rounded-2xl"
                  ></div>
                </div>
              </div>
              <div class="-mt-14">
                <div class="flex gap-6 flex-col sm:flex-row">
                  <p class="font-semibold">
                    {$_('hero.slide1.partneredWith')}
                  </p>
                  <div class="flex gap-6">
                    <img src="/assets/images/postmark.png" alt="postmark" />
                    <img src="/assets/images/fedex.png" alt="fedex" />
                    <img src="/assets/images/purolator.png" alt="purolator" />
                    <img src="/assets/images/ups.png" alt="ups" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      {/if}
    </Carousel.Content>

    <div
      class="max-w-[1280px] mx-auto -left-2 px-4 estimator z-10 relative"
      style="margin-top: -{desiredHeight}"
    >
      <div class="bg-white text-bland-950 rounded-4xl shadow-2xl">
        <ShippingEstimator />
      </div>
      <div class="flex justify-center mt-16 gap-2">
        {#each Array(totalSlides) as _, i}
          <button
            onclick={() => goToSlide(i)}
            class="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
            style="background-color: {$activeIndex === i
              ? dotColors[i]
              : '#E5E7EB'}"
            aria-label="Go to slide {i + 1}"
          ></button>
        {/each}
      </div>
    </div>
  </Carousel.Root>
  <!-- Hero Section End -->

  <!-- Shipping Made Easy Section Start -->
  <section class="pt-[198px] pb-12 lg:pb-[100px]">
    <div class="max-w-[1296px] px-4 mx-auto">
      <div class="flex flex-col md:grid grid-cols-12 gap-7 md:gap-14">
        <div
          class="col-span-6 lg:col-span-7 my-auto flex flex-col-reverse md:flex-col"
        >
          <div class="mt-4 md:mt-0">
            <h2 class="heading-h2">
              {$_('shippingMadeEasy.title')}<br
                class="hidden sm:inline-block"
              />
            </h2>

            <p class="sub-heading">
              {$_('shippingMadeEasy.description')}
            </p>

            <Button
              
              class="my-5 md:my-10 flex items-center font-semibold text-xs sm:text-sm md:text-base text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
            >
              {$_('shippingMadeEasy.startShippingToday')}
              <Icon
                icon="solar:arrow-right-linear"
                class="text-bland-25 size-3.5 sm:size-6"
              />
            </Button>
          </div>

          <img
            src={activeImage}
            alt="Shipping Type"
            class="transition-all duration-500 ease-in-out"
          />
        </div>

        <div class="col-span-6 lg:col-span-5 my-auto">
          <Accordion
            type="single"
            bind:value={openAccordion}
            class="flex flex-col gap-4"
          >
            <div
              onclick={() => handleAccordionChange('item-1')}
              role="button"
              tabindex="0"
              onkeydown={e =>
                e.key === 'Enter' && handleAccordionChange('item-1')}
            >
              <AccordionItem
                value="item-1"
                class="data-[state=open]:bg-secondary-700 data-[state=closed]:bg-secondary-300 !border border-[#8484FE]/10 p-4 sm:p-6 rounded-3xl"
              >
                <AccordionTrigger
                  class="data-[state=open]:[&>div>svg>path]:fill-secondary-700 data-[state=open]:[&>div]:bg-bland-25 data-[state=close]:[&>div]:bg-secondary-700 [&>div>svg>path]:fill-bland-25 text-base sm:text-lg flex justify-start items-center gap-4 [&>svg]:hidden p-0 data-[state=open]:text-white data-[state=closed]:text-secondary-700 hover:no-underline cursor-pointer"
                >
                  <div
                    class="bg-secondary-700 rounded-full size-8 sm:size-12 flex justify-center items-center"
                  >
                    <svg
                      width="24"
                      height="26"
                      viewBox="0 0 24 26"
                      xmlns="http://www.w3.org/2000/svg"
                      class="scale-75"
                    >
                      <path
                        d="M22 2H19V1C19 0.734784 18.8946 0.48043 18.7071 0.292893C18.5196 0.105357 18.2652 0 18 0C17.7348 0 17.4804 0.105357 17.2929 0.292893C17.1054 0.48043 17 0.734784 17 1V2H7V1C7 0.734784 6.89464 0.48043 6.70711 0.292893C6.51957 0.105357 6.26522 0 6 0C5.73478 0 5.48043 0.105357 5.29289 0.292893C5.10536 0.48043 5 0.734784 5 1V2H2C1.46957 2 0.960859 2.21071 0.585786 2.58579C0.210714 2.96086 0 3.46957 0 4V24C0 24.5304 0.210714 25.0391 0.585786 25.4142C0.960859 25.7893 1.46957 26 2 26H22C22.5304 26 23.0391 25.7893 23.4142 25.4142C23.7893 25.0391 24 24.5304 24 24V4C24 3.46957 23.7893 2.96086 23.4142 2.58579C23.0391 2.21071 22.5304 2 22 2ZM6.5 21C6.20333 21 5.91332 20.912 5.66665 20.7472C5.41997 20.5824 5.22771 20.3481 5.11418 20.074C5.00065 19.7999 4.97094 19.4983 5.02882 19.2074C5.0867 18.9164 5.22956 18.6491 5.43934 18.4393C5.64912 18.2296 5.91639 18.0867 6.20736 18.0288C6.49834 17.9709 6.79994 18.0007 7.07403 18.1142C7.34811 18.2277 7.58238 18.42 7.7472 18.6666C7.91203 18.9133 8 19.2033 8 19.5C8 19.8978 7.84196 20.2794 7.56066 20.5607C7.27936 20.842 6.89782 21 6.5 21ZM12 21C11.7033 21 11.4133 20.912 11.1666 20.7472C10.92 20.5824 10.7277 20.3481 10.6142 20.074C10.5006 19.7999 10.4709 19.4983 10.5288 19.2074C10.5867 18.9164 10.7296 18.6491 10.9393 18.4393C11.1491 18.2296 11.4164 18.0867 11.7074 18.0288C11.9983 17.9709 12.2999 18.0007 12.574 18.1142C12.8481 18.2277 13.0824 18.42 13.2472 18.6666C13.412 18.9133 13.5 19.2033 13.5 19.5C13.5 19.8978 13.342 20.2794 13.0607 20.5607C12.7794 20.842 12.3978 21 12 21ZM12 16C11.7033 16 11.4133 15.912 11.1666 15.7472C10.92 15.5824 10.7277 15.3481 10.6142 15.074C10.5006 14.7999 10.4709 14.4983 10.5288 14.2074C10.5867 13.9164 10.7296 13.6491 10.9393 13.4393C11.1491 13.2296 11.4164 13.0867 11.7074 13.0288C11.9983 12.9709 12.2999 13.0006 12.574 13.1142C12.8481 13.2277 13.0824 13.42 13.2472 13.6666C13.412 13.9133 13.5 14.2033 13.5 14.5C13.5 14.8978 13.342 15.2794 13.0607 15.5607C12.7794 15.842 12.3978 16 12 16ZM17.5 21C17.2033 21 16.9133 20.912 16.6666 20.7472C16.42 20.5824 16.2277 20.3481 16.1142 20.074C16.0007 19.7999 15.9709 19.4983 16.0288 19.2074C16.0867 18.9164 16.2296 18.6491 16.4393 18.4393C16.6491 18.2296 16.9164 18.0867 17.2074 18.0288C17.4983 17.9709 17.7999 18.0007 18.074 18.1142C18.3481 18.2277 18.5824 18.42 18.7472 18.6666C18.912 18.9133 19 19.2033 19 19.5C19 19.8978 18.842 20.2794 18.5607 20.5607C18.2794 20.842 17.8978 21 17.5 21ZM17.5 16C17.2033 16 16.9133 15.912 16.6666 15.7472C16.42 15.5824 16.2277 15.3481 16.1142 15.074C16.0007 14.7999 15.9709 14.4983 16.0288 14.2074C16.0867 13.9164 16.2296 13.6491 16.4393 13.4393C16.6491 13.2296 16.9164 13.0867 17.2074 13.0288C17.4983 12.9709 17.7999 13.0006 18.074 13.1142C18.3481 13.2277 18.5824 13.42 18.7472 13.6666C18.912 13.9133 19 14.2033 19 14.5C19 14.8978 18.842 15.2794 18.5607 15.5607C18.2794 15.842 17.8978 16 17.5 16ZM22 8H2V4H5V5C5 5.26522 5.10536 5.51957 5.29289 5.70711C5.48043 5.89464 5.73478 6 6 6C6.26522 6 6.51957 5.89464 6.70711 5.70711C6.89464 5.51957 7 5.26522 7 5V4H17V5C17 5.26522 17.1054 5.51957 17.2929 5.70711C17.4804 5.89464 17.7348 6 18 6C18.2652 6 18.5196 5.89464 18.7071 5.70711C18.8946 5.51957 19 5.26522 19 5V4H22V8Z"
                      />
                    </svg>
                  </div>
                  {$_('shippingMadeEasy.oneTimeShippers')}
                </AccordionTrigger>
                <AccordionContent
                  class="flex flex-col gap-4 text-secondary-300 mt-5"
                >
                  <p
                    class="font-medium text-sm sm:text-base leading-[1.8em] text-white"
                  >
                    {$_('shippingMadeEasy.oneTimeShippersDesc')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </div>

            <div
              onclick={() => handleAccordionChange('item-2')}
              role="button"
              tabindex="0"
              onkeydown={e =>
                e.key === 'Enter' && handleAccordionChange('item-2')}
            >
              <AccordionItem
                value="item-2"
                class="data-[state=open]:bg-secondary-700 data-[state=closed]:bg-[var(--color-secondary-300)] !border border-[#8484FE]/10 p-4 sm:p-6 rounded-3xl"
              >
                <AccordionTrigger
                  class="data-[state=open]:[&>div>svg>path]:fill-secondary-700 data-[state=open]:[&>div]:bg-bland-25 data-[state=close]:[&>div]:bg-secondary-700 [&>div>svg>path]:fill-bland-25 text-lg sm:text-xl flex justify-start items-center gap-4 [&>svg]:hidden p-0 data-[state=open]:text-white data-[state=closed]:text-secondary-700 hover:no-underline cursor-pointer"
                >
                  <div
                    class="bg-secondary-700 rounded-full size-8 sm:size-12 flex justify-center items-center"
                  >
                    <svg
                      width="30"
                      height="23"
                      viewBox="0 0 30 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="scale-75"
                    >
                      <path
                        d="M29 21H28V9.33375C28 9.00461 27.9188 8.68055 27.7635 8.39032C27.6083 8.1001 27.3838 7.85267 27.11 7.67L16.11 0.336249C15.7815 0.117236 15.3955 0.000366211 15.0006 0.000366211C14.6058 0.000366211 14.2198 0.117236 13.8912 0.336249L2.89125 7.67C2.61722 7.85253 2.3925 8.09989 2.23702 8.39013C2.08154 8.68036 2.00013 9.00449 2 9.33375V21H1C0.734784 21 0.48043 21.1054 0.292893 21.2929C0.105357 21.4804 0 21.7348 0 22C0 22.2652 0.105357 22.5196 0.292893 22.7071C0.48043 22.8946 0.734784 23 1 23H29C29.2652 23 29.5196 22.8946 29.7071 22.7071C29.8946 22.5196 30 22.2652 30 22C30 21.7348 29.8946 21.4804 29.7071 21.2929C29.5196 21.1054 29.2652 21 29 21ZM16 13H23V16H16V13ZM14 16H7V13H14V16ZM7 18H14V21H7V18ZM16 18H23V21H16V18Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  {$_('shippingMadeEasy.growingBusiness')}
                </AccordionTrigger>
                <AccordionContent
                  class="flex flex-col gap-4 text-secondary-700 mt-5"
                >
                  <p
                    class="font-medium text-xs sm:text-sm leading-[1.8em] text-white"
                  >
                    {$_('shippingMadeEasy.oneTimeShippersDesc')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </div>

            <div
              onclick={() => handleAccordionChange('item-3')}
              role="button"
              tabindex="0"
              onkeydown={e =>
                e.key === 'Enter' && handleAccordionChange('item-3')}
            >
              <AccordionItem
                value="item-3"
                class="data-[state=open]:bg-secondary-700 data-[state=closed]:bg-[var(--color-secondary-300)] !border border-[#8484FE]/10 p-4 sm:p-6 rounded-3xl"
              >
                <AccordionTrigger
                  class="data-[state=open]:[&>div>svg>path]:fill-secondary-700 data-[state=open]:[&>div]:bg-bland-25 data-[state=close]:[&>div]:bg-secondary-700 [&>div>svg>path]:fill-bland-25 text-lg sm:text-xl flex justify-start items-center gap-4 [&>svg]:hidden p-0 data-[state=open]:text-white data-[state=closed]:text-secondary-700 hover:no-underline cursor-pointer"
                >
                  <div
                    class="bg-secondary-700 rounded-full size-8 sm:size-12 flex justify-center items-center"
                  >
                    <svg
                      width="26"
                      height="22"
                      viewBox="0 0 26 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="scale-75"
                    >
                      <path
                        d="M24 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V20C0 20.5304 0.210714 21.0391 0.585786 21.4142C0.960859 21.7893 1.46957 22 2 22H24C24.5304 22 25.0391 21.7893 25.4142 21.4142C25.7893 21.0391 26 20.5304 26 20V2C26 1.46957 25.7893 0.960859 25.4142 0.585786C25.0391 0.210714 24.5304 0 24 0ZM13 15C11.4092 14.9983 9.88405 14.3657 8.75919 13.2408C7.63433 12.116 7.00165 10.5908 7 9C7 8.73478 7.10536 8.48043 7.29289 8.29289C7.48043 8.10536 7.73478 8 8 8C8.26522 8 8.51957 8.10536 8.70711 8.29289C8.89464 8.48043 9 8.73478 9 9C9 10.0609 9.42143 11.0783 10.1716 11.8284C10.9217 12.5786 11.9391 13 13 13C14.0609 13 15.0783 12.5786 15.8284 11.8284C16.5786 11.0783 17 10.0609 17 9C17 8.73478 17.1054 8.48043 17.2929 8.29289C17.4804 8.10536 17.7348 8 18 8C18.2652 8 18.5196 8.10536 18.7071 8.29289C18.8946 8.48043 19 8.73478 19 9C18.9983 10.5908 18.3657 12.116 17.2408 13.2408C16.116 14.3657 14.5908 14.9983 13 15ZM2 4V2H24V4H2Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  {$_('shippingMadeEasy.ecommerce')}
                </AccordionTrigger>
                <AccordionContent
                  class="flex flex-col gap-4 text-secondary-700 mt-5"
                >
                  <p
                    class="font-medium text-xs sm:text-sm leading-[1.8em] text-white"
                  >
                    {$_('shippingMadeEasy.oneTimeShippersDesc')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </div>

            <div
              onclick={() => handleAccordionChange('item-4')}
              role="button"
              tabindex="0"
              onkeydown={e =>
                e.key === 'Enter' && handleAccordionChange('item-4')}
            >
              <AccordionItem
                value="item-4"
                class="data-[state=open]:bg-secondary-700 data-[state=closed]:bg-[var(--color-secondary-300)] !border border-[#8484FE]/10 p-4 sm:p-6 rounded-3xl"
              >
                <AccordionTrigger
                  class="data-[state=open]:[&>div>svg>path]:fill-secondary-700 data-[state=open]:[&>div]:bg-bland-25 data-[state=close]:[&>div]:bg-secondary-700 [&>div>svg>path]:fill-bland-25 text-lg sm:text-xl flex justify-start items-center gap-4 [&>svg]:hidden p-0 data-[state=open]:text-white data-[state=closed]:text-secondary-700 hover:no-underline cursor-pointer"
                >
                  <div
                    class="bg-secondary-700 rounded-full size-8 sm:size-12 flex justify-center items-center"
                  >
                    <svg
                      width="22"
                      height="30"
                      viewBox="0 0 22 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="scale-75"
                    >
                      <path
                        d="M21.7312 14.6825L7.73117 29.6825C7.58281 29.8408 7.38698 29.9466 7.17323 29.9839C6.95947 30.0211 6.7394 29.9879 6.54621 29.8891C6.35302 29.7903 6.1972 29.6314 6.10226 29.4363C6.00733 29.2412 5.97843 29.0205 6.01992 28.8075L7.85242 19.6412L0.648674 16.9362C0.493963 16.8784 0.355998 16.7831 0.247102 16.6589C0.138207 16.5347 0.0617744 16.3854 0.0246322 16.2245C-0.01251 16.0635 -0.00920442 15.8959 0.0342533 15.7365C0.0777111 15.5772 0.159967 15.431 0.273674 15.3112L14.2737 0.311236C14.422 0.152905 14.6179 0.047125 14.8316 0.00985718C15.0454 -0.0274107 15.2655 0.00585619 15.4586 0.104638C15.6518 0.203419 15.8076 0.362356 15.9026 0.557463C15.9975 0.75257 16.0264 0.973262 15.9849 1.18624L14.1474 10.3625L21.3512 13.0637C21.5047 13.122 21.6416 13.2172 21.7496 13.3409C21.8577 13.4646 21.9336 13.613 21.9707 13.773C22.0077 13.933 22.0048 14.0997 21.9622 14.2583C21.9195 14.417 21.8385 14.5626 21.7262 14.6825H21.7312Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  {$_('shippingMadeEasy.proShippers')}
                </AccordionTrigger>
                <AccordionContent
                  class="flex flex-col gap-4 text-secondary-700 mt-5"
                >
                  <p
                    class="font-medium text-xs sm:text-sm leading-[1.8em] text-white"
                  >
                    {$_('shippingMadeEasy.oneTimeShippersDesc')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </div>
            <div
              onclick={() => handleAccordionChange('item-5')}
              role="button"
              tabindex="0"
              onkeydown={e =>
                e.key === 'Enter' && handleAccordionChange('item-5')}
            >
              <AccordionItem
                value="item-5"
                class="data-[state=open]:bg-secondary-700 data-[state=closed]:bg-[var(--color-secondary-300)] !border border-[#8484FE]/10 p-4 sm:p-6 rounded-3xl"
              >
                <AccordionTrigger
                  class="data-[state=open]:[&>div>svg>path]:fill-secondary-700 data-[state=open]:[&>div]:bg-bland-25 data-[state=close]:[&>div]:bg-secondary-700 [&>div>svg>path]:fill-bland-25 text-base sm:text-lg flex justify-start items-center gap-4 [&>svg]:hidden p-0 data-[state=open]:text-white data-[state=closed]:text-secondary-700 hover:no-underline cursor-pointer"
                >
                  <div
                    class="bg-secondary-700 data-[state=open]:bg-white rounded-full size-8 sm:size-12 flex justify-center items-center"
                  >
                    <svg
                      width="30"
                      height="24"
                      viewBox="0 0 30 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="scale-75"
                    >
                      <path
                        d="M29 22H27V8C27.2652 8 27.5196 7.89464 27.7071 7.70711C27.8946 7.51957 28 7.26522 28 7C28 6.73478 27.8946 6.48043 27.7071 6.29289C27.5196 6.10536 27.2652 6 27 6H21V2C21.2652 2 21.5196 1.89464 21.7071 1.70711C21.8946 1.51957 22 1.26522 22 1C22 0.734784 21.8946 0.48043 21.7071 0.292893C21.5196 0.105357 21.2652 0 21 0H3C2.73478 0 2.48043 0.105357 2.29289 0.292893C2.10536 0.48043 2 0.734784 2 1C2 1.26522 2.10536 1.51957 2.29289 1.70711C2.48043 1.89464 2.73478 2 3 2V22H1C0.734784 22 0.48043 22.1054 0.292893 22.2929C0.105357 22.4804 0 22.7348 0 23C0 23.2652 0.105357 23.5196 0.292893 23.7071C0.48043 23.8946 0.734784 24 1 24H29C29.2652 24 29.5196 23.8946 29.7071 23.7071C29.8946 23.5196 30 23.2652 30 23C30 22.7348 29.8946 22.4804 29.7071 22.2929C29.5196 22.1054 29.2652 22 29 22ZM8 5H10C10.2652 5 10.5196 5.10536 10.7071 5.29289C10.8946 5.48043 11 5.73478 11 6C11 6.26522 10.8946 6.51957 10.7071 6.70711C10.5196 6.89464 10.2652 7 10 7H8C7.73478 7 7.48043 6.89464 7.29289 6.70711C7.10536 6.51957 7 6.26522 7 6C7 5.73478 7.10536 5.48043 7.29289 5.29289C7.48043 5.10536 7.73478 5 8 5ZM7 11C7 10.7348 7.10536 10.4804 7.29289 10.2929C7.48043 10.1054 7.73478 10 8 10H10C10.2652 10 10.5196 10.1054 10.7071 10.2929C10.8946 10.4804 11 10.7348 11 11C11 11.2652 10.8946 11.5196 10.7071 11.7071C10.5196 11.8946 10.2652 12 10 12H8C7.73478 12 7.48043 11.8946 7.29289 11.7071C7.10536 11.5196 7 11.2652 7 11ZM15 22H9V16H15V22ZM16 12H14C13.7348 12 13.4804 11.8946 13.2929 11.7071C13.1054 11.5196 13 11.2652 13 11C13 10.7348 13.1054 10.4804 13.2929 10.2929C13.4804 10.1054 13.7348 10 14 10H16C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11C17 11.2652 16.8946 11.5196 16.7071 11.7071C16.5196 11.8946 16.2652 12 16 12ZM16 7H14C13.7348 7 13.4804 6.89464 13.2929 6.70711C13.1054 6.51957 13 6.26522 13 6C13 5.73478 13.1054 5.48043 13.2929 5.29289C13.4804 5.10536 13.7348 5 14 5H16C16.2652 5 16.5196 5.10536 16.7071 5.29289C16.8946 5.48043 17 5.73478 17 6C17 6.26522 16.8946 6.51957 16.7071 6.70711C16.5196 6.89464 16.2652 7 16 7ZM25 22H21V8H25V22Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  {$_('shippingMadeEasy.enterprises')}
                </AccordionTrigger>
                <AccordionContent
                  class="flex flex-col gap-4 text-secondary-700 mt-5"
                >
                  <p
                    class="font-medium text-xs sm:text-sm leading-[1.8em] text-white"
                  >
                    {$_('shippingMadeEasy.oneTimeShippersDesc')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  </section>
  <!-- Shipping Made Easy Section End -->

  <!-- Shipping Places Section Start -->
  <section class="md:py-12 lg:pb-[100px]">
    <div class="max-w-[1296px] px-4 mx-auto">
      <div class="mt-4 md:mt-0 text-center">
        <h2 class="heading-h2">{$_('shippingPlaces.title')}</h2>

        <p class="sub-heading">
          {$_('shippingPlaces.description')}
        </p>
      </div>

      <div
        class="flex flex-col md:grid grid-cols-12 gap-4 sm:gap-8 lg:gap-20 mt-[60px] mb-16 lg:mb-[120px]"
      >
        <div class="col-span-6 lg:col-span-5 my-auto">
          <img src={canadaShipping} alt="Canada Shipping" />
        </div>

        <div class="col-span-6 lg:col-span-7 my-auto">
          <h3 class="font-bold text-lg sm:text-xl mb-2">
            {$_('shippingPlaces.canadaShipping.title')}
          </h3>

          <p class="text-sm sm:text-base">
            {$_('shippingPlaces.canadaShipping.description')}
          </p>
        </div>
      </div>

      <div
        class="flex flex-col-reverse md:grid grid-cols-12 gap-4 sm:gap-8 lg:gap-20 mt-[60px] mb-16 lg:mb-[120px]"
      >
        <div class="col-span-6 lg:col-span-7 my-auto">
          <h3 class="font-bold text-lg sm:text-xl mb-2">
            {$_('shippingPlaces.usShipping.title')}
          </h3>

          <p class="text-sm sm:text-base">
            {$_('shippingPlaces.usShipping.description')}
          </p>
        </div>

        <div class="col-span-6 lg:col-span-5 my-auto">
          <img src={usShipping} alt="US Shipping" />
        </div>
      </div>

      <div
        class="flex flex-col md:grid grid-cols-12 gap-4 sm:gap-8 lg:gap-20 lg:mt-[60px]"
      >
        <div class="col-span-6 lg:col-span-5 my-auto">
          <img src={internatinalShipping} alt="Canada Shipping" />
        </div>

        <div class="col-span-6 lg:col-span-7 my-auto">
          <h3 class="font-bold text-lg sm:text-xl mb-2">
            {$_('shippingPlaces.internationalShipping.title')}
          </h3>

          <p class="text-sm sm:text-base">
            {$_('shippingPlaces.internationalShipping.description')}
          </p>
        </div>
      </div>
    </div>
  </section>
  <!-- Shipping Places Section End -->

  <!-- Smater 4 Steps Section Start -->
  <section class="py-12 lg:py-[100px]">
    <div class="max-w-[1296px] px-4 mx-auto">
      <div class="mt-4 md:mt-0 text-center">
        <h2 class="heading-h2">{$_('fourSteps.title')}</h2>

        <p class="sub-heading">
          {$_('fourSteps.description')}
        </p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-[60px]"
      >
        <div class="rounded-[24px] border border-bland-300/30 p-5">
          <img src={step1} alt="Pack Your Shipment" class="w-full" />

          <h4 class="uppercase text-xs mt-4 font-semibold">
            {$_('common.step')} 1
          </h4>

          <h3 class="text-lg sm:text-xl font-semibold my-3">
            {$_('fourSteps.step1.title')}
          </h3>

          <p class="">
            {$_('fourSteps.step1.description')}
          </p>
        </div>

        <div class="rounded-[24px] border border-bland-300/30 p-5">
          <img src={step2} alt="Compare & Choose" class="w-full" />

          <h4 class="uppercase text-xs mt-4 font-semibold">
            {$_('common.step')} 2
          </h4>

          <h3 class="text-lg sm:text-xl font-semibold my-3">
            {$_('fourSteps.step2.title')}
          </h3>

          <p class="text-bland-950">
            {$_('fourSteps.step2.description')}
          </p>
        </div>

        <div class="rounded-[24px] border border-bland-300/30 p-5">
          <img src={step3} alt="Print & Get Ready" class="w-full" />

          <h4 class="uppercase text-xs mt-4 font-semibold">
            {$_('common.step')} 3
          </h4>

          <h3 class="text-lg sm:text-xl font-semibold my-3">
            {$_('fourSteps.step3.title')}
          </h3>

          <p class="text-bland-950">
            {$_('fourSteps.step3.description')}
          </p>
        </div>

        <div class="rounded-[24px] border border-bland-300/30 p-5">
          <img src={step4} alt="Ship & Track" class="w-full" />

          <h4 class="uppercase text-sm mt-4 font-semibold">
            {$_('common.step')} 4
          </h4>

          <h3 class="text-lg sm:text-xl font-semibold my-3">
            {$_('fourSteps.step4.title')}
          </h3>

          <p class="text-bland-950">
            {$_('fourSteps.step4.description')}
          </p>
        </div>
      </div>

      <div>
        <Button
          
          class="mt-8 md:mt-[60px] mx-auto flex items-center font-semibold text-xs sm:text-sm md:text-base text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
        >
          {$_('fourSteps.getStarted')}
          <Icon
            icon="solar:arrow-right-linear"
            class="text-bland-25 size-3.5 sm:size-6"
          />
        </Button>
      </div>
    </div>
  </section>
  <!-- Smater 4 Steps Section Start -->

  <!-- FAQ Section Start -->
  <section class="py-12 lg:py-[100px] header-bg-300">
    <div class="max-w-[1296px] px-4 mx-auto">
      <div class="mt-4 md:mt-0 text-center">
        <h2 class="heading-h2">{$_('faq.title')}</h2>

        <p class="sub-heading">
          {$_('faq.description')}
        </p>
      </div>

      <div class="mt-[60px]">
        <Accordion type="single" value="item-1" class="flex flex-col gap-4">
          <AccordionItem
            value="item-1"
            class="data-[state=open]:bg-bland-25 data-[state=close]:bg-secondary-300 !border data-[state=open]:border-secondary-700/60 accordeion-border p-4 sm:p-6 rounded-[24px]"
          >
            <AccordionTrigger
              class="text-base sm:text-lg flex justify-between items-center gap-4 [&>svg]:size-6 p-0 data-[state=open]:text-secondary-700 data-[state=close]: hover:no-underline cursor-pointer"
            >
              {$_('faq.question1')}
            </AccordionTrigger>
            <AccordionContent class="flex flex-col gap-4  mt-5 pb-0">
              <p class="text-xs sm:text-sm leading-[1.8em] text-bland-950">
                {$_('faq.answer1')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            class="data-[state=open]:bg-bland-25 data-[state=close]:bg-secondary-300 !border data-[state=open]:border-secondary-700/60 accordeion-border p-4 sm:p-6 rounded-[24px]"
          >
            <AccordionTrigger
              class="text-base sm:text-lg flex justify-between items-center gap-4 [&>svg]:size-6 p-0 data-[state=open]:text-secondary-700 data-[state=close]: hover:no-underline cursor-pointer"
            >
              {$_('faq.question2')}
            </AccordionTrigger>
            <AccordionContent class="flex flex-col gap-4  mt-5 pb-0">
              <p
                class="font-medium text-xs sm:text-sm leading-[1.8em] text-bland-950"
              >
                {$_('faq.answer2')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            class="data-[state=open]:bg-bland-25 data-[state=close]:bg-secondary-300 !border data-[state=open]:border-secondary-700/60 accordeion-border p-4 sm:p-6 rounded-[24px]"
          >
            <AccordionTrigger
              class="text-base sm:text-lg flex justify-between items-center gap-4 [&>svg]:size-6 p-0 data-[state=open]:text-secondary-700 data-[state=close]: hover:no-underline cursor-pointer"
            >
              {$_('faq.question3')}
            </AccordionTrigger>
            <AccordionContent class="flex flex-col gap-4  mt-5 pb-0">
              <p
                class="font-medium text-xs sm:text-sm leading-[1.8em] text-bland-950"
              >
                {$_('faq.answer2')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            class="data-[state=open]:bg-bland-25 data-[state=close]:bg-secondary-300 !border data-[state=open]:border-secondary-700/60 accordeion-border p-4 sm:p-6 rounded-[24px]"
          >
            <AccordionTrigger
              class="text-base sm:text-lg flex justify-between items-center gap-4 [&>svg]:size-6 p-0 data-[state=open]:text-secondary-700 data-[state=close]: hover:no-underline cursor-pointer"
            >
              {$_('faq.question4')}
            </AccordionTrigger>
            <AccordionContent class="flex flex-col gap-4  mt-5 pb-0">
              <p
                class="font-medium text-xs sm:text-sm leading-[1.8em] text-bland-950"
              >
                {$_('faq.answer2')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            class="data-[state=open]:bg-bland-25 data-[state=close]:bg-secondary-300 !border data-[state=open]:border-secondary-700/60 accordeion-border p-4 sm:p-6 rounded-[24px]"
          >
            <AccordionTrigger
              class="text-base sm:text-lg flex justify-between items-center gap-4 [&>svg]:size-6 p-0 data-[state=open]:text-secondary-700 data-[state=close]: hover:no-underline cursor-pointer"
            >
              {$_('faq.question5')}
            </AccordionTrigger>
            <AccordionContent class="flex flex-col gap-4  mt-5 pb-0">
              <p
                class="font-medium text-xs sm:text-sm leading-[1.8em] text-bland-950"
              >
                {$_('faq.answer2')}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </section>
  <!-- FAQ Section End -->

  <!-- CTA Section Start -->
  <section class="py-12 lg:py-[100px]">
    <div class="max-w-[1296px] px-4 mx-auto">
      <div class="flex flex-col md:grid grid-cols-12 gap-6 sm:gap-10 lg:gap-20">
        <div class="col-span-8 my-auto text-center md:text-start">
          <h2 class="heading-h2">{$_('cta.title')}</h2>

          <p class="sub-heading">
            {$_('cta.description')}
          </p>
        </div>

        <div class="col-span-4 my-auto">
          <Button
            
            class="ms-auto me-auto md:me-0 flex items-center font-semibold text-xs sm:text-sm md:text-base text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
          >
            {$_('cta.getStarted')}
            <Icon
              icon="solar:arrow-right-linear"
              class="text-bland-25 size-3.5 sm:size-6"
            />
          </Button>
        </div>
      </div>
    </div>
  </section>
  <!-- CTA Section End -->
</main>

<PublicFooter />

<!-- Theme Test Section
<section class="py-16 bg-neutral-50 dark:bg-neutral-100">
  <div class=" px-6">
    <ThemeTest />
  </div>
</section> -->
