<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';
  import type { DateValue } from '@internationalized/date';
  import { getContext } from 'svelte';

  // Get drag state from parent context
  let dragState = getContext<{
    isDragging: boolean;
    startDate: DateValue | null;
    setStartDate: (date: DateValue | null) => void;
    setIsDragging: (value: boolean) => void;
    updatePlaceholder: (date: DateValue) => void;
  }>('dragState');

  let {
    ref = $bindable(null),
    class: className,
    date,
    ...restProps
  }: RangeCalendarPrimitive.CellProps = $props();

  let mouseDownElement: HTMLElement | null = null;

  function handleMouseDown(e: MouseEvent) {
    if (date && dragState) {
      const target = e.currentTarget as HTMLElement;
      const dayElement = target.querySelector('[data-day]') as HTMLElement;
      if (
        !dayElement?.hasAttribute('data-disabled') &&
        !dayElement?.hasAttribute('data-unavailable')
      ) {
        // Store the element where mousedown occurred
        mouseDownElement = target;
        // Set start date but don't mark as dragging yet
        // This allows normal click behavior if mouseup happens on same element
        dragState.setStartDate(date);
      }
    }
  }

  function handleMouseEnter(e: MouseEvent) {
    if (date && dragState?.startDate && !dragState.isDragging) {
      const target = e.currentTarget as HTMLElement;
      const dayElement = target.querySelector('[data-day]') as HTMLElement;
      // Only start dragging if we moved to a different cell after mousedown
      if (
        target !== mouseDownElement &&
        !dayElement?.hasAttribute('data-disabled') &&
        !dayElement?.hasAttribute('data-unavailable')
      ) {
        dragState.setIsDragging(true);
        dragState.updatePlaceholder(date);
      }
    } else if (date && dragState?.isDragging && dragState.startDate) {
      // Continue dragging
      const target = e.currentTarget as HTMLElement;
      const dayElement = target.querySelector('[data-day]') as HTMLElement;
      if (
        !dayElement?.hasAttribute('data-disabled') &&
        !dayElement?.hasAttribute('data-unavailable')
      ) {
        dragState.updatePlaceholder(date);
      }
    }
  }

  function handleMouseUp(e: MouseEvent) {
    if (date && dragState) {
      const target = e.currentTarget as HTMLElement;
      if (dragState.isDragging && dragState.startDate) {
        // Complete the drag selection
        dragState.setIsDragging(false);
        // The value is already set by updatePlaceholder
      } else if (dragState.startDate && target === mouseDownElement) {
        // This was a click (mousedown and mouseup on same element)
        // Reset drag state to allow normal click behavior
        dragState.setStartDate(null);
        // Let the normal click handler work
      }
      mouseDownElement = null;
    }
  }
</script>

<RangeCalendarPrimitive.Cell
  bind:ref
  {date}
  class={cn(
    'size-(--cell-size) relative p-0 text-center text-sm focus-within:z-20',
    // Selected range styling - background for the cell container
    '[&:has([data-selected])]:bg-primary-400/10',
    // Range start and end - background for cells containing range start/end
    '[&:has([data-range-start])]:bg-primary-400/10 [&:has([data-range-end])]:bg-primary-400/10',
    // Range middle - continuous background for selected range (lighter shade)
    '[&:has([data-range-middle])]:bg-primary-400/20',
    // Rounded corners for range boundaries
    '[&:has([data-range-start])]:rounded-l-md [&:has([data-range-end])]:rounded-r-md',
    '[&:has([data-range-middle])]:rounded-none',
    // First and last cells in a row with range middle
    'first:[&:has([data-range-middle])]:rounded-l-md last:[&:has([data-range-middle])]:rounded-r-md',
    className
  )}
  onmousedown={handleMouseDown}
  onmouseenter={handleMouseEnter}
  onmouseup={handleMouseUp}
  {...restProps}
/>
