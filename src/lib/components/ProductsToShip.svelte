<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from './ui/button';
  import { Checkbox } from './ui/checkbox';
  import { Input } from './ui/input';
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
  } from './ui/input-group';
  import { Label } from './ui/label';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
  } from './ui/select';
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from './ui/table';
</script>

<main>
  <section
    class="border border-white/50 mt-5 md:mt-10 rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-4 md:gap-8 form-shadow"
  >
    <h3 class="text-2xl font-medium text-bland-950">
      Which products do you ship?
    </h3>

    <div>
      <Label class="form-label-main">Package Summary</Label>

      <Table class="mt-4 rounded-xl overflow-hidden">
        <TableHeader class="table-header-bg [&_th]:semibold">
          <TableRow>
            <TableHead>Box</TableHead>
            <TableHead>Package Type</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>Declared Value</TableHead>
            <TableHead>Additional Handling</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="table-body-bg">
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>MyPackage</TableCell>
            <TableCell>1.0 Lbs</TableCell>
            <TableCell>5 x 3 x 0.5 Inches</TableCell>
            <TableCell>$10.00</TableCell>
            <TableCell>No</TableCell>
            <TableCell
              class="text-right flex gap-3.5 justify-end w-auto [&_button]:cursor-pointer"
            >
              <Button variant="link" class="text-sm font-medium underline p-0"
                >Edit</Button
              >
              <Button variant="link" class="text-sm font-medium underline p-0"
                >Duplicate</Button
              >
              <Button variant="link" class="text-sm font-medium underline p-0"
                >Delete</Button
              >
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <Label class="form-label-main">Package Details</Label>

        <Label class="font-medium text-xs sm:text-base text-bland-300 mt-4 mb-2"
          >Package Type</Label
        >

        <Select type="single" name="Shipping From">
          <SelectTrigger class="select-field">My Package</SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>From</SelectLabel>
              <SelectItem>My Package</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="mt-auto">
        <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
          >Weight</Label
        >

        <Input type="text" placeholder="4.5" class="input-field" />
      </div>

      <div class="mt-auto">
        <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
          >Units</Label
        >

        <Select type="single" name="Shipping From">
          <SelectTrigger class="select-field">Lbs</SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>From</SelectLabel>
              <SelectItem>Lbs</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Label class="form-label-main">Additional Details</Label>

        <Label class="font-medium text-xs sm:text-base text-bland-300 mt-4 mb-2"
          >Length</Label
        >

        <Input type="text" placeholder="1.2" class="input-field" />
      </div>

      <div class="mt-auto">
        <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
          >Weight</Label
        >

        <Input type="text" placeholder="4.5" class="input-field" />
      </div>

      <div class="mt-auto">
        <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
          >Height</Label
        >

        <Input type="text" placeholder="0.8" class="input-field" />
      </div>

      <div class="mt-auto">
        <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
          >Units</Label
        >

        <Select type="single" name="Shipping From">
          <SelectTrigger class="select-field">Inches</SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>From</SelectLabel>
              <SelectItem>Inches</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:-mt-5">
      <div class="mt-auto">
        <Label class="font-medium text-xs sm:text-base text-bland-300 my-2"
          >Declared Value (insurance)</Label
        >

        <div class="relative">
          <Input type="text" placeholder="0.00" class="input-field" />

          <Label
            class="font-medium text-base underline text-bland-300 absolute right-3 top-1/2 -translate-y-1/2"
            >CAD</Label
          >
        </div>

        <div class="flex items-center gap-3 mt-3">
          <Checkbox id="additionalhandling" />
          <Label for="additionalhandling" class="font-medium text-bland-950"
            >Additional Handling</Label
          >
        </div>
      </div>
    </div>

    <Button
      class="me-auto flex items-center font-semibold text-sm sm:text-base md:text-lg text-primary-400 bg-primary-200 shadow-none border border-primary-200 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
    >
      <Icon icon="iconoir:plus" class="size-8 text-primary-400" /> Add Package
    </Button>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="mt-auto">
        <Label class="form-label-main">Extras</Label>

        <div class="mt-auto">
          <Label
            class="font-medium text-xs sm:text-base text-bland-300 mt-3 mb-2"
            >Select Signature Options</Label
          >

          <div
            class="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Select type="single" name="Shipping From">
              <SelectTrigger class="select-field">None</SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>From</SelectLabel>
                  <SelectItem   value="None">None</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div class="flex items-center gap-3">
              <Checkbox id="documentonly" />
              <Label
                for="documentonly"
                class="font-medium text-bland-950 text-nowrap"
                >Document Only</Label
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 p-6 rounded-xl forminfo-bg"
    >
      <Button variant="link" class="text-base font-semibold underline p-0"
        >Clear All Information</Button
      >

      <Button
        class="flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
      >
        Get Started
      </Button>
    </div>
  </section>
</main>
