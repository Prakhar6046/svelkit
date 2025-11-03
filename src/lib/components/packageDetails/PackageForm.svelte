<script lang="ts">
  import { Label } from '../../../lib/components/ui/label';
  import { Input } from '../../../lib/components/ui/input';
  import { Button } from '../../../lib/components/ui/button';
  import { Checkbox } from '../../../lib/components/ui/checkbox';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
  } from '../../../lib/components/ui/select';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '../../../lib/components/ui/table';
  import * as Dialog from '../../../lib/components/ui/dialog';
  import Icon from '@iconify/svelte';
  import * as yup from 'yup';
  import { toast } from 'svelte-sonner';

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

  // Props
  export let showTitle = true;
  export let title = 'Which products do You Ship?';
  export let addButtonText = 'Add Package';
  export let showPackageTable = true;
  export let packages: Array<any> = [];
  export let onPackageAdded: ((packageData: PackageData) => void) | null = null;
  export let onPackageUpdated:
    | ((index: number, packageData: PackageData) => void)
    | null = null;
  export let onPackageDuplicated: ((index: number) => void) | null = null;
  export let onPackageDeleted: ((index: number) => void) | null = null;
  export let onValidated: ((result: { valid: boolean }) => void) | null = null;

  export let clearSignal: number = 0;
  let _lastClearSignal = 0;

  export let validateSignal: number = 0;
  let _lastValidateSignal = 0;

  // Data options
  const packageies = [
    { value: 'envelope', label: 'Envelope' },
    { value: 'package', label: 'Package' },
    { value: 'box', label: 'Box' },
  ];

  const units = [
    { value: 'lbs', label: 'LBS' },
    { value: 'kg', label: 'KG' },
    { value: 'oz', label: 'OZ' },
  ];

  const dimensionUnits = [
    { value: 'inches', label: 'Inches' },
    { value: 'cm', label: 'CM' },
    { value: 'mm', label: 'MM' },
  ];

  // Form state
  let selectedPackageDetail = '';
  let weight = '';
  let selectedUnit = '';
  let length = '';
  let width = '';
  let height = '';
  let selectedDimensionUnit = '';
  let declaredValue = '';
  let additionalHandling = false;

  // Error handling
  let packageErrors: Record<string, string> = {};

  // Edit modal state
  let editingIndex: number = -1;
  let editModalOpen = false;
  let editPackageType = '';
  let editWeight = '';
  let editWeightUnit = '';
  let editLength = '';
  let editWidth = '';
  let editHeight = '';
  let editDimensionUnit = '';
  let editDeclaredValue = '';
  let editAdditionalHandling = false;

  // Delete modal state
  let deleteIndex: number = -1;
  let deleteModalOpen = false;

  // Validation schema
  const packageSchema = yup.object({
    packageType: yup.string().required('Package type is required'),
    packageWeight: yup
      .string()
      .matches(/^\d+(\.\d+)?$/, 'Weight must be a number')
      .required('Weight is required'),
    packageUnit: yup.string().required('Unit is required'),
    packageLength: yup
      .string()
      .matches(/^\d+(\.\d+)?$/, 'Length must be a number')
      .required('Length is required'),
    packageWidth: yup
      .string()
      .matches(/^\d+(\.\d+)?$/, 'Width must be a number')
      .required('Width is required'),
    packageHeight: yup
      .string()
      .matches(/^\d+(\.\d+)?$/, 'Height must be a number')
      .required('Height is required'),
    packageUnit2: yup.string().required('Unit is required'),
    packageValue: yup
      .string()
      .matches(/^\d+(\.\d+)?$/, 'Value must be a number')
      .required('Value is required'),
  });

  // Reactive labels
  $: selectedPacakageLabelDetail =
    packageies.find(p => p.value === selectedPackageDetail)?.label ||
    'Select Package Type';

  $: selectedUnitLabel =
    units.find(c => c.value === selectedUnit)?.label || 'Select any unit';

  $: selectedDimensionLabel =
    dimensionUnits.find(u => u.value === selectedDimensionUnit)?.label ||
    'Select any unit';

  // Edit modal reactive labels
  $: editPackageTypeLabel =
    packageies.find(p => p.value === editPackageType)?.label ||
    'Select Package Type';

  $: editWeightUnitLabel =
    units.find(c => c.value === editWeightUnit)?.label || 'Select any unit';

  $: editDimensionUnitLabel =
    dimensionUnits.find(u => u.value === editDimensionUnit)?.label ||
    'Select any unit';

  // Reactive package data
  $: packageData = {
    packageType: selectedPackageDetail,
    packageWeight: weight,
    packageUnit: selectedUnit,
    packageLength: length,
    packageWidth: width,
    packageHeight: height,
    packageUnit2: selectedDimensionUnit,
    packageValue: declaredValue,
    additionalHandling: additionalHandling,
  };

  async function validateForm(): Promise<boolean> {
    packageErrors = {};
    try {
      await packageSchema.validate(packageData, { abortEarly: false });
      packageErrors = {};
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errs: Record<string, string> = {};
        err.inner.forEach(e => {
          if (e.path) {
            // normalize schema paths to your packageErrors keys
            // assume schema uses keys like packageType, packageWeight etc.
            errs[e.path] = e.message;
          }
        });
        packageErrors = errs;
      } else {
        console.error('Unexpected validation error', err);
      }
      return false;
    }
  }

  // Clear errors when select values change
  $: {
    if (selectedPackageDetail && packageErrors['packageType']) {
      packageClearError('packageType');
    }
    if (selectedUnit && packageErrors['packageUnit']) {
      packageClearError('packageUnit');
    }
    if (selectedDimensionUnit && packageErrors['packageUnit2']) {
      packageClearError('packageUnit2');
    }
  }

  function packageClearError(field: string) {
    delete packageErrors[field];
    packageErrors = { ...packageErrors };
  }

  async function handleAddPackage() {
    try {
      packageErrors = {}; // clear previous errors
      await packageSchema.validate(packageData, { abortEarly: false });
      toast.success('Package details added');
      console.log('Package details : ', packageData);

      // Call the callback if provided
      if (onPackageAdded) {
        onPackageAdded(packageData);
      }

      // Reset form
      resetForm();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        packageErrors = err.inner.reduce(
          (acc, curr) => {
            if (curr.path) acc[curr.path] = curr.message;
            return acc;
          },
          {} as Record<string, string>
        );

        console.error('Package add errors:', packageErrors);
        toast.error('Please fill all required fields correctly.');
      } else {
        console.error('Unknown error during validation:', err);
        toast.error('Something went wrong !');
      }
    }
  }

  function resetForm() {
    selectedPackageDetail = '';
    weight = '';
    selectedUnit = '';
    length = '';
    width = '';
    height = '';
    selectedDimensionUnit = '';
    declaredValue = '';
    additionalHandling = false;
  }

  function resetAll() {
    resetForm();
    packageErrors = {};
    editingIndex = -1;
    editModalOpen = false;
    editPackageType = '';
    editWeight = '';
    editWeightUnit = '';
    editLength = '';
    editWidth = '';
    editHeight = '';
    editDimensionUnit = '';
    editDeclaredValue = '';
    editAdditionalHandling = false;
    deleteIndex = -1;
    deleteModalOpen = false;
  }

  // expose public reset if ever needed
  export function resetFormPublic() {
    resetAll();
  }

  // react to parent validateSignal -> run validateForm and call callback (no dispatch)
  $: (async () => {
    if (validateSignal !== _lastValidateSignal) {
      _lastValidateSignal = validateSignal;
      const valid = await validateForm();
      if (onValidated) onValidated({ valid });
    }
  })();

  // react to parent clear signal
  $: if (clearSignal !== _lastClearSignal) {
    _lastClearSignal = clearSignal;
    resetAll();
  }

  function handleEdit(index: number) {
    editingIndex = index;
    const pkg = packages[index];

    // Populate edit form with package data
    editPackageType = pkg.packageType;
    editWeight = pkg.packageWeight;
    editWeightUnit = pkg.packageUnit;
    editLength = pkg.packageLength;
    editWidth = pkg.packageWidth;
    editHeight = pkg.packageHeight;
    editDimensionUnit = pkg.packageUnit2;
    editDeclaredValue = pkg.packageValue;
    editAdditionalHandling = pkg.additionalHandling || false;

    // editModalOpen = true;
  }

  function handleSaveEdit() {
    const updatedPackage = {
      packageType: editPackageType,
      packageWeight: editWeight,
      packageUnit: editWeightUnit,
      packageLength: editLength,
      packageWidth: editWidth,
      packageHeight: editHeight,
      packageUnit2: editDimensionUnit,
      packageValue: editDeclaredValue,
      additionalHandling: editAdditionalHandling,
    };

    if (onPackageUpdated) {
      onPackageUpdated(editingIndex, updatedPackage);
    }

    editModalOpen = false;
    toast.success('Package updated successfully');
  }

  function handleDuplicate(index: number) {
    if (onPackageDuplicated) {
      onPackageDuplicated(index);
      toast.success('Package duplicated successfully');
    }
  }

  function handleDeleteClick(index: number) {
    deleteIndex = index;
    // deleteModalOpen = true;
  }

  function handleConfirmDelete() {
    if (onPackageDeleted) {
      onPackageDeleted(deleteIndex);
      toast.success('Package deleted successfully');
    }
    deleteModalOpen = false;
  }
