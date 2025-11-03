<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  // @ts-ignore - silence Svelte import type resolution issues
  import Sidebar from '$lib/components/Sidebar.svelte';
  import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbSeparator,
    BreadcrumbPage,
  } from '$lib/components/ui/breadcrumb';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectGroup,
    SelectLabel,
  } from '$lib/components/ui/select';
  import * as Yup from 'yup';
  import { toast, Toaster } from 'svelte-sonner';
  import PackageForm from '$lib/components/packageDetails/PackageForm.svelte';
  import { packagesData } from '$lib/data/shipmentData';
  // @ts-ignore - ensure consistent import casing
  import DashboardHeader from '$lib/components/DashboardHeader.svelte';
  import { showDashboardSidebar } from '$lib/stores/store';

  let selectedValue = '';
  const countries = [
    { value: 'canada', label: 'Canada' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ];

  $: selectedLabel =
    countries.find(c => c.value === selectedValue)?.label || 'Select a country';

  // Dropdown Logid for Ship to
  let selectedToCountry = '';
  $: selectedToCountryLabel =
    countries.find(c => c.value === selectedToCountry)?.label ||
    'Select a country';

  //Dropdown logic for Package Details Modal

  const packageies = [
    { value: 'envelope', label: 'Envelope' },
    { value: 'package', label: 'Package' },
    { value: 'box', label: 'Box' },
  ];
  let selectedPackage = '';
  $: selectedPacakageLabel =
    packageies.find(c => c.value === selectedPackage)?.label ||
    'Select a package';

  //Dropdown logic for Package Details

  let selectedPackageDetail = '';
  $: selectedPacakageLabelDetail =
    packageies.find(c => c.value === selectedPackageDetail)?.label ||
    'Select a package';

  // //Dropdown logic for Unit details modal
  const units = [
    { value: 'lbs', label: 'LBS' },
    { value: 'kg', label: 'KG' },
    { value: 'oz', label: 'OZ' },
  ];
  let selectedUnitModal = '';
  $: selectedUnitModalLabel =
    units.find(c => c.value === selectedUnitModal)?.label || 'Select any unit';

  //

  const dimensionUnits = [
    { value: 'inches', label: 'Inches' },
    { value: 'cm', label: 'CM' },
    { value: 'mm', label: 'MM' },
  ];
  let selectedDimensionUnitModal = '';

  $: selectedDimensionLabelModal =
    dimensionUnits.find(u => u.value === selectedDimensionUnitModal)?.label ||
    'Select any unit';

  //
  let selectedUnit = '';
  $: selectedUnitLabel =
    units.find(c => c.value === selectedUnit)?.label || 'Select any unit';

  //
  let selectedDimensionUnit = '';

  $: selectedDimensionLabel =
    dimensionUnits.find(u => u.value === selectedDimensionUnit)?.label ||
    'Select any unit';

  //

  const signatureOptions = [
    { value: 'no-signature', label: 'No Signature Required' },
    { value: 'signature-required', label: 'Signature Required' },
    { value: 'adult-signature', label: 'Adult Signature Required' },
  ];

  // currently selected option
  let selectedSignatureOption = '';

  // reactive label for trigger
  $: selectedSignatureLabel =
    signatureOptions.find(o => o.value === selectedSignatureOption)?.label ||
    'Select Signature options';

  // Form data variables
  // Ship From
  let fromCompany = '';
  let fromContact = '';
  let fromPhone = '';
  let fromEmail = '';
  let fromAddress = '';
  let fromPostalCode = '';
  let fromCity = '';
  let fromResidential = false;
  let fromDefault = false;
  let fromSaveToAddressBook = false;

  // Ship To
  let toCompany = '';
  let toContact = '';
  let toPhone = '';
  let toEmail = '';
  let toAddress = '';
  let toPostalCode = '';
  let toCity = '';
  let toResidential = false;
  let toDefault = false;
  let toSaveToAddressBook = false;

  // Extras
  let deliveryComments = '';
  let referenceNumber = '';
  let emailNotifications = false;
  let documentsOnly = false;

  // all fields form data

  $: formData = {
    shipFrom: {
      company: fromCompany,
      contact: fromContact,
      phone: fromPhone,
      email: fromEmail,
      address: fromAddress,
      country: selectedValue,
      countryLabel: selectedLabel,
      postalCode: fromPostalCode,
      city: fromCity,
      residential: fromResidential,
      defaultAddress: fromDefault,
      saveToAddressBook: fromSaveToAddressBook,
    },
    shipTo: {
      company: toCompany,
      contact: toContact,
      phone: toPhone,
      email: toEmail,
      address: toAddress,
      country: selectedToCountry,
      countryLabel: selectedToCountryLabel,
      postalCode: toPostalCode,
      city: toCity,
      residential: toResidential,
      defaultAddress: toDefault,
      saveToAddressBook: toSaveToAddressBook,
    },
    extras: {
      signatureOption: selectedSignatureOption,
      signatureOptionLabel: selectedSignatureLabel,
      deliveryComments: deliveryComments,
      referenceNumber: referenceNumber,
      emailNotifications: emailNotifications,
      documentsOnly: documentsOnly,
    },
  };

  // Clear dialog  signal to notify PackageForm (no ref)
  let showClearDialog = false;
  let clearSignal = 0;

  function openClearDialog() {
    showClearDialog = true;
  }

  function cancelClear() {
    showClearDialog = false;
  }

  // Cleares the input fields and errore as well
  function confirmClear() {
    // Reset top-level select / form fields
    errors = {};
    selectedValue = '';
    selectedToCountry = '';
    selectedPackage = '';
    selectedPackageDetail = '';
    selectedUnitModal = '';
    selectedDimensionUnitModal = '';
    selectedUnit = '';
    selectedDimensionUnit = '';
    selectedSignatureOption = '';

    // Ship From
    fromCompany = '';
    fromContact = '';
    fromPhone = '';
    fromEmail = '';
    fromAddress = '';
    fromPostalCode = '';
    fromCity = '';
    fromResidential = false;
    fromDefault = false;
    fromSaveToAddressBook = false;

    // Ship To
    toCompany = '';
    toContact = '';
    toPhone = '';
    toEmail = '';
    toAddress = '';
    toPostalCode = '';
    toCity = '';
    toResidential = false;
    toDefault = false;
    toSaveToAddressBook = false;

    // Extras
    deliveryComments = '';
    referenceNumber = '';
    emailNotifications = false;
    documentsOnly = false;

    // Clear packages list
    packages = [];

    // Tell PackageForm to reset its internal fields (increment so change is detected)
    clearSignal += 1;

    showClearDialog = false;
    toast.success('All information cleared');
  }
  function resetForm() {
    // Reset top-level select / form fields
    selectedValue = '';
    selectedToCountry = '';
    selectedPackage = '';
    selectedPackageDetail = '';
    selectedUnitModal = '';
    selectedDimensionUnitModal = '';
    selectedUnit = '';
    selectedDimensionUnit = '';
    selectedSignatureOption = '';

    // Ship From
    fromCompany = '';
    fromContact = '';
    fromPhone = '';
    fromEmail = '';
    fromAddress = '';
    fromPostalCode = '';
    fromCity = '';
    fromResidential = false;
    fromDefault = false;
    fromSaveToAddressBook = false;

    // Ship To
    toCompany = '';
    toContact = '';
    toPhone = '';
    toEmail = '';
    toAddress = '';
    toPostalCode = '';
    toCity = '';
    toResidential = false;
    toDefault = false;
    toSaveToAddressBook = false;

    // Extras
    deliveryComments = '';
    referenceNumber = '';
    emailNotifications = false;
    documentsOnly = false;

    // Clear packages list
    packages = [];
  }

  // Yup validation schema for shipFromSchema

  const shipFromSchema = Yup.object({
    company: Yup.string().required('Company name is required'),
    contact: Yup.string()
      .matches(/^[0-9\-()\s]*$/, 'Invalid phone number')
      .required('Phone number is required'),
    phone: Yup.string()
      .matches(/^[0-9\-()\s]*$/, 'Invalid phone number')
      .required('Phone number is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    countryLabel: Yup.string().required('Country label is required'),
    postalCode: Yup.string().required('Postal code is required'),
    city: Yup.string().required('City is required'),

    // Optional fields — no required() rule
    residential: Yup.boolean(),
    defaultAddress: Yup.boolean(),
    saveToAddressBook: Yup.boolean(),
  });

  // Yup validation schema for shipToSchema

  const shipToSchema = Yup.object({
    company: Yup.string().required('Company is required'),
    contact: Yup.string()
      .matches(/^[0-9\-()\s]*$/, 'Invalid phone number')
      .required('Phone number is required'),
    phone: Yup.string()
      .required('Phone is required')
      .matches(/^[0-9\-()\s]*$/, 'Invalid phone number'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    countryLabel: Yup.string().required('Country label is required'),
    postalCode: Yup.string().required('Postal code is required'),
    city: Yup.string().required('City is required'),

    // Optional fields
    residential: Yup.boolean().optional(),
    defaultAddress: Yup.boolean().optional(),
    saveToAddressBook: Yup.boolean().optional(),
  });

  // Yup validation schema for extras

  const extrasSchema = Yup.object({
    signatureOption: Yup.string().required('Signature option is required'),
    signatureOptionLabel: Yup.string().required(
      'Signature option label is required'
    ),
    deliveryComments: Yup.string().required('Delivery comment is required'),
    referenceNumber: Yup.string().required('Reference number is required'),

    // Optional booleans
    emailNotifications: Yup.boolean().optional(),
    documentsOnly: Yup.boolean().optional(),
  });

  // All form schema into one.

  const shippingSchema = Yup.object({
    shipFrom: shipFromSchema,
    shipTo: shipToSchema,
    extras: extrasSchema,
  });

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
      await shippingSchema.validate(formData, { abortEarly: false });

      if (!packages || packages.length === 0) {
        toast.error('At least add one package to get estimate');

        // Trigger package validation only when no packages exist
        awaitingPackageValidation = true;
        packageValidateSignal =
          packageValidateSignal === 0 ? 1 : packageValidateSignal + 1;

        return;
      }

      // Everything is valid
      toast.success('Data submitted successfully!');
      packagesData.update(data => [...data, formData]);
      console.log('Estimate Data:', $packagesData);

      resetForm();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        errors = err.inner.reduce(
          (acc, curr) => {
            if (curr.path) acc[curr.path] = curr.message;
            return acc;
          },
          {} as Record<string, string>
        );

        console.error('Validation errors:', errors);
        toast.error('Please fill all required fields correctly.');

        // Trigger package validation also when form validation fails
        if (!packages || packages.length === 0) {
          awaitingPackageValidation = true;
          packageValidateSignal =
            packageValidateSignal === 0 ? 1 : packageValidateSignal + 1;
        }
      } else {
        console.error('Unknown error during validation:', err);
        toast.error('Something went wrong!');
      }
    }
  }

  function clearError(field: string) {
    delete errors[field];
    errors = { ...errors };
  }

  $: {
    if (selectedValue && errors['shipFrom.country']) {
      clearError('shipFrom.country');
    }

    if (selectedToCountry && errors['shipTo.country']) {
      clearError('shipTo.country');
    }
    if (selectedSignatureOption && errors['extras.signatureOption']) {
      clearError('extras.signatureOption');
    }
  }

  let isSwapping = false;

  function swapAddresses() {
    if (isSwapping) return;

    isSwapping = true;

    // Swap all the values
    [fromCompany, toCompany] = [toCompany, fromCompany];
    [fromContact, toContact] = [toContact, fromContact];
    [fromPhone, toPhone] = [toPhone, fromPhone];
    [fromEmail, toEmail] = [toEmail, fromEmail];
    [fromAddress, toAddress] = [toAddress, fromAddress];
    [selectedValue, selectedToCountry] = [selectedToCountry, selectedValue];
    [fromPostalCode, toPostalCode] = [toPostalCode, fromPostalCode];
    [fromCity, toCity] = [toCity, fromCity];
    [fromResidential, toResidential] = [toResidential, fromResidential];
    [fromDefault, toDefault] = [toDefault, fromDefault];
    [fromSaveToAddressBook, toSaveToAddressBook] = [
      toSaveToAddressBook,
      fromSaveToAddressBook,
    ];

    // Reset animation state after completion
    setTimeout(() => {
      isSwapping = false;
    }, 600);
  }
