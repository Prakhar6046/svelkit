<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
  import * as RangeCalendar from './index.js';
  import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
  import type { ButtonVariant } from '$lib/components/ui/button/index.js';
  import type { Snippet } from 'svelte';
  import { isEqualMonth, type DateValue } from '@internationalized/date';
  import { setContext } from 'svelte';

  let {
    ref = $bindable(null),
    value = $bindable(),
    placeholder = $bindable(),
    weekdayFormat = 'short',
    class: className,
    buttonVariant = 'ghost',
    captionLayout = 'label',
    locale = 'en-US',
    months: monthsProp,
    years,
    monthFormat: monthFormatProp,
    yearFormat = 'numeric',
    day,
    disableDaysOutsideMonth = false,
    ...restProps
  }: WithoutChildrenOrChild<RangeCalendarPrimitive.RootProps> & {
    buttonVariant?: ButtonVariant;
    captionLayout?: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label';
    months?: RangeCalendarPrimitive.MonthSelectProps['months'];
    years?: RangeCalendarPrimitive.YearSelectProps['years'];
    monthFormat?: RangeCalendarPrimitive.MonthSelectProps['monthFormat'];
    yearFormat?: RangeCalendarPrimitive.YearSelectProps['yearFormat'];
    day?: Snippet<[{ day: DateValue; outsideMonth: boolean }]>;
  } = $props();

  const monthFormat = $derived.by(() => {
    if (monthFormatProp) return monthFormatProp;
    if (captionLayout.startsWith('dropdown')) return 'short';
    return 'long';
  });

  // Drag state for range selection
  let isDragging = $state(false);
  let startDate = $state<DateValue | null>(null);

  function setStartDate(date: DateValue | null) {
    startDate = date;
  }

  function setIsDragging(value: boolean) {
    isDragging = value;
  }

  function updatePlaceholder(endDate: DateValue) {
    // Only update if we're actually dragging (not just clicking)
    if (startDate && isDragging) {
      // Determine start and end dates (might be reversed if dragging backwards)
      let rangeStart = startDate;
      let rangeEnd = endDate;

      // Compare dates to determine order
      if (rangeStart.compare(rangeEnd) > 0) {
        [rangeStart, rangeEnd] = [rangeEnd, rangeStart];
      }

      // Update placeholder to show preview
      placeholder = rangeEnd;
      // Update value to show the range
      value = { start: rangeStart, end: rangeEnd };
    }
  }

  // Provide drag state context to child components (use getters to access reactive state)
  setContext('dragState', {
    get isDragging() {
      return isDragging;
    },
    get startDate() {
      return startDate;
    },
    setStartDate,
    setIsDragging,
    updatePlaceholder,
  });

  // Handle mouse leave to stop dragging if mouse leaves calendar
  function handleMouseLeave() {
    if (isDragging) {
      isDragging = false;
      startDate = null;
    }
  }
</script>

<RangeCalendarPrimitive.Root
  bind:ref
  bind:value
  bind:placeholder
  {weekdayFormat}
  {disableDaysOutsideMonth}
  class={cn(
    'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
    className
  )}
  onmouseleave={handleMouseLeave}
  {locale}
  {monthFormat}
  {yearFormat}
  {...restProps}
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Months>
      <RangeCalendar.Nav>
        <RangeCalendar.PrevButton variant={buttonVariant} />
        <RangeCalendar.NextButton variant={buttonVariant} />
      </RangeCalendar.Nav>
      {#each months as month, monthIndex (month)}
        <RangeCalendar.Month>
          <RangeCalendar.Header>
            <RangeCalendar.Caption
              {captionLayout}
              months={monthsProp}
              {monthFormat}
              {years}
              {yearFormat}
              month={month.value}
              bind:placeholder
              {locale}
              {monthIndex}
            />
          </RangeCalendar.Header>

          <RangeCalendar.Grid>
            <RangeCalendar.GridHead>
              <RangeCalendar.GridRow class="select-none">
                {#each weekdays as weekday (weekday)}
                  <RangeCalendar.HeadCell>
                    {weekday.slice(0, 2)}
                  </RangeCalendar.HeadCell>
                {/each}
              </RangeCalendar.GridRow>
            </RangeCalendar.GridHead>
            <RangeCalendar.GridBody>
              {#each month.weeks as weekDates (weekDates)}
                <RangeCalendar.GridRow class="mt-2 w-full">
                  {#each weekDates as date (date)}
                    <RangeCalendar.Cell {date} month={month.value}>
                      {#if day}
                        {@render day({
                          day: date,
                          outsideMonth: !isEqualMonth(date, month.value),
                        })}
                      {:else}
                        <RangeCalendar.Day />
                      {/if}
                    </RangeCalendar.Cell>
                  {/each}
                </RangeCalendar.GridRow>
              {/each}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
        </RangeCalendar.Month>
      {/each}
    </RangeCalendar.Months>
  {/snippet}
</RangeCalendarPrimitive.Root>
