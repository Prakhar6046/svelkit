<script lang="ts">
    import Icon from '@iconify/svelte';
    // @ts-ignore - allow importing .svelte component without stricter TS checks in this file
    import Sidebar from '$lib/components/Sidebar.svelte';
    import * as yup from 'yup';
  
    import {
      carriers,
      packageType,
      pickupTimeWindow,
      savedAddresses,
      showDashboardSidebar,
      weightType,
    } from '$lib/stores/store';
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
    import Calendar from '$lib/components/ui/calendar/calendar.svelte';
    import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectLabel,
      SelectTrigger,
    } from '$lib/components/ui/select';
    import {
      Popover,
      PopoverContent,
      PopoverTrigger,
    } from '$lib/components/ui/popover';
    import { Textarea } from '$lib/components/ui/textarea';
    import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
    import fedex from '$lib/assets/images/fedex-with-bg.svg';
    import { goto } from '$app/navigation';
    import * as Dialog from '$lib/components/ui/dialog';
    import { onMount } from 'svelte';
    import DashboardHeader from '$lib/components/DashboardHeader.svelte';
  
    // Variables and state management for all type of input fields
    let selectedAddress = '';
    onMount(() => {
      const defaultAddr = $savedAddresses.find(a => a.default);
      if (defaultAddr) {
        selectedAddress = defaultAddr.address;
      }
    });
    let selectedPackage = $packageType[0].value;
    let selectedWeightUnit = $weightType[0].value;
    let selectedTimeSlot = $pickupTimeWindow[0].value;
    let selectedCarrier = $carriers[0].id;
  
    // Schema Validation
    const schema = yup.object().shape({
      selectedAddress: yup.string().required('Pickup address is required'),
      // Calendar returns a date-like value; accept mixed and require presence
      pickupDate: yup.mixed().required('Pickup date is required'),
      selectedTimeSlot: yup.string().required('Pickup time window is required'),
      selectedPackage: yup.string().required('Package type is required'),
      totalWeight: yup
        .number()
        .typeError('Weight must be a number')
        .positive('Weight must be positive')
        .required('Total weight is required'),
      selectedWeightUnit: yup.string().required('Weight unit is required'),
      dimensions1: yup.string().required('Dimensions are required'),
      dimensions2: yup.string().required('Dimensions are required'),
      dimensions3: yup.string().required('Dimensions are required'),
      selectedCarrier: yup.string().required('Please select a carrier'),
    });
  
    let pickupDate: any = null;
    let totalWeight: string = '';
    let dimensions1: string = '';
    let dimensions2: string = '';
    let dimensions3: string = '';
    let packageDescription: string = '';
    let carrierDescription: string = '';
  
    let errors: Record<string, string> = {};
    let touched: Record<string, boolean> = {};
  
    function getValues() {
      return {
        selectedAddress,
        pickupDate,
        selectedTimeSlot,
        selectedPackage,
        totalWeight: totalWeight === '' ? totalWeight : Number(totalWeight),
        selectedWeightUnit,
        dimensions1,
        dimensions2,
        dimensions3,
        packageDescription,
        selectedCarrier,
        carrierDescription,
      };
    }
  
    async function validateField(name: string) {
      touched[name] = true;
      try {
        await schema.validateAt(name, getValues());
        delete errors[name];
      } catch (err: any) {
        errors[name] = err?.message || 'Invalid';
      }
    }
  
    async function validateAll(): Promise<boolean> {
      errors = {};
      try {
        await schema.validate(getValues(), { abortEarly: false });
        return true;
      } catch (err: any) {
        const e: any = err;
        if (e && Array.isArray(e.inner) && e.inner.length) {
          for (const it of e.inner) {
            errors[it.path] = it.message;
            touched[it.path] = true;
          }
        } else if (e && e.path) {
          errors[e.path] = e.message;
          touched[e.path] = true;
        }
        return false;
      }
    }
  
    async function handleNext() {
      const ok = await validateAll();
      if (ok) {
        goto('/pickups/review-confirm-pickup');
      } else {
        const first = Object.keys(errors)[0];
        if (first) {
          const el = document.querySelector(`[data-field="${first}"]`);
          if (el)
            (el as HTMLElement).scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
        }
      }
    }
  
    function clearError(field: string) {
      if (errors[field]) {
        delete errors[field];
        errors = { ...errors };
      }
    }
  
    $: if (pickupDate) clearError('pickupDate');
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
  
      <div class="mt-4 rounded-xl p-6 bg-bland-25 border border-bland-200 mb-6">
        <h3 class="text-2xl font-medium text-bland-950">Schedule a pickup</h3>
  
        <div
          class="flex gap-5 justify-between items-start xl:flex-row flex-col mt-8"
        >
          <!-- Ship From Section -->
          <div class="w-full">
            <h4 class="form-label-main">Pickup Details</h4>
  
            <div class=" grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
              <div class="col-span-8">
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Label class="form-fields-label"
                      >Pickup Address
                      <button
                        type="button"
                        class="underline text-xs font-normal text-bland-400 cursor-pointer"
                        >Change Address</button
                      >
                      ></Label
                    >
                  </Dialog.Trigger>
                  <Dialog.Content
                    class="bg-bland-25 rounded-xl border border-[#D0D5DD]  md:min-w-[672px] min-w-[300px]  overflow-y-auto h-fit p-0"
                  >
                    <Dialog.Title
                      class="text-xl font-semibold text-bland-950 text-start bg-bland-75 h-full w-full py-2.5 px-6 border border-bland-550"
                    >
                      Change Pickup Address
                    </Dialog.Title>
                    <Dialog.Header class="p-[24px] pt-[8px] pb-[8px]">
                      <Dialog.Description>
                        <div class="flex flex-col gap-[24px] text-start">
                          <!-- Service Types -->
                          <div>
                            <p class="text-lg font-semibold mb-3">
                              Select from saved addresses:
                            </p>
                            <div class="grid gap-3">
                              <RadioGroup.Root bind:value={selectedAddress}>
                                {#each $savedAddresses as addr, i}
                                  <label
                                    class="flex items-start sm:items-center flex-col sm:flex-row justify-between gap-3 border border-[#D0D5DD] rounded-md p-3 cursor-pointer"
                                    for={`address-${i}`}
                                  >
                                    <div class="flex items-center gap-4">
                                      <RadioGroup.Item
                                        value={addr.address}
                                        id={`address-${i}`}
                                        class="mt-1"
                                      />
                                      <div class="flex flex-col gap-1">
                                        <p class="font-semibold">
                                          {addr.addressType}
                                        </p>
                                        <span class="text-sm text-[#4B5563]"
                                          >{addr.address}</span
                                        >
                                      </div>
                                    </div>
  
                                    {#if addr.default}
                                      <span
                                        class="bg-blueshade-700 text-white hover:bg-blueshade-700 transition-colors !py-1.5 px-6 text-xs font-medium rounded-sm cursor-default w-full sm:w-fit text-center"
                                      >
                                        Default
                                      </span>
                                    {/if}
                                  </label>
                                {/each}
                              </RadioGroup.Root>
                            </div>
                          </div>
                        </div>
                      </Dialog.Description>
                    </Dialog.Header>
  
                    <Dialog.Footer
                      class="flex flex-row justify-end! items-center  bg-bland-75 h-full w-full p-[24px] pt-[16px] border border-bland-550"
                    >
                      <Dialog.Root>
                        <Dialog.Trigger>
                          <Button class="common-button">Add New Address</Button>
                        </Dialog.Trigger>
                        <Dialog.Content
                          class="bg-bland-25 rounded-xl border border-[#D0D5DD]  md:min-w-[672px] min-w-[300px]  overflow-y-auto h-full sm:h-fit p-0 py-1"
                        >
                          <Dialog.Title
                            class="text-xl font-semibold text-bland-950 text-start bg-bland-75 h-full w-full py-2.5 px-6 border border-bland-550"
                          >
                            Add New Address
                          </Dialog.Title>
                          <Dialog.Header class="p-[24px] pt-[8px] pb-[8px]">
                            <Dialog.Description>
                              <div class="flex flex-col gap-1 text-start">
                                <div
                                  class="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                  <div class="mt-auto">
                                    <Label class="form-fields-label"
                                      >Address Name</Label
                                    >
  
                                    <Input
                                      type="text"
                                      placeholder="4.5"
                                      class="input-field"
                                    />
                                  </div>
                                  <div class="mt-auto">
                                    <Label class="form-fields-label"
                                      >Street Address</Label
                                    >
  
                                    <Input
                                      type="text"
                                      placeholder="4.5"
                                      class="input-field"
                                    />
                                  </div>
                                </div>
  
                                <div
                                  class="grid grid-cols-1 sm:grid-cols-3 gap-4"
                                >
                                  <div class="mt-auto">
                                    <Label class="form-fields-label">City</Label>
  
                                    <Input
                                      type="text"
                                      placeholder="4.5"
                                      class="input-field"
                                    />
                                  </div>
  
                                  <div class="mt-auto">
                                    <Label class="form-fields-label"
                                      >Province</Label
                                    >
  
                                    <Select type="single" name="Shipping From">
                                      <SelectTrigger
                                        class="w-full accordeion-border input-text h-[42px] xl:h-12 py-2 xl:py-[11px] text-sm sm:text-base data-[placeholder]:text-bland-950 [&_path]:text-bland-950"
                                      >
                                        Lbs
                                      </SelectTrigger>
                                      <SelectContent class="form-bg border-0">
                                        <SelectGroup>
                                          <SelectLabel>From</SelectLabel>
                                          <SelectItem value="Lbs">Lbs</SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div class="mt-auto">
                                    <Label class="form-fields-label"
                                      >Postal Code</Label
                                    >
  
                                    <Input
                                      type="text"
                                      placeholder="4.5"
                                      class="input-field"
                                    />
                                  </div>
                                </div>
                              </div>
                              </Dialog.Description>
                          </Dialog.Header>
  
                          <Dialog.Footer
                            class="flex flex-row justify-end! items-center  bg-bland-75 h-full w-full p-[24px] pt-[16px] border border-bland-550"
                          >
                            <Button class="common-button">Save Address</Button>
                            <Button
                              class="bg-[#FF3C3C] text-white hover:bg-redish-100/80 transition-colors !py-2 !px-6 text-sm font-medium rounded-md cursor-pointer"
                              >Delete</Button
                            >
                          </Dialog.Footer>
                        </Dialog.Content>
                      </Dialog.Root>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Root>
  
                <Input
                  disabled={true}
                  value={selectedAddress}
                  placeholder="123 Main St, Anytown, ON M1A 2B3"
                  class="input-field"
                />
              </div>
  
              <div class="col-span-4">
                <Label class="form-fields-label">Pickup Date</Label>
                <Popover>
                  <PopoverTrigger
                    data-field="pickupDate"
                    class={`mt-3 w-full flex justify-between items-center py-[11px] px-3 border rounded-lg data-placeholder:text-bland-950 text-sm sm:!text-base shadow-xs ${errors.pickupDate ? 'border-red-500 ring-1 ring-red-500' : 'border-bland-300/30'}`}
                  >
                    {pickupDate ? pickupDate : 'Select a date'}
                    <Icon icon="ph:calendar-dots" class="size-5" />
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0 bg-bland-25">
                    <Calendar bind:value={pickupDate} type="single" />
                  </PopoverContent>
                  <span class="absolute text-red-500 text-sm mt-1 block"
                    >{errors.pickupDate || ''}</span
                  >
                </Popover>
              </div>
  
              <div class="col-span-12">
                <Label class="form-fields-label">Pickup Time Window</Label>
                <div data-field="selectedTimeSlot">
                  <Select
                    type="single"
                    name="Pickup Time Slot"
                    bind:value={selectedTimeSlot}
                  >
                    <SelectTrigger
                      class={`select-field ${errors.selectedTimeSlot ? 'border-red-500 ring-1 ring-red-500' : 'border-bland-300/30'}`}
                    >
                      {$pickupTimeWindow.find(p => p.value === selectedTimeSlot)
                        ?.label}
                    </SelectTrigger>
  
                    <SelectContent class="form-bg border-0">
                      <SelectGroup>
                        {#each $pickupTimeWindow as pkg}
                          <SelectItem value={pkg.value}>{pkg.label}</SelectItem>
                        {/each}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span
                    class="absolute text-red-500 text-sm mt-1 block min-h-[1rem]"
                    >{errors.selectedTimeSlot || ''}</span
                  >
                </div>
              </div>
            </div>
          </div>
  
          <!-- Ship To Section -->
          <div class="space-y-4 w-full">
            <h4 class="form-label-main">Package Details</h4>
  
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div class="col-span-5">
                <Label class="form-fields-label">Package Type</Label>
                <Select type="single" name="Country" bind:value={selectedPackage}>
                  <SelectTrigger
                    class={`w-full h-[42px] xl:h-12 rounded-lg bg-transparent px-3 py-2 text-sm ${errors.selectedPackage ? 'border-red-500 ring-1 ring-red-500' : 'border-bland-300/30'}`}
                  >
                    {$packageType.find(p => p.value === selectedPackage)?.label}
                  </SelectTrigger>
  
                  <SelectContent class="form-bg border-0">
                    <SelectGroup>
                      {#each $packageType as pkg}
                        <SelectItem value={pkg.value}>{pkg.label}</SelectItem>
                      {/each}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
  
              <div class="col-span-5">
                <Label class="form-fields-label">Total Weight</Label>
                <Input
                  placeholder="5"
                  bind:value={totalWeight}
                  oninput={() => clearError('totalWeight')}
                  data-field="totalWeight"
                  class={`input-field ${errors.totalWeight ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {#if errors.totalWeight}
                  <span class="absolute text-red-500 text-sm mt-1 block"
                    >{errors.totalWeight}</span
                  >
                {/if}
              </div>
  
              <div class="col-span-2 mt-auto">
                <Select
                  type="single"
                  name="Weight"
                  bind:value={selectedWeightUnit}
                >
                  <SelectTrigger
                    class={`select-field ${errors.selectedWeightUnit ? 'border-red-500 ring-1 ring-red-500' : 'border-bland-300/30'}`}
                  >
                    {$weightType.find(p => p.value === selectedWeightUnit)?.label}
                  </SelectTrigger>
  
                  <SelectContent class="form-bg border-0">
                    <SelectGroup>
                      {#each $weightType as pkg}
                        <SelectItem value={pkg.value}>{pkg.label}</SelectItem>
                      {/each}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
  
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label class="form-fields-label">Dimensions (Optional)</Label>
                <Input
                  placeholder="30"
                  bind:value={dimensions1}
                  oninput={() => clearError('dimensions1')}
                  data-field="dimensions1"
                  class={`w-full  input-field ${errors.dimensions1 ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {#if errors.dimensions1}
                  <span class="absolute text-red-500 text-sm mt-1 block"
                    >{errors.dimensions1}</span
                  >
                {/if}
              </div>
  
              <div class="mt-auto">
                <Input
                  placeholder="20"
                  bind:value={dimensions2}
                  oninput={() => clearError('dimensions2')}
                  data-field="dimensions2"
                  class={`w-full  input-field ${errors.dimensions2 ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {#if errors.dimensions2}
                  <span class="absolute text-red-500 text-sm mt-1 block"
                    >{errors.dimensions2}</span
                  >
                {/if}
              </div>
  
              <div class="mt-auto">
                <Input
                  placeholder="15"
                  bind:value={dimensions3}
                  oninput={() => clearError('dimensions3')}
                  data-field="dimensions3"
                  class={`w-full input-field ${errors.dimensions3 ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {#if errors.dimensions3}
                  <span class="absolute text-red-500 text-sm mt-1 block"
                    >{errors.dimensions3}</span
                  >
                {/if}
              </div>
            </div>
  
            <div class="grid grid-cols-1 gap-4">
              <div>
                <Label class="form-fields-label"
                  >Description Off Content (Optional)</Label
                >
                <Textarea
                  bind:value={packageDescription}
                  on:input={() => validateField('packageDescription')}
                  data-field="packageDescription"
                  class={`w-full h-40 accordeion-border input-text rounded-xl py-2 xl:py-[11px] text-sm sm:!text-base data-placeholder:text-bland-950 placeholder:text-bland-950 focus-visible:ring-0 focus-visible:ring-offset-0 ${errors.packageDescription ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Type your message here."
                  rows={10}
                  id="message"
                />
                {#if errors.packageDescription}
                  <span class="absolute text-red-500 text-sm mt-1 block"
                    >{errors.packageDescription}</span
                  >
                {/if}
              </div>
            </div>
          </div>
        </div>
  
        <h3 class="text-2xl font-medium text-bland-950 mt-8">
          Carrier & Service
        </h3>
  
        <div class="mt-8">
          <RadioGroup.Root bind:value={selectedCarrier}>
            {#each $carriers as carrier}
              <label
                class="flex items-start sm:items-center flex-col sm:flex-row justify-between gap-3 border border-bland-200 rounded-md p-3 cursor-pointer"
                class:border-primary-400={selectedCarrier === carrier.id}
                for={carrier.id}
              >
                <div class="flex items-center gap-4">
                  <RadioGroup.Item
                    value={carrier.id}
                    id={carrier.id}
                    class="[&_svg]:bg-bland-950 [&_svg]:rounded-full [&_svg]:size-2.5"
                  />
                  <div class="flex items-center gap-4">
                    <div>
                      <img
                        src={carrier.logo}
                        alt={carrier.name}
                        class="w-8 h-8 object-contain"
                      />
                    </div>
                    <div class="flex flex-col">
                      <p class="font-semibold">{carrier.name}</p>
                      <span class="text-sm text-[#4B5563]"
                        >{carrier.description}</span
                      >
                    </div>
                  </div>
                </div>
                <span
                  class="text-bland-950"
                  class:text-primary-400={selectedCarrier === carrier.id}
                >
                  {carrier.price}
                </span>
              </label>
            {/each}
          </RadioGroup.Root>
          <span class="absolute text-red-500 text-sm mt-1 block min-h-[1rem]"
            >{errors.selectedCarrier || ''}</span
          >
        </div>
  
        <div class="grid grid-cols-1 gap-4 mt-4">
          <div>
            <Label class="form-fields-label"
              >Description Off Content (Optional)</Label
            >
            <Textarea
              bind:value={carrierDescription}
              oninput={() => clearError('carrierDescription')}
              data-field="carrierDescription"
              class={`w-full h-40 accordeion-border input-text rounded-xl py-2 xl:py-[11px] text-sm sm:!text-base data-placeholder:text-bland-950 placeholder:text-bland-950 focus-visible:ring-0 focus-visible:ring-offset-0 ${errors.carrierDescription ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              placeholder="Type your message here."
              rows={10}
              id="message"
            />
            <span class="absolute text-red-500 text-sm mt-1 block min-h-[1rem]"
              >{errors.carrierDescription || ''}</span
            >
          </div>
        </div>
  
        <Button
          onclick={handleNext}
          class="ms-auto me-auto md:me-0 common-button mt-4"
        >
          Next: Review & Confirm
        </Button>
      </div>
    </section>
  </main>

