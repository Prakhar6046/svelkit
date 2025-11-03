<script lang="ts">
    import Icon from '@iconify/svelte';
    import PublicNavbar from '$lib/components/PublicNavbar.svelte';
    import ShippingEstimator from '$lib/components/Shipping.svelte';
    import { Button } from '$lib/components/ui/button';
    import {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
    } from '$lib/components/ui/tabs';
    import PublicFooter from '$lib/components/PublicFooter.svelte';
    import YourShippingLocation from '$lib/components/YourShippingLocation.svelte';
    import ProductsToShip from '$lib/components/ProductsToShip.svelte';
    import YourResults from '$lib/components/YourResults.svelte';
    import TrackShipment from '$lib/components/TrackShipment.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { setMeta } from '$lib/meta/meta';
    onMount(() => {
      setMeta({
        title: 'Get Estimate | User Message',
        description: 'Learn more about estimate and our mission.',
        image:
          'https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXJsfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
        url: import.meta.env.VITE_SITE_URL,
      });
    });
  </script>
  
  <PublicNavbar />
  
  <main>
    <section>
      <div class="header-bg-600">
        <div class="max-w-[1296px] px-4 mx-auto">
          <div class="mt-4 md:mt-0 text-center py-10 md:py-20">
            <h2
              class="text-3xl md:text-5xl lg:text-[60px] font-semibold leading-[1.3em]"
            >
              {$t('shipTrack.hero.title')}
            </h2>
            <p class="sub-heading">
              {$t('shipTrack.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  
    <section class="py-12 lg:py-[100px]">
      <div class="max-w-[1296px] px-4 mx-auto">
        <Tabs value="estimate" class="items-center !gap-4">
          <TabsList class="custom-tabs-list">
            <TabsTrigger value="estimate"
              >{$t('shipTrack.tabs.estimate')}</TabsTrigger
            >
            <TabsTrigger value="tracking"
              >{$t('shipTrack.tabs.tracking')}</TabsTrigger
            >
          </TabsList>
          <TabsContent value="estimate" class="w-full">
            <div class=" form-shadow">
              <ShippingEstimator />
            </div>
  
            <YourShippingLocation />
  
            <ProductsToShip />
  
            <section
              class="border border-white/50 mt-5 md:mt-10 rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-4 md:gap-8 form-shadow"
            >
              <YourResults />
            </section>
          </TabsContent>
  
          <TabsContent value="tracking" class="w-full">
            <TrackShipment />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  
    <section class="py-12 lg:py-[100px] header-bg-300">
      <div class="max-w-[1296px] px-4 mx-auto">
        <div class="flex flex-col md:grid grid-cols-12 gap-6 sm:gap-10 lg:gap-20">
          <div class="col-span-8 my-auto text-center md:text-start">
            <h2 class="heading-h2">{$t('shipTrack.cta.title')}</h2>
  
            <p class="sub-heading">
              {$t('shipTrack.cta.subtitle')}
            </p>
          </div>
  
          <div class="col-span-4 my-auto">
            <Button
              asChild
              class="ms-auto me-auto md:me-0 flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
            >
              {$t('shipTrack.cta.button')}
              <Icon
                icon="solar:arrow-right-linear"
                class="text-bland-25 size-3.5 sm:size-6"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  </main>
  
  <PublicFooter />
  