<script>
    // @ts-nocheck
    import Icon from '@iconify/svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { showDashboardSidebar } from '$lib/stores/store';
    import { Button } from '$lib/components/ui/button';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import UserImg from '$lib/assets/images/dashboard/user.png';
    import Label from '$lib/components/ui/label/label.svelte';
    import { Input } from '$lib/components/ui/input';
    import Calendar from '$lib/components/Calendar.svelte';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import * as Table from '$lib/components/ui/table';
    // import type { DateRange } from 'bits-ui';
    import { getLocalTimeZone } from '@internationalized/date';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
    import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectLabel,
      SelectTrigger,
    } from '$lib/components/ui/select';
    import { goto } from '$app/navigation';
    import DashboardHeader from '$lib/components/DashboardHeader.svelte';
    import { writable } from 'svelte/store';
    import Tabs from '$lib/components/ui/tabs/tabs.svelte';
    import { getSchedulePickups } from '$lib/services/schedulePickups.service';
  
    // Sample pickup data with variety
    // interface PickupData {
    //   id: string;
    //   dateTime: string;
    //   carrier: string;
    //   address: string;
    //   recipient?: string;
    //   isMyPickup?: boolean;
    // }
  
    let allPickups = $state([]);
  
    // State variables
    let searchQuery = $state('');
    let dateRange = $state(undefined);
    let onlyMyPickups = $state(false);
    let onlyTodayPickups = $state(false);
    let loading = $state(false);
  
    // Load pickups on component mount
    async function loadPickups() {
      loading = true;
      try {
        const response = await getSchedulePickups();
        if (response.success) {
          allPickups = response.data.pickups;
        }
      } catch (error) {
        console.error('Failed to load pickups:', error);
      } finally {
        loading = false;
      }
    }
  
    // Load data when component mounts
    $effect(() => {
      loadPickups();
    });
  
    // Get today's date for comparison
    const today = new Date();
    const todayString = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  
    // Helper function to parse date string (handles formats like "Sep 15, 2025")
    function parseDateString(dateString) {
      try {
        const parsed = new Date(dateString);
  
        // Check if date is valid
        if (isNaN(parsed.getTime())) {
          return null;
        }
  
        return parsed;
      } catch (e) {
        return null;
      }
    }
  
    // Filter function to check if date matches selected range
    function isDateInRange(dateString, range) {
      if (!range || !range.start) return true;
  
      try {
        const pickupDate = parseDateString(dateString);
        if (!pickupDate) return true; // If date can't be parsed, don't filter it out
  
        const startDate = range.start.toDate(getLocalTimeZone());
  
        // Normalize dates to start of day for accurate comparison
        const startDateOnly = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        const pickupDateOnly = new Date(
          pickupDate.getFullYear(),
          pickupDate.getMonth(),
          pickupDate.getDate()
        );
  
        // If only start date is selected
        if (!range.end) {
          return pickupDateOnly.getTime() === startDateOnly.getTime();
        }
  
        // If both start and end dates are selected
        const endDate = range.end.toDate(getLocalTimeZone());
        const endDateOnly = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );
  
        return pickupDateOnly >= startDateOnly && pickupDateOnly <= endDateOnly;
      } catch (e) {
        return true;
      }
    }
  
    // Filtered pickups based on all criteria
    let filteredPickups = $derived(
      allPickups.filter(pickup => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch =
            pickup.id.toLowerCase().includes(query) ||
            pickup.address.toLowerCase().includes(query) ||
            pickup.dateTime.toLowerCase().includes(query) ||
            (pickup.recipient && pickup.recipient.toLowerCase().includes(query));
          if (!matchesSearch) return false;
        }
  
        // Only My Pickups filter
        if (onlyMyPickups && !pickup.isMyPickup) {
          return false;
        }
  
        // Only Today Pickups filter
        if (onlyTodayPickups && pickup.dateTime !== todayString) {
          return false;
        }
  
        // Date range filter
        if (!isDateInRange(pickup.dateTime, dateRange)) {
          return false;
        }
  
        return true;
      })
    );
  
    // Creating filter dialog states here for easier management
  
    // Pending (dialog) filter state
  
    let filterUpdate = writable(0);
  
    let filtersDialogOpen = $state(false);
  
    // Carrier filters
    let pFedEx = $state(false);
    let pUSPS = $state(false);
    let pDHL = $state(false);
  
    // Service filters
    let pStandard = $state(false);
    let pExpress = $state(false);
    let pFreight = $state(false);
    let pInternational = $state(false);
  
    // Price filter
    let pMinPrice = $state(0); // always keep min at 0
    let pMaxPrice = $state(1000); // dynamic max value
    let pUseSlider = $state(true); // when true, slider active and number inputs disabled
  
    // Debounce + count
    let pendingCount = $state(0);
  
    $effect(() => {
      // This will re-run whenever any filter state changes
      const carriers = [pFedEx, pUSPS, pDHL];
      const services = [pStandard, pExpress, pFreight, pInternational];
      const prices = [pMinPrice, pMaxPrice];
  
      clearTimeout(pendingDebounce);
      pendingDebounce = setTimeout(() => {
        pendingCount = applyFilterSet().length;
      }, 300);
    });
  
    let pendingDebounce = null;
    // --- Core filter logic
    function applyFilterSet() {
      let data = [...allPickups];
  
      // Carrier filter
      const carriers = [];
      if (pFedEx) carriers.push('FedEx');
      if (pUSPS) carriers.push('USPS');
      if (pDHL) carriers.push('DHL');
      if (carriers.length) {
        data = data.filter(d => carriers.includes(d.carrier));
      }
  
      // Service type filter
      const services = [];
      if (pStandard) services.push('Standard');
      if (pExpress) services.push('Express');
      if (pFreight) services.push('Freight');
      if (pInternational) services.push('International');
      if (services.length) {
        data = data.filter(d => services.includes(d.serviceType));
      }
  
      // Price filter (if applicable)
      data = data.filter(d =>
        d.price ? d.price >= pMinPrice && d.price <= pMaxPrice : true
      );
  
      filterUpdate.update(n => n + 1);
  
      return data;
    }
  
    function applyFilters() {
      const result = applyFilterSet();
      filteredPickups = result;
      pendingCount = result.length;
      filtersDialogOpen = false;
    }
  
    function clearFilters() {
      pFedEx = pUSPS = pDHL = false;
      pStandard = pExpress = pFreight = pInternational = false;
      pMinPrice = 0;
      pMaxPrice = 200;
  
      filteredPickups = allPickups;
      pendingCount = allPickups.length;
    }
  
    function getMockData(pickupId) {
      // Generate consistent mock data based on pickup ID hash
      const hash = pickupId
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
      // Time windows
      const timeWindows = [
        '9:00 AM - 12:00 PM',
        '12:00 PM - 3:00 PM',
        '3:00 PM - 6:00 PM',
        '6:00 PM - 9:00 PM',
      ];
  
      // Package counts
      const packageCounts = [1, 2, 3, 4, 5];
  
      // Weights (in kg)
      const weights = [5, 8, 12, 15, 20, 25, 30];
  
      // Dimensions
      const dimensions = [
        '30 x 20 x 15 cm',
        '40 x 30 x 20 cm',
        '50 x 40 x 30 cm',
        '60 x 50 x 40 cm',
        '45 x 35 x 25 cm',
      ];
  
      // Pickup instructions
      const instructions = [
        'Please ring the doorbell twice. Package is in the front porch.',
        'Leave at the back door. No signature required.',
        'Call recipient before delivery. Package is fragile.',
        'Use side entrance. Gate code: 1234',
        'Handle with care. Package contains electronics.',
      ];
  
      return {
        timeWindow: timeWindows[hash % timeWindows.length],
        packageCount: packageCounts[hash % packageCounts.length],
        weight: weights[hash % weights.length],
        dimensions: dimensions[hash % dimensions.length],
        instruction: instructions[hash % instructions.length],
      };
    }
  
    function formatDateDetailed(dateString) {
      const date = parseDateString(dateString);
      if (!date) return dateString;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  </script>
  
  <main class="bg-bland-650 h-full">
    <Sidebar />
  
    <DashboardHeader />
  
    <section
      class={`${$showDashboardSidebar ? 'lg:w-[calc(100%-256px)]' : 'w-full'}  ms-auto flex-1 p-6 duration-300`}
    >
      <!-- Header banner -->
      <div class="bg-bland-900 rounded-xl p-6 mb-6">
        <div>
          <h3 class="sub-heading !text-bland-25 font-bold !mt-0">
            Schedule a Pickup
          </h3>
  
          <p class="text-bland-25 mt-2">
            Track and manage all your shipments in one place
          </p>
        </div>
      </div>
  
      <div class="p-[24px] border-2 border-bland-200 bg-bland-25 rounded-md">
        <div class="flex flex-col gap-4">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-2"
          >
            <div
              class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-fit"
            >
              <div class="w-full sm:w-auto">
                <Input
                  type="text"
                  icon="iconoir:search"
                  placeholder="Search by tracking number, recipient, or date..."
                  class="w-full sm:w-[324px] text-black h-10 xl:h-12 border border-bland-200 input-text rounded-xl px-3 py-3 xl:py-[11px] text-xs font-normal sm:text-base! data-placeholder:text-bland-75 placeholder:text-sm placeholder:text-bland-200! placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                  bind:value={searchQuery}
                />
              </div>
              <div>
                <Calendar bind:value={dateRange} />
              </div>
            </div>
  
            <div>
              <Dialog.Root bind:open={filtersDialogOpen}>
                <Dialog.Trigger>
                  <Button
                    asChild
                    class="ms-auto me-auto md:me-0 flex items-center font-normal text-xs text-bland-950  shadow-none border-2 border-bland-200 rounded-md py-2 xl:py-2.5 px-3! h-auto cursor-pointer hover:shadow-md flex-wrap gap-2"
                  >
                    <span
                      ><Icon
                        icon="ph:funnel-x-bold"
                        class="mb-0.5 text-bland-300"
                      /></span
                    >
                    Filter
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content
                  class="bg-bland-25 rounded-xl border border-[#D0D5DD]  md:min-w-[672px] min-w-[300px]  overflow-y-auto h-full max-h-[700px] p-0"
                >
                  <Dialog.Title
                    class="text-xl font-semibold text-bland-950 text-start bg-bland-75 h-full w-full p-[24px] border border-bland-550"
                  >
                    Advanced Filters
                  </Dialog.Title>
                  <Dialog.Header class="p-[24px] pt-[8px] pb-[8px]">
                    <Dialog.Description>
                      <div class="flex flex-col gap-[24px]">
                        <!-- Carrier Services -->
                        <div>
                          <p class="text-lg font-medium mb-3">Carrier Services</p>
                          <div class="flex flex-col gap-2">
                            <label class="inline-flex items-center gap-3">
                              <Checkbox bind:checked={pFedEx} />
                              <img
                                src="/assets/images/carrierServices1.png"
                                alt="FedEx"
                              />
                              <span class="text-sm">FedEx</span>
                            </label>
  
                            <label class="inline-flex items-center gap-3">
                              <Checkbox bind:checked={pUSPS} />
                              <img
                                src="/assets/images/carrierServices2.png"
                                alt="USPS"
                              />
                              <span class="text-sm">USPS</span>
                            </label>
  
                            <label class="inline-flex items-center gap-3">
                              <Checkbox bind:checked={pDHL} />
                              <img
                                src="/assets/images/carrierServices3.png"
                                alt="DHL"
                              />
                              <span class="text-sm">DHL Express</span>
                            </label>
                          </div>
                        </div>
  
                        <!-- Service Types -->
                        <div>
                          <p class="text-sm font-medium text-bland-800 mb-3">
                            Service Types
                          </p>
                          <div class="grid grid-cols-2 gap-3">
                            <label
                              class="flex items-center gap-3 border border-[#E5E7EB] rounded-md p-3"
                            >
                              <Checkbox bind:checked={pStandard} />
                              <Icon
                                icon="ph:truck"
                                width="24"
                                height="24"
                                class="text-[#6C6C6C]"
                              />
                              <span>Standard</span>
                            </label>
                            <label
                              class="flex items-center gap-3 border border-[#E5E7EB] rounded-md p-3"
                            >
                              <Checkbox bind:checked={pExpress} />
                              <Icon
                                icon="ph:truck"
                                width="24"
                                height="24"
                                class="text-[#6C6C6C]"
                              />
                              <span>Express</span>
                            </label>
                            <label
                              class="flex items-center gap-3 border border-[#E5E7EB] rounded-md p-3"
                            >
                              <Checkbox bind:checked={pFreight} />
                              <Icon
                                icon="ph:train-regional-duotone"
                                width="24"
                                height="24"
                                class="text-[#6C6C6C]"
                              />
                              <span>Freight</span>
                            </label>
                            <label
                              class="flex items-center gap-3 border border-[#E5E7EB] rounded-md p-3"
                            >
                              <Checkbox bind:checked={pInternational} />
                              <Icon
                                icon="zondicons:network"
                                width="20"
                                height="20"
                                class="text-[#6C6C6C]"
                              />
                              <span>International</span>
                            </label>
                          </div>
                        </div>
  
                        <!-- Price Range -->
                        <div>
                          <p class="text-sm font-medium text-bland-800 mb-3">
                            Price Range
                          </p>
                          <div class="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <Label class="text-xs text-bland-500 block mb-1"
                                >Min Price</Label
                              >
                              <Input
                                type="number"
                                min="0"
                                bind:value={pMinPrice}
                                oninput={e => {
                                  pUseSlider = false;
                                  pMinPrice = Math.max(
                                    0,
                                    Number(e.target.value) || 0
                                  );
                                  clearTimeout(pendingDebounce);
                                  pendingDebounce = setTimeout(() => {
                                    try {
                                      pendingCount = applyFilterSet({
                                        usePending: true,
                                      }).length;
                                    } catch (e) {
                                      pendingCount = allPickups.length;
                                    }
                                  }, 300);
                                }}
                                class="border-bland-200 input-text rounded-md px-3 py-3 xl:py-[11px] text-xs font-normal sm:text-base! data-placeholder:text-bland-75 placeholder:text-sm placeholder:text-bland-300! placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 text-bland-400! h-10"
                              />
                            </div>
                            <div>
                              <Label class="text-xs text-bland-500 block mb-1"
                                >Max Price</Label
                              >
                              <Input
                                type="number"
                                min="0"
                                bind:value={pMaxPrice}
                                oninput={e => {
                                  pUseSlider = false;
                                  pMaxPrice = Math.max(
                                    0,
                                    Number(e.target.value) || 0
                                  );
                                  clearTimeout(pendingDebounce);
                                  pendingDebounce = setTimeout(() => {
                                    try {
                                      pendingCount = applyFilterSet({
                                        usePending: true,
                                      }).length;
                                    } catch (e) {
                                      pendingCount = allPickups.length;
                                    }
                                  }, 300);
                                }}
                                class="border-bland-200 input-text rounded-md px-3 py-3 xl:py-[11px] text-xs font-normal sm:text-base! data-placeholder:text-bland-75 placeholder:text-sm placeholder:text-bland-300! placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 text-bland-400! h-10"
                              />
                            </div>
                          </div>
  
                          <div class="flex flex-col">
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              step="10"
                              bind:value={pMaxPrice}
                              class="w-full accent-blueshade-500"
                              oninput={e => {
                                pUseSlider = true;
                                pMaxPrice = Math.max(
                                  0,
                                  Number(e.target.value) || 0
                                );
                              }}
                              disabled={!pUseSlider}
                            />
                            <div
                              class="flex justify-between text-xs text-bland-400! mt-1"
                            >
                              <span>$0</span>
                              <span>$1000</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Dialog.Description>
                  </Dialog.Header>
  
                  <Dialog.Footer
                    class="flex flex-row justify-between! items-center  bg-bland-75 h-full w-full p-[24px] pt-[16px] border border-bland-550"
                  >
                    <Button
                      variant="ghost"
                      class="text-bland-600 hover:text-bland-800 transition-colors p-0 cursor-pointer"
                      onclick={() => {
                        clearFilters();
                        // Update the table immediately after clearing
                        filterUpdate.update(n => n + 1);
                      }}>Clear Filters</Button
                    >
                    <Button
                      onclick={applyFilters}
                      class="bg-primary-400 text-white hover:bg-orange-400 transition-colors py-2! px-3! text-sm font-medium rounded-md"
                      >Show {pendingCount}
                      {pendingCount === 1 ? 'Result' : 'Results'}</Button
                    >
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Root>
            </div>
          </div>
  
          <div class="flex justify-start items-center flex-wrap gap-y-5 gap-x-10">
            <div class="flex items-center space-x-2">
              <Checkbox id="only-my-pickups" bind:checked={onlyMyPickups} />
              <Label
                for="only-my-pickups"
                class="text-xs md:text-sm text-bland-400">Only My Pickups</Label
              >
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox id="only-today-pickups" bind:checked={onlyTodayPickups} />
              <Label
                for="only-today-pickups"
                class="text-xs md:text-sm text-bland-400"
                >Only Today Pickups</Label
              >
            </div>
          </div>
        </div>
      </div>
  
      <div
        class="mt-4 rounded-xl bg-bland-25 border border-bland-200 mb-6 overflow-hidden"
      >
        <Table.Root class="w-full h-full">
          <Table.Header class="bg-bland-900 text-bland-25 h-full w-full">
            <Table.Row class="w-full">
              <Table.Head class="px-6 py-4">Pickup ID</Table.Head>
              <Table.Head class="px-6 py-4">Date & Time</Table.Head>
              <Table.Head class="px-6 py-4">Carrier</Table.Head>
              <Table.Head class="px-6 py-4">Address</Table.Head>
              <Table.Head class="px-6 py-4">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#if filteredPickups.length === 0}
              <Table.Row>
                <Table.Cell
                  colspan="5"
                  class="px-6 py-8 text-center text-sm text-bland-400"
                >
                  No pickups found matching your filters.
                </Table.Cell>
              </Table.Row>
            {:else}
              {#each filteredPickups as pickup (pickup.id)}
                <Table.Row class="border-b border-bland-200">
                  <Table.Cell class="px-6 py-4 text-sm font-medium"
                    >{pickup.id}</Table.Cell
                  >
                  <Table.Cell class="px-6 py-4 text-sm font-normal text-bland-600"
                    >{pickup.dateTime}</Table.Cell
                  >
                  <Table.Cell class="px-6 py-4"
                    ><div class="flex items-center gap-3">
                      <img
                        src="/assets/images/carrierServices1.png"
                        alt={pickup.carrier}
                        class="w-8 h-8"
                      />
                      <span class="font-medium text-base">{pickup.carrier}</span>
                    </div></Table.Cell
                  >
                  <Table.Cell class="px-6 py-4 text-sm font-normal text-bland-600"
                    >{pickup.address}</Table.Cell
                  >
                  <Table.Cell class="flex items-center gap-6 px-6 py-4">
                    <Dialog.Root>
                      <Dialog.Trigger
                        class="underline text-sm font-normal text-bland-700 cursor-pointer"
                      >
                        View Details
                      </Dialog.Trigger>
                      <Dialog.Content
                        class="bg-bland-25 rounded-xl border border-bland-200 sm:min-w-[672px] min-w-[300px] overflow-y-auto h-[610px] sm:h-fit p-0 !flex flex-col gap-0"
                      >
                        <Dialog.Title
                          class="text-xl font-semibold text-bland-950 text-start bg-bland-75 h-fit w-full py-2.5 px-6 border border-bland-550"
                        >
                          Pickup Details - {pickup.id}
                          <div
                            class={`flex gap-1 px-2 py-1 text-white text-xs font-medium w-fit rounded-sm items-center mt-2 ${
                              pickup.status === 'Complete'
                                ? 'bg-green-300'
                                : 'bg-redish-400'
                            }`}
                          >
                            {pickup.status}
                          </div>
                        </Dialog.Title>
                        <Dialog.Header class="p-[24px] pt-[8px] pb-[8px]">
                          <Dialog.Description
                            class="flex flex-col justify-between gap-[24px]"
                          >
                            {@const mockData = getMockData(pickup.id)}
                            <div
                              class="flex flex-col gap-1 rounded-xl border border-bland-200 p-4 sm:p-6"
                            >
                              <!-- Carrier Services -->
                              <div>
                                <p class="font-semibold my-4">Pickup Details</p>
                                <div
                                  class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start"
                                >
                                  <div>
                                    <p class="text-sm">Address</p>
                                    <p class="text-xs text-bland-400">
                                      {pickup.address}
                                    </p>
                                  </div>
                                  <!-- {#if pickup.recipient}
                                <div>
                                  <p class="text-sm">Recipient</p>
                                  <p class="text-xs text-bland-400">
                                    {pickup.recipient}
                                  </p>
                                </div>
                              {/if} -->
                                </div>
                                <div
                                  class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start my-4"
                                >
                                  <div>
                                    <p class="text-sm">Date</p>
                                    <p class="text-xs text-bland-400">
                                      {formatDateDetailed(pickup.dateTime)}
                                    </p>
                                  </div>
                                  <div>
                                    <p class="text-sm">Time Window</p>
                                    <p class="text-xs text-bland-400">
                                      {mockData.timeWindow}
                                    </p>
                                  </div>
                                </div>
                              </div>
  
                              <div>
                                <p class="font-semibold my-4">Package Details</p>
  
                                <div
                                  class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-start my-4"
                                >
                                  <div>
                                    <p class="text-sm">Package Count</p>
                                    <p class="text-xs text-bland-400">
                                      {mockData.packageCount} package{mockData.packageCount >
                                      1
                                        ? 's'
                                        : ''}
                                    </p>
                                  </div>
                                  <div>
                                    <p class="text-sm">Total Weight</p>
                                    <p class="text-xs text-bland-400">
                                      {mockData.weight} Kg
                                    </p>
                                  </div>
                                  <div>
                                    <p class="text-sm">Dimensions</p>
                                    <p class="text-xs text-bland-400">
                                      {mockData.dimensions}
                                    </p>
                                  </div>
                                </div>
                              </div>
  
                              <div>
                                <p class="font-semibold my-4">
                                  Carrier & Service
                                </p>
  
                                <div
                                  class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start my-4"
                                >
                                  <div>
                                    <p class="text-sm">Carrier</p>
                                    <div class="flex items-center gap-2 mt-1">
                                      <img
                                        src="/assets/images/carrierServices1.png"
                                        alt={pickup.carrier}
                                        class="w-6 h-6"
                                      />
                                      <p class="text-xs text-bland-400">
                                        {pickup.carrier}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p class="text-sm">Pickup Instruction</p>
                                    <p class="text-xs text-bland-400">
                                      {mockData.instruction}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Dialog.Description>
                        </Dialog.Header>
  
                        <Dialog.Footer
                          class="flex flex-row justify-end items-end bg-bland-75 h-full w-full p-[24px] pt-[16px] border border-bland-550"
                        >
                          <Button class="common-button">
                            <Icon icon="ph:headset" width="20" height="20" />
                            Contact Support</Button
                          >
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Root>
                    <button
                      onclick={() => goto('/pickups/schedule-new-pickup')}
                      class="underline text-sm font-normal text-bland-700 cursor-pointer bg-transparent border-none"
                      >Reschedule</button
                    >
                  </Table.Cell>
                </Table.Row>
              {/each}
            {/if}
          </Table.Body>
        </Table.Root>
  
        <div class="flex justify-end w-full">
          <Button
            onclick={() => {
              goto('/pickups/schedule-new-pickup');
            }}
            class="my-4 me-4 common-button"
          >
            Schedule New Pickup</Button
          >
        </div>
      </div>
    </section>
  </main>
  