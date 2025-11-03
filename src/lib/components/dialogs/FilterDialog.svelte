<script>
  // @ts-nocheck
  import * as Dialog from '../../../lib/components/ui/dialog';
  import { Button } from '../../../lib/components/ui/button';
  import { Checkbox } from '../../../lib/components/ui/checkbox';
  import { Input } from '../../../lib/components/ui/input';
  import { Label } from '../../../lib/components/ui/label';
  import Icon from '@iconify/svelte';

  // ✅ Props from parent
  export let shipmentsData = [];
  export let onFiltered = null; // ✅ callback function to send results back to parent

  // Local dialog state
  let filtersDialogOpen = false;
  let pendingCount = shipmentsData.length;

  // Filters
  let pFedEx = false;
  let pUSPS = false;
  let pDHL = false;

  let pStandard = false;
  let pExpress = false;
  let pFreight = false;
  let pInternational = false;

  let pMinPrice = 0;
  let pMaxPrice = 1000;
  let pUseSlider = false;

  let pendingDebounce;

  $: {
    clearTimeout(pendingDebounce);
    pendingDebounce = setTimeout(() => {
      pendingCount = applyFilterSet().length;
    }, 200);
  }
  $: if (filtersDialogOpen) {
    pendingCount = applyFilterSet().length;
  }

  // --- Core filter logic
  function applyFilterSet() {
    let data = shipmentsData.slice();

    // Carrier filter
    const carriers = [];
    if (pFedEx) carriers.push('FedEx');
    if (pUSPS) carriers.push('USPS');
    if (pDHL) carriers.push('DHL');
    if (carriers.length) data = data.filter(d => carriers.includes(d.carrier));

    // Service type filter
    const services = [];
    if (pStandard) services.push('Standard');
    if (pExpress) services.push('Express');
    if (pFreight) services.push('Freight');
    if (pInternational) services.push('International');
    if (services.length)
      data = data.filter(d => services.includes(d.serviceType));

    // Price range filter
    data = data.filter(d => d.price >= pMinPrice && d.price <= pMaxPrice);

    return data;
  }

  // --- Apply Filters
  function applyFilters() {
    const filtered = applyFilterSet();
    pendingCount = filtered.length;
    filtersDialogOpen = false;

    // ✅ send filtered data to parent (no dispatch, just callback)
    if (typeof onFiltered === 'function') {
      onFiltered(filtered);
    }
  }

  // --- Clear Filters
  function clearFilters() {
    pFedEx = pUSPS = pDHL = false;
    pStandard = pExpress = pFreight = pInternational = false;
    pMinPrice = 0;
    pMaxPrice = 1000;
    pUseSlider = false;

    pendingCount = shipmentsData.length;

    // ✅ Send unfiltered data back
    if (typeof onFiltered === 'function') {
      onFiltered(shipmentsData);
    }
  }

  // --- Live update pending count
  $: {
    clearTimeout(pendingDebounce);
    pendingDebounce = setTimeout(() => {
      try {
        pendingCount = applyFilterSet().length;
      } catch {
        pendingCount = shipmentsData.length;
      }
    }, 400);
  }
</script>

<!-- You can reuse your <Dialog> UI here as-is -->
<div>
  <Dialog.Root bind:open={filtersDialogOpen}>
    <Dialog.Trigger>
      <Button
        class="ms-auto me-auto md:me-0 flex items-center font-normal text-xs text-bland-950  shadow-none border-2 border-bland-200 rounded-md py-2 xl:py-2.5 px-3! h-auto cursor-pointer hover:shadow-md flex-wrap gap-2"
      >
        <span
          ><Icon icon="ph:funnel-x-bold" class="mb-0.5 text-bland-300" /></span
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
                  <img src="/assets/images/carrierServices1.png" alt="FedEx" />
                  <span class="text-sm">FedEx</span>
                </label>

                <label class="inline-flex items-center gap-3">
                  <Checkbox bind:checked={pUSPS} />
                  <img src="/assets/images/carrierServices2.png" alt="USPS" />
                  <span class="text-sm">USPS</span>
                </label>

                <label class="inline-flex items-center gap-3">
                  <Checkbox bind:checked={pDHL} />
                  <img src="/assets/images/carrierServices3.png" alt="DHL" />
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
              <p class="text-sm font-medium text-bland-800 mb-3">Price Range</p>
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
                      pMinPrice = Math.max(0, Number(e.target.value) || 0);
                      clearTimeout(pendingDebounce);
                      pendingDebounce = setTimeout(() => {
                        try {
                          pendingCount = applyFilterSet({
                            usePending: true,
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
                  <Label class="text-xs text-bland-500 block mb-1"
                    >Max Price</Label
                  >
                  <Input
                    type="number"
                    min="0"
                    bind:value={pMaxPrice}
                    oninput={e => {
                      pUseSlider = false;
                      pMaxPrice = Math.max(0, Number(e.target.value) || 0);
                      clearTimeout(pendingDebounce);
                      pendingDebounce = setTimeout(() => {
                        try {
                          pendingCount = applyFilterSet({
                            usePending: true,
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
                    pMaxPrice = Math.max(0, Number(e.target.value) || 0);
                  }}
                  disabled={!pUseSlider}
                />
                <div class="flex justify-between text-xs text-bland-400! mt-1">
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
