<script lang="ts">
  import Icon from '@iconify/svelte';
  import trackResultsMap from '$lib/assets/images/track-results-map.svg';
</script>

<section>
  <div>
    <ul
      class="flex flex-col md:flex-row justify-between items-start md:items-center [&_li]:ps-8 [&_li]:border-l [&_li]:border-bland-300 [&_li]:first:md:border-0 [&_li]:first:md:ps-0"
    >
      <li>
        <label class="track-results-label" for="from">From</label>
        <span class="track-results-value">ON, Canada</span>
      </li>

      <li>
        <label class="track-results-label" for="to">To</label>
        <span class="track-results-value">NC, USA</span>
      </li>

      <li>
        <label class="track-results-label" for="to">Total Time Spend</label>
        <span class="track-results-value">5 Days, 14 Hours</span>
      </li>

      <li>
        <label class="track-results-label" for="to">Departure Time</label>
        <span class="track-results-value">Mon, 05 Sep | 14:11 PM</span>
      </li>

      <li>
        <label class="track-results-label" for="to">Expected Arrival</label>
        <span class="track-results-value">Mon, 05 Sep | 14:11 PM</span>
      </li>
    </ul>
  </div>

  <div class="flex flex-col lg:grid grid-cols-12 gap-10 lg:gap-0 mt-10">
    <div
      class="col-span-5 my-auto flex flex-col gap-4 [&>div]:relative [&>div]:after:w-0.5 [&>div]:after:h-[30px] [&>div]:after:absolute [&>div]:after:bg-green-300 [&>div]:after:left-[10.5px] [&>div]:after:sm:left-[18px] [&>div]:after:top-21 [&>div]:after:sm:top-15 [&>div]:after:-translate-x-1/2 [&>div:last-child]:after:hidden"
    >
      <div class="flex items-center gap-3 sm:gap-5">
        <Icon
          icon="material-symbols:check-circle-rounded"
          class="text-green-300 size-6 sm:size-9"
        />

        <div class="flex flex-col gap-1">
          <span class="track-results-value !flex items-center gap-2 sm:gap-4"
            >ON, Canada <span class="text-bland-300">·</span><span
              class="track-results-label">Mon, 05 Sep | 14:11 PM</span
            ></span
          >
          <label class="track-results-label" for="from">Label printed</label>
          <label
            class="track-results-label flex items-center gap-1.5"
            for="from"
            ><Icon
              icon="qlementine-icons:location-16"
              class="size-3 text-bland-300"
            /> ON, Canada</label
          >
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-5">
        <Icon
          icon="material-symbols:check-circle-rounded"
          class="text-green-300 size-6 sm:size-9"
        />

        <div class="flex flex-col gap-1">
          <span class="track-results-value !flex items-center gap-2 sm:gap-4"
            >ON, Canada <span class="text-bland-300">·</span><span
              class="track-results-label">Mon, 05 Sep | 14:11 PM</span
            ></span
          >
          <label class="track-results-label" for="from">Label printed</label>
          <label
            class="track-results-label flex items-center gap-1.5"
            for="from"
            ><Icon
              icon="qlementine-icons:location-16"
              class="size-3 text-bland-300"
            /> ON, Canada</label
          >
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-5">
        <Icon
          icon="material-symbols:check-circle-rounded"
          class="text-green-300 size-6 sm:size-9"
        />

        <div class="flex flex-col gap-1">
          <span class="track-results-value !flex items-center gap-2 sm:gap-4"
            >ON, Canada <span class="text-bland-300">·</span><span
              class="track-results-label">Mon, 05 Sep | 14:11 PM</span
            ></span
          >
          <label class="track-results-label" for="from">Label printed</label>
          <label
            class="track-results-label flex items-center gap-1.5"
            for="from"
            ><Icon
              icon="qlementine-icons:location-16"
              class="size-3 text-bland-300"
            /> ON, Canada</label
          >
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-5">
        <Icon
          icon="material-symbols:check-circle-rounded"
          class="text-green-300 size-6 sm:size-9"
        />

        <div class="flex flex-col gap-1">
          <span class="track-results-value !flex items-center gap-2 sm:gap-4"
            >ON, Canada <span class="text-bland-300">·</span><span
              class="track-results-label">Mon, 05 Sep | 14:11 PM</span
            ></span
          >
          <label class="track-results-label" for="from">Label printed</label>
          <label
            class="track-results-label flex items-center gap-1.5"
            for="from"
            ><Icon
              icon="qlementine-icons:location-16"
              class="size-3 text-bland-300"
            /> ON, Canada</label
          >
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-5">
        <Icon
          icon="material-symbols:check-circle-rounded"
          class="text-green-300 size-6 sm:size-9"
        />

        <div class="flex flex-col gap-1">
          <span class="track-results-value !flex items-center gap-2 sm:gap-4"
            >ON, Canada <span class="text-bland-300">·</span><span
              class="track-results-label">Mon, 05 Sep | 14:11 PM</span
            ></span
          >
          <label class="track-results-label" for="from">Label printed</label>
          <label
            class="track-results-label flex items-center gap-1.5"
            for="from"
            ><Icon
              icon="qlementine-icons:location-16"
              class="size-3 text-bland-300"
            /> ON, Canada</label
          >
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-5">
        <div
          class="rounded-full size-6 sm:size-9 border-2 border-bland-300"
        ></div>

        <div class="flex flex-col gap-1">
          <span class="track-results-value !flex items-center gap-2 sm:gap-4"
            >ON, Canada <span class="text-bland-300">·</span><span
              class="track-results-label">Mon, 05 Sep | 14:11 PM</span
            ></span
          >
          <label class="track-results-label" for="from">Label printed</label>
          <label
            class="track-results-label flex items-center gap-1.5"
            for="from"
            ><Icon
              icon="qlementine-icons:location-16"
              class="size-3 text-bland-300"
            /> ON, Canada</label
          >
        </div>
      </div>
    </div>

    <div class="col-span-7 my-auto">
      <img src={trackResultsMap} alt="Track Results Map" class="w-full" />
    </div>
  </div>
</section>
