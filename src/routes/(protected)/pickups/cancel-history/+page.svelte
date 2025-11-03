<script lang="ts">
    import { writable, derived } from 'svelte/store';
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
    import * as Tabs from '$lib/components/ui/tabs';
    import Alltabssection from '$lib/components/Alltabssection.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import * as Table from '$lib/components/ui/table';
    import * as Dialog from '$lib/components/ui/dialog';
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectGroup,
      SelectLabel,
    } from '$lib/components/ui/select';
    import Calendar from '$lib/components/Calendar.svelte';
    import type { DateRange } from 'bits-ui';
    import { getLocalTimeZone } from '@internationalized/date';
    import DashboardHeader from '$lib/components/DashboardHeader.svelte';
    import { getCancelHistoryPickups } from '$lib/services/cancelHistoryPickups.service';
  
    interface PickupData {
      id: string;
      dateTime: string;
      status: 'Complete' | 'Cancelled';
      carrier: string;
      carrierImg: string;
      address: string;
      recipient?: string;
      isMyPickup?: boolean;
      price?: number;
      serviceType?: string;
    }
    
    let allPickups: PickupData[] = $state([]);
    let loading = $state(false);
  
    // Load pickups on component mount
    async function loadPickups() {
      loading = true;
      try {
        const response = await getCancelHistoryPickups();
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
  
  
    let searchQuery = $state('');
    let dateRange: DateRange | undefined = $state(undefined);
    let onlyMyPickups = $state(false);
    let onlyTodayPickups = $state(false);
  
    let filtersDialogOpen = $state(false);
  
    let pFedEx = $state(false);
    let pUSPS = $state(false);
    let pDHL = $state(false);
    let pStandard = $state(false);
    let pExpress = $state(false);
    let pFreight = $state(false);
    let pInternational = $state(false);
    let pMinPrice = $state(0);
    let pMaxPrice = $state(1000);
    let pUseSlider = $state(true);
  
    let filterFedEx = $state(false);
    let filterUSPS = $state(false);
    let filterDHL = $state(false);
    let filterStandard = $state(false);
    let filterExpress = $state(false);
    let filterFreight = $state(false);
    let filterInternational = $state(false);
    let filterMinPrice = $state(0);
    let filterMaxPrice = $state(1000);
  
    const itemsPerPage = 5;
    let currentPage = $state(1);
  
    const today = new Date();
    const todayString = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  
    function parseDateString(dateString: string): Date | null {
      try {
        const parsed = new Date(dateString);
        if (isNaN(parsed.getTime())) {
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
  
    function formatDate(dateString: string): string {
      const date = parseDateString(dateString);
      if (!date) return dateString;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  
    function formatDateDetailed(dateString: string): string {
      const date = parseDateString(dateString);
      if (!date) return dateString;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  
    function getMockData(pickupId: string) {
      const hash = pickupId
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
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
  
    function isDateInRange(
      dateString: string,
      range: DateRange | undefined
    ): boolean {
      if (!range || !range.start) return true;
  
      try {
        const pickupDate = parseDateString(dateString);
        if (!pickupDate) return true;
  
        const startDate = range.start.toDate(getLocalTimeZone());
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
  
        if (!range.end) {
          return pickupDateOnly.getTime() === startDateOnly.getTime();
        }
  
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
  
    // Calculate filtered pickups
    let filteredPickups = $derived(
      allPickups.filter(pickup => {
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
        if (onlyTodayPickups) {
          const pickupDate = formatDate(pickup.dateTime);
          if (pickupDate !== todayString) {
            return false;
          }
        }
  
        // Date range filter
        if (!isDateInRange(pickup.dateTime, dateRange)) {
          return false;
        }
  
        // Carrier filter - only apply if at least one carrier is selected
        const carrierSelected = filterFedEx || filterUSPS || filterDHL;
        if (carrierSelected) {
          const carrier = pickup.carrier.toLowerCase();
          const matchesCarrier =
            (filterFedEx && carrier.includes('fedex')) ||
            (filterUSPS && carrier.includes('usps')) ||
            (filterDHL && carrier.includes('dhl'));
          if (!matchesCarrier) return false;
        }
  
        // Service type filter - only apply if at least one service is selected
        const serviceSelected =
          filterStandard || filterExpress || filterFreight || filterInternational;
        if (serviceSelected && pickup.serviceType) {
          const service = pickup.serviceType.toLowerCase();
          const matchesService =
            (filterStandard && service.includes('standard')) ||
            (filterExpress && service.includes('express')) ||
            (filterFreight && service.includes('freight')) ||
            (filterInternational && service.includes('international'));
          if (!matchesService) return false;
        }
  
        // Price filter
        if (pickup.price !== undefined) {
          if (pickup.price < filterMinPrice || pickup.price > filterMaxPrice) {
            return false;
          }
        }
  
        return true;
      })
    );
  
    // Calculate pending count (for modal button)
    let pendingCount = $derived.by(() => {
      if (!filtersDialogOpen) return filteredPickups.length;
  
      // Calculate with pending filters
      return allPickups.filter(pickup => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch =
            pickup.id.toLowerCase().includes(query) ||
            pickup.address.toLowerCase().includes(query) ||
            pickup.dateTime.toLowerCase().includes(query) ||
            (pickup.recipient && pickup.recipient.toLowerCase().includes(query));
          if (!matchesSearch) return false;
        }
  
        if (onlyMyPickups && !pickup.isMyPickup) return false;
        if (onlyTodayPickups) {
          const pickupDate = formatDate(pickup.dateTime);
          if (pickupDate !== todayString) return false;
        }
  
        if (!isDateInRange(pickup.dateTime, dateRange)) return false;
  
        // Use pending filters
        const carrierSelected = pFedEx || pUSPS || pDHL;
        if (carrierSelected) {
          const carrier = pickup.carrier.toLowerCase();
          const matchesCarrier =
            (pFedEx && carrier.includes('fedex')) ||
            (pUSPS && carrier.includes('usps')) ||
            (pDHL && carrier.includes('dhl'));
          if (!matchesCarrier) return false;
        }
  
        const serviceSelected =
          pStandard || pExpress || pFreight || pInternational;
        if (serviceSelected && pickup.serviceType) {
          const service = pickup.serviceType.toLowerCase();
          const matchesService =
            (pStandard && service.includes('standard')) ||
            (pExpress && service.includes('express')) ||
            (pFreight && service.includes('freight')) ||
            (pInternational && service.includes('international'));
          if (!matchesService) return false;
        }
  
        if (pickup.price !== undefined) {
          if (pickup.price < pMinPrice || pickup.price > pMaxPrice) return false;
        }
  
        return true;
      }).length;
    });
  
    // Paginated results
    let paginatedPickups = $derived.by(() => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredPickups.slice(start, end);
    });
  
    // Total pages
    let totalPages = $derived(Math.ceil(filteredPickups.length / itemsPerPage));
  
    // Generate page numbers for pagination
    let paginationPages = $derived.by(() => {
      const total = totalPages || 0;
      const current = currentPage || 1;
      const pages: (number | string)[] = [];
      const groupSize = 3;
  
      if (total <= groupSize) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }
  
      const currentBlock = Math.ceil(current / groupSize);
      const start = (currentBlock - 1) * groupSize + 1;
      const end = Math.min(start + groupSize - 1, total);
  
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
  
      for (let i = start; i <= end; i++) pages.push(i);
  
      if (end < total) {
        if (end < total - 1) pages.push('...');
        pages.push(total);
      }
  
      return pages;
    });
  
    // Ensure currentPage is within valid bounds
    $effect(() => {
      if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
      }
      if (currentPage < 1) {
        currentPage = 1;
      }
    });
  
    // Functions
    function applyFilters() {
      filterFedEx = pFedEx;
      filterUSPS = pUSPS;
      filterDHL = pDHL;
      filterStandard = pStandard;
      filterExpress = pExpress;
      filterFreight = pFreight;
      filterInternational = pInternational;
      filterMinPrice = Math.max(0, Number(pMinPrice) || 0);
      filterMaxPrice = Math.max(0, Number(pMaxPrice) || 0);
  
      currentPage = 1;
  
      filtersDialogOpen = false;
    }
  
    function clearFilters() {
      pFedEx = pUSPS = pDHL = false;
      pStandard = pExpress = pFreight = pInternational = false;
      pMinPrice = 0;
      pMaxPrice = 1000;
      pUseSlider = true;
  
      // Reset active
      filterFedEx = filterUSPS = filterDHL = false;
      filterStandard =
        filterExpress =
        filterFreight =
        filterInternational =
          false;
      filterMinPrice = 0;
      filterMaxPrice = 1000;
  
      currentPage = 1;
    }
  
    function goToPage(page: number) {
      const p = Number(page) || 1;
      currentPage = Math.max(1, Math.min(p, totalPages));
    }
  
    function nextPage() {
      currentPage = Math.min(currentPage + 1, totalPages);
    }
  
    function prevPage() {
      currentPage = Math.max(currentPage - 1, 1);
    }
  
    // Track previous filter states to reset page only when they change
    let prevSearchQuery = $state('');
    let prevDateRange = $state<DateRange | undefined>(undefined);
    let prevOnlyMyPickups = $state(false);
    let prevOnlyTodayPickups = $state(false);
    let prevFilterFedEx = $state(false);
    let prevFilterUSPS = $state(false);
    let prevFilterDHL = $state(false);
    let prevFilterStandard = $state(false);
    let prevFilterExpress = $state(false);
    let prevFilterFreight = $state(false);
    let prevFilterInternational = $state(false);
  
    $effect(() => {
      // Check if any filter changed
      if (
        searchQuery !== prevSearchQuery ||
        dateRange !== prevDateRange ||
        onlyMyPickups !== prevOnlyMyPickups ||
        onlyTodayPickups !== prevOnlyTodayPickups ||
        filterFedEx !== prevFilterFedEx ||
        filterUSPS !== prevFilterUSPS ||
        filterDHL !== prevFilterDHL ||
        filterStandard !== prevFilterStandard ||
        filterExpress !== prevFilterExpress ||
        filterFreight !== prevFilterFreight ||
        filterInternational !== prevFilterInternational
      ) {
        currentPage = 1;
      }
  
      // Update previous values
      prevSearchQuery = searchQuery;
      prevDateRange = dateRange;
      prevOnlyMyPickups = onlyMyPickups;
      prevOnlyTodayPickups = onlyTodayPickups;
      prevFilterFedEx = filterFedEx;
      prevFilterUSPS = filterUSPS;
      prevFilterDHL = filterDHL;
      prevFilterStandard = filterStandard;
      prevFilterExpress = filterExpress;
      prevFilterFreight = filterFreight;
      prevFilterInternational = filterInternational;
    });
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
            Cancel / History
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
                  class="w-full sm:w-[324px] input-field"
                  bind:value={searchQuery}
                />
              </div>
              <div>
                <Calendar bind:value={dateRange} />
              </div>
            </div>
            <div class="flex gap-3">
              <div>
                <Dialog.Root bind:open={filtersDialogOpen}>
                  <Dialog.Trigger>
                    <Button
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
                            <p class="text-lg font-medium mb-3">
                              Carrier Services
                            </p>
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
                                  alt="DHL Express"
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
                                  placeholder="$ 0"
                                  class="border-bland-200 input-text rounded-md px-3 py-3 xl:py-[11px] text-xs font-normal sm:text-base! data-placeholder:text-bland-75 placeholder:text-sm placeholder:text-bland-300! placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 text-bland-400! h-10"
                                  bind:value={pMinPrice}
                                  disabled={pUseSlider}
                                />
                              </div>
                              <div>
                                <Label class="text-xs text-bland-500 block mb-1"
                                  >Max Price</Label
                                >
                                <Input
                                  type="number"
                                  placeholder="$ 0"
                                  class="border-bland-200 input-text rounded-md px-3 py-3 xl:py-[11px] text-xs font-normal sm:text-base! data-placeholder:text-bland-75 placeholder:text-sm placeholder:text-bland-300! placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 text-bland-400! h-10"
                                  bind:value={pMaxPrice}
                                  disabled={pUseSlider}
                                />
                              </div>
                            </div>
  
                            <div class="flex flex-col">
                              <input
                                type="range"
                                min="0"
                                max="1000"
                                bind:value={pMaxPrice}
                                class="w-full accent-blueshade-500"
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
                        class="text-bland-600  hover:text-bland-800 transition-colors p-0 cursor-pointer"
                        onclick={clearFilters}>Clear Filters</Button
                      >
                      <Button class="common-button" onclick={applyFilters}
                        >Show {pendingCount} Results</Button
                      >
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
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
        class="mt-4 rounded-xl overflow-hidden bg-bland-25 border border-bland-200 mb-6"
      >
        <Table.Root class="w-full h-full">
          <Table.Header class="bg-bland-900 text-bland-25 h-full w-full">
            <Table.Row class="w-full">
              <Table.Head class="px-6 py-4">Pickup ID</Table.Head>
              <Table.Head class="px-6 py-4">Date & Time</Table.Head>
              <Table.Head class="px-6 py-4">Status</Table.Head>
              <Table.Head class="px-6 py-4">Carrier</Table.Head>
              <Table.Head class="px-6 py-4">Address</Table.Head>
              <Table.Head class="px-6 py-4">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#if paginatedPickups.length === 0}
              <Table.Row>
                <Table.Cell
                  colspan="6"
                  class="px-6 py-8 text-center text-sm text-bland-400"
                >
                  No pickups found matching your filters.
                </Table.Cell>
              </Table.Row>
            {:else}
              {#each paginatedPickups as pickup (pickup.id)}
                <Table.Row class="border-b border-bland-200">
                  <Table.Cell class="px-6 py-4 text-sm font-medium"
                    >{pickup.id}</Table.Cell
                  >
                  <Table.Cell class="px-6 py-4 text-sm font-normal text-bland-600"
                    >{formatDate(pickup.dateTime)}</Table.Cell
                  >
                  <Table.Cell class="px-6 py-4">
                    <div
                      class={`flex gap-1 px-2 py-1 text-white text-xs font-medium w-fit rounded-sm items-center mt-2 ${
                        pickup.status === 'Complete'
                          ? 'bg-green-300'
                          : 'bg-redish-400'
                      }`}
                    >
                      {pickup.status}
                    </div>
                  </Table.Cell>
  
                  <Table.Cell class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        src={pickup.carrierImg}
                        alt={pickup.carrier}
                        class="w-8 h-8"
                      />
                      <span class="font-medium text-base">{pickup.carrier}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell class="px-6 py-4 text-sm font-normal text-bland-600"
                    >{pickup.address}</Table.Cell
                  >
  
                  <Table.Cell class="px-6 py-4">
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
                                        src={pickup.carrierImg}
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
                  </Table.Cell>
                </Table.Row>
              {/each}
            {/if}
          </Table.Body>
  
          <Table.Footer>
            <Table.Row class="border-t border-bland-200">
              <Table.Cell colspan="6"></Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
        <div class="p-6">
          <div
            aria-label="Pagination"
            class="flex justify-end items-center gap-2"
          >
            <!-- Previous Button -->
            <button
              type="button"
              aria-label="Previous"
              class="p-2 rounded-md bg-bland-25 border border-bland-200 hover:bg-bland-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onclick={prevPage}
              disabled={currentPage === 1}
            >
              <Icon icon="uil:angle-left" class="w-4 h-4" />
            </button>
  
            <!-- Dynamic Page Numbers -->
            {#each paginationPages as page, idx (idx)}
              {#if page === '...'}
                <span class="px-2 text-bland-400">…</span>
              {:else}
                <button
                  type="button"
                  aria-current={currentPage === page ? 'page' : undefined}
                  class="px-3 py-1 rounded-md border {currentPage === page
                    ? 'border-primary-400 text-bland-25 bg-primary-400 font-medium'
                    : 'bg-bland-25 border-bland-200 text-bland-700 hover:bg-bland-200'}"
                  onclick={() => goToPage(page as number)}
                >
                  {page}
                </button>
              {/if}
            {/each}
  
            <!-- Next Button -->
            <button
              type="button"
              aria-label="Next"
              class="p-2 rounded-md bg-bland-25 border border-bland-200 hover:bg-bland-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onclick={nextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <Icon icon="uil:angle-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
  