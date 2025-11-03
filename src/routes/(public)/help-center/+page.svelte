<script lang="ts">
    import PublicNavbar from '$lib/components/PublicNavbar.svelte';
    import Reliability from '$lib/assets/images/Reliability.svg';
    import helpIc1 from '$lib/assets/images/help-ic-1.svg';
    import helpIc2 from '$lib/assets/images/help-ic-2.svg';
    import helpIc3 from '$lib/assets/images/help-ic-3.svg';
    import helpIc4 from '$lib/assets/images/help-ic-4.svg';
    import helpIc5 from '$lib/assets/images/help-ic-5.svg';
    import helpIc6 from '$lib/assets/images/help-ic-6.svg';
    import Icon from '@iconify/svelte';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
    import { Button } from '$lib/components/ui/button';
    import PublicFooter from '$lib/components/PublicFooter.svelte';
    import { ChatButton, ChatWidget } from '$lib/components/chat';
    import {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
    } from '$lib/components/ui/tabs';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { setMeta } from '$lib/meta/meta';
  
    let chatOpen = false;
    function toggleChat() {
      chatOpen = !chatOpen;
    }
  
    onMount(() => {
      setMeta({
        title: 'Help | User Message',
        description: 'Learn more about us and our mission.',
        image:
          'https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXJsfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
        url: import.meta.env.VITE_SITE_URL,
      });
    });
  </script>
  
  <PublicNavbar />
  
  <main>
    <!-- Ship and return Section Start -->
    <section>
      <div class="header-bg-600">
        <div class="max-w-[1296px] px-4 mx-auto">
          <div class="mt-4 md:mt-0 text-center py-10 md:py-20">
            <h2
              class="text-3xl md:text-5xl lg:text-[60px] font-semibold leading-[1.3em]"
            >
              {$t('helpCenter.hero.title')}
            </h2>
            <p class="sub-heading">{$t('helpCenter.hero.subtitle')}</p>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Select a category to find quick, detailed answers. section starts -->
    <section>
      <div class="max-w-[1296px] px-4 mx-auto pt-10 md:py-24">
        <div class="mt-4 md:mt-0 text-center">
          <p class="sub-heading">{$t('helpCenter.categories.subtitle')}</p>
        </div>
  
        <div class="mt-[60px] text-bland-950">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {#each $t('helpCenter.categories.cards') as card}
              <div
                class="bg-white border border-bland-300/30 rounded-[24px] p-5 flex flex-col gap-4 justify-start"
              >
                <img src={(card as any).icon} class="w-12" alt={(card as any).title} />
                <p class="text-2xl font-semibold text-bland-950 text-start">
                  {(card as any).title}
                </p>
                <p class="text-start">{(card as any).description}</p>
                <a href="/" class="text-start font-semibold underline text-lg"
                  >{(card as any).cta}</a
                >
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>
  
    <!-- Shipping & Delivery section starts -->
    <section>
      <div class="max-w-[1296px] px-4 mx-auto pt-10 md:py-24">
        <div class="my-3">
          <Breadcrumb.Root>
            <Breadcrumb.List>
              {#each $t('helpCenter.breadcrumbs') as crumb, i}
                <Breadcrumb.Item>
                  {#if (crumb as any).link}
                    <Breadcrumb.Link
                      href={(crumb as any).link}
                      class="text-bland-300 text-lg"
                      >{(crumb as any).label}</Breadcrumb.Link
                    >
                  {:else}
                    <Breadcrumb.Page class="font-semibold text-lg"
                      >{(crumb as any).label}</Breadcrumb.Page
                    >
                  {/if}
                </Breadcrumb.Item>
                {#if i < $t('helpCenter.breadcrumbs').length - 1}
                  <Breadcrumb.Separator />
                {/if}
              {/each}
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </div>
  
        <div class="mt-4 md:mt-0 text-start">
          <h2 class="heading-h2">{$t('helpCenter.shippingDelivery.title')}</h2>
          <p class="sub-heading">{$t('helpCenter.shippingDelivery.subtitle')}</p>
        </div>
  
        <div class="mt-10 md:mt-16">
          <Tabs value="services" class="grid grid-cols-5 gap-4 w-full">
            <TabsList
              class="rounded-3xl p-1 [&_[data-state=active]]:bg-secondary-200 [&_button]:rounded-xl [&_button]:text-lg  [&_button]:font-semibold [&_button]:py-3 [&_button]:px-10 [&_button]:h-auto flex flex-row gap-2 sm:flex-col col-span-5 sm:col-span-2 w-full overflow-auto justify-start items-start [&_[data-state=active]]:shadow-none [&_[data-state=active]]:text-secondary-700 h-fit"
            >
              {#each $t('helpCenter.tabs') as tab}
                <TabsTrigger
                  class="w-full justify-between !px-6 [&>span.icon]:hidden [&[data-state=active]>span.icon]:inline-flex cursor-pointer"
                  value={(tab as any).value}
                >
                  <span>{(tab as any).label}</span>
                  <span class="icon ms-auto"
                    ><Icon icon="solar:arrow-right-linear" class="size-6" /></span
                  >
                </TabsTrigger>
              {/each}
            </TabsList>
  
            {#each $t('helpCenter.tabs') as tab}
              <TabsContent value={(tab as any).value} class="col-span-5 sm:col-span-3">
                <div
                  class="p-6 rounded-[24px] border border-secondary-700/60 bg-[#FDFDFF] flex flex-col gap-4"
                >
                  <h1 class="text-xl font-medium text-secondary-700">
                    {(tab as any).content.title}
                  </h1>
                  <p>{@html (tab as any).content.body}</p>
  
                  {#if (tab as any).content.subTabs}
                    <Tabs
                      value={(tab as any).content.subTabs[0].value}
                      class="grid grid-cols-5 gap-4 w-full"
                    >
                      <TabsList
                        class="rounded-3xl p-1 [&_[data-state=active]]:bg-secondary-200 [&_button]:rounded-xl [&_button]:text-sm [&_button]:text-bland-950 [&_button]:font-normal [&_button]:py-3 [&_button]:px-10 [&_button]:h-auto flex flex-row lg:flex-col col-span-5 lg:col-span-2 w-full overflow-auto items-start [&_[data-state=active]]:shadow-none [&_[data-state=active]]:text-secondary-700 h-fit justify-start"
                      >
                        {#each (tab as any).content.subTabs as subTab}
                          <TabsTrigger
                            class="w-full justify-between !px-6 [&>span.icon]:hidden [&[data-state=active]>span.icon]:inline-flex h-fit"
                            value={(subTab as any).value}
                          >
                            <span>{(subTab as any).label}</span>
                          </TabsTrigger>
                        {/each}
                      </TabsList>
  
                      {#each (tab as any).content.subTabs as subTab}
                        <TabsContent
                          value={(subTab as any).value}
                          class="col-span-5 lg:col-span-3 p-6 border border-bland-300/30 rounded-xl flex flex-col gap-4 text-bland-950"
                        >
                          <h1 class="font-medium text-xl">{(subTab as any).title}</h1>
                          <p>{@html (subTab as any).body}</p>
                        </TabsContent>
                      {/each}
                    </Tabs>
                  {/if}
                </div>
              </TabsContent>
            {/each}
          </Tabs>
        </div>
      </div>
    </section>
  
    <!-- CTA Section Start -->
    <section class="py-12 lg:py-[100px] header-bg-300">
      <div class="max-w-[1296px] px-4 mx-auto">
        <div class="flex flex-col md:grid grid-cols-12 gap-6 sm:gap-10 lg:gap-20">
          <div class="col-span-8 my-auto text-center md:text-start">
            <h2 class="heading-h2 capitalize">{$t('helpCenter.cta.title')}</h2>
            <p class="sub-heading">{$t('helpCenter.cta.subtitle')}</p>
          </div>
  
          <div class="col-span-4 my-auto">
            <Button
              class="ms-auto me-auto md:me-0 flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
            >
              {$t('helpCenter.cta.button')}<Icon
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
  
  <!-- Chat widget -->
  <ChatWidget
    open={chatOpen}
    on:close={() => (chatOpen = false)}
    onClose={() => (chatOpen = false)}
  />
  <ChatButton on:toggle={toggleChat} />
  