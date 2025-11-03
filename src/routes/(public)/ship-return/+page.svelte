<script lang="ts">
    import PublicNavbar from '$lib/components/PublicNavbar.svelte';
    import createAccount from '$lib/assets/images/create-account.svg';
    import print from '$lib/assets/images/print.svg';
    import dropOff from '$lib/assets/images/Dropoff.svg';
    import trackShipment from '$lib/assets/images/track-shipment.svg';
    import prepareRetun from '$lib/assets/images/prepare-retun.svg';
    import submitReturnRequest from '$lib/assets/images/submitReturnRequest.svg';
    import pickUpOrDropOff from '$lib/assets/images/pickUpOrDropOff.svg';
  
    import Icon from '@iconify/svelte';
    import { Button } from '$lib/components/ui/button';
  
    import PublicFooter from '$lib/components/PublicFooter.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { setMeta } from '$lib/meta/meta';
    onMount(() => {
      setMeta({
        title: 'Return Ship | About Page',
        description: 'Learn more about us and our mission.',
        image:
          'https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXJsfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
        url: import.meta.env.VITE_SITE_URL,
      });
    });
  </script>
  
  <PublicNavbar />
  
  <main>
    <!-- hero section -->
    <section>
      <div class="header-bg-600">
        <div class="max-w-[1296px] px-4 mx-auto">
          <div class="mt-4 md:mt-0 text-center py-10 md:py-20">
            <h2
              class="text-3xl md:text-5xl lg:text-[60px] font-semibold leading-[1.3em]"
            >
              {$t('ship.hero.title')}
            </h2>
  
            <p class="sub-heading">
              {$t('ship.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Ship and return Section Start -->
    <section class="md:pt-12">
      <div class="max-w-[1296px] px-4 mx-auto pt-10 md:pt-24">
        <div class="mt-4 md:mt-0 text-center">
          <h2 class="heading-h2">{$t('ship.steps.title')}</h2>
  
          <p class="sub-heading">
            {$t('ship.steps.subtitle')}
          </p>
        </div>
  
        <div
          class="flex flex-col md:grid grid-cols-12 gap-4 sm:gap-8 lg:gap-20 mt-[60px] mb-16 lg:mb-[120px]"
        >
          <div class="col-span-6 lg:col-span-5 my-auto">
            <img src={createAccount} alt={$t('ship.steps.createAccount.alt')} />
          </div>
  
          <div class="col-span-6 lg:col-span-7 my-auto">
            <h3 class="font-bold text-xl sm:text-2xl mb-2">
              {$t('ship.steps.createAccount.title')}
            </h3>
  
            <p class="text-base sm:text-lg">
              {$t('ship.steps.createAccount.description')}
            </p>
          </div>
        </div>
  
        <div
          class="flex flex-col-reverse md:grid grid-cols-12 gap-4 sm:gap-8 lg:gap-20 mt-[60px] mb-16 lg:mb-[120px]"
        >
          <div class="col-span-6 lg:col-span-7 my-auto">
            <h3 class="font-bold text-xl sm:text-2xl mb-2">
              {$t('ship.steps.printLabel.title')}
            </h3>
  
            <p class="text-base sm:text-lg">
              {$t('ship.steps.printLabel.description')}
            </p>
          </div>
  
          <div class="col-span-6 lg:col-span-5 my-auto">
            <img src={print} alt={$t('ship.steps.printLabel.alt')} />
          </div>
        </div>
  
        <div
          class="flex flex-col md:grid grid-cols-12 gap-4 sm:gap-8 lg:gap-20 lg:mt-[60px]"
        >
          <div class="col-span-6 lg:col-span-5 my-auto">
            <img src={dropOff} alt={$t('ship.steps.dropOff.alt')} />
          </div>
  
          <div class="col-span-6 lg:col-span-7 my-auto">
            <h3 class="font-bold text-xl sm:text-2xl mb-2">
              {$t('ship.steps.dropOff.title')}
            </h3>
  
            <p class="text-base sm:text-lg">
              {$t('ship.steps.dropOff.description')}
            </p>
          </div>
        </div>
  
        <div
          class="flex flex-col-reverse md:grid grid-cols-12 gap-4 sm:gap-8 lg:gap-20 mt-[60px] mb-16 lg:mb-[120px]"
        >
          <div class="col-span-6 lg:col-span-7 my-auto">
            <h3 class="font-bold text-xl sm:text-2xl mb-2">
              {$t('ship.steps.track.title')}
            </h3>
  
            <p class="text-base sm:text-lg">
              {$t('ship.steps.track.description')}
            </p>
          </div>
  
          <div class="col-span-6 lg:col-span-5 my-auto">
            <img src={trackShipment} alt={$t('ship.steps.track.alt')} />
          </div>
        </div>
      </div>
    </section>
    <!-- Shipping Places Section End -->
  
    <!-- Easy, Flexible Returns section start -->
    <section class="py-12 lg:py-[100px]">
      <div class="max-w-[1296px] px-4 mx-auto">
        <div class="mt-4 md:mt-0 text-center">
          <h2 class="heading-h2">{$t('ship.returns.title')}</h2>
  
          <p class="sub-heading">
            {$t('ship.returns.subtitle')}
          </p>
        </div>
  
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[60px] w-full"
        >
          <div class="rounded-[24px] border border-bland-300/30 p-5">
            <img
              src={prepareRetun}
              alt={$t('ship.returns.prepare.alt')}
              class="w-full"
            />
            <h3 class="text-xl sm:text-2xl font-semibold my-3">
              {$t('ship.returns.prepare.title')}
            </h3>
  
            <p class="">
              {$t('ship.returns.prepare.description')}
            </p>
          </div>
  
          <div class="rounded-[24px] border border-bland-300/30 p-5">
            <img
              src={submitReturnRequest}
              alt={$t('ship.returns.submit.alt')}
              class="w-full"
            />
  
            <h3 class="text-xl sm:text-2xl font-semibold my-3">
              {$t('ship.returns.submit.title')}
            </h3>
  
            <p class="">
              {$t('ship.returns.submit.description')}
            </p>
          </div>
  
          <div class="rounded-[24px] border border-bland-300/30 p-5">
            <img
              src={pickUpOrDropOff}
              alt={$t('ship.returns.pickup.alt')}
              class="w-full"
            />
  
            <h3 class="text-xl sm:text-2xl font-semibold my-3">
              {$t('ship.returns.pickup.title')}
            </h3>
  
            <p class="">
              {$t('ship.returns.pickup.description')}
            </p>
          </div>
        </div>
  
        <div>
          <Button
            class="mt-8 md:mt-[60px] mx-auto flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 h-auto cursor-pointer hover:shadow-md"
          >
            {$t('ship.returns.cta')}
            <Icon
              icon="solar:arrow-right-linear"
              class="text-bland-25 size-3.5 sm:size-6"
            />
          </Button>
        </div>
      </div>
    </section>
    <!-- Easy, Flexible Returns section ends -->
  
    <!-- CTA Section Start -->
    <section class="py-12 lg:py-[100px] header-bg-300">
      <div class="max-w-[1296px] px-4 mx-auto">
        <div class="flex flex-col md:grid grid-cols-12 gap-6 sm:gap-10 lg:gap-20">
          <div class="col-span-8 my-auto text-center md:text-start">
            <h2 class="heading-h2 capitalize">{$t('ship.cta.title')}</h2>
  
            <p class="sub-heading">
              {$t('ship.cta.subtitle')}
            </p>
          </div>
  
          <div class="col-span-4 my-auto">
            <Button
              class="ms-auto me-auto md:me-0 flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 h-auto cursor-pointer hover:shadow-md"
            >
              {$t('ship.cta.button')}
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
  