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
    import * as Tabs from '$lib/components/ui/tabs';
    import Alltabssection from '$lib/components/Alltabssection.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import * as Table from '$lib/components/ui/table';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Select from '$lib/components/ui/select';
    import Calendar from '$lib/components/Calendar.svelte';
    import DashboardHeader from '$lib/components/DashboardHeader.svelte';
    import {
      getCutoffTimes,
      getAvailableCountries,
      getPostalCodesByCountry,
    } from '$lib/services/cutoffTimes.service';
  
    let selectedCountry = $state(null);
    let postalCode = $state('');
    let tableData = $state([]);
    let loading = $state(false);
    let error = $state(null);
  
    const countries = getAvailableCountries();
  
    function getPostalCodePlaceholder() {
      if (selectedCountry) {
        const postalCodes = getPostalCodesByCountry(selectedCountry);
        return postalCodes?.[0] || 'Enter postal code';
      }
      return 'Enter postal code';
    }
  
    async function handleGetTimes() {
      if (!selectedCountry || !postalCode.trim()) {
        error = 'Please select a country and enter a postal code';
        return;
      }
  
      loading = true;
      error = null;
  
      try {
        const response = await getCutoffTimes(selectedCountry, postalCode.trim());
  
        if (response.success && response.data.cutoffTimes.length > 0) {
          tableData = response.data.cutoffTimes;
        } else {
          tableData = [];
          error = response.message || 'No cutoff times found';
        }
      } catch (err) {
        error = 'Failed to fetch cutoff times. Please try again.';
        tableData = [];
        console.error('Error fetching cutoff times:', err);
      } finally {
        loading = false;
      }
    }
  
    function handleReset() {
      selectedCountry = null;
      postalCode = '';
      tableData = [];
      error = null;
      loading = false;
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
          <h3 class="sub-heading !text-bland-25 font-bold !mt-0">Cutoff Times</h3>
  
          <p class="text-bland-25 mt-2">
            Find carrier cutoff times based on your location
          </p>
        </div>
      </div>
  
      <!-- <div class="p-[24px] border-2 border-bland-200 bg-bland-25 rounded-md">
        
      </div> -->
      <div class="common-card mb-6">
        <h3 class="text-xl font-semibold text-bland-950 mb-4">Ship From:</h3>
  
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label class="form-fields-label my-2">Country</Label>
  
            <Select.Root
              type="single"
              name="Shipping From"
              bind:value={selectedCountry}
            >
              <Select.Trigger class="select-field">
                {#if selectedCountry}
                  {selectedCountry}
                {:else}
                  Select Country
                {/if}
              </Select.Trigger>
              <Select.Content class="form-bg border-0">
                <Select.Group>
                  <Select.Label>From</Select.Label>
                  {#each countries as country}
                    <Select.Item value={country} label={country}>
                      {country}
                    </Select.Item>
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
  
          <div>
            <Label class="form-fields-label my-2">Postal Code</Label>
  
            <Input
              type="text"
              bind:value={postalCode}
              placeholder={getPostalCodePlaceholder()}
              class="input-field"
            />
          </div>
  
          <div class="col-span-1 sm:col-span-2 flex justify-end">
            <div class="flex gap-4">
              <Button
                onclick={handleReset}
                class="bg-transparent hover:bg-transparent transition-colors py-2! px-3! text-sm font-medium rounded-md cursor-pointer border border-[#D0D5DD]"
                ><Icon
                  icon="garden:reload-fill-16"
                  width="16"
                  height="16"
                  class="text-bland-300"
                /> Reset</Button
              ><Button
                onclick={handleGetTimes}
                disabled={loading}
                class="bg-primary-400 text-white hover:bg-orange-400 transition-colors py-2! px-3! text-sm font-medium rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >{loading ? 'Loading...' : 'Get Times'}</Button
              >
            </div>
          </div>
        </div>
  
        <div class="mt-6 border border-[#D0D5DD] overflow-hidden rounded-2xl">
          <Table.Root class="w-full h-full">
            <Table.Header class="bg-bland-900 text-bland-25 h-full w-full">
              <Table.Row class="w-full">
                <Table.Head class="px-6 py-4">Carrier</Table.Head>
                <Table.Head class="px-6 py-4">Service Type</Table.Head>
                <Table.Head class="px-6 py-4 ">Daily Cutoff Time</Table.Head>
                <Table.Head class="px-6 py-4 ">Note</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#if tableData.length > 0}
                {#each tableData as item}
                  <Table.Row class="border-b border-bland-200">
                    <Table.Cell class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.carrier}
                          class="w-8 h-8"
                        />
                        <span class="font-medium text-base">{item.carrier}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell class="px-6 py-4 text-sm font-medium"
                      >{item.serviceType}</Table.Cell
                    >
                    <Table.Cell class="px-6 py-4 text-sm font-medium"
                      >{item.cutoffTime}</Table.Cell
                    >
                    <Table.Cell
                      class="px-6 py-4 text-sm font-normal text-bland-600"
                      >{item.note}</Table.Cell
                    >
                  </Table.Row>
                {/each}
              {:else}
                <Table.Row>
                  <Table.Cell
                    colspan="4"
                    class="px-6 py-8 text-center text-bland-600"
                  >
                    {#if error}
                      <div class="text-red-500">{error}</div>
                    {:else if selectedCountry || postalCode}
                      No cutoff times found. Please select a country and postal
                      code, then click "Get Times".
                    {:else}
                      Please select a country and enter a postal code, then click
                      "Get Times" to view cutoff times.
                    {/if}
                  </Table.Cell>
                </Table.Row>
              {/if}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    </section>
  </main>
  