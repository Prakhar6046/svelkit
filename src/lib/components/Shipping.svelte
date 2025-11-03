<script lang="ts">
  import { estimateData } from './../stores/store';
  import { Label } from './ui/label';
  import * as Select from './ui/select';
  import YourResults from './YourResults.svelte';

  import { showResults } from '../stores/store';
  import { onMount } from 'svelte';
  import { Input } from './ui/input';
  import { _ } from 'svelte-i18n';
  // Example data
  export let from = [
    { value: 'usa', label: 'United States' },
    { value: 'canada', label: 'Canada' },
    { value: 'mexico', label: 'Mexico' },
  ];

  export let packageTypes = [
    { value: 'box', label: 'Box' },
    { value: 'envelope', label: 'Envelope' },
    { value: 'crate', label: 'Crate' },
  ];

  // Bound values
  let fromValue: string;
  let toValue: string;
  let packageTypeValue: string;
  let weight: string;

  // / Optional: Initialize from store
  onMount(() => {
    estimateData.subscribe(data => {
      fromValue = data.from;
      toValue = data.to;
      packageTypeValue = data.packageType;
      weight = data.weight;
    });
  });
  // Helper to get label
  function getLabel(value: string, list: { value: string; label: string }[]) {
    return list.find(o => o.value === value)?.label || '';
  }

  const handleEstimate = () => {
    showResults.set(true);
    estimateData.set({
      from: fromValue,
      to: toValue,
      packageType: packageTypeValue,
      weight,
    });
    console.log({
      from: fromValue,
      to: toValue,
      packageType: packageTypeValue,
      weight,
    });
  };
</script>

<div
  class="border border-white/50 mt-5 md:mt-10 rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-4 md:gap-8"
>
  <h1 class="text-xl font-medium">{$_('shippingEstimator.title')}</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
    <!-- From -->
    <div class="flex flex-col gap-2">
      <Label class="text-xs sm:text-sm "
        >{$_('shippingEstimator.fromLabel')}</Label
      >
      <Select.Root type="single" name="Shipping From" bind:value={fromValue}>
        <Select.Trigger
          class="w-full accordeion-border py-2 xl:py-[11px] text-xs sm:text-sm"
        >
          {#if fromValue}
            {getLabel(fromValue, from)}
          {:else}
            {$_('shippingEstimator.fromPlaceholder')}
          {/if}
        </Select.Trigger>
        <Select.Content class="form-bg border-0">
          <Select.Group>
            <Select.Label>{$_('shippingEstimator.fromLabel')}</Select.Label>
            {#each from as option (option.value)}
              <Select.Item class="" value={option.value} label={option.label}>
                {option.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    <!-- To -->
    <div class="flex flex-col gap-2">
      <Label class="text-xs sm:text-sm "
        >{$_('shippingEstimator.toLabel')}</Label
      >
      <Select.Root type="single" name="Destination" bind:value={toValue}>
        <Select.Trigger
          class="w-full accordeion-border py-2 xl:py-[11px] text-xs sm:text-sm"
        >
          {#if toValue}
            {getLabel(toValue, from)}
          {:else}
            {$_('shippingEstimator.toPlaceholder')}
          {/if}
        </Select.Trigger>
        <Select.Content class="form-bg border-0">
          <Select.Group>
            <Select.Label>{$_('shippingEstimator.toLabel')}</Select.Label>
            {#each from as option (option.value)}
              <Select.Item class="" value={option.value} label={option.label}>
                {option.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    <!-- Package Type -->
    <div class="flex flex-col gap-2">
      <Label class="text-xs sm:text-sm "
        >{$_('shippingEstimator.packageTypeLabel')}</Label
      >
      <Select.Root
        type="single"
        name="Select Package type"
        bind:value={packageTypeValue}
      >
        <Select.Trigger
          class="w-full accordeion-border py-2 xl:py-[11px] text-xs sm:text-sm"
        >
          {#if packageTypeValue}
            {getLabel(packageTypeValue, packageTypes)}
          {:else}
            {$_('shippingEstimator.packageTypePlaceholder')}
          {/if}
        </Select.Trigger>
        <Select.Content class="form-bg border-0">
          <Select.Group>
            <Select.Label
              >{$_('shippingEstimator.packageTypeLabel')}</Select.Label
            >
            {#each packageTypes as option (option.value)}
              <Select.Item class="" value={option.value} label={option.label}>
                {option.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    <!-- Weight -->
    <div class="flex flex-col gap-2">
      <Label class="text-xs sm:text-sm "
        >{$_('shippingEstimator.packageWeightLabel')}</Label
      >
      <Input
        bind:value={weight}
        class="bg-transparent px-4 w-full rounded-xl border accordeion-border py-2.5 sm:py-2 xl:py-[11px] h-auto text-xs sm:!text-sm focus-visible:ring-0 focus-visible:ring-offset-0 input-text"
        placeholder={$_('shippingEstimator.packageWeightUnit')}
        type="number"
        min="0"
      />
    </div>

    <!-- Button -->
    <div class="flex flex-col gap-3 col-span-1 sm:col-span-2 lg:col-span-1">
      <button
        on:click={handleEstimate}
        class="flex items-center justify-center font-semibold text-xs sm:text-sm text-bland-25 border border-primary-400 bg-primary-400 shadow-none rounded-xl py-2 xl:py-[11px] px-6 h-auto cursor-pointer hover:shadow-md"
      >
        {$_('shippingEstimator.submitButton')}
      </button>
    </div>
  </div>
  {#if $showResults}
    <YourResults />
  {/if}
  <div>
    <p class="text-center text-xs sm:text-sm md:text-base text-bland-500">
      {$_('shippingEstimator.bottom')}
    </p>
  </div>
</div>
