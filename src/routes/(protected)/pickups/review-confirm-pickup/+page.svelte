<script>
    import Icon from '@iconify/svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { showDashboardSidebar } from '$lib/stores/store';
    import { Button } from '$lib/components/ui/button';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import UserImg from '$lib/assets/images/dashboard/user.png';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectGroup,
      SelectLabel,
    } from '$lib/components/ui/select';
    import DashboardHeader from '$lib/components/DashboardHeader.svelte';
    import { goto } from '$app/navigation';
  </script>
  
  <main class="bg-bland-650 h-full">
    <Sidebar />
  
    <DashboardHeader />
  
    <section
      class={`${$showDashboardSidebar ? 'lg:w-[calc(100%-256px)]' : 'w-full'}  ms-auto flex-1 p-6 duration-300`}
    >
      <!-- Header banner -->
      <div class="bg-bland-900 rounded-xl p-6 mb-6">
        <div>
          <h3 class="sub-heading !text-bland-25 font-bold !mt-0">
            Schedule a Pickup
          </h3>
  
          <p class="text-bland-25 mt-2">
            Track and manage all your shipments in one place
          </p>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4 my-4 gap-y-4">
        <div
          class="col-span-2 rounded-xl p-6 bg-bland-25 border border-bland-200"
        >
          <h3 class="text-2xl font-medium text-bland-950">
            Review & Confirm Pickup
          </h3>
          <div class="flex flex-col gap-1">
            <!-- Carrier Services -->
            <div>
              <p class="font-semibold my-4">Pickup Details</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start">
                <div>
                  <p class="text-sm">Address</p>
                  <p class="text-xs text-bland-400">
                    123 Main St, Anytown, ON M1A 2B3
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start my-4">
                <div>
                  <p class="text-sm">Date</p>
                  <p class="text-xs text-bland-400">
                    Thursday, September 18, 2025
                  </p>
                </div>
                <div>
                  <p class="text-sm">Time Window</p>
                  <p class="text-xs text-bland-400">3:00 PM - 6:00 PM</p>
                </div>
              </div>
            </div>
  
            <div>
              <p class="font-semibold my-4">Pickup Details</p>
  
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-start my-4">
                <div>
                  <p class="text-sm">Package Count</p>
                  <p class="text-xs text-bland-400">1 package</p>
                </div>
                <div>
                  <p class="text-sm">Total Weight</p>
                  <p class="text-xs text-bland-400">5 Kg</p>
                </div>
                <div>
                  <p class="text-sm">Dimensions</p>
                  <p class="text-xs text-bland-400">30 x 20 x 15 cm</p>
                </div>
              </div>
            </div>
  
            <div>
              <p class="font-semibold my-4">carrier & Service</p>
  
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start my-4">
                <div>
                  <p class="text-sm">Carrier</p>
                  <p class="text-xs text-bland-400">Fedx Express</p>
                </div>
                <div>
                  <p class="text-sm">Pickup Instruction</p>
                  <p class="text-xs text-bland-400">
                    A text area for specific instructions for the driver.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div
          class="col-span-1 w-full rounded-xl p-6 bg-bland-25 border border-bland-200 h-fit"
        >
          <h3 class="text-2xl font-medium text-bland-950">Pickup Summary</h3>
          <div class="grid gap-4 mt-4">
            <div class="flex justify-between">
              <p class="text-sm md:text-base">Pickup Fee</p>
              <p class="semibold text-sm md:text-base">$25.00</p>
            </div>
            <div class="h-px bg-bland-200 w-full"></div>
            <div class="flex justify-between">
              <p class="text-sm md:text-base font-semibold">Total</p>
              <p class="font-bold text-sm md:text-base">$25.00</p>
            </div>
            <p class="font-semibold text-xs md:text-sm">Included Features</p>
            <div class="flex items-center gap-2">
              <Icon
                icon="mingcute:check-fill"
                width="14"
                height="14"
                class="text-green-100"
              />
              <p class="text-sm md:text-base">Free pickup service</p>
            </div>
            <div class="flex items-center gap-2">
              <Icon
                icon="mingcute:check-fill"
                width="14"
                height="14"
                class="text-green-100"
              />
              <p class="text-sm md:text-base">Same-day scheduling available</p>
            </div>
  
            <Dialog.Root>
              <Dialog.Trigger>
                <Button class="common-button w-full">Confirm Pickup</Button>
              </Dialog.Trigger>
              <Dialog.Content
                class="bg-bland-25 rounded-xl border border-[#D0D5DD]  md:min-w-[672px] min-w-[300px]  overflow-y-auto h-fit p-0"
              >
                <Dialog.Title
                  class="text-xl font-semibold text-bland-950 text-start bg-bland-75 h-full w-full py-2.5 px-6 border border-bland-550"
                >
                  Change Pickup Address
                </Dialog.Title>
                <Dialog.Header class="p-[24px] pt-[8px] pb-[8px]">
                  <Dialog.Description>
                    <div class="flex flex-col gap-[24px] text-start">
                      <!-- Service Types -->
                      <div>
                        <p class="text-lg font-semibold mb-3">
                          Select from saved addresses:
                        </p>
                        <div class="grid gap-3">
                          <RadioGroup.Root value="option-one">
                            <label
                              class="flex items-start sm:items-center flex-col sm:flex-row justify-between gap-3 border border-[#D0D5DD] rounded-md p-3"
                            >
                              <div class="flex items-center gap-4">
                                <RadioGroup.Item
                                  value="option-one"
                                  id="option-one"
                                  class="[&_svg]:bg-bland-950 [&_svg]:rounded-full [&_svg]:size-2.5"
                                />
                                <div class="flex flex-col gap-1">
                                  <p class="font-semibold">Home</p>
                                  <span class="text-sm text-[#4B5563]"
                                    >123 Main St, Anytown, ON M1A 2B3</span
                                  >
                                </div>
                              </div>
                              <span
                                class="bg-blueshade-700 text-white hover:bg-blueshade-700 transition-colors !py-1.5 px-6 text-xs font-medium rounded-sm cursor-pointer w-full sm:w-fit text-center"
                                >Default</span
                              >
                            </label>
                            <label
                              class="flex items-center gap-3 border border-[#D0D5DD] rounded-md p-3"
                            >
                              <RadioGroup.Item
                                value="option-two"
                                id="option-two"
                                class="[&_svg]:bg-bland-950 [&_svg]:rounded-full [&_svg]:size-2.5"
                              />
                              <div class="flex flex-col gap-1">
                                <p class="font-semibold">Office</p>
                                <span class="text-sm text-[#4B5563]"
                                  >123 Main St, Anytown, ON M1A 2B3</span
                                >
                              </div>
                            </label>
                          </RadioGroup.Root>
                        </div>
                      </div>
                    </div>
                  </Dialog.Description>
                </Dialog.Header>
  
                <Dialog.Footer
                  class="flex flex-row justify-end! items-center  bg-bland-75 h-full w-full p-[24px] pt-[16px] border border-bland-550"
                >
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button class="common-button">Add New Address</Button>
                    </Dialog.Trigger>
                    <Dialog.Content
                      class="bg-bland-25 rounded-xl border border-[#D0D5DD]  md:min-w-[672px] min-w-[300px]  overflow-y-auto h-full sm:h-fit p-0 py-1"
                    >
                      <Dialog.Title
                        class="text-xl font-semibold text-bland-950 text-start bg-bland-75 h-full w-full py-2.5 px-6 border border-bland-550"
                      >
                        Add New Address
                      </Dialog.Title>
                      <Dialog.Header class="p-[24px] pt-[8px] pb-[8px]">
                        <Dialog.Description>
                          <div class="flex flex-col gap-1 text-start">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div class="mt-auto">
                                <Label class="form-fields-label my-2"
                                  >Address Name</Label
                                >
  
                                <Input
                                  type="text"
                                  placeholder="4.5"
                                  class="input-field"
                                />
                              </div>
                              <div class="mt-auto">
                                <Label class="form-fields-label my-2"
                                  >Street Address</Label
                                >
  
                                <Input
                                  type="text"
                                  placeholder="4.5"
                                  class="input-field"
                                />
                              </div>
                            </div>
  
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div class="mt-auto">
                                <Label class="form-fields-label my-2">City</Label>
  
                                <Input
                                  type="text"
                                  placeholder="4.5"
                                  class="input-field"
                                />
                              </div>
  
                              <div class="mt-auto">
                                <Label class="form-fields-label my-2"
                                  >Province</Label
                                >
  
                                <Select type="single" name="Shipping From">
                                  <SelectTrigger class="select-field">
                                    Lbs
                                  </SelectTrigger>
                                  <SelectContent class="form-bg border-0">
                                    <SelectGroup>
                                      <SelectLabel>From</SelectLabel>
                                      <SelectItem value="Lbs">Lbs</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
  
                              <div class="mt-auto">
                                <Label class="form-fields-label my-2"
                                  >Postal Code</Label
                                >
  
                                <Input
                                  type="text"
                                  placeholder="4.5"
                                  class="input-field"
                                />
                              </div>
                            </div>
                          </div></Dialog.Description
                        >
                      </Dialog.Header>
  
                      <Dialog.Footer
                        class="flex flex-row justify-end! items-center  bg-bland-75 h-full w-full p-[24px] pt-[16px] border border-bland-550"
                      >
                        <Button class="common-button">Save Address</Button>
                        <Button class="bg-[#FF3C3C]! common-button">Delete</Button
                        >
                      </Dialog.Footer>
                    </Dialog.Content>
                  </Dialog.Root>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
            <Button
              variant="secondary"
              class="shadow-none bg-bland-200/30 rounded-[6px] cursor-pointer"
              onclick={() => goto('/pickups/schedule-new-pickup')}
              >Back To Edit</Button
            >
          </div>
        </div>
      </div>
    </section>
  </main>

