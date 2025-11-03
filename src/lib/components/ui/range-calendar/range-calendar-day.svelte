<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: RangeCalendarPrimitive.DayProps = $props();
</script>

<RangeCalendarPrimitive.Day
  bind:ref
  class={cn(
    buttonVariants({ variant: 'ghost' }),
    'size-(--cell-size) flex select-none flex-col items-center justify-center gap-1 whitespace-nowrap p-0 font-normal leading-none',
    '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground [&[data-today][data-disabled]]:text-muted-foreground',
    // Selected date (part of range) - solid background
    '[&[data-selected]]:bg-primary-400 [&[data-selected]]:text-bland-25',
    // range Start - solid background with rounded left
    '[&[data-range-start]]:bg-primary-400 [&[data-range-start]]:text-bland-25 [&[data-range-start]]:rounded-l-md',
    // range End - solid background with rounded right
    '[&[data-range-end]]:bg-primary-400 [&[data-range-end]]:text-bland-25 [&[data-range-end]]:rounded-r-md',
    // range Middle - lighter background for range preview
    '[&[data-range-middle]]:bg-primary-400/30 [&[data-range-middle]]:text-bland-950 [&[data-range-middle]]:rounded-none',
    // Outside months
    '[&[data-outside-month]:not([data-selected])]:text-muted-foreground [&[data-outside-month]:not([data-selected])]:hover:text-accent-foreground',
    // Disabled
    'data-[disabled]:text-muted-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    // Unavailable
    'data-[unavailable]:line-through',
    // hover - only when not selected
    'hover:bg-accent hover:text-accent-foreground [&[data-selected]]:hover:bg-primary-400',
    // focus
    'focus:border-ring focus:ring-ring/50 focus:relative',
    // inner spans
    '[&>span]:text-xs [&>span]:opacity-70',
    className
  )}
  {...restProps}
/>
