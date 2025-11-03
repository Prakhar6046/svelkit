<script lang="ts">
  import { Input } from './ui/input';
  import { Label } from './ui/label';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
  } from './ui/select';
</script>

<main>
  <section
    class="border border-white/50 mt-5 md:mt-10 rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-4 md:gap-8 form-shadow"
  >
    <h3 class="text-2xl font-medium text-bland-950">
      What is your shipping location?
    </h3>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
      <div class="flex flex-col sm:flex-row items-end gap-4">
        <div class="w-full">
          <Label class="form-label-main">From</Label>

          <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
            >Label</Label
          >

          <Select type="single" name="Shipping From">
            <SelectTrigger
              class="w-full accordeion-border input-text h-[42px] xl:h-12 py-2 xl:py-[11px] text-sm sm:text-base data-[placeholder]:text-bland-950"
            >
              Ontario, Canada
            </SelectTrigger>
            <SelectContent class="form-bg border-0">
              <SelectGroup>
                <SelectLabel>From</SelectLabel>
                <SelectItem>Ontario, Canada</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="w-full">
          <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
            >Post Code</Label
          >

          <Input
            type="text"
            placeholder="K6A 1A3"
            class="w-full h-[42px] xl:h-12 accordeion-border input-text rounded-xl py-2 xl:py-[11px] text-sm sm:!text-base data-[placeholder]:text-bland-950 placeholder:text-bland-950 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-end gap-4">
        <div class="w-full">
          <Label class="form-label-main">To</Label>

          <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
            >Country</Label
          >

          <Select type="single" name="Shipping From" class="w-full">
            <SelectTrigger
              class="w-full accordeion-border input-text h-[42px] xl:h-12 py-2 xl:py-[11px] text-sm sm:text-base data-[placeholder]:text-bland-950"
            >
              Ontario, Canada
            </SelectTrigger>
            <SelectContent class="form-bg border-0">
              <SelectGroup>
                <SelectLabel>From</SelectLabel>
                <SelectItem>Ontario, Canada</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="w-full">
          <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
            >Post Code</Label
          >

          <Input
            type="text"
            placeholder="E3VIT3"
            class="w-full h-[42px] xl:h-12 accordeion-border input-text rounded-xl py-2 xl:py-[11px] text-sm sm:!text-base data-[placeholder]:text-bland-950 placeholder:text-bland-950 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
    </div>
  </section>
</main>
