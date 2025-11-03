<script lang="ts">
  import PublicNavbar from '$lib/components/PublicNavbar.svelte';
  import { Button } from '$lib/components/ui/button';
  import Icon from '@iconify/svelte';
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '$lib/components/ui/tabs';
  import PublicFooter from '$lib/components/PublicFooter.svelte';
  import ShippingEstimator from '$lib/components/Shipping.svelte';
  import Dollar from '$lib/assets/images/pricing/ic-dollar.svg';
  import Lightning from '$lib/assets/images/pricing/ic-lightning.svg';
  import Dashboard from '$lib/assets/images/pricing/ic-dashboard.svg';
  import Globe from '$lib/assets/images/pricing/ic-globe.svg';
  import { t } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { setMeta } from '$lib/meta/meta';
  onMount(() => {
    setMeta({
      title: 'Pricing | User Message',
      description: 'Learn more about us and our mission.',
      image:
        'https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXJsfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
      url: import.meta.env.VITE_SITE_URL,
    });
  });
</script>

<PublicNavbar />

<main>
  <!-- Hero Section starts -->
  <section>
    <div class={`herobg-slide1  px-4 h-full`}>
      <div
        class={`max-w-[1280px] mx-auto px-4 flex flex-col justify-between py-10 md:py-14 lg:py-[85px] min-h[80vh] gap-5`}
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20">
          <div>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mb-6 lg:mb-8 leading-[1.2em] text-bland-950"
            >
              {$t('pricing.pricingPage.hero.title')}
            </h1>
            <p
              class="text-base sm:text-lg md:text-xl lg:text-2xl max-w-[500px] text-bland-950"
            >
              {@html $t('pricing.pricingPage.hero.subtitle')}
            </p>

            <Button
              class="mt-8 md:mt-[60px] lg:mx-0 mx-auto flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
            >
              {$t('pricing.pricingPage.hero.button')}
              <Icon
                icon="solar:arrow-right-linear"
                class="text-bland-25 size-3.5 sm:size-6"
              />
            </Button>
          </div>
          <div
            class="flex md:justify-end justify-center bg-img-slide1 rounded-2xl relative md:pl-12 pt-6"
          >
            <div
              class="bg-[url(/assets/images/pricing/hero-img.svg)] bg-contain bg-bottom-left bg-no-repeat h-[400px] flex items-center justify-start w-full rounded-2xl relative"
            >
              {#each $t('pricing.pricingPage.savingsCards') as card}
                <div
                  class="absolute top-30 -left-20 bg-white border-4 border-blue-600 w-fit rounded-2xl p-4 shadow-2xl"
                >
                  <p class="text-base font-bold mb-2 text-primary-400">
                    {(card as any)?.label || ''}
                  </p>
                  <div class="flex gap-3 items-center">
                    <p class="text-xl sm:text-3xl font-semibold text-bland-950">
                      {(card as any)?.price || ''}
                    </p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Hero Section ends -->

  <!-- Pricing Table Section Start -->
  <section class="py-12 lg:py-[100px]">
    <div class="max-w-[1296px] px-4 mx-auto">
      <div class="mt-4 md:mt-0 text-center">
        <h2 class="heading-h2">
          {$t('pricing.pricingPage.pricingTable.heading')}
        </h2>
        <p class="sub-heading">
          {$t('pricing.pricingPage.pricingTable.subHeading')}
        </p>
      </div>
      <Tabs value="canada" class="items-center lg:mt-[60px] mt-8">
        <TabsList class="custom-tabs-list max-w-[600px]">
          <TabsTrigger value="canada">Canada</TabsTrigger>
          <TabsTrigger value="us">US</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
        </TabsList>
        <TabsContent
          value="canada"
          class="overflow-x-auto w-full border-white/50 border rounded-2xl shadow-md p-5 mt-8 max-w-[992px]"
        >
          <table class="w-full">
            <thead>
              <tr class="border-b accordeion-border">
                <th
                  class="text-left p-4 font-medium text-bland-300 whitespace-nowrap"
                >
                  Carrier
                </th>
                <th
                  class="text-left p-4 font-medium text-bland-300 whitespace-nowrap"
                >
                  Retail Rate
                </th>
                <th
                  class="text-left p-4 font-medium text-bland-300 whitespace-nowrap"
                >
                  Our Rate
                </th>
                <th
                  class="text-left p-4 font-medium text-bland-300 whitespace-nowrap"
                >
                  You Save
                </th>
              </tr>
            </thead>
            <tbody>
              {#each $t('pricing.pricingPage.pricingTable.tabs.canada') as row}
                <tr class="border-b accordeion-border last:border-b-0">
                  <td class="p-4 whitespace-nowrap font-medium">
                    {(row as any)?.carrier || ''}
                  </td>
                  <td class="p-4 whitespace-nowrap">{(row as any)?.retailRate || ''}</td>
                  <td class="p-4 whitespace-nowrap">{(row as any)?.ourRate || ''}</td>
                  <td class="p-4 whitespace-nowrap">
                    <span class="text-primary-400 font-bold">{(row as any)?.youSave || ''}</span
                    >
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="us"
          >{$t('pricing.pricingPage.pricingTable.tabs.us')}</TabsContent
        >
        <TabsContent value="international">
          {$t('pricing.pricingPage.pricingTable.tabs.international')}
        </TabsContent>
      </Tabs>

      <Button
        class="mt-8 md:mt-[60px] mx-auto flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
      >
        {$t('pricing.pricingPage.pricingTable.ctaButton')}
      </Button>
    </div>
  </section>
  <!-- Pricing Table Section Ends -->

  <!-- Estimator Section Start -->
  <section class="header-bg-300 py-12 lg:py-[100px]">
    <div class="mt-4 md:mt-0 text-center">
      <h2 class="heading-h2">{$t('pricing.pricingPage.estimator.heading')}</h2>
      <p class="sub-heading">
        {$t('pricing.pricingPage.estimator.subHeading')}
      </p>
    </div>
    <div class="max-w-[1296px] px-4 mx-auto">
      <div class="bg-white rounded-4xl text-bland-950 shadow-2xl">
        <ShippingEstimator />
      </div>
    </div>

    <!-- Why Shipper Section Start -->
    <div class="max-w-[1296px] px-4 mx-auto pt-12 lg:pt-[100px]">
      <div class="mt-4 md:mt-0 text-center">
        <h2 class="heading-h2">
          {$t('pricing.pricingPage.whyShippers.heading')}
        </h2>
        <p class="sub-heading">
          {$t('pricing.pricingPage.whyShippers.subHeading')}
        </p>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:mt-[60px] mt-8"
      >
        {#each $t('pricing.pricingPage.whyShippers.features') as feature}
          <div class="bg-white rounded-6xl p-5 border accordeion-border">
            <div
              class="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center mb-4"
            >
              {#if (feature as any)?.icon === 'Dollar'}<img
                  src={Dollar}
                  alt={(feature as any)?.title || 'Dollar icon'}
                />{/if}
              {#if (feature as any)?.icon === 'Lightning'}<img
                  src={Lightning}
                  alt={(feature as any)?.title || 'Lightning icon'}
                />{/if}
              {#if (feature as any)?.icon === 'Dashboard'}<img
                  src={Dashboard}
                  alt={(feature as any)?.title || 'Dashboard icon'}
                />{/if}
              {#if (feature as any)?.icon === 'Globe'}<img
                  src={Globe}
                  alt={(feature as any)?.title || 'Globe icon'}
                />{/if}
            </div>
            <h3 class="text-xl sm:text-2xl text-bland-950 font-semibold">
              {(feature as any)?.title || ''}
            </h3>
            <p class="text-base mt-4">{(feature as any)?.description || ''}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <!-- Estimator Section End -->

  <!-- CTA Section Start -->
  <section class="py-12 lg:py-[100px]">
    <div class="max-w-[1296px] px-4 mx-auto">
      <div class="flex flex-col md:grid grid-cols-12 gap-6 sm:gap-10 lg:gap-20">
        <div class="col-span-8 my-auto text-center md:text-start">
          <h2 class="heading-h2">
            {$t('pricing.pricingPage.ctaSection.heading')}
          </h2>
          <p class="sub-heading">
            {$t('pricing.pricingPage.ctaSection.subHeading')}
          </p>
        </div>

        <div class="col-span-4 my-auto">
          <Button
            class="ms-auto me-auto md:me-0 flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
          >
            {$t('pricing.pricingPage.ctaSection.button')}
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
