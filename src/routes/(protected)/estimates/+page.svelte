<script lang="ts">
  import Icon from '@iconify/svelte';
  // @ts-ignore - silence Svelte import type resolution issues

  import Sidebar from '$lib/components/Sidebar.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu';
  import UserImg from '$lib/assets/images/dashboard/user.png';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectGroup,
    SelectLabel,
  } from '$lib/components/ui/select';
  import YourResults from '$lib/components/YourResults.svelte';
  import { showDashboardSidebar, showResults } from '$lib/stores/store';
  import { toast, Toaster } from 'svelte-sonner';
  import * as yup from 'yup';
  import PackageForm from '$lib/components/packageDetails/PackageForm.svelte';
  import DashboardHeader from '$lib/components/DashboardHeader.svelte';

  let selectedValue = '';
  const countries = [
    { value: 'canada', label: 'Canada' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ];

  const cities = [
    { value: 'london', label: 'London' },
    { value: 'manchesterUnited', label: 'Manchester United' },
    { value: 'barcelona', label: 'Barcelona' },
  ];

  $: selectedLabel =
    countries.find(c => c.value === selectedValue)?.label || 'Select a country';
  $: if (selectedValue) {
    console.log('Selected value:', selectedValue);
    console.log('Label:', selectedLabel);
  }
  // Dropdown Logid for Ship to
  let selectedFromCity = '';
  $: selectedFromCityLabel =
    cities.find(c => c.value === selectedFromCity)?.label || 'Select a city';

  let selectedToCountry = '';
  $: selectedToCountryLabel =
    countries.find(c => c.value === selectedToCountry)?.label ||
    'Select a country';

  // react to changes
  $: if (selectedToCountry) {
    console.log('Selected value:', selectedToCountry);
    console.log('Label:', selectedToCountryLabel);
  }

  // currently selected option
  let selectedSignatureOption = '';

  // reactive label for trigger
  const signatureOptions = [
    { value: 'no-signature', label: 'No Signature Required' },
    { value: 'signature-required', label: 'Signature Required' },
    { value: 'adult-signature', label: 'Adult Signature Required' },
  ];

  $: selectedSignatureLabel =
    signatureOptions.find(o => o.value === selectedSignatureOption)?.label ||
    'Select Signature options';

  // Reactive form state
  let fromPostalCode = '';
  let fromCity = '';
  let fromResidential = false;

  let toPostalCode = '';

  let weight = '';
  let length = '';
  let width = '';
  let height = '';
  let declaredValue = '';
  let additionalHandling = false;

  let documentOnly = false;

  // yup validation

  const estimateSchema = yup.object({
    fromCountry: yup.string().required('Country is required'),
    fromPostalCode: yup.string().required('Postal code is required'),
    fromCity: yup.string().required('City is required'),

    toCountry: yup.string().required('Country is required'),
    toPostalCode: yup.string().required('Postal code is required'),

    signatureOptions: yup.string().required('Signature is required'),
  });

  $: estimateData = {
    fromCountry: selectedValue,
    fromPostalCode: fromPostalCode,
    fromCity: selectedFromCity,
    fromResidential: fromResidential,

    toCountry: selectedToCountry,
    toPostalCode: toPostalCode,

    signatureOptions: selectedSignatureOption,
    documentOnly: documentOnly,
  };

  // Making the package details common
  interface PackageData {
    packageType: string;
    packageWeight: string;
    packageUnit: string;
    packageLength: string;
    packageWidth: string;
    packageHeight: string;
    packageUnit2: string;
    packageValue: string;
    additionalHandling: boolean;
  }

  let packages: PackageData[] = [];

  let showClearDialog = false;
  let clearSignal = 0;

  function openClearDialog() {
    showClearDialog = true;
  }

  function cancelClear() {
    showClearDialog = false;
  }

  function confirmClear() {
    // reset page-level fields
    selectedValue = '';
    selectedFromCity = '';
    selectedToCountry = '';
    fromPostalCode = '';
    toPostalCode = '';
    fromResidential = false;

    weight = '';
    length = '';
    width = '';
    height = '';
    declaredValue = '';
    additionalHandling = false;
    documentOnly = false;
    selectedSignatureOption = '';

    // clear packages array
    packages = [];
    errors = {};
    // notify PackageForm to reset its internal fields
    clearSignal += 1;

    showClearDialog = false;
    toast.success('All information cleared');
  }

  function handlePackageAdded(packageData: PackageData) {
    packages = [...packages, packageData];
    console.log('All packages', packages);
  }

  function handleEdit(index: number, updatedPackage?: PackageData) {
    if (updatedPackage) {
      packages = packages.map((p, i) => (i === index ? updatedPackage : p));
      console.log('Updated package at index:', index, updatedPackage);
      return;
    }

    console.log('Edit requested for index:', index);
  }

  function handleDuplicate(index: number) {
    const pkg = packages[index];
    if (!pkg) {
      console.warn('Cannot duplicate. No package at index:', index);
      return;
    }
    const cloned = { ...pkg };
    packages = [
      ...packages.slice(0, index + 1),
      cloned,
      ...packages.slice(index + 1),
    ];
    console.log('Duplicated package at index:', index, cloned);
  }

  function handleDelete(index: number) {
    if (index < 0 || index >= packages.length) {
      console.warn('Cannot delete. Invalid index:', index);
      return;
    }
    const deleted = packages[index];
    packages = packages.filter((_, i) => i !== index);
    console.log('Deleted package at index:', index, deleted);
  }

  // Called by PackageForm when parent requested validation (via packageValidateSignal)
  function handlePackageValidated() {
    if (!awaitingPackageValidation) return;
    awaitingPackageValidation = false;
  }

  let errors: Record<string, string> = {};

  let packageValidateSignal = 0;
  let awaitingPackageValidation = false;

  async function handleNext() {
    errors = {};
    try {
      await estimateSchema.validate(estimateData, { abortEarly: false });

      if (packages && packages.length === 0) {
        toast.error('Atleast add one package to get estimate');
        return;
      } else {
        toast.success('Data submitted successfully!');
        console.log('Estimate Data:', estimateData);
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        errors = err.inner.reduce(
          (acc, curr) => {
            if (curr.path) acc[curr.path] = curr.message;
            return acc;
          },
          {} as Record<string, string>
        );

        console.error('Validation errors:', errors);
        toast.error('Please fill all required fields correctly.');
      } else {
        console.error('Unknown error during validation:', err);
        toast.error('Something went wrong !');
      }
    } finally {
      if (!packages || packages.length === 0) {
        awaitingPackageValidation = true;
        packageValidateSignal =
          packageValidateSignal === 0 ? 1 : packageValidateSignal + 1;
      }
    }
  }

  function clearError(field: string) {
    delete errors[field];
    errors = { ...errors };
  }

  $: {
    if (selectedValue && errors['fromCountry']) {
      clearError('fromCountry');
    }

    if (selectedFromCity && errors['fromCity']) {
      clearError('fromCity');
    }

    if (selectedToCountry && errors['toCountry']) {
      clearError('toCountry');
    }
    if (selectedSignatureOption && errors['signatureOptions']) {
      clearError('signatureOptions');
    }
  }
</script>

<main class="bg-bland-650 h-full">
  <Sidebar />

  <DashboardHeader />

  <section
    class={`${$showDashboardSidebar ? 'lg:w-[calc(100%-256px)]' : 'w-full'}  ms-auto flex-1 p-6 duration-300`}
  >
    <!-- Trying to make package details component common  -->

    <!-- Header banner -->
    <div class="bg-bland-900 rounded-xl p-6 mb-6">
      <div>
        <h3 class="sub-heading !text-bland-25 font-bold !mt-0">Get Estimate</h3>

        <p class="text-bland-25 mt-2">
          Get Instant Shipping Estimates for FedEx, UPS, Canada Post, and more!
        </p>
      </div>
    </div>

    <div class="common-card mb-6">
      <h3 class="text-2xl font-medium text-bland-950">
        What is Your Shipping Location?
      </h3>

      <div
        class="flex gap-5 justify-between items-start xl:flex-row flex-col mt-8"
      >
        <!-- Ship From Section -->
        <div class="w-full">
          <h4 class="form-label-main">Ship From</h4>

          <div class=" grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <Label class="form-fields-label">Country</Label>
              <Select type="single" name="Country" bind:value={selectedValue}>
                <SelectTrigger
                  class={`select-field ${
                    errors['fromCountry']
                      ? 'border-red-500!'
                      : ''
                  }`}
                >
                  {selectedLabel}
                </SelectTrigger>

                <SelectContent class="form-bg border-0">
                  <SelectGroup>
                    <SelectLabel>Country</SelectLabel>
                    {#each countries as country}
                      <SelectItem value={country.value}>
                        {country.label}
                      </SelectItem>
                    {/each}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {#if errors['fromCountry']}
                <span class="absolute text-red-500 text-xs xl:text-sm text-left"
                  >{errors['fromCountry']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Postal code</Label>
              <Input
                placeholder="Postal code"
                bind:value={fromPostalCode}
                oninput={() => {
                  if (errors['fromPostalCode']) clearError('fromPostalCode');
                }}
                class={`input-field ${
                  errors['fromPostalCode']
                    ? 'border-red-500!'
                    : ''
                }`}
              />
              {#if errors['fromPostalCode']}
                <span class="absolute text-red-500 text-xs xl:text-sm text-left"
                  >{errors['fromPostalCode']}</span
                >
              {/if}
            </div>

            <div class="sm:col-span-2">
              <Label class="form-fields-label">City</Label>
              <Select
                type="single"
                name="Country"
                bind:value={selectedFromCity}
              >
                <SelectTrigger
                  class={`select-field ${
                    errors['fromCity'] ? 'border-red-500!' : ''
                  }`}
                >
                  {selectedFromCityLabel}
                </SelectTrigger>

                <SelectContent class="form-bg border-0">
                  <SelectGroup>
                    <SelectLabel>City</SelectLabel>
                    {#each cities as city}
                      <SelectItem value={city.value}>
                        {city.label}
                      </SelectItem>
                    {/each}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {#if errors['fromCity']}
                <span class="absolute text-red-500 text-xs xl:text-sm text-left"
                  >{errors['fromCity']}</span
                >
              {/if}
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center space-x-2">
              <Checkbox bind:checked={fromResidential} id="residential-from" />
              <Label for="residential-from" class="text-sm text-bland-700"
                >Residential (or home office)</Label
              >
            </div>
          </div>
        </div>

        <!-- Swap Button -->
        <div
          class="flex items-center justify-center mx-auto xl:my-auto rotate-90 xl:rotate-none"
        >
          <Button
            size="icon"
            class="rounded-full w-12 h-12 bg-bland-200/30 border-none"
          >
            <Icon icon="tdesign:swap" width="24" height="24" />
          </Button>
        </div>

        <!-- Ship To Section -->
        <div class="space-y-4 w-full">
          <h4 class="form-label-main">Ship To</h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label class="form-fields-label">Country</Label>
              <Select
                type="single"
                name="Country"
                bind:value={selectedToCountry}
              >
                <SelectTrigger
                  class={`select-field ${
                    errors['toCountry'] ? 'border-red-500!' : ''
                  }`}
                >
                  {selectedToCountryLabel}
                </SelectTrigger>

                <SelectContent class="form-bg border-0">
                  <SelectGroup>
                    <SelectLabel>Country</SelectLabel>
                    {#each countries as country}
                      <SelectItem value={country.value}>
                        {country.label}
                      </SelectItem>
                    {/each}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {#if errors['toCountry']}
                <span class="absolute text-red-500 text-xs xl:text-sm text-left"
                  >{errors['toCountry']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Postal code</Label>
              <Input
                placeholder="Postal code"
                bind:value={toPostalCode}
                oninput={() => {
                  if (errors['toPostalCode']) clearError('toPostalCode');
                }}
                class={`input-field
                ${
                  errors['toPostalCode'] ? 'border-red-500!' : ''
                }`}
              />
              {#if errors['toPostalCode']}
                <span class="absolute text-red-500 text-xs xl:text-sm text-left"
                  >{errors['toPostalCode']}</span
                >
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>

    <PackageForm
      showTitle={true}
      title="Which products do You Ship?"
      addButtonText="Add Package"
      showPackageTable={true}
      {packages}
      {clearSignal}
      validateSignal={packageValidateSignal}
      onValidated={handlePackageValidated}
      onPackageAdded={handlePackageAdded}
      onPackageUpdated={handleEdit}
      onPackageDeleted={handleDelete}
      onPackageDuplicated={handleDuplicate}
    />

    <div class="common-card mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="mt-auto">
          <Label class="form-label-main">Extras</Label>

          <div class="mt-8">
            <Label class="form-fields-label mt-3"
              >Select Signature Options</Label
            >

            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              <div class="">
                <Select
                  type="single"
                  name="SignatureOption"
                  bind:value={selectedSignatureOption}
                >
                  <SelectTrigger
                    class={`select-field ${
                      errors['signatureOptions']
                        ? 'border-red-500!'
                        : ''
                    }`}
                  >
                    {selectedSignatureLabel}
                  </SelectTrigger>

                  <SelectContent class="form-bg border-0">
                    <SelectGroup>
                      <SelectLabel>Signature Option</SelectLabel>
                      {#each signatureOptions as option}
                        <SelectItem value={option.value}
                          >{option.label}</SelectItem
                        >
                      {/each}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {#if errors['signatureOptions']}
                  <span
                    class="absolute text-red-500 text-xs xl:text-sm text-left"
                    >{errors['signatureOptions']}</span
                  >
                {/if}
              </div>

              <div class="flex items-center gap-3">
                <Checkbox bind:checked={documentOnly} id="documentonly" />
                <Label
                  for="documentonly"
                  class="font-medium text-bland-950 text-nowrap"
                  >Document Only</Label
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 p-6 rounded-xl mt-8 forminfo-bg"
      >
        <Button
          variant="link"
          class="text-base font-semibold underline p-0 cursor-pointer"
          onclick={openClearDialog}>Clear All Information</Button
        >

        {#if showClearDialog}
          <div
            class="fixed w-full inset-0 z-50 flex items-center justify-center"
          >
            <div
              class="absolute inset-0 bg-black/40"
              role="button"
              tabindex="0"
              aria-label="Close dialog"
              onclick={cancelClear}
              onkeydown={e =>
                (e.key === 'Enter' || e.code === 'Space') && cancelClear()}
            ></div>
            <div
              class="bg-bland-25 rounded-lg p-6 z-10 w-full max-w-86 mx-2 border border-[#D0D5DD]"
            >
              <h3 class="text-lg font-semibold mb-2">Clear all data?</h3>
              <p class="text-sm text-bland-700 mb-4">
                Clearing will reset all fields and remove all packages. This
                action cannot be undone.
              </p>
              <div class="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onclick={cancelClear}
                  class="border border-bland-200 cursor-pointer hover:bg-bland-100"
                >
                  Cancel
                </Button>
                <Button
                  onclick={confirmClear}
                  class="bg-red-500! common-button hover:bg-red-400!"
                  >Clear</Button
                >
              </div>
            </div>
          </div>
        {/if}

        <Button onclick={handleNext} class="common-button">Next</Button>
      </div>
    </div>

    {#if $showResults}
      <div class="common-card mb-6">
        <YourResults />
      </div>
    {/if}
  </section>
</main>

<Toaster position="top-right" />
