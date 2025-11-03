<script lang="ts">
  import Icon from '@iconify/svelte';
  import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '../components/ui/accordion';
  import { Button } from '../components/ui/button';
  import {
    NavigationMenuRoot,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from '../components/ui/navigation-menu';
  import { themeStore } from '../stores/theme.js';
  import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetTrigger,
  } from '../components/ui/sheet';
  import LanguageDropdown from './LanguageDropdown.svelte';
  import { _ } from 'svelte-i18n';
  import { navigate } from 'svelte-routing';

  interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: any; // Svelte component
    items?: MenuItem[];
    key?: string; // i18n key
  }

  interface Logo {
    url: string;
    src: string;
    darkSrc?: string;
    alt: string;
  }

  interface Auth {
    login: {
      title: string;
      url: string;
      key?: string;
    };
    signup: {
      title: string;
      url: string;
      key?: string;
    };
  }

  interface PublicNavbarProps {
    logo?: Logo;
    menu?: MenuItem[];
    auth?: Auth;
  }

  let {
    logo = {
      url: '/',
      src: '/static/img/app-logo.svg',
      // optional dark-mode logo; override by passing logo.darkSrc prop
      darkSrc: '$lib/assets/static/img/app-logo-white.svg',
      alt: 'logo',
    },
    menu = [
      { title: 'Home', url: '/', key: 'nav.home' },
      { title: 'Pricing', url: '/pricing', key: 'nav.pricing' },
      { title: 'Integration', url: '#', key: 'nav.integration' },
      { title: 'Why Ship N Flash', url: '#', key: 'nav.whyShipNFlash' },
      { title: 'About Us', url: 'about', key: 'nav.aboutUs' },
    ],
    auth = {
      login: { title: 'Login', url: '/login', key: 'nav.login' },
      signup: { title: 'Get Started', url: '/login', key: 'nav.getStarted' },
    },
  }: PublicNavbarProps = $props();

  function toggleTheme() {
    themeStore.toggleTheme();
  }
</script>

<section class="py-4">
  <div class="max-w-[1296px] px-4 mx-auto">
    <nav class="flex justify-between items-center w-full">
      <a href={logo.url} class="flex items-center gap-2">
        {#if $themeStore.isDark}
          <img
            src={logo.darkSrc ?? logo.src}
            class="w-28 sm:w-40"
            alt={logo.alt}
          />
        {:else}
          <img src={logo.src} class="w-28 sm:w-40" alt={logo.alt} />
        {/if}
      </a>

      <div class="hidden xl:flex items-center">
        <NavigationMenuRoot>
          <NavigationMenuList class="gap-11">
            {#each menu as item}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={item.url}
                  class="text-base  hover:font-semibold p-0"
                >
                  {item.key ? $_(item.key) : item.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            {/each}
          </NavigationMenuList>
        </NavigationMenuRoot>
      </div>

      <div class="flex items-center gap-1 sm:gap-2">
        <Sheet>
          <SheetTrigger>
            <Icon icon="ci:menu-alt-02" class="size-5 sm:size-7 xl:hidden" />
          </SheetTrigger>
          <SheetContent
            side="right"
            class="bg-white duration-300 w-5/6 sm:w-96 sm:!max-w-96 h-[96%] my-auto me-4 rounded-xl border-none"
          >
            <div class="mt-12 px-4">
              <ul class="flex flex-col gap-4">
                {#each menu as item}
                  <li>
                    <a href={item.url}>{item.key ? $_(item.key) : item.title}</a
                    >
                  </li>
                {/each}
              </ul>
            </div>

            <SheetFooter>
              <Button
                class="flex items-center font-semibold text-xs sm:text-sm md:text-base text-bland-25 bg-primary-400 shadow-none rounded-xl py-2 xl:py-2.5 px-2.5 sm:px-4 xl:!px-6 h-auto cursor-pointer hover:shadow-md"
              >
                {auth.signup.key ? $_(auth.signup.key) : auth.signup.title}
                <Icon
                  icon="solar:arrow-right-linear"
                  class="text-bland-25 size-3.5 sm:size-6"
                />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <!-- <Button
          class="shadow-none h-full cursor-pointer hover:shadow-md"
          onclick={toggleTheme}
        >
          {#if $themeStore.isDark}
            <Icon icon="mynaui:sun" class="size-4 sm:size-5" />
          {:else}
            <Icon icon="ant-design:moon-outlined" class="size-4 sm:size-5" />
          {/if}
        </Button> -->
        <!-- Language Dropdown -->
        <LanguageDropdown />
        <button
          onclick={() => {
            navigate('/login');
          }}
          class="font-semibold text-xs sm:text-sm md:text-base shadow-none border border-bland-200 rounded-xl py-1 sm:py-2 xl:py-2.5 px-2.5 sm:px-4 xl:!px-6 h-auto cursor-pointer hover:shadow-md"
        >
          {auth.login.key ? $_(auth.login.key) : auth.login.title}
        </button>
        <button
          onclick={() => {
            navigate('/login');
          }}
          class="hidden sm:flex items-center font-semibold text-xs sm:text-sm md:text-base text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-1 sm:py-2 xl:py-2.5 px-2.5 sm:px-4 xl:!px-6 h-auto cursor-pointer hover:shadow-md"
        >
          {auth.signup.key ? $_(auth.signup.key) : auth.signup.title}
          <Icon
            icon="solar:arrow-right-linear"
            class="text-bland-25 size-3.5 sm:size-6"
          />
        </button>
      </div>
    </nav>
  </div>
</section>

{#snippet renderMenuItem(item: MenuItem)}
  {#if item.items}
    <NavigationMenuItem>
      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
      <NavigationMenuContent class="bg-popover text-popover-foreground">
        {#each item.items as subItem (subItem.title)}
          <NavigationMenuLink class="w-80">
            {@render SubMenuLink(subItem)}
          </NavigationMenuLink>
        {/each}
      </NavigationMenuContent>
    </NavigationMenuItem>
  {:else}
    <NavigationMenuItem>
      <NavigationMenuLink
        href={item.url}
        class="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-xs font-medium transition-colors"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  {/if}
{/snippet}

{#snippet renderMobileMenuItem(item: MenuItem)}
  {#if item.items}
    <AccordionItem value={item.title} class="border-b-0">
      <AccordionTrigger class="text-sm py-0 font-semibold hover:no-underline">
        {item.title}
      </AccordionTrigger>
      <AccordionContent class="mt-2">
        {#each item.items as subItem (subItem.title)}
          {@render SubMenuLink(subItem)}
        {/each}
      </AccordionContent>
    </AccordionItem>
  {:else}
    <a href={item.url} class="text-sm font-semibold">
      {item.title}
    </a>
  {/if}
{/snippet}

{#snippet SubMenuLink(item: MenuItem)}
  <a
    class="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
    href={item.url}
  >
    <div class="">
      {#if item.icon}
        {@const IconComponent = item.icon}
        <IconComponent class="size-5 shrink-0" />
      {/if}
    </div>
    <div>
      <div class="text-xs font-semibold">{item.title}</div>
      {#if item.description}
        <p class="text-muted-foreground text-xs leading-snug">
          {item.description}
        </p>
      {/if}
    </div>
  </a>
{/snippet}
