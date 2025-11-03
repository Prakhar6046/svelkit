<script lang="ts">
  import Icon from '@iconify/svelte';
  import AppLogo from '$lib/assets/static/img/app-logo.svg';
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from './ui/collapsible';
  import { navigate } from 'svelte-routing';
  import { showDashboardSidebar } from '../stores/store';
  import { onMount, onDestroy } from 'svelte';

  let currentPath = window.location.pathname;

  // Track open state for each menu (only one should be open at a time)
  let pickupsOpen = $state(false);
  let accountOpen = $state(false);
  let previousPickupsOpen = $state(false);
  let previousAccountOpen = $state(false);

  let unsubscribe: (() => void) | null = null;
  let scrollPosition = 0;

  // Update currentPath when back/forward navigation occurs
  onMount(() => {
    window.addEventListener('popstate', () => {
      currentPath = window.location.pathname;
    });

    // Prevent body scroll and horizontal overflow on mobile when sidebar is open
    unsubscribe = showDashboardSidebar.subscribe(isOpen => {
      if (window.innerWidth < 1024) {
        if (isOpen) {
          // Save scroll position
          scrollPosition = window.scrollY;
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.top = `-${scrollPosition}px`;
        } else {
          // Restore scroll position
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          window.scrollTo(0, scrollPosition);
        }
      }
      if (currentPath.startsWith('/pickups')) {
        pickupsOpen = true;
      }
      if (currentPath.startsWith('/account')) {
        accountOpen = true;
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
  });

  // Helper function to check if the route is active
  const isActive = (slug: string) => {
    return currentPath === slug || currentPath.startsWith(slug + '/');
  };

  function handleNavClick() {
    if (window.innerWidth < 1024) {
      showDashboardSidebar.set(false);
    }
  }

  // only one menu is open at a time
  $effect(() => {
    // If pickups was just opened and account is open, close account
    if (pickupsOpen && !previousPickupsOpen && accountOpen) {
      accountOpen = false;
    }
    // If account was just opened and pickups is open, close pickups
    if (accountOpen && !previousAccountOpen && pickupsOpen) {
      pickupsOpen = false;
    }
    previousPickupsOpen = pickupsOpen;
    previousAccountOpen = accountOpen;
  });
</script>

<!-- Mobile overlay only -->
{#if $showDashboardSidebar}
  <div
    class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    onclick={() => {
      if (window.innerWidth < 1024) {
        showDashboardSidebar.set(false);
      }
    }}
    role="button"
    tabindex="0"
  ></div>
{/if}

<aside
  class={`bg-bland-25 h-full fixed top-0 left-0 overflow-hidden duration-300 z-20 border-r
          ${$showDashboardSidebar ? 'w-64 lg:w-64 px-3  border-r-bland-300/40' : 'w-0 border-transparent'}
          mobile-sidebar-fix`}
>
  <img src={AppLogo} alt="Ship in a Flash Logo" class="mt-3 cursor-pointer" />

  <ul class="flex flex-col gap-1.5 mt-8">
    <!-- Dashboard -->
    <li
      onclick={() => {
        navigate('/dashboard');
        handleNavClick();
      }}
      class={`text-sm font-medium flex items-center gap-4 cursor-pointer rounded-md p-2 duration-100
        ${isActive('/dashboard') ? 'bg-primary-400 text-bland-25' : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'}`}
    >
      <Icon icon="oui:nav-dashboards" class="size-4" />
      <span>Dashboard</span>
    </li>

    <!-- Create Shipment -->
    <li
      onclick={() => navigate('/create-shipment')}
      class={`text-sm font-medium flex items-center gap-4 cursor-pointer rounded-md p-2 duration-100
        ${isActive('/create-shipment') ? 'bg-primary-400 text-bland-25' : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'}`}
    >
      <Icon icon="solar:box-linear" class="size-4" />
      <span>Create Shipment</span>
    </li>

    <!-- Estimates -->
    <li
      onclick={() => navigate('/estimates')}
      class={`text-sm font-medium flex items-center gap-4 cursor-pointer rounded-md p-2 duration-100
        ${isActive('/estimates') ? 'bg-primary-400 text-bland-25' : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'}`}
    >
      <Icon icon="lucide:calculator" class="size-4" />
      <span>Estimates</span>
    </li>

    <!-- History -->
    <li
      onclick={() => navigate('/history')}
      class={`text-sm font-medium flex items-center gap-4 cursor-pointer rounded-md p-2 duration-100
        ${isActive('/history') ? 'bg-primary-400 text-bland-25' : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'}`}
    >
      <Icon icon="iconamoon:clock" class="size-4" />
      <span>History</span>
    </li>

    <!-- Pickups (Collapsible) -->
    <!-- Pickups (Collapsible) -->
    <li class="relative text-sm font-medium rounded-md">
      <Collapsible bind:open={pickupsOpen}>
        <CollapsibleTrigger
          class={`w-full text-left text-sm font-medium flex items-center gap-4 cursor-pointer rounded-md p-2 duration-100 
        ${
          currentPath.startsWith('/pickups')
            ? 'bg-primary-400 text-bland-25' /* Pickups main active (orange) */
            : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'
        }`}
        >
          <Icon icon="ph:truck" class="size-4" />
          <span class="flex-1">Pickups</span>
          <Icon
            icon="uil:angle-down"
            class="size-6 transition-transform duration-300 {pickupsOpen
              ? 'rotate-180'
              : ''}"
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <ul class="flex flex-col gap-1.5 mt-3 ms-5">
            <li
              onclick={() => navigate('/pickups/schedule')}
              class={`text-sm font-medium cursor-pointer py-2 px-3 rounded-md ${
                isActive('/pickups/schedule') ||
                isActive('/pickups/schedule-new-pickup') ||
                isActive('/pickups/review-confirm-pickup')
                  ? 'bg-bland-200/50 text-bland-950' /* gray background for active submenu */
                  : 'text-bland-950 hover:bg-bland-200/50 hover:text-bland-950'
              }`}
            >
              Schedule
            </li>
            <li
              onclick={() => navigate('/pickups/cancel-history')}
              class={`text-sm font-medium cursor-pointer py-2 px-3 rounded-md ${
                isActive('/pickups/cancel-history')
                  ? 'bg-bland-200/50 text-bland-950'
                  : 'text-bland-950 hover:bg-bland-200/50 hover:text-bland-950'
              }`}
            >
              Cancel / History
            </li>
            <li
              onclick={() => navigate('/pickups/cutoff')}
              class={`text-sm font-medium cursor-pointer py-2 px-3 rounded-md ${
                isActive('/pickups/cutoff')
                  ? 'bg-bland-200/50 text-bland-950'
                  : 'text-bland-950 hover:bg-bland-200/50 hover:text-bland-950'
              }`}
            >
              Cutoff Times
            </li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>

    <!-- Account (Collapsible) -->
    <!-- <li class="relative text-sm font-medium rounded-md">
      <Collapsible bind:open={accountOpen}>
        <CollapsibleTrigger
          class="w-full text-left text-sm font-medium flex items-center gap-4 cursor-pointer rounded-md p-2 duration-100 text-bland-950 hover:bg-primary-400 hover:text-bland-25"
        >
          <Icon icon="ph:user" class="size-4" />
          <span class="flex-1">Account</span>
          <Icon
            icon="uil:angle-down"
            class="size-6 transition-transform duration-300 {accountOpen
              ? 'rotate-180'
              : ''}"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul class="flex flex-col gap-1.5 mt-3 ms-8">
            <li
              onclick={() => navigate('/account/item1')}
              class={`text-sm font-medium cursor-pointer p-1 rounded ${isActive('/account/item1') ? 'bg-primary-400 text-bland-25' : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'}`}
            >
              Item 1
            </li>
            <li
              onclick={() => navigate('/account/item2')}
              class={`text-sm font-medium cursor-pointer p-1 rounded ${isActive('/account/item2') ? 'bg-primary-400 text-bland-25' : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'}`}
            >
              Item 2
            </li>
            <li
              onclick={() => navigate('/account/item3')}
              class={`text-sm font-medium cursor-pointer p-1 rounded ${isActive('/account/item3') ? 'bg-primary-400 text-bland-25' : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'}`}
            >
              Item 3
            </li>
            <li
              onclick={() => navigate('/account/item4')}
              class={`text-sm font-medium cursor-pointer p-1 rounded ${isActive('/account/item4') ? 'bg-primary-400 text-bland-25' : 'text-bland-950 hover:bg-primary-400 hover:text-bland-25'}`}
            >
              Item 4
            </li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li> -->
  </ul>
</aside>

<style>
  /* Mobile-only fixes - desktop completely unaffected */
  @media (max-width: 1023px) {
    :global(.mobile-sidebar-fix) {
      z-index: 40;
      transition:
        transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
        width 300ms cubic-bezier(0.4, 0, 0.2, 1),
        padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1),
        padding-right 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Always hide sidebar when closed on mobile */
    :global(.mobile-sidebar-fix.w-0) {
      transform: translateX(-100%) !important;
      width: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    /* Ensure sidebar is fully visible when open */
    :global(.mobile-sidebar-fix.w-64) {
      transform: translateX(0) !important;
    }
  }
</style>