</script>

<div class="common-card mb-6">
  {#if showTitle}
    <h3 class="text-2xl font-medium text-bland-950">
      {title}
    </h3>
  {/if}

  <!-- Package Summary Table -->
  {#if showPackageTable && packages.length > 0}
    <div class="mt-8">
      <Label class="form-label-main">Package Summary</Label>

      <Table class="mt-4 rounded-xl overflow-hidden">
        <TableHeader class="bg-bland-900 text-bland-25">
          <TableRow>
            <TableHead class="text-bland-25 font-medium">Box</TableHead>
            <TableHead class="text-bland-25 font-medium">Package Type</TableHead
            >
            <TableHead class="text-bland-25 font-medium">Weight</TableHead>
            <TableHead class="text-bland-25 font-medium">Dimensions</TableHead>
            <TableHead class="text-bland-25 font-medium"
              >Declared Value</TableHead
            >
            <TableHead class="text-bland-25 font-medium"
              >Additional Handling</TableHead
            >
            <TableHead class="text-bland-25 font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each packages as pkg, index}
            <TableRow class="bg-bland-25">
              <TableCell class="font-medium">{index + 1}</TableCell>
              <TableCell>{pkg.packageType}</TableCell>
              <TableCell>{pkg.packageWeight} {pkg.packageUnit}</TableCell>
              <TableCell>
                {pkg.packageLength} x {pkg.packageWidth} x {pkg.packageHeight}
                {pkg.packageUnit2}
              </TableCell>
              <TableCell>${pkg.packageValue}</TableCell>
              <TableCell>{pkg.additionalHandling ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <!-- Edit Button with Dialog -->
                  <div>
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 p-0 cursor-pointer"
                          onclick={() => handleEdit(index)}
                        >
                          <Icon
                            icon="hugeicons:pencil-edit-02"
                            width="24"
                            height="24"
                            class="text-bland-700"
                          />
                        </Button>
                      </Dialog.Trigger>
                      <Dialog.Content
                        class="common-card md:min-w-[800px] min-w-[300px] overflow-y-auto h-full max-h-[615px]"
                      >
                        <Dialog.Header>
                          <Dialog.Title
                            class="text-xl font-semibold text-bland-950"
                          >
                            Edit Package
                          </Dialog.Title>

                          <Dialog.Description>
                            <!-- Package Details Section -->
                            <div class="mb-8 mt-12">
                              <h4
                                class="text-lg font-medium text-bland-950 mb-4"
                              >
                                Package Details
                              </h4>
                              <div
                                class="grid grid-cols-1 md:grid-cols-3 gap-4"
                              >
                                <div>
                                  <Label class="form-fields-label">
                                    Package Type
                                  </Label>
                                  <Select
                                    type="single"
                                    name="PackageType"
                                    bind:value={editPackageType}
                                  >
                                    <SelectTrigger class="select-field">
                                      {editPackageTypeLabel}
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Package Type</SelectLabel>
                                        {#each packageies as item}
                                          <SelectItem value={item.value}
                                            >{item.label}</SelectItem
                                          >
                                        {/each}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label class="form-fields-label">
                                    Weight
                                  </Label>
                                  <Input
                                    bind:value={editWeight}
                                    type="number"
                                    placeholder="Abc"
                                    class="w-full h-10 rounded-lg border border-bland-200 bg-transparent px-3 py-2 text-sm"
                                  />
                                </div>

                                <div>
                                  <Label class="form-fields-label">Units</Label>
                                  <Select
                                    type="single"
                                    name="WeightUnits"
                                    bind:value={editWeightUnit}
                                  >
                                    <SelectTrigger
                                      class="w-full h-10 rounded-lg border border-bland-200 bg-transparent px-3 py-2 text-sm"
                                    >
                                      {editWeightUnitLabel}
                                    </SelectTrigger>
                                    <SelectContent class="form-bg border-0">
                                      <SelectGroup>
                                        <SelectLabel>Units</SelectLabel>
                                        {#each units as item}
                                          <SelectItem value={item.value}
                                            >{item.label}</SelectItem
                                          >
                                        {/each}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <!-- Additional Details Section -->
                            <div class="mb-6">
                              <h4
                                class="text-lg font-medium text-bland-950 mb-4"
                              >
                                Additional Details
                              </h4>

                              <!-- Dimensions Row -->
                              <div
                                class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
                              >
                                <div>
                                  <Label class="form-fields-label">
                                    Length
                                  </Label>
                                  <Input
                                    bind:value={editLength}
                                    placeholder="Abc"
                                    class="w-full h-10 rounded-lg border border-bland-200 bg-transparent px-3 py-2 text-sm"
                                  />
                                </div>

                                <div>
                                  <Label class="form-fields-label">Width</Label>
                                  <Input
                                    bind:value={editWidth}
                                    placeholder="Abc"
                                    class="w-full h-10 rounded-lg border border-bland-200 bg-transparent px-3 py-2 text-sm"
                                  />
                                </div>

                                <div>
                                  <Label class="form-fields-label">
                                    Height
                                  </Label>
                                  <Input
                                    bind:value={editHeight}
                                    placeholder="LBS"
                                    class="w-full h-10 rounded-lg border border-bland-200 bg-transparent px-3 py-2 text-sm"
                                  />
                                </div>

                                <div>
                                  <Label class="form-fields-label">Units</Label>
                                  <Select
                                    type="single"
                                    name="DimensionUnits"
                                    bind:value={editDimensionUnit}
                                  >
                                    <SelectTrigger
                                      class="w-full h-10 rounded-lg border border-bland-200 bg-transparent px-3 py-2 text-sm"
                                    >
                                      {editDimensionUnitLabel}
                                    </SelectTrigger>
                                    <SelectContent class="form-bg border-0">
                                      <SelectGroup>
                                        <SelectLabel>Units</SelectLabel>
                                        {#each dimensionUnits as unit}
                                          <SelectItem value={unit.value}
                                            >{unit.label}</SelectItem
                                          >
                                        {/each}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <!-- Declared Value Row -->
                              <div class="mb-4">
                                <div
                                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                  <div>
                                    <Label class="form-fields-label">
                                      Declared Value (Insurance)
                                    </Label>
                                    <div
                                      class="flex items-center gap-2 relative"
                                    >
                                      <Input
                                        bind:value={editDeclaredValue}
                                        placeholder="Abc"
                                        class="w-full h-10 rounded-lg border border-bland-200 bg-transparent px-3 py-2 text-sm"
                                      />
                                      <span
                                        class="text-sm text-bland-700 font-medium absolute right-3 top-1/2 -translate-y-1/2"
                                      >
                                        CAD
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <!-- Checkbox -->
                              <div class="mb-6">
                                <div class="flex items-center space-x-2">
                                  <Checkbox
                                    id="additional-handling-{index}"
                                    bind:checked={editAdditionalHandling}
                                  />
                                  <Label
                                    for="additional-handling-{index}"
                                    class="text-sm text-bland-700"
                                  >
                                    Additional Handling
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Footer
                          class="flex flex-row !justify-between w-full items-center pt-4"
                        >
                          <Dialog.Trigger>
                            <Button
                              variant="ghost"
                              class="text-bland-600 underline hover:text-bland-800 transition-colors"
                            >
                              Cancel
                            </Button>
                          </Dialog.Trigger>
                          <Button
                            class="flex items-center gap-2 bg-primary-400 text-bland-25 hover:bg-primary-400/90 rounded-lg px-6 py-2 h-auto"
                            onclick={handleSaveEdit}
                          >
                            Save Changes
                          </Button>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Root>
                  </div>

                  <!-- Duplicate Button -->
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 p-0 cursor-pointer"
                    onclick={() => handleDuplicate(index)}
                  >
                    <Icon
                      icon="si:copy-line"
                      width="24"
                      height="24"
                      class="text-[#4A64C4]"
                    />
                  </Button>

                  <!-- Delete Button with Dialog -->
                  <div>
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 p-0 cursor-pointer"
                          onclick={() => handleDeleteClick(index)}
                        >
                          <Icon
                            icon="hugeicons:delete-01"
                            width="24"
                            height="24"
                            class="text-redish-100"
                          />
                        </Button>
                      </Dialog.Trigger>
                      <Dialog.Content
                        class="common-card md:min-w-[800px] min-w-[300px]"
                      >
                        <Dialog.Header>
                          <Dialog.Title
                            class="text-xl font-semibold text-bland-950 text-start"
                          >
                            Delete
                          </Dialog.Title>

                          <Dialog.Description>
                            <h1
                              class="text-xl font-semibold text-bland-950 my-4 text-start"
                            >
                              Are you sure?
                            </h1>
                            <p class="text-bland-700 text-start">
                              Do you really want to delete this record?
                            </p>
                          </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Footer
                          class="flex flex-row !justify-between w-full items-center pt-4"
                        >
                          <Button
                            variant="ghost"
                            class="text-bland-600 underline hover:text-bland-800 transition-colors p-0 cursor-pointer"
                          >
                            Cancel
                          </Button>
                          <Button
                            class="bg-[#FF3C3C] text-white hover:bg-redish-100/80 transition-colors !py-2 !px-6 text-sm font-medium rounded-md cursor-pointer"
                            onclick={handleConfirmDelete}
                          >
                            Delete
                          </Button>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Root>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  {/if}

  <!-- Package Details Section -->
  <div
    class="grid grid-cols-1 sm:grid-cols-3 gap-4 {showTitle ||
    (showPackageTable && packages.length > 0)
      ? 'mt-8'
      : ''}"
  >
    <div class="relative">
      <Label class="form-label-main mb-4">Package Details</Label>

      <Label class="form-fields-label">Package Type</Label>

      <Select
        type="single"
        name="PackageType"
        bind:value={selectedPackageDetail}
      >
        <SelectTrigger
          class={`select-field ${
            packageErrors['packageType'] ? 'border-red-500' : 'border-bland-200'
          }`}
        >
          {selectedPacakageLabelDetail}
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Package Type</SelectLabel>
            {#each packageies as item}
              <SelectItem value={item.value}>
                {item.label}
              </SelectItem>
            {/each}
          </SelectGroup>
        </SelectContent>
      </Select>
      {#if packageErrors['packageType']}
        <span class="absolute text-red-500 text-xs xl:text-sm text-left">
          {packageErrors['packageType']}
        </span>
      {/if}
    </div>

    <div class="mt-auto">
      <Label class="form-fields-label my-2">Weight</Label>

      <Input
        type="number"
        placeholder="4.5"
        bind:value={weight}
        oninput={() => {
          if (packageErrors['packageWeight'])
            packageClearError('packageWeight');
        }}
        class={`input-field ${
          packageErrors['packageWeight'] ? 'border-red-500' : 'border-bland-200'
        }`}
      />
      {#if packageErrors['packageWeight']}
        <span class="absolute text-red-500 text-xs xl:text-sm text-left">
          {packageErrors['packageWeight']}
        </span>
      {/if}
    </div>

    <div class="mt-auto">
      <Label class="form-fields-label my-2">Units</Label>

      <Select type="single" name="WeightUnits" bind:value={selectedUnit}>
        <SelectTrigger
          class={`select-field ${
            packageErrors['packageUnit'] ? 'border-red-500' : 'border-bland-200'
          }`}
        >
          {selectedUnitLabel}
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Units</SelectLabel>
            {#each units as item}
              <SelectItem value={item.value}>
                {item.label}
              </SelectItem>
            {/each}
          </SelectGroup>
        </SelectContent>
      </Select>
      {#if packageErrors['packageUnit']}
        <span class="absolute text-red-500 text-xs xl:text-sm text-left">
          {packageErrors['packageUnit']}
        </span>
      {/if}
    </div>
  </div>

  <!-- Additional Details Section -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
    <div>
      <Label class="form-label-main">Additional Details</Label>

      <Label class="form-fields-label mt-4 mb-2">Length</Label>

      <Input
        type="number"
        placeholder="1.2"
        bind:value={length}
        oninput={() => {
          if (packageErrors['packageLength'])
            packageClearError('packageLength');
        }}
        class={`input-field ${
          packageErrors['packageLength'] ? 'border-red-500' : 'border-bland-200'
        }`}
      />
      {#if packageErrors['packageLength']}
        <span class="absolute text-red-500 text-xs xl:text-sm text-left">
          {packageErrors['packageLength']}
        </span>
      {/if}
    </div>

    <div class="mt-auto">
      <Label class="form-fields-label my-2">Width</Label>

      <Input
        type="number"
        placeholder="4.5"
        bind:value={width}
        oninput={() => {
          if (packageErrors['packageWidth']) packageClearError('packageWidth');
        }}
        class={`input-field ${
          packageErrors['packageWidth'] ? 'border-red-500' : 'border-bland-200'
        }`}
      />
      {#if packageErrors['packageWidth']}
        <span class="absolute text-red-500 text-xs xl:text-sm text-left">
          {packageErrors['packageWidth']}
        </span>
      {/if}
    </div>

    <div class="mt-auto">
      <Label class="form-fields-label my-2">Height</Label>

      <Input
        type="number"
        placeholder="0.8"
        bind:value={height}
        oninput={() => {
          if (packageErrors['packageHeight'])
            packageClearError('packageHeight');
        }}
        class={`input-field ${
          packageErrors['packageHeight'] ? 'border-red-500' : 'border-bland-200'
        }`}
      />
      {#if packageErrors['packageHeight']}
        <span class="absolute text-red-500 text-xs xl:text-sm text-left">
          {packageErrors['packageHeight']}
        </span>
      {/if}
    </div>

    <div class="mt-auto">
      <Label class="form-fields-label my-2">Units</Label>

      <Select
        type="single"
        name="DimensionUnits"
        bind:value={selectedDimensionUnit}
      >
        <SelectTrigger
          class={`select-field ${
            packageErrors['packageUnit2']
              ? 'border-red-500'
              : 'border-bland-200'
          }`}
        >
          {selectedDimensionLabel}
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Units</SelectLabel>
            {#each dimensionUnits as unit}
              <SelectItem value={unit.value}>{unit.label}</SelectItem>
            {/each}
          </SelectGroup>
        </SelectContent>
      </Select>
      {#if packageErrors['packageUnit2']}
        <span class="absolute text-red-500 text-xs xl:text-sm text-left">
          {packageErrors['packageUnit2']}
        </span>
      {/if}
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="mt-auto">
      <Label class="form-fields-label mt-4 mb-2">
        Declared Value (insurance)
      </Label>

      <div class="relative">
        <Input
          type="number"
          placeholder="0.00"
          bind:value={declaredValue}
          oninput={() => {
            if (packageErrors['packageValue'])
              packageClearError('packageValue');
          }}
          class={`input-field ${
            packageErrors['packageValue']
              ? 'border-red-500'
              : 'border-bland-200'
          }`}
        />

        <Label
          class="font-medium text-base underline text-bland-300 absolute right-3 top-1/2 -translate-y-1/2"
        >
          CAD
        </Label>
        {#if packageErrors['packageValue']}
          <span class="absolute text-red-500 text-xs xl:text-sm text-left">
            {packageErrors['packageValue']}
          </span>
        {/if}
      </div>

      <div class="flex items-center gap-3 mt-6">
        <Checkbox bind:checked={additionalHandling} id="additionalhandling" />
        <Label for="additionalhandling" class="font-medium text-bland-950">
          Additional Handling
        </Label>
      </div>
    </div>
  </div>

  <Button onclick={handleAddPackage} asChild class="common-button mt-6">
    <Icon icon="mynaui:plus" class="size-7" />
    {addButtonText}
  </Button>
</div>
