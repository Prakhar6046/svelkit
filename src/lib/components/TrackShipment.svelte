<script>
  import TrackResults from './TrackResults.svelte';
  import { Button } from './ui/button';
  import { Input } from './ui/input';
  import { Label } from './ui/label';
</script>

<main>
  <section
    class="border border-white/50 mt-5 md:mt-10 rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-4 md:gap-8 form-shadow"
  >
    <h3 class="text-2xl font-medium">Track Shipment.</h3>

    <div class="mt-auto">
      <Label class="font-medium text-xs sm:text-base my-2"
        >Tracking Number</Label
      >

      <div class="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Enter tracking number(s)"
          class="w-full h-[42px] xl:h-12 border-bland-200 text-bland-200 rounded-xl py-2 xl:py-[11px] text-sm sm:!text-base data-[placeholder]:text-bland-950 placeholder:text-bland-300 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button
          class="ms-auto me-auto md:me-0 flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
        >
          Track My Package
        </Button>
      </div>
    </div>

    <div>
      <p class="text-center text-sm sm:text-base md:text-lg text-bland-500">
        Track packages from all major carriers in one place
      </p>
    </div>

    <TrackResults />
  </section>
</main>
