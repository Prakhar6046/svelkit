<script>
  // @ts-nocheck
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
  import { getLocalTimeZone } from '@internationalized/date';
  import Calendar from '$lib/components/Calendar.svelte';

  import { DatePicker } from '@svelte-plugins/datepicker';
  import { format } from 'date-fns';
  import DashboardHeader from '$lib/components/DashboardHeader.svelte';
  import { getShipments } from '$lib/services/shipments.service';

  let startDate = $state(new Date());
  let dateFormat = 'MM/dd/yy';
  let isOpen = false;

  const toggleDatePicker = () => (isOpen = !isOpen);

  let selectedRange = writable(undefined);

  const formatDate = dateString => {
    if (isNaN(new Date(dateString))) {
      return '';
    }

    return (dateString && format(new Date(dateString), dateFormat)) || '';
  };

  let formattedStartDate = $derived(formatDate(startDate));

  const onChange = () => {
    startDate = new Date(formattedStartDate);
  };

  // ==================== DATA ARRAY ====================
  // This is where all shipment data is maintained
  let shipmentsData = $state([]);
  let loading = $state(false);

  // Load shipments on component mount
  async function loadShipments() {
    loading = true;
    try {
      const response = await getShipments();
      if (response.success) {
        shipmentsData = response.data.shipments;
      }
    } catch (error) {
      console.error('Failed to load shipments:', error);
    } finally {
      loading = false;
    }
  }

  // Load data when component mounts
  $effect(() => {
    loadShipments();
  });

  // ==================== STORES (STATE MANAGEMENT) ====================
  // Svelte stores are like React useState - they hold reactive state
  let activeTab = writable('All'); // Current active tab
  let searchQuery = writable(''); // Search input value
  let currentPage = writable(1); // Current page number
  // Selected date range from calendar (object with { from, to } in 'YYYY-MM-DD' or null)
  let selectedShipment = writable(null); // Currently selected shipment for modal
  let debounceTimer; // Timer for search debouncing

  // Pending (dialog) filter state

  let filtersDialogOpen = $state(false);
  let pFedEx = $state(false);
  let pUSPS = $state(false);
  let pDHL = $state(false);
  let pStandard = $state(false);
  let pExpress = $state(false);
  let pFreight = $state(false);
  let pInternational = $state(false);
  let pMinPrice = $state(0); // always keep min at 0
  let pMaxPrice = $state(1000); // dynamic max value
  let pUseSlider = $state(true); // when true, slider active and number inputs disabled
  let pendingCount = $state(0);
  let pendingDebounce = null;

  // Update pending count when shipmentsData changes
  $effect(() => {
    pendingCount = shipmentsData.length;
  });

  // Function to update pending count with debouncing
  $effect(() => {
    if (filtersDialogOpen) {
      clearTimeout(pendingDebounce);
      pendingDebounce = setTimeout(() => {
        try {
          pendingCount = applyFilterSet({
            usePending: true,
            tab: $activeTab,
            query: $searchQuery,
            date: $selectedRange,
          }).length;
        } catch (e) {
          pendingCount = shipmentsData.length;
        }
      }, 300);
    }
  });

  // Active (applied) filters used for actual table filtering
  let filterFedEx = false;
  let filterUSPS = false;
  let filterDHL = false;
  let filterStandard = false;
  let filterExpress = false;
  let filterFreight = false;
  let filterInternational = false;
  let filterMinPrice = 0;
  let filterMaxPrice = 1000;

  const itemsPerPage = 5; // Number of items per page

  // ==================== STATUS CONFIGURATION ====================
  // Maps status to their visual styles (like a config object)
  const statusConfig = {
    Delivered: {
      bg: 'bg-green-150',
      text: 'text-green-400',
      icon: 'material-symbols:check-rounded',
    },
    Created: {
      bg: 'bg-bland-150',
      text: 'text-bland-950',
      icon: 'material-symbols-light:add-rounded',
    },
    'In Transit': {
      bg: 'bg-blueshade-200',
      text: 'text-blueshade-600',
      icon: 'wpf:in-transit',
    },
    Exception: {
      bg: 'bg-redish-200',
      text: 'text-redish-300',
      icon: 'fluent:warning-16-regular',
    },
  };

  // ==================== TAB CONFIGURATION ====================
  // Defines all tabs with their properties
  const tabs = [
    { value: 'All', label: 'All', spanClass: 'bg-bland-25 text-primary-400' },
    {
      value: 'Created',
      label: 'Created',
      spanClass: 'bg-bland-650 text-bland-950',
    },
    {
      value: 'In Transit',
      label: 'In Transit',
      spanClass: 'bg-blueshade-200 text-blueshade-600',
    },
    {
      value: 'Exception',
      label: 'Exception',
      spanClass: 'bg-[#FEE2E2] text-primary-950',
    },
    {
      value: 'Delivered',
      label: 'Delivered',
      spanClass: 'bg-green-150 text-green-400',
    },
  ];

  // ==================== DERIVED STORES (COMPUTED STATE) ====================
  // Like React useMemo - automatically recomputes when dependencies change

  // (tabCounts will be defined after filteredShipments so it can reference the derived value)

  // helper to convert shippingCost like "$15.00" to number
  function priceOf(shipment) {
    try {
      return (
        Number(String(shipment.shippingCost).replace(/[^0-9.-]+/g, '')) || 0
      );
    } catch (e) {
      return 0;
    }
  }

  // Helper that applies either active or pending filters
  function applyFilterSet({ usePending = false, tab, query, date, data = shipmentsData } = {}) {
    // Determine which set of filters to use (pending or active)
    const use = usePending
      ? {
          fedex: pFedEx,
          usps: pUSPS,
          dhl: pDHL,
          standard: pStandard,
          express: pExpress,
          freight: pFreight,
          international: pInternational,
          min: pMinPrice,
          max: pMaxPrice,
        }
      : {
          fedex: filterFedEx,
          usps: filterUSPS,
          dhl: filterDHL,
          standard: filterStandard,
          express: filterExpress,
          freight: filterFreight,
          international: filterInternational,
          min: filterMinPrice,
          max: filterMaxPrice,
        };

    let filtered = data.slice();

    // Tab filter
    if (tab && tab !== 'All') {
      filtered = filtered.filter(shipment => shipment.status === tab);
    }

    // Search query
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.trackingId.toLowerCase().includes(q) ||
          s.recipient.toLowerCase().includes(q) ||
          s.date.includes(q)
      );
    }

    // Date filter
    if (date && typeof date === 'object' && (date.start || date.end)) {
      const fromDate = date.start
        ? date.start.toDate(getLocalTimeZone())
        : null;
      const toDate = date.end ? date.end.toDate(getLocalTimeZone()) : null;

      filtered = filtered.filter(s => {
        const shipmentDate = new Date(s.date);
        if (isNaN(shipmentDate.getTime())) return false;

        if (fromDate && shipmentDate < fromDate) return false;
        if (toDate && shipmentDate > toDate) return false;

        return true;
      });
    }

    // Carrier filters (if any carrier checkbox is selected, include only those)
    const carrierSelected = use.fedex || use.usps || use.dhl;
    if (carrierSelected) {
      filtered = filtered.filter(s => {
        const carrier = String(s.carrier).toLowerCase();
        if (use.fedex && carrier.includes('fedex')) return true;
        if (use.usps && carrier.includes('usps')) return true;
        if (use.dhl && carrier.includes('dhl')) return true;
        return false;
      });
    }

    // Service type filters
    const serviceSelected =
      use.standard || use.express || use.freight || use.international;
    if (serviceSelected) {
      filtered = filtered.filter(s => {
        const serv = String(s.service).toLowerCase();
        if (use.standard && serv.includes('standard')) return true;
        if (use.express && serv.includes('express')) return true;
        if (use.freight && serv.includes('freight')) return true;
        if (use.international && serv.includes('international')) return true;
        return false;
      });
    }

    // Price filter (inclusive)
    filtered = filtered.filter(s => {
      const p = priceOf(s);
      return p >= Number(use.min || 0) && p <= Number(use.max || 0);
    });

    return filtered;
  }

  // Store to trigger updates to filtered shipments
  let filterUpdate = writable(0);

  // Create a store for shipmentsData so derived stores can react to it
  let shipmentsDataStore = writable([]);

  // Sync shipmentsData $state with shipmentsDataStore
  $effect(() => {
    shipmentsDataStore.set(shipmentsData);
  });

  // Derived filtered shipments now includes applied/active filters
  const filteredShipments = derived(
    [activeTab, searchQuery, selectedRange, filterUpdate, shipmentsDataStore],
    ([$activeTab, $searchQuery, $selectedRange, , $shipmentsDataStore]) => {
      // Use the store data instead of the $state variable
      return applyFilterSet({
        usePending: false,
        tab: $activeTab,
        query: $searchQuery,
        date: $selectedRange,
        data: $shipmentsDataStore,
      });
    }
  );

  // =/============================================================

  function isDateInRange(dateString, range) {
    if (!range || !range.from) return true;

    try {
      const shipmentDate = new Date(dateString);
      if (isNaN(shipmentDate)) return true;

      const start = new Date(range.from);
      const startOnly = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );
      const shipmentOnly = new Date(
        shipmentDate.getFullYear(),
        shipmentDate.getMonth(),
        shipmentDate.getDate()
      );

      if (!range.to) {
        return shipmentOnly.getTime() === startOnly.getTime();
      }

      const end = new Date(range.to);
      const endOnly = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      );

      return shipmentOnly >= startOnly && shipmentOnly <= endOnly;
    } catch {
      return true;
    }
  }

  export const tabCounts = writable({
    All: 0,
    Created: 0,
    'In Transit': 0,
    Exception: 0,
    Delivered: 0,
  });

  function updateTabCounts(filteredShipments) {
    tabCounts.set({
      All: filteredShipments.length,
      Created: filteredShipments.filter(s => s.status === 'Created').length,
      'In Transit': filteredShipments.filter(s => s.status === 'In Transit')
        .length,
      Exception: filteredShipments.filter(s => s.status === 'Exception').length,
      Delivered: filteredShipments.filter(s => s.status === 'Delivered').length,
    });
  }

  // Debounced pending-count calculation (shows how many results pending filters would return)
  $effect(() => {
    if (
      $activeTab ||
      $searchQuery ||
      $selectedRange ||
      pFedEx ||
      pUSPS ||
      pDHL ||
      pStandard ||
      pExpress ||
      pFreight ||
      pInternational ||
      pMinPrice ||
      pMaxPrice
    ) {
      clearTimeout(pendingDebounce);
      pendingDebounce = setTimeout(() => {
        try {
          pendingCount = applyFilterSet({
            usePending: true,
            tab: $activeTab,
            query: $searchQuery,
            date: $selectedRange,
          }).length;
        } catch (e) {
          pendingCount = shipmentsData.length;
        }
      }, 600);
    }
  });

  function applyFilters() {
    // copy pending to active
    filterFedEx = pFedEx;
    filterUSPS = pUSPS;
    filterDHL = pDHL;
    filterStandard = pStandard;
    filterExpress = pExpress;
    filterFreight = pFreight;
    filterInternational = pInternational;
    filterMinPrice = Math.max(0, Number(pMinPrice) || 0);
    filterMaxPrice = Math.max(0, Number(pMaxPrice) || 0);

    // Reset page to show first page of filtered results
    currentPage.set(1);
    // Get the newly filtered data
    const filtered = applyFilterSet({
      usePending: false,
      tab: $activeTab,
      query: $searchQuery,
      date: $selectedRange,
    });

    // ✅ update tab counts now
    updateTabCounts(filtered);
    // Close the dialog
    filtersDialogOpen = false;

    // Trigger an update to the filtered data
    filterUpdate.update(n => n + 1);
  }

  $effect(() => {
    // recalc counts based on currently active filters when user searches or changes date range
    // Also react to shipmentsData changes
    const filtered = applyFilterSet({
      usePending: false,
      tab: 'All',
      query: $searchQuery,
      date: $selectedRange,
    });
    updateTabCounts(filtered);
  });

  // Update tab counts when shipmentsData loads
  $effect(() => {
    if (shipmentsData.length > 0) {
      const filtered = applyFilterSet({
        usePending: false,
        tab: 'All',
        query: $searchQuery,
        date: $selectedRange,
      });
      updateTabCounts(filtered);
      // Trigger filter update to refresh derived stores
      filterUpdate.update(n => n + 1);
    }
  });

  function clearFilters() {
    // reset pending
    pFedEx = pUSPS = pDHL = false;
    pStandard = pExpress = pFreight = pInternational = false;
    pMinPrice = 0;
    pMaxPrice = 200;
    pUseSlider = true;

    // reset active
    filterFedEx = filterUSPS = filterDHL = false;
    filterStandard =
      filterExpress =
      filterFreight =
      filterInternational =
        false;
    filterMinPrice = 0;
    filterMaxPrice = 200;

    // Update pending count with default filters
    try {
      pendingCount = applyFilterSet({
        usePending: true,
        tab: $activeTab,
        query: $searchQuery,
        date: $selectedRange,
      }).length;
    } catch (e) {
      pendingCount = shipmentsData.length;
    }

    // Reset page and close dialog
    currentPage.set(1);
    filterUpdate.update(n => n + 1);
  }

  // Paginate the filtered results
  // Takes filtered data and slices it for current page
  const paginatedShipments = derived(
    [filteredShipments, currentPage],
    ([$filteredShipments, $currentPage]) => {
      const start = ($currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return $filteredShipments.slice(start, end);
    }
  );

  // Calculate total number of pages
  const totalPages = derived([filteredShipments], ([$filteredShipments]) => {
    return Math.ceil($filteredShipments.length / itemsPerPage);
  });

  // Ensure currentPage stays within valid bounds when filtered results change
  $effect(() => {
    const tp = $totalPages || 1;
    if ($currentPage > tp) {
      currentPage.set(tp);
    }
    if ($currentPage < 1) {
      currentPage.set(1);
    }
  });

  // ==================== EVENT HANDLERS ====================

  // Search with 2-second debouncing
  function handleSearch(event) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery.set(event.target.value);
      currentPage.set(1); // Reset to first page when searching
    }, 2000);
  }

  // Handle tab change
  function handleTabChange(tab) {
    activeTab.set(tab);
    currentPage.set(1); // Reset to first page when changing tabs
  }

  // Pagination functions
  function goToPage(page) {
    const tp = $totalPages || 1;
    const p = Number(page) || 1;
    const clamped = Math.max(1, Math.min(p, tp));
    currentPage.set(clamped);
  }

  function nextPage() {
    const tp = $totalPages || 1;
    currentPage.update(n => Math.min(n + 1, tp));
  }

  function prevPage() {
    currentPage.update(n => Math.max(n - 1, 1));
  }

  // Format date from YYYY-MM-DD to readable format
  function formatDDDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Generate mock tracking progress
  function getTrackingProgress(shipment) {
    return [
      {
        event: 'Out for delivery in ' + shipment.location,
        time: 'Sep 17, 10:30 AM',
        completed: true,
      },
      {
        event: 'Arrived at local hub',
        time: 'Sep 17, 08:15 AM',
        completed: true,
      },
      {
        event: 'Departed from sorting facility',
        time: 'Sep 16, 11:45 PM',
        completed: true,
      },
      {
        event: 'Picked up by driver',
        time: 'Sep 15, 02:20 PM',
        completed: true,
      },
    ];
  }

  // Generate page numbers for pagination
  // Generate page numbers for pagination (derived store for stable reactivity)
  const paginationPages = derived(
    [totalPages, currentPage],
    ([$totalPages, $currentPage]) => {
      const total = $totalPages || 0;
      const current = $currentPage || 1;
      const pages = [];
      const groupSize = 3; // show pages in groups of 3

      if (total <= groupSize) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

      const currentBlock = Math.ceil(current / groupSize); // 1-based
      const start = (currentBlock - 1) * groupSize + 1;
      const end = Math.min(start + groupSize - 1, total);

      if (start > 1) {
        // show first page and leading ellipsis
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      // show the pages for the current block
      for (let i = start; i <= end; i++) pages.push(i);

      if (end < total) {
        // trailing ellipsis and last page
        if (end < total - 1) pages.push('...');
        pages.push(total);
      }

      return pages;
    }
  );

  // Export dialog state
  let exportDialogOpen = $state(false);
  let exportMyShipmentOnly = $state(false);
  let exportCarrierDirectOnly = $state(false);
  let exportIncludeDeleted = $state(false);
  let exportTimePeriod = $state('all'); // all, last7days, last30days, last90days
  let exportCount = $state(0);
  let exportDebounce = null;

  function exportToCSV() {
    // Get filtered data
    let dataToExport = applyFilterSet({
      usePending: false,
      tab: $activeTab,
      query: $searchQuery,
      date: $selectedRange,
    });

    // Apply export-specific filters
    if (exportMyShipmentOnly) {
      dataToExport = dataToExport.filter(s => s.shipper === 'Abir Adnan');
    }

    if (exportCarrierDirectOnly) {
      dataToExport = dataToExport.filter(s => s.isCarrierDirect === true);
    }

    if (!exportIncludeDeleted) {
      dataToExport = dataToExport.filter(s => !s.isDeleted);
    }

    if (exportTimePeriod !== 'all') {
      const now = new Date();
      let cutoff = new Date();

      if (exportTimePeriod === 'last7days') cutoff.setDate(now.getDate() - 7);
      if (exportTimePeriod === 'last30days') cutoff.setDate(now.getDate() - 30);
      if (exportTimePeriod === 'last90days') cutoff.setDate(now.getDate() - 90);

      dataToExport = dataToExport.filter(s => {
        const shipmentDate = new Date(s.date);
        return shipmentDate >= cutoff && shipmentDate <= now;
      });
    }

    // Create CSV content
    const headers = [
      'Tracking ID',
      'Status',
      'Recipient',
      'Location',
      'Carrier',
      'Service',
      'Date',
      'Shipper',
      'Tracking Number',
      'Weight',
      'Dimensions',
      'Estimated Delivery',
      'Shipping Cost',
    ];

    const csvRows = [headers.join(',')];

    dataToExport.forEach(shipment => {
      const row = [
        shipment.trackingId,
        shipment.status,
        shipment.recipient,
        shipment.location,
        shipment.carrier,
        shipment.service,
        shipment.date,
        shipment.shipper,
        shipment.trackingNumber,
        shipment.weight,
        shipment.dimensions,
        shipment.estimatedDelivery,
        shipment.shippingCost,
      ].map(field => `"${field}"`); // Wrap in quotes to handle commas

      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `shipments_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close dialog
    exportDialogOpen = false;
  }

  function updateExportCount() {
    clearTimeout(exportDebounce);
    exportDebounce = setTimeout(() => {
      try {
        let filtered = applyFilterSet({
          usePending: false,
          tab: $activeTab,
          query: $searchQuery,
          date: $selectedRange,
        });

        if (exportMyShipmentOnly) {
          filtered = filtered.filter(s => s.shipper === 'Abir Adnan');
        }

        if (exportCarrierDirectOnly) {
          filtered = filtered.filter(s => s.isCarrierDirect === true);
        }

        if (!exportIncludeDeleted) {
          filtered = filtered.filter(s => !s.isDeleted);
        }

        if (exportTimePeriod !== 'all') {
          const now = new Date();
          let cutoff = new Date();
          if (exportTimePeriod === 'last7days')
            cutoff.setDate(now.getDate() - 7);
          if (exportTimePeriod === 'last30days')
            cutoff.setDate(now.getDate() - 30);
          if (exportTimePeriod === 'last90days')
            cutoff.setDate(now.getDate() - 90);
          filtered = filtered.filter(s => {
            const shipmentDate = new Date(s.date);
            return shipmentDate >= cutoff && shipmentDate <= now;
          });
        }

        exportCount = filtered.length;
      } catch (e) {
        exportCount = 0;
      }
    }, 300);
  }

  $effect(() => {
    if (
      exportDialogOpen ||
      exportMyShipmentOnly ||
      exportCarrierDirectOnly ||
      exportIncludeDeleted ||
      exportTimePeriod
    ) {
      updateExportCount();
    }
  });
</script>

<main class="bg-bland-650 h-full">
  <Sidebar />

  <!-- Header -->
  <DashboardHeader />

  <!-- Main Content Section -->
  <section
    class={`${$showDashboardSidebar ? 'lg:w-[calc(100%-256px)]' : 'w-full'} ms-auto flex-1 p-6 duration-300`}
  >
    <!-- Header Banner -->
    <div class="bg-bland-900 rounded-xl p-6 mb-6">
      <div>
        <h3 class="sub-heading !text-bland-25 font-bold !mt-0">
          Shipping History
        </h3>
        <p class="text-bland-25 mt-2">
          Get Instant Shipping Estimates for FedEx, UPS, Canada Post, and more!
        </p>
      </div>
    </div>

    <!-- Tabs Section -->
    <Tabs.Root value={$activeTab} class="p-0 flex flex-col gap-0 ">
      <Tabs.List
        class="h-full bg-bland-25 p-0 w-full lg:max-w-[840px] flex flex-wrap  border border-bland-200 rounded-b-none border-b-0 rounded-t-md overflow-hidden"
      >
        <!-- Dynamic Tab Rendering using #each (like map in JS) -->
        {#each tabs as tab, index (tab.value)}
          <Tabs.Trigger
            value={tab.value}
            class="tabs text-bland-700 border-0! {index === 0
              ? ''
              : ''} {index === tabs.length - 1
              ? ' border-r-0'
              : 'border-r border-bland-200'}"
            onclick={() => handleTabChange(tab.value)}
          >
            {tab.label}
            <span class="tabs-span-label {tab.spanClass}">
              {$tabCounts[tab.value]}
            </span>
          </Tabs.Trigger>
        {/each}
      </Tabs.List>

      <!-- Single Content Section - Layout doesn't repeat, only data changes -->
      <Tabs.Content value={$activeTab} class="">
        <div
          class="p-[24px] border border-bland-200 bg-bland-25 rounded-md rounded-tl-none lg:rounded-tr-md rounded-tr-none"
        >
          <div class="flex flex-col gap-4">
            <!-- Search and Filter Bar -->
            <div
              class="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-2"
            >
              <div
                class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-fit"
              >
                <div class="w-full">
                  <Input
                    type="text"
                    icon="iconoir:search"
                    placeholder="Search by tracking number, recipient, or date..."
                    class="sm:w-[324px]! w-full input-field"
                    oninput={handleSearch}
                  />
                </div>
                <div>
                  <Calendar bind:value={$selectedRange} />
                </div>
              </div>
              <div class="flex gap-3 w-full sm:w-fit">
                <div>
                  <Dialog.Root bind:open={filtersDialogOpen}>
                    <Dialog.Trigger>
                      <Button
                        asChild
                        class="ms-auto me-auto md:me-0 flex items-center font-normal text-xs text-bland-950  shadow-none border border-bland-200 rounded-md py-2 xl:py-2.5 px-3! h-auto cursor-pointer hover:shadow-md flex-wrap gap-2"
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
                                    alt="DHL"
                                  />
                                  <span class="text-sm">DHL Express</span>
                                </label>
                              </div>
                            </div>

                            <!-- Service Types -->
                            <div>
                              <p
                                class="text-sm font-medium text-bland-800 mb-3"
                              >
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
                              <p
                                class="text-sm font-medium text-bland-800 mb-3"
                              >
                                Price Range
                              </p>
                              <div class="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <Label class="form-fields-label mb-1"
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
                                            tab: $activeTab,
                                            query: $searchQuery,
                                            date: $selectedRange,
                                          }).length;
                                        } catch (e) {
                                          pendingCount = shipmentsData.length;
                                        }
                                      }, 300);
                                    }}
                                    class="border-bland-200 input-text rounded-md px-3 py-3 xl:py-[11px] text-xs font-normal sm:text-base! data-placeholder:text-bland-75 placeholder:text-sm placeholder:text-bland-300! placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 text-bland-400! h-10"
                                  />
                                </div>
                                <div>
                                  <Label class="form-fields-label mb-1"
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
                                            tab: $activeTab,
                                            query: $searchQuery,
                                            date: $selectedRange,
                                          }).length;
                                        } catch (e) {
                                          pendingCount = shipmentsData.length;
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
                        <Button onclick={applyFilters} class="common-button"
                          >Show {pendingCount}
                          {pendingCount === 1 ? 'Result' : 'Results'}</Button
                        >
                      </Dialog.Footer>
                    </Dialog.Content>
                  </Dialog.Root>
                </div>
                <div>
                  <Dialog.Root
                    open={exportDialogOpen}
                    onOpenChange={e => (exportDialogOpen = e)}
                  >
                    <Dialog.Trigger>
                      <Button
                        asChild
                        class="ms-auto me-auto md:me-0 flex items-center font-normal text-xs text-bland-25 bg-blueshade-100 shadow-none border-2 border-bland-200 rounded-md py-2 xl:py-2.5 px-3! h-auto cursor-pointer hover:shadow-md flex-wrap gap-2"
                        onclick={() => {
                          exportDialogOpen = true;
                          updateExportCount();
                        }}
                      >
                        <span><Icon icon="bx:export" class="mb-0.5" /></span>
                        Export
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Content
                      class="bg-bland-25 rounded-xl border border-[#D0D5DD]  md:min-w-[672px] min-w-[300px]  overflow-y-auto h-full max-h-[450px] p-0"
                    >
                      <Dialog.Title
                        class="text-xl font-semibold text-bland-950 text-start bg-bland-75 h-full w-full p-[24px] border border-bland-550"
                      >
                        Export Data
                      </Dialog.Title>
                      <Dialog.Header class="p-[24px] pt-[8px] pb-[8px]">
                        <Dialog.Description
                          class="flex flex-col justify-between gap-[24px]"
                        >
                          <div class="flex flex-col gap-[24px]">
                            <!-- Carrier Services -->
                            <div>
                              <p class="text-lg font-medium mb-3">Filter By</p>
                              <div class="flex flex-col gap-2">
                                <label class="inline-flex items-center gap-3">
                                  <Checkbox
                                    bind:checked={exportMyShipmentOnly}
                                  />

                                  <span class="text-sm">My Shipment Only</span>
                                </label>

                                <label class="inline-flex items-center gap-3">
                                  <Checkbox
                                    bind:checked={exportCarrierDirectOnly}
                                  />

                                  <span class="text-sm"
                                    >Carrier direct Shipment Only
                                  </span>
                                </label>

                                <label class="inline-flex items-center gap-3">
                                  <Checkbox
                                    bind:checked={exportIncludeDeleted}
                                  />

                                  <span class="text-sm"
                                    >Included Deleted Shipments</span
                                  >
                                </label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div>
                              <Label class="form-fields-label"
                                >Select Time Period</Label
                              >

                              <Select
                                type="single"
                                bind:value={exportTimePeriod}
                                class="mt-2"
                              >
                                <SelectTrigger class="select-field">
                                  {#if exportTimePeriod === 'last7days'}Last 7
                                    Days{/if}
                                  {#if exportTimePeriod === 'last30days'}Last 30
                                    Days{/if}
                                  {#if exportTimePeriod === 'last90days'}Last 90
                                    Days{/if}
                                  {#if exportTimePeriod === 'all'}All Time{/if}
                                </SelectTrigger>
                                <SelectContent class="form-bg border-0">
                                  <SelectGroup>
                                    <SelectItem value="last7days"
                                      >Last 7 Days</SelectItem
                                    >
                                    <SelectItem value="last30days"
                                      >Last 30 Days</SelectItem
                                    >
                                    <SelectItem value="last90days"
                                      >Last 90 Days</SelectItem
                                    >
                                    <SelectItem value="all">All Time</SelectItem
                                    >
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
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
                          onclick={() => {
                            exportMyShipmentOnly = false;
                            exportCarrierDirectOnly = false;
                            exportIncludeDeleted = false;
                            exportTimePeriod = 'all';
                            updateExportCount();
                          }}>Clear Filters</Button
                        >
                        <Button onclick={exportToCSV} class="common-button">
                          Export {exportCount}
                          {exportCount === 1 ? 'Result' : 'Results'}
                        </Button>
                      </Dialog.Footer>
                    </Dialog.Content>
                  </Dialog.Root>
                </div>
              </div>
            </div>

            <!-- Filter Checkboxes -->
            <div
              class="flex justify-start items-center flex-wrap gap-y-5 gap-x-10"
            >
              <div class="flex items-center space-x-2">
                <Checkbox id="only-my-shipment-{$activeTab}" />
                <Label
                  for="only-my-shipment-{$activeTab}"
                  class="text-xs md:text-sm text-bland-400"
                >
                  Only My Shipment
                </Label>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox id="only-today-{$activeTab}" />
                <Label
                  for="only-today-{$activeTab}"
                  class="text-xs md:text-sm text-bland-400"
                >
                  Only Today Shipment
                </Label>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox id="carrier-direct-{$activeTab}" />
                <Label
                  for="carrier-direct-{$activeTab}"
                  class="text-xs md:text-sm text-bland-400"
                >
                  Only Carrier Direct Shipment
                </Label>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox id="deleted-{$activeTab}" />
                <Label
                  for="deleted-{$activeTab}"
                  class="text-xs md:text-sm text-bland-400"
                >
                  Deleted
                </Label>
              </div>
            </div>
          </div>
        </div>

        <!-- Table Section - Single Layout for All States -->
        <div
          class="mt-4 rounded-xl overflow-hidden bg-bland-25 border border-bland-200 mb-6"
        >
          <Table.Root class="w-full h-full">
            <!-- Table Header - Static -->
            <Table.Header class="bg-bland-900 text-bland-25 h-full w-full">
              <Table.Row class="w-full">
                <Table.Head class="px-6 py-4">Tracking Id</Table.Head>
                <Table.Head class="px-6 py-4">Status</Table.Head>
                <Table.Head class="px-6 py-4">Recipient</Table.Head>
                <Table.Head class="px-6 py-4">Carrier</Table.Head>
                <Table.Head class="px-6 py-4">Service</Table.Head>
                <Table.Head class="px-6 py-4">Date</Table.Head>
                <Table.Head class="px-6 py-4">Actions</Table.Head>
              </Table.Row>
            </Table.Header>

            <!-- Table Body - Dynamic Content -->
            <Table.Body>
              <!-- Show "No data" message if empty -->
              {#if $paginatedShipments.length === 0}
                <Table.Row>
                  <Table.Cell
                    colspan="7"
                    class="text-center py-8 text-bland-400"
                  >
                    No data available
                  </Table.Cell>
                </Table.Row>
              {:else}
                <!-- Loop through shipments using #each (like map() in JS) -->
                <!-- Each shipment uses same layout, only values change -->
                {#each $paginatedShipments as shipment (shipment.id)}
                  <Table.Row class="border-b border-bland-200">
                    <!-- Tracking ID Cell -->
                    <Table.Cell class="px-6 py-4 text-sm font-medium">
                      {shipment.trackingId}
                    </Table.Cell>

                    <!-- Status Cell - Dynamic styling from statusConfig -->
                    <Table.Cell class="px-6 py-4">
                      <div
                        class="flex gap-1 px-2 py-1 {statusConfig[
                          shipment.status
                        ].bg} {statusConfig[shipment.status]
                          .text} text-xs font-medium max-w-[86px] rounded-sm items-center"
                      >
                        <span>
                          <Icon
                            icon={statusConfig[shipment.status].icon}
                            class="w-[12px] h-[12px]"
                          />
                        </span>
                        {shipment.status}
                      </div>
                    </Table.Cell>

                    <!-- Recipient Cell -->
                    <Table.Cell class="px-6 py-4">
                      <div class="flex flex-col items-start">
                        <h1 class="text-sm font-medium text-bland-950">
                          {shipment.recipient}
                        </h1>
                        <h4 class="text-regular font-sm text-bland-400">
                          {shipment.location}
                        </h4>
                      </div>
                    </Table.Cell>

                    <!-- Carrier Cell -->
                    <Table.Cell class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img
                          src={shipment.carrierImg}
                          alt={shipment.carrier}
                          class="w-8 h-8"
                        />
                        <span class="font-medium text-base"
                          >{shipment.carrier}</span
                        >
                      </div>
                    </Table.Cell>

                    <!-- Service Cell -->
                    <Table.Cell
                      class="px-6 py-4 text-sm font-medium text-bland-950"
                    >
                      {shipment.service}
                    </Table.Cell>

                    <!-- Date Cell -->
                    <Table.Cell
                      class="px-6 py-4 text-sm font-normal text-bland-600"
                    >
                      {formatDate(shipment.date)}
                    </Table.Cell>

                    <!-- Actions Cell with Modal -->
                    <Table.Cell class="px-6 py-4">
                      <Dialog.Root>
                        <Dialog.Trigger
                          class="underline text-sm font-normal text-bland-700 cursor-pointer"
                          onclick={() => selectedShipment.set(shipment)}
                        >
                          View Details
                        </Dialog.Trigger>
                        <Dialog.Content
                          class="bg-bland-25 rounded-xl border border-[#D0D5DD] sm:min-w-[672px] min-w-[300px] overflow-y-auto h-[610px] sm:h-fit p-0 !flex flex-col gap-0"
                        >
                          {#if $selectedShipment}
                            <Dialog.Title
                              class="text-xl font-semibold text-bland-950 text-start bg-bland-75 h-fit w-full py-2.5 px-6 border border-bland-550"
                            >
                              {$selectedShipment.trackingId}
                              <div
                                class="flex gap-1 px-2 py-1 {statusConfig[
                                  $selectedShipment.status
                                ].bg} {statusConfig[$selectedShipment.status]
                                  .text} text-xs font-medium max-w-[86px] rounded-sm items-center mt-2"
                              >
                                <span>
                                  <Icon
                                    icon={statusConfig[$selectedShipment.status]
                                      .icon}
                                    class="w-[12px] h-[12px]"
                                  />
                                </span>
                                {$selectedShipment.status}
                              </div>
                            </Dialog.Title>

                            <Dialog.Header class="p-[24px] pt-[8px] pb-[8px]">
                              <Dialog.Description
                                class="flex flex-col justify-between gap-[24px]"
                              >
                                <div class="flex flex-col gap-[24px]">
                                  <div>
                                    <Tabs.Root
                                      value="Status"
                                      class="p-0 flex flex-col gap-0"
                                    >
                                      <Tabs.List
                                        class="h-full bg-bland-25 p-0 w-fit flex flex-wrap text-bland-950 [&>button[data-state=active]]:!text-primary-400 [&>button[data-state=active]]:!bg-bland-25 [&>button[data-state=active]]:!border-b-primary-400 [&>button]:bg-bland-25 [&>button]:text-bland-950"
                                      >
                                        <Tabs.Trigger
                                          value="Status"
                                          class="rounded-none !w-fit cursor-pointer"
                                        >
                                          Status
                                        </Tabs.Trigger>
                                        <Tabs.Trigger
                                          value="Details"
                                          class="rounded-none !w-fit cursor-pointer"
                                        >
                                          Details
                                        </Tabs.Trigger>
                                      </Tabs.List>

                                      <!-- Status Tab Content -->
                                      <Tabs.Content value="Status" class="mt-4">
                                        <p class="text-lg font-semibold">
                                          Tracking Progress
                                        </p>
                                        <div class="my-6">
                                          <div
                                            class="flex flex-col gap-10 lg:gap-0 mt-10"
                                          >
                                            <div
                                              class="my-auto flex flex-col gap-4 [&>div]:relative [&>div]:after:w-0.5 [&>div]:after:h-[80px] [&>div]:sm:after:h-[50px] [&>div]:after:absolute [&>div]:after:bg-green-300 [&>div]:after:left-[18px] [&>div]:after:sm:left-[16px] [&>div]:after:top-3 [&>div]:after:-translate-x-1/2 [&>div:last-child]:after:hidden"
                                            >
                                              <!-- Loop through tracking progress -->
                                              {#each getTrackingProgress($selectedShipment) as progress, idx (idx)}
                                                <div
                                                  class="flex gap-3 sm:gap-5"
                                                >
                                                  <div
                                                    class="w-9 flex justify-center"
                                                  >
                                                    <Icon
                                                      icon="bi:circle-fill"
                                                      width="12"
                                                      height="12"
                                                      class="text-green-300"
                                                    />
                                                  </div>
                                                  <div
                                                    class="flex flex-col gap-1 items-start text-start sm:w-full w-[170px]"
                                                  >
                                                    <span
                                                      class="font-medium !flex items-center gap-2 sm:gap-4"
                                                    >
                                                      {progress.event}
                                                    </span>
                                                    <span
                                                      class="text-bland-600 text-sm"
                                                      >{progress.time}</span
                                                    >
                                                  </div>
                                                </div>
                                              {/each}
                                            </div>
                                          </div>
                                        </div>
                                      </Tabs.Content>

                                      <!-- Details Tab Content -->
                                      <Tabs.Content value="Details">
                                        <p class="text-lg font-semibold my-6">
                                          Shipping Details
                                        </p>
                                        <div
                                          class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start"
                                        >
                                          <div>
                                            <p class="text-bland-400">
                                              Shipper
                                            </p>
                                            <p class="font-medium">
                                              {$selectedShipment.shipper}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">
                                              Service
                                            </p>
                                            <p class="font-medium">
                                              {$selectedShipment.service}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">
                                              Recipient
                                            </p>
                                            <p class="font-medium">
                                              {$selectedShipment.recipient}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">Weight</p>
                                            <p class="font-medium">
                                              {$selectedShipment.weight}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">
                                              Carrier
                                            </p>
                                            <p class="font-medium">
                                              {$selectedShipment.carrier}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">
                                              Dimensions
                                            </p>
                                            <p class="font-medium">
                                              {$selectedShipment.dimensions}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">
                                              Tracking Number
                                            </p>
                                            <p class="font-medium">
                                              {$selectedShipment.trackingNumber}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">Status</p>
                                            <p class="font-medium">
                                              {$selectedShipment.status}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">
                                              Estimated Delivery
                                            </p>
                                            <p class="font-medium">
                                              {$selectedShipment.estimatedDelivery}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="text-bland-400">
                                              Shipping Cost
                                            </p>
                                            <p class="font-medium">
                                              {$selectedShipment.shippingCost}
                                            </p>
                                          </div>
                                        </div>
                                      </Tabs.Content>
                                    </Tabs.Root>
                                  </div>
                                </div>
                              </Dialog.Description>
                            </Dialog.Header>

                            <Dialog.Footer
                              class="flex flex-row justify-end items-end bg-bland-75 h-full w-full p-[24px] pt-[16px] border border-bland-550"
                            >
                              <Button
                                class="bg-primary-400 text-white hover:bg-orange-400 transition-colors py-2! px-3! text-sm font-medium rounded-md"
                              >
                                <Icon
                                  icon="ph:headset"
                                  width="20"
                                  height="20"
                                />
                                Contact Support
                              </Button>
                            </Dialog.Footer>
                          {/if}
                        </Dialog.Content>
                      </Dialog.Root>
                    </Table.Cell>
                  </Table.Row>
                {/each}
              {/if}
            </Table.Body>
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
                disabled={$currentPage === 1}
              >
                <Icon icon="uil:angle-left" class="w-4 h-4" />
              </button>

              <!-- Dynamic Page Numbers -->
              {#each $paginationPages as page, idx (idx)}
                {#if page === '...'}
                  <span class="px-2 text-bland-400">…</span>
                {:else}
                  <button
                    type="button"
                    aria-current={$currentPage === page ? 'page' : undefined}
                    class="px-3 py-1 rounded-md border {$currentPage === page
                      ? 'border-primary-400 text-bland-25 bg-primary-400 font-medium'
                      : 'bg-bland-25 border-bland-200 text-bland-700 hover:bg-bland-200'}"
                    onclick={() => goToPage(page)}
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
                disabled={$currentPage === $totalPages || $totalPages === 0}
              >
                <Icon icon="uil:angle-right" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </section>
</main>
