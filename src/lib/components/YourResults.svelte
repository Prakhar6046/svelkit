<script lang="ts">
  import { Separator } from './ui/separator';
  import { Button } from './ui/button';
  import Icon from '@iconify/svelte';

  import {
    cheapest,
    fastest,
    tableData,
  } from '../mock/heroSection/heroSection';
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from './ui/collapsible';
  import { estimateData, showResults } from '../stores/store';
  import { onMount } from 'svelte';

  import { _ } from 'svelte-i18n';

  let fromValue: string;
  let toValue: string;
  let packageTypeValue: string;
  let weight: string;
  // Reactive assignments
  $: {
    fromValue = $estimateData.from;
  }
  $: {
    toValue = $estimateData.to;
  }
  $: {
    packageTypeValue = $estimateData.packageType;
  }
  $: {
    weight = $estimateData.weight;
  }

  // Now console.log will always reflect latest store values
  $: console.log(fromValue, toValue, 'from-->TO');
</script>

<div>
  <div class="flex justify-between gap-2">
    <h3 class="font-semibold text-lg sm:text-xl">
      {$_('shippingEstimator.result.title')}
    </h3>

    <div
      on:click={() => {
        showResults.set(false);
        console.log('helloo', $showResults);
      }}
      class="forminfo-bg rounded-sm p-2 cursor-pointer"
    >
      <Icon icon="radix-icons:cross-2" class="size-4" />
    </div>
  </div>

  <div class="mt-4">
    <p class="text-xs font-semibold">
      {$_('shippingEstimator.result.shippingDateLabel')}
    </p>
    <span class="text-xs underline text-bland-300"
      >{$_('shippingEstimator.result.shippingDateValue')}</span
    >
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
    <!-- Cheapest Section -->
    <div
      class={`border ${cheapest.bgClass} p-3 lg:p-6 rounded-xl flex justify-between mb-5`}
    >
      <div>
        <h3 class="font-semibold text-bland-950 text-xl lg:text-[32px]">
          {cheapest.type}
        </h3>
        <div class="my-4">
          <p class="text-lg lg:text-xl font-semibold text-bland-950">
            ${cheapest.price}
          </p>
          <span
            class="line-through text-bland-300 font-medium text-xs lg:text-xs block my-0.5"
            >${cheapest.oldPrice}</span
          >
          <p
            class="text-bland-25 text-[10px] bg-green-200 inline rounded-full py-1 px-2.5 leanding-[1em]"
          >
            Save ${cheapest.save}
          </p>
        </div>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-6 mb-5"
        >
          <img src={cheapest.icon} alt={cheapest.carrier} class="rounded-sm" />
          <div>
            <h5 class="font-medium text-xs lg:text-sm text-bland-950">
              {cheapest.service}
            </h5>
            <span class="text-[10px] md:text-xs text-bland-350"
              >{cheapest.delivery}</span
            >
          </div>
        </div>
        <Button class="common-button">Select</Button>
      </div>

      <div class="flex flex-col justify-between items-end">
        <div class="relative">
          <svg
            class="size-20 lg:size-28"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50ZM9.51885 50C9.51885 72.3571 27.6429 90.4811 50 90.4811C72.3571 90.4811 90.4811 72.3571 90.4811 50C90.4811 27.6429 72.3571 9.51885 50 9.51885C27.6429 9.51885 9.51885 27.6429 9.51885 50Z"
              fill="#9898D3"
            />
            <path
              d="M100 50C100 39.3135 96.5761 28.9082 90.2305 20.3098C83.8848 11.7114 74.9512 5.37225 64.7397 2.22195L61.9336 11.3178C70.2011 13.8683 77.4339 19.0006 82.5715 25.9621C87.7091 32.9236 90.4811 41.348 90.4811 50H100Z"
              fill="#BDBDF8"
            />
          </svg>
          <div
            class="flex flex-col text-center absolute left-1/2 top-1/2 -translate-1/2"
          >
            <span class="font-semibold text-[10px] lg:text-xs text-bland-950"
              >Save</span
            >
            <span class="font-semibold text-lg lg:text-xl text-bland-950"
              >{cheapest.percentageSave}%</span
            >
          </div>
        </div>
        <Button
          class="font-semibold text-bland-450 underline shadow-none text-sm lg:text-base"
          >More</Button
        >
      </div>
    </div>

    <!-- Fastest Section -->
    <div
      class={`border ${fastest.bgClass} p-3 lg:p-6 rounded-xl flex justify-between mb-5`}
    >
      <div>
        <h3 class="font-semibold text-bland-950 text-xl lg:text-[32px]">
          {fastest.type}
        </h3>
        <div class="my-4">
          <p class="text-lg lg:text-xl font-semibold text-bland-950">
            ${fastest.price}
          </p>
          <span
            class="line-through text-bland-300 font-medium text-xs lg:text-xs block my-0.5"
            >${fastest.oldPrice}</span
          >
          <p
            class="text-bland-25 text-[10px] bg-green-200 inline rounded-full py-1 px-2.5 leanding-[1em]"
          >
            Save ${fastest.save}
          </p>
        </div>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-6 mb-5"
        >
          <img src={fastest.icon} alt={fastest.carrier} class="rounded-sm" />
          <div>
            <h5 class="font-medium text-xs lg:text-sm text-bland-950">
              {fastest.service}
            </h5>
            <span class="text-[10px] md:text-xs text-bland-350"
              >{fastest.delivery}</span
            >
          </div>
        </div>
        <Button class="common-button">Select</Button>
      </div>

      <div class="flex flex-col justify-between items-end">
        <div class="relative">
          <svg
            class="size-20 lg:size-28"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50ZM9.51885 50C9.51885 72.3571 27.6429 90.4811 50 90.4811C72.3571 90.4811 90.4811 72.3571 90.4811 50C90.4811 27.6429 72.3571 9.51885 50 9.51885C27.6429 9.51885 9.51885 27.6429 9.51885 50Z"
              fill="#60B0B3"
            />
            <path
              d="M100 50C100 39.3135 96.5761 28.9082 90.2305 20.3098C83.8848 11.7114 74.9512 5.37225 64.7397 2.22195L61.9336 11.3178C70.2011 13.8683 77.4339 19.0006 82.5715 25.9621C87.7091 32.9236 90.4811 41.348 90.4811 50H100Z"
              fill="#A5F3F5"
            />
          </svg>
          <div
            class="flex flex-col text-center absolute left-1/2 top-1/2 -translate-1/2"
          >
            <span class="font-semibold text-[10px] lg:text-xs text-bland-950"
              >Save</span
            >
            <span class="font-semibold text-xl lg:text-2xl text-bland-950"
              >{fastest.percentageSave}%</span
            >
          </div>
        </div>
        <Button
          class="font-semibold text-bland-450 underline shadow-none text-sm lg:text-base"
          >More</Button
        >
      </div>
    </div>
  </div>

  <!-- Table Header -->
  <div class="overflow-x-auto">
    <div class="min-w-[850px]">
      <div
        class="grid grid-cols-12 gap-1 [&>*]:font-medium [&>*]:text-xs [&>*]:lg:text-base [&>*]:py-3 [&>*]:lg:px-3 text-bland-300"
      >
        <div class="col-span-3 lg:col-span-2 xl:col-span-3">
          {$_('shippingEstimator.result.serviceLevel')}
        </div>
        <div class="col-span-3 lg:col-span-2 xl:col-span-3">
          {$_('shippingEstimator.result.estTime')}
        </div>
        <div class="col-span-6 lg:col-span-8 xl:col-span-6">
          {$_('shippingEstimator.result.priceLabel')}
        </div>
      </div>

      {#each tableData as item}
        <Collapsible>
          <!-- Row -->
          <div
            class="grid grid-cols-12 gap-1 border-y border-[#E2E8F0] [&>*]:py-3 [&>*]:lg:px-3"
          >
            <div class="col-span-3 lg:col-span-2 xl:col-span-3 my-auto">
              <div class="flex items-center gap-2">
                <img
                  src={item.icon}
                  alt={item.carrier}
                  class="rounded-sm size-8"
                />
                <div>
                  <h5 class="font-medium text-xs lg:text-sm text-bland-950">
                    {item.carrier}
                  </h5>
                  {#if item.serviceLevel}
                    <span
                      class="text-bland-25 text-[10px] bg-green-200 inline rounded-full py-0.5 px-2 lg:px-3 font-normal"
                      >{item.serviceLevel}</span
                    >
                  {/if}
                </div>
              </div>
            </div>

            <div class="col-span-3 lg:col-span-2 xl:col-span-3 my-auto">
              <div>
                <p
                  class="font-medium text-xs lg:text-sm text-bland-950 leading-[1em]"
                >
                  {item.estDelivery}
                </p>
                <span class="text-xs text-bland-300"
                  >{item.estDeliveryTime}</span
                >
              </div>
            </div>

            <div class="col-span-6 lg:col-span-8 xl:col-span-6 my-auto">
              <div
                class="flex justify-between items-center [&>*]:w-[calc(100%/3)]"
              >
                <div class="flex items-center gap-3 lg:gap-5">
                  <div>
                    <p class="text-xs lg:text-sm font-medium leading-[1em]">
                      ${item.price.toFixed(2)}
                    </p>
                    <span class="text-xs text-bland-300 line-through"
                      >{item.oldPrice
                        ? `$${item.oldPrice.toFixed(2)}`
                        : ''}</span
                    >
                  </div>

                  {#if item.stats.totalCost && item.serviceLevel === 'Cheapest'}
                    <div
                      class="bg-primary-200 text-primary-50 font-semibold text-xs lg:text-base py-2 px-2 lg:px-4 rounded-xl"
                    >
                      {$_('shippingEstimator.result.saveLabel')}
                      {Math.round(
                        ((item.oldPrice - item.price) / item.oldPrice) * 100
                      )}%
                    </div>
                  {/if}
                </div>

                <div class="text-center">
                  <CollapsibleTrigger
                    class="underline font-semibold text-xs lg:text-base text-bland-300 cursor-pointer"
                    >{$_(
                      'shippingEstimator.result.moreLabel'
                    )}</CollapsibleTrigger
                  >
                </div>

                <div class="text-right">
                  <Button asChild class="common-button ms-auto">
                    {$_('shippingEstimator.result.selectLabel')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Expanded Content -->
          <CollapsibleContent class="form-bg p-2 sm:p-4 border-t-2 border-none">
            <div
              class="grid grid-cols-3 gap-2 md:gap-4 lg:gap-8 [&_div]:text-xs [&_div]:lg:text-sm"
            >
              <div class="flex flex-col gap-2">
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_('shippingEstimator.collapsibleContent.cutoffTimeLabel')}
                  </div>
                  <div class="">{item.stats.cutoff}</div>
                </div>
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_('shippingEstimator.collapsibleContent.rateZoneLabel')}
                  </div>
                  <div class="">{item.stats.zone}</div>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_(
                      'shippingEstimator.collapsibleContent.billableWeightLabel'
                    )}
                  </div>
                  <div class="">{item.stats.billableWeight}</div>
                </div>
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_(
                      'shippingEstimator.collapsibleContent.currencyCodeLabel'
                    )}
                  </div>
                  <div class="">{item.stats.currencyCode}</div>
                </div>
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_('shippingEstimator.collapsibleContent.trackingLabel')}
                  </div>
                  <div class="">{item.stats.tracking}</div>
                </div>
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_(
                      'shippingEstimator.collapsibleContent.pickupAvailableLabel'
                    )}
                  </div>
                  <div class="">{item.stats.pickupAvailable}</div>
                </div>
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_('shippingEstimator.collapsibleContent.pickupFeeLabel')}
                  </div>
                  <div class="">{item.stats.pickupFee}</div>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_('shippingEstimator.collapsibleContent.baseRateLabel')}
                  </div>
                  <div class="">
                    ${item.stats.baseRate.toFixed(2)}
                  </div>
                </div>
                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_(
                      'shippingEstimator.collapsibleContent.fuelSurchargeLabel'
                    )}
                  </div>
                  <div class="">
                    ${item.stats.fuelSurcharge.toFixed(2)}
                  </div>
                </div>

                <Separator class="my-0.5 bg-bland-550" />

                <div class="flex justify-between align-items">
                  <div class="text-bland-300">
                    {$_('shippingEstimator.collapsibleContent.totalCostLabel')}
                  </div>
                  <div class="">
                    ${item.stats.totalCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      {/each}
    </div>
  </div>

  <p class="capitalize text-bland-500 tracking-wider text-sm mt-4">
    {$_('shippingEstimator.result.note')}
  </p>
</div>
