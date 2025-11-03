<script lang="ts">
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import type { DateRange } from 'bits-ui';
  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
  } from '@internationalized/date';
  import { cn } from '../../lib/utils.js';
  import { RangeCalendar } from '../../lib/components/ui/range-calendar/index.js';
  import * as Popover from '../../lib/components/ui/popover/index.js';
  import Icon from '@iconify/svelte';

  const df = new DateFormatter('en-US', { dateStyle: 'medium' });

  // Selected range, export it so parent can bind to it
  let {
    value = $bindable(undefined as DateRange | undefined),
  }: {
    value?: DateRange | undefined;
  } = $props();

  // Placeholder is used during range selection (while dragging)
  // This creates the visual preview of the range being selected
  let placeholder: DateValue | undefined = $state(undefined);
</script>

<div
  class="flex flex-row gap-2 h-10 xl:h-12 border border-bland-200 input-text rounded-md text-xs font-normal sm:text-sm! data-placeholder:text-bland-75 placeholder:text-sm placeholder:text-bland-200! placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 text-bland-950! w-full sm:w-fit"
>
  <Popover.Root>
    <Popover.Trigger
      class={cn(
        !value && 'text-muted-foreground',
        'flex gap-2 md:text-[14px] items-center justify-between relative sm:w-fit w-full cursor-pointer px-3 text-nowrap'
      )}
    >
      <div class="flex gap-2 items-center justify-between">
        <Icon
          icon="famicons:calendar-outline"
          class="h-5 w-5 text-bland-300 mb-px"
        />
        {#if value && value.start}
          {#if value.end}
            {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
              value.end.toDate(getLocalTimeZone())
            )}
          {:else}
            {df.format(value.start.toDate(getLocalTimeZone()))}
          {/if}
        {:else}
          Select Date Range
        {/if}
      </div>
      <Icon icon="lucide:chevron-down" class="h-5 w-5 text-bland-300" />
    </Popover.Trigger>

    <Popover.Content
      class="w-auto p-0 bg-bland-25 absolute top-2  border-bland-200"
      align="start"
    >
      <RangeCalendar bind:value bind:placeholder numberOfMonths={2} />
    </Popover.Content>
  </Popover.Root>
</div>
