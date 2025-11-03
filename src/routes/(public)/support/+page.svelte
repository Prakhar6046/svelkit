<script lang="ts">
    import PublicNavbar from '$lib/components/PublicNavbar.svelte';
    import Reliability from '$lib/assets/images/Reliability.svg';
    import Simplicity from '$lib/assets/images/Simplicity.svg';
    import Trust from '$lib/assets/images/trust.svg';
    import {
      Accordion,
      AccordionContent,
      AccordionItem,
      AccordionTrigger,
    } from '$lib/components/ui/accordion';
    import {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
    } from '$lib/components/ui/tabs';
  
    import Icon from '@iconify/svelte';
    import { Button } from '$lib/components/ui/button';
  
    import PublicFooter from '$lib/components/PublicFooter.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import { Select } from '$lib/components/ui/select';
    import { ChatButton, ChatWidget } from '$lib/components/chat';
    import { onMount } from 'svelte';
    import { t } from 'svelte-i18n';
    import { setMeta } from '$lib/meta/meta';
  
    let chatOpen = false;
    function toggleChat() {
      chatOpen = !chatOpen;
    }
    onMount(() => {
      setMeta({
        title: 'Support | About Support',
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
              class=" text-3xl md:text-5xl lg:text-[60px] font-semibold leading-[1.3em]"
            >
              {$t('support.hero.title')}
            </h2>
  
            <p class="sub-heading">
              {$t('support.hero.subtitle')}
            </p>
  
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              <div
                class="bg-white border border-bland-300/30 text-bland-950 rounded-[24px] p-5 flex flex-col gap-4 justify-start"
              >
                <img
                  src={Reliability}
                  class="w-12"
                  alt={$t('support.cards.liveChat.alt')}
                />
                <p class="text-2xl font-semibold text-start">
                  {$t('support.cards.liveChat.title')}
                </p>
                <p class="text-start">
                  {$t('support.cards.liveChat.description')}
                </p>
                <a href="/" class="text-start font-semibold underline text-lg">
                  {$t('support.cards.liveChat.link')}
                </a>
              </div>
              <div
                class="bg-white border border-bland-300/30 text-bland-950 rounded-[24px] p-5 flex flex-col gap-4"
              >
                <img
                  src={Simplicity}
                  class="w-12"
                  alt={$t('support.cards.email.alt')}
                />
                <p class="text-2xl font-semibold text-start">
                  {$t('support.cards.email.title')}
                </p>
                <p class="text-start">
                  {$t('support.cards.email.description')}
                </p>
                <a href="/" class="text-start font-semibold underline text-lg">
                  {$t('support.cards.email.link')}
                </a>
              </div>
              <div
                class="bg-white border border-bland-300/30 text-bland-950 rounded-[24px] p-5 flex flex-col gap-4"
              >
                <img
                  src={Trust}
                  class="w-12"
                  alt={$t('support.cards.helpCenter.alt')}
                />
                <p class="text-2xl font-semibold text-start">
                  {$t('support.cards.helpCenter.title')}
                </p>
                <p class="text-start">
                  {$t('support.cards.helpCenter.description')}
                </p>
                <a href="/" class="text-start font-semibold underline text-lg">
                  {$t('support.cards.helpCenter.link')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Shipping Places Section End -->
    <section>
      <div class="max-w-[1296px] px-4 mx-auto pt-10 md:py-24">
        <div class="mt-4 md:mt-0 text-center">
          <h2 class="heading-h2">{$t('support.faq.title')}</h2>
          <p class="sub-heading">{$t('support.faq.subtitle')}</p>
        </div>
  
        <div class="mt-[60px]">
          <Tabs value="shipping" class="items-center">
            <TabsList class="custom-tabs-list w-full max-w-max mx-auto mb-10">
              <TabsTrigger value="shipping"
                >{$t('support.faq.tabs.shipping')}</TabsTrigger
              >
              <TabsTrigger value="returns"
                >{$t('support.faq.tabs.returns')}</TabsTrigger
              >
              <TabsTrigger value="tracking"
                >{$t('support.faq.tabs.tracking')}</TabsTrigger
              >
              <TabsTrigger value="billing"
                >{$t('support.faq.tabs.billing')}</TabsTrigger
              >
            </TabsList>
  
            <TabsContent value="shipping" class="w-full">
              <div class="w-full">
                <Accordion
                  type="single"
                  value="item-1"
                  class="flex flex-col gap-4 w-full"
                >
                  <AccordionItem
                    value="item-1"
                    class="data-[state=open]:bg-bland-25 data-[state=close]:bg-secondary-300 !border data-[state=open]:border-secondary-700/60 border-bland-300/30 p-4 sm:p-6 rounded-[24px]"
                  >
                    <AccordionTrigger
                      class="text-lg sm:text-xl flex justify-between items-center gap-4 [&>svg]:size-6 p-0 data-[state=open]:text-secondary-700 data-[state=close]: hover:no-underline cursor-pointer w-full"
                    >
                      {$t('support.faq.accordion.item1.question')}
                    </AccordionTrigger>
                    <AccordionContent class="flex flex-col gap-4 mt-5 pb-0">
                      <p
                        class="text-sm sm:text-base leading-[1.8em] text-bland-950"
                      >
                        {$t('support.faq.accordion.item1.answer')}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
  
                  <AccordionItem
                    value="item-2"
                    class="data-[state=open]:bg-bland-25 data-[state=close]:bg-secondary-300 !border data-[state=open]:border-secondary-700/60 border-bland-300/30 p-4 sm:p-6 rounded-[24px]"
                  >
                    <AccordionTrigger
                      class="text-lg sm:text-xl flex justify-between items-center gap-4 [&>svg]:size-6 p-0 data-[state=open]:text-secondary-700 data-[state=close]: hover:no-underline cursor-pointer"
                    >
                      {$t('support.faq.accordion.item2.question')}
                    </AccordionTrigger>
                    <AccordionContent class="flex flex-col gap-4  mt-5 pb-0">
                      <p
                        class="font-medium text-sm sm:text-base leading-[1.8em] text-bland-950"
                      >
                        {$t('support.faq.accordion.item2.answer')}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
  
                  <AccordionItem
                    value="item-3"
                    class="data-[state=open]:bg-bland-25 data-[state=close]:bg-secondary-300 !border data-[state=open]:border-secondary-700/60 border-bland-300/30 p-4 sm:p-6 rounded-[24px]"
                  >
                    <AccordionTrigger
                      class="text-lg sm:text-xl flex justify-between items-center gap-4 [&>svg]:size-6 p-0 data-[state=open]:text-secondary-700 data-[state=close]: hover:no-underline cursor-pointer"
                    >
                      {$t('support.faq.accordion.item3.question')}
                    </AccordionTrigger>
                    <AccordionContent class="flex flex-col gap-4  mt-5 pb-0">
                      <p
                        class="font-medium text-sm sm:text-base leading-[1.8em] text-bland-950"
                      >
                        {$t('support.faq.accordion.item3.answer')}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
  
            <TabsContent value="returns"
              >{$t('support.faq.tabs.returns')}</TabsContent
            >
            <TabsContent value="tracking"
              >{$t('support.faq.tabs.tracking')}</TabsContent
            >
            <TabsContent value="billing"
              >{$t('support.faq.tabs.billing')}</TabsContent
            >
          </Tabs>
        </div>
      </div>
    </section>
  
    <!-- Dedicated Email Support -->
    <section>
      <div class="max-w-[1296px] px-4 mx-auto pt-10 md:py-24">
        <div class="mt-4 md:mt-0 text-center">
          <h2 class="heading-h2">{$t('support.emailSupport.title')}</h2>
          <p class="sub-heading">{$t('support.emailSupport.subtitle')}</p>
        </div>
  
        <div class="grid grid-cols-5 gap-4 mt-[60px]">
          <div class="col-span-5 sm:col-span-2 flex flex-col gap-4">
            <p class="text-2xl font-semibold text-start">
              {$t('support.emailSupport.info.question')}
            </p>
            <p class="text-start">
              {$t('support.emailSupport.info.instructions')}
            </p>
            <p class="text-start">
              {$t('support.emailSupport.info.liveChat')}
            </p>
          </div>
  
          <div class="col-span-5 sm:col-span-3">
            <div
              class="rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-4 shadow-lg border border-bland-300/30 mb-20 md:mb-0"
            >
              <div class="flex flex-col gap-2">
                <Label class="text-sm sm:text-base"
                  >{$t('support.emailSupport.form.fullName')}</Label
                >
                <input
                  class="bg-transparent px-4 w-full rounded-xl border accordeion-border input-text py-[11px] text-sm sm:text-base"
                  placeholder={$t(
                    'support.emailSupport.form.fullNamePlaceholder'
                  )}
                  type="text"
                />
              </div>
  
              <div class="flex flex-col gap-2">
                <Label class="text-sm sm:text-base"
                  >{$t('support.emailSupport.form.email')}</Label
                >
                <input
                  class="bg-transparent px-4 w-full rounded-xl border accordeion-border input-text py-[11px] text-sm sm:text-base"
                  placeholder={$t('support.emailSupport.form.emailPlaceholder')}
                  type="text"
                />
              </div>
  
              <div class="flex flex-col gap-2">
                <Label class="text-sm sm:text-base"
                  >{$t('support.emailSupport.form.message')}</Label
                >
                <input
                  class="bg-transparent px-4 w-full rounded-xl border accordeion-border input-text py-[11px] text-sm sm:text-base"
                  placeholder={$t('support.emailSupport.form.messagePlaceholder')}
                  type="textarea"
                />
              </div>
  
              <div
                class="flex flex-col gap-3 col-span-1 sm:col-span-2 lg:col-span-1"
              >
                <Button
                  class="flex items-center justify-center font-semibold text-sm sm:text-base text-bland-25 border border-primary-400 bg-primary-400 shadow-none rounded-xl py-2 xl:py-[11px] px-6 h-auto cursor-pointer hover:shadow-md"
                >
                  {$t('support.emailSupport.form.submit')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- CTA Section Start -->
    <section class="py-12 lg:py-[100px] header-bg-300">
      <div class="max-w-[1296px] px-4 mx-auto">
        <div class="flex flex-col md:grid grid-cols-12 gap-6 sm:gap-10 lg:gap-20">
          <div class="col-span-8 my-auto text-center md:text-start">
            <h2 class="heading-h2 capitalize">
              {$t('support.cta.title')}
            </h2>
            <p class="sub-heading">
              {$t('support.cta.subtitle')}
            </p>
          </div>
          <div class="col-span-4 my-auto">
            <Button
              asChild
              class="ms-auto me-auto md:me-0 flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
            >
              {$t('support.cta.button')}<Icon
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
  
  <!-- Chat widget -->
  <ChatWidget
    open={chatOpen}
    on:close={() => (chatOpen = false)}
    onClose={() => (chatOpen = false)}
  />
  <ChatButton on:toggle={toggleChat} />
  