</script>

<main class="bg-bland-650 h-full">
  <Sidebar />

  <DashboardHeader />

  <section
    class={`${$showDashboardSidebar ? 'lg:w-[calc(100%-256px)]' : 'w-full'}  ms-auto flex-1 p-6 duration-300`}
  >
    <!-- Header banner -->
    <div
      class="bg-bland-900 rounded-xl p-6 flex items-center justify-between mb-6"
    >
      <div>
        <h3 class="sub-heading !text-bland-25 font-bold !mt-0">
          Create Shipment
        </h3>
        <p class="text-bland-25 my-2">
          Fill out the details below to create your shipment
        </p>
      </div>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="bg-bland-25 rounded-xl p-3 border border-[#D0D5DD] mb-6">
      <Breadcrumb>
        <BreadcrumbList class="flex items-center gap-2">
          <BreadcrumbItem>
            <div
              class="flex items-center gap-2 bg-primary-400 text-bland-25 px-4 py-3 rounded-lg font-semibold"
            >
              <Icon icon="mynaui:truck" class="size-5" />
              <span>Create Shipment</span>
            </div>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="mynaui:chevron-right" class="size-4 text-gray-400" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage class="text-gray-500 font-medium">
              Commercial Invoice
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="mynaui:chevron-right" class="size-4 text-gray-400" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage class="text-gray-500 font-medium">
              Your Results
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="mynaui:chevron-right" class="size-4 text-gray-400" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage class="text-gray-500 font-medium">
              Checkout
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <!-- Shipping Location Form -->
    <div class="common-card mb-6">
      <h3 class="text-xl font-semibold text-bland-950 mb-6">
        What Is Your Shipping Location?
      </h3>

      <div class="flex gap-5 justify-between items-center xl:flex-row flex-col">
        <!-- Ship From Section -->
        <div class="space-y-4 w-full">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-medium text-bland-950">Ship From</h4>
            <Button
              variant="outline"
              class="text-sm px-4 py-2 h-auto rounded-sm"
            >
              Address Book
            </Button>
          </div>

          <div class=" grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label class="form-fields-label">Company</Label>
              <Input
                placeholder="Company"
                bind:value={fromCompany}
                oninput={() => {
                  if (errors['shipFrom.company'])
                    clearError('shipFrom.company');
                }}
                class={`input-field 
                ${errors['shipFrom.company'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipFrom.company']}
                <span class="absolute text-red-500 text-xs xl:text-sm absolute"
                  >{errors['shipFrom.company']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Contact</Label>
              <Input
                bind:value={fromContact}
                type="number"
                oninput={() => {
                  if (errors['shipFrom.contact'])
                    clearError('shipFrom.contact');
                }}
                placeholder="Contact"
                class={`input-field 
              ${errors['shipFrom.contact'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipFrom.contact']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipFrom.contact']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Phone</Label>
              <Input
                placeholder="Phone"
                type="number"
                bind:value={fromPhone}
                oninput={() => {
                  if (errors['shipFrom.phone']) clearError('shipFrom.phone');
                }}
                class={`input-field
              ${errors['shipFrom.phone'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipFrom.phone']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipFrom.phone']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Email</Label>
              <Input
                placeholder="Email"
                bind:value={fromEmail}
                oninput={() => {
                  if (errors['shipFrom.email']) clearError('shipFrom.email');
                }}
                class={`input-field 
              ${errors['shipFrom.email'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipFrom.email']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipFrom.email']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Address</Label>
              <Input
                placeholder="Address"
                bind:value={fromAddress}
                oninput={() => {
                  if (errors['shipFrom.address'])
                    clearError('shipFrom.address');
                }}
                class={`input-field 
              ${errors['shipFrom.address'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipFrom.address']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipFrom.address']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Country</Label>

              <Select type="single" name="Country" bind:value={selectedValue}>
                <SelectTrigger
                  class={`select-field 
              ${errors['shipFrom.country'] ? 'border-red-500!' : ''}`}
                >
                  {selectedLabel}
                </SelectTrigger>

                <SelectContent>
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
              {#if errors['shipFrom.country']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipFrom.country']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Postal code</Label>
              <Input
                placeholder="Abc"
                class={`input-field 
              ${errors['shipFrom.postalCode'] ? 'border-red-500!' : ''}`}
                bind:value={fromPostalCode}
                oninput={() => {
                  if (errors['shipFrom.postalCode'])
                    clearError('shipFrom.postalCode');
                }}
              />
              {#if errors['shipFrom.postalCode']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipFrom.postalCode']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">City</Label>
              <Input
                placeholder="City"
                bind:value={fromCity}
                oninput={() => {
                  if (errors['shipFrom.city']) clearError('shipFrom.city');
                }}
                class={`input-field 
              ${errors['shipFrom.city'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipFrom.city']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipFrom.city']}</span
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

            <div class="flex items-center space-x-2">
              <Checkbox bind:checked={fromDefault} id="default-from" />
              <Label for="default-from" class="text-sm text-bland-700"
                >Set as my default address</Label
              >
            </div>

            <div class="flex items-center space-x-2">
              <Checkbox bind:checked={fromSaveToAddressBook} id="save-from" />
              <Label for="save-from" class="text-sm text-bland-700"
                >Save To Address Book</Label
              >
            </div>
          </div>
        </div>

        <!-- Swap Button -->
        <div class="flex items-center justify-center">
          <Button
            size="icon"
            class="rounded-full w-12 h-12 bg-bland-200/30 border-none duration-800 {isSwapping
              ? 'transform rotate-[360deg]'
              : ''}"
            onclick={swapAddresses}
            disabled={isSwapping}
          >
            <Icon icon="tdesign:swap" width="24" height="24" />
          </Button>
        </div>

        <!-- Ship To Section -->
        <div class="space-y-4 w-full">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-medium text-bland-950">Ship To</h4>
            <Button
              variant="outline"
              class="text-sm px-4 py-2 h-auto rounded-sm"
            >
              Address Book
            </Button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label class="form-fields-label">Company</Label>
              <Input
                placeholder="Company"
                bind:value={toCompany}
                oninput={() => {
                  if (errors['shipTo.company']) clearError('shipTo.company');
                }}
                class={`input-field 
                ${errors['shipTo.company'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipTo.company']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipTo.company']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Contact</Label>
              <Input
                placeholder="Contact"
                type="number"
                bind:value={toContact}
                oninput={() => {
                  if (errors['shipTo.contact']) clearError('shipTo.contact');
                }}
                class={`input-field 
                ${errors['shipTo.contact'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipTo.contact']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipTo.contact']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Phone</Label>
              <Input
                placeholder="Phone"
                type="number"
                bind:value={toPhone}
                oninput={() => {
                  if (errors['shipTo.phone']) clearError('shipTo.phone');
                }}
                class={`input-field 
                ${errors['shipTo.phone'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipTo.phone']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipTo.phone']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Email</Label>
              <Input
                placeholder="Email"
                bind:value={toEmail}
                oninput={() => {
                  if (errors['shipTo.email']) clearError('shipTo.email');
                }}
                class={`input-field 
                ${errors['shipTo.email'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipTo.email']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipTo.email']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Address</Label>
              <Input
                placeholder="Address"
                bind:value={toAddress}
                oninput={() => {
                  if (errors['shipTo.address']) clearError('shipTo.address');
                }}
                class={`input-field 
                ${errors['shipTo.address'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipTo.address']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipTo.address']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Country</Label>
              <Select
                type="single"
                name="Country"
                bind:value={selectedToCountry}
              >
                <SelectTrigger
                  class={`select-field 
                ${errors['shipTo.country'] ? 'border-red-500!' : ''}`}
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
              {#if errors['shipTo.country']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipTo.country']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">Postal code</Label>
              <Input
                placeholder="Postal code"
                bind:value={toPostalCode}
                oninput={() => {
                  if (errors['shipTo.postalCode'])
                    clearError('shipTo.postalCode');
                }}
                class={`input-field 
                ${errors['shipTo.postalCode'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipTo.postalCode']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipTo.postalCode']}</span
                >
              {/if}
            </div>

            <div>
              <Label class="form-fields-label">City</Label>
              <Input
                placeholder="City"
                bind:value={toCity}
                oninput={() => {
                  if (errors['shipTo.city']) clearError('shipTo.city');
                }}
                class={`input-field 
                ${errors['shipTo.city'] ? 'border-red-500!' : ''}`}
              />
              {#if errors['shipTo.city']}
                <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                  >{errors['shipTo.city']}</span
                >
              {/if}
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center space-x-2">
              <Checkbox bind:checked={toResidential} id="residential-to" />
              <Label for="residential-to" class="text-sm text-bland-700"
                >Residential (or home office)</Label
              >
            </div>

            <div class="flex items-center space-x-2">
              <Checkbox bind:checked={toDefault} id="default-to" />
              <Label for="default-to" class="text-sm text-bland-700"
                >Set as my default address</Label
              >
            </div>

            <div class="flex items-center space-x-2">
              <Checkbox bind:checked={toSaveToAddressBook} id="save-to" />
              <Label for="save-to" class="text-sm text-bland-700"
                >Save To Address Book</Label
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Form -->

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

    <!-- Extras Form -->
    <div class="common-card mb-6">
      <h3 class="text-xl font-semibold text-bland-950 mb-6">Extras</h3>

      <!-- Form Fields -->
      <div class="space-y-6">
        <!-- First Row: Select Signature Option and Delivery Comments -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="form-fields-label">Select Signature Option</Label>
            <Select
              type="single"
              name="SignatureOption"
              bind:value={selectedSignatureOption}
            >
              <SelectTrigger
                class={`select-field 
                ${errors['extras.signatureOption'] ? 'border-red-500!' : ''}`}
              >
                {selectedSignatureLabel}
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Signature Option</SelectLabel>
                  {#each signatureOptions as option}
                    <SelectItem value={option.value}>{option.label}</SelectItem>
                  {/each}
                </SelectGroup>
              </SelectContent>
            </Select>
            {#if errors['extras.signatureOption']}
              <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                >{errors['extras.signatureOption']}</span
              >
            {/if}
          </div>

          <div>
            <Label class="form-fields-label">Delivery Comments</Label>
            <Input
              placeholder="Comments"
              bind:value={deliveryComments}
              oninput={() => {
                if (errors['extras.deliveryComments'])
                  clearError('extras.deliveryComments');
              }}
              class={`input-field 
                ${errors['extras.deliveryComments'] ? 'border-red-500!' : ''}`}
            />
            {#if errors['extras.deliveryComments']}
              <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                >{errors['extras.deliveryComments']}</span
              >
            {/if}
          </div>
          <!-- Reference Number -->
          <div>
            <Label class="form-fields-label">Reference Number</Label>
            <Input
              placeholder="Reference Number"
              bind:value={referenceNumber}
              oninput={() => {
                if (errors['extras.referenceNumber'])
                  clearError('extras.referenceNumber');
              }}
              class={`input-field 
                ${errors['extras.referenceNumber'] ? 'border-red-500!' : ''}`}
            />
            {#if errors['extras.referenceNumber']}
              <span class="text-red-500 text-xs xl:text-sm absolute text-left"
                >{errors['extras.referenceNumber']}</span
              >
            {/if}
          </div>
        </div>

        <!-- Checkboxes -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <Checkbox
              bind:checked={emailNotifications}
              id="email-notifications"
            />
            <Label for="email-notifications" class="text-sm text-bland-700"
              >Email Notifications</Label
            >
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox bind:checked={documentsOnly} id="documents-only" />
            <Label for="documents-only" class="text-sm text-bland-700"
              >Documents Only</Label
            >
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4"
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

          <Button onclick={handleNext} class="common-button">
            Next
          </Button>
        </div>
      </div>
    </div>
  </section>
</main>

<Toaster position="top-right" />
