<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import LearningCenter from '$lib/assets/images/dashboard/learning-center.svg';
  import ShipForSuccess from '$lib/assets/images/dashboard/ship-for-success.svg';
  import CountryRules from '$lib/assets/images/dashboard/country-rules.svg';
  import HowToCustomize from '$lib/assets/images/dashboard/how-to-customize.svg';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu';
  // @ts-ignore - silence Svelte import type resolution issues

  import Sidebar from '$lib/components/Sidebar.svelte';
  import IcSettings from '$lib/assets/images/dashboard/ic-settings.svg';
  import IcExport from '$lib/assets/images/dashboard/ic-export.svg';
  import IcHide from '$lib/assets/images/dashboard/ic-hide.svg';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
  } from '$lib/components/ui/select';
  import Donut from '$lib/assets/images/dashboard/donut.svg';
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '$lib/components/ui/tabs';
  import { toast, Toaster } from 'svelte-sonner';
  import { navigate } from 'svelte-routing';
  import { showDashboardSidebar } from '$lib/stores/store';
  import DashboardHeader from '$lib/components/DashboardHeader.svelte';
</script>

<main class="bg-bland-650 h-full">
  <Sidebar />

  <DashboardHeader />

  <section
    class={`${$showDashboardSidebar ? 'lg:w-[calc(100%-256px)]' : 'w-full'}  ms-auto flex-1 p-6 duration-300`}
  >
    <!-- Header banner -->
    <div
      class="bg-bland-900 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 mb-6"
    >
      <div>
        <h3 class="sub-heading !text-bland-25 font-bold !mt-0">Hi, Abir!</h3>
        <p class="text-[#B7B7B7] my-2">We're glad to see you on board.</p>
        <p class="text-bland-25">
          Currently your dashboard seems a little bit empty. Let's get started
          with your first shipment!
        </p>
      </div>
      <div class="ms-auto">
        <Button
          onclick={() => {
            navigate('/create-shipment');
          }}
          class="common-button"
        >
          <Icon icon="mynaui:plus" /> Create Shipment
        </Button>
      </div>
    </div>

    <!-- Top stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="common-card">
        <div class="text-bland-950 text-sm font-medium">
          <span class="size-3 rounded-full bg-primary-500 inline-block me-1.5"
          ></span> Created
        </div>
        <div class="text-2xl font-bold text-bland-950 mt-2">02</div>
      </div>
      <div class="common-card">
        <div class="text-bland-950 text-sm font-medium">
          <span class="size-3 rounded-full bg-primary-400 inline-block me-1.5"
          ></span> In Transit
        </div>
        <div class="text-2xl font-bold text-bland-950 mt-2">02</div>
      </div>
      <div class="common-card">
        <div class="text-bland-950 text-sm font-medium">
          <span class="size-3 rounded-full bg-primary-600 inline-block me-1.5"
          ></span> Exception
        </div>
        <div class="text-2xl font-bold text-bland-950 mt-2">02</div>
      </div>
      <div class="common-card">
        <div class="text-bland-950 text-sm font-medium">
          <span class="size-3 rounded-full bg-primary-700 inline-block me-1.5"
          ></span> Delivered
        </div>
        <div class="text-2xl font-bold text-bland-950 mt-2">02</div>
      </div>
    </div>

    <!-- Main grid: tiles + transit -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          class="p-6 rounded-xl text-center text-white bg-primary-900 flex justify-center items-center flex-col"
        >
          <img src={LearningCenter} alt="Learning Center" class="mx-auto" />
          <div class="mt-6 text-lg font-semibold">Learning Center</div>
        </div>

        <div
          class="p-6 rounded-xl text-center text-white bg-primary-500 flex justify-center items-center flex-col"
        >
          <img src={ShipForSuccess} alt="Ship For Success" class="mx-auto" />
          <div class="mt-6 text-lg font-semibold">Ship for Success</div>
        </div>

        <div
          class="p-6 rounded-xl text-center text-white bg-primary-400 flex justify-center items-center flex-col"
        >
          <img src={CountryRules} alt="Country Rules" class="mx-auto" />
          <div class="mt-6 text-lg font-semibold">Country Rules</div>
        </div>

        <div
          class="p-6 rounded-xl text-center text-white bg-primary-800 flex justify-center items-center flex-col"
        >
          <img src={HowToCustomize} alt="How To Customize" class="mx-auto" />
          <div class="mt-6 text-lg font-semibold">How To Customize</div>
        </div>
      </div>

      <div class="common-card h-fit">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold">Transit Status</div>
            <div class="relative">
              <DropdownMenu>
                <DropdownMenuTrigger class="cursor-pointer"
                  ><Icon
                    icon="ph:dots-three-bold"
                    class="size-6"
                  /></DropdownMenuTrigger
                >
                <DropdownMenuContent
                  class="bg-bland-25 border rounded-lg p-2 min-w-[180px] absolute right-[-13px] border-bland-300/40 "
                >
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcSettings} alt="Settings" class="size-4" />
                    <span>Widget Setting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcExport} alt="Export" class="size-4" />
                    <span>Export to Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcHide} alt="Hide" class="size-4" />
                    <span>Hide Widget</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div class="bg-bland-850 rounded-xl p-5">
            <div class="flex items-center justify-center">
              <div
                class="w-20 h-20 rounded-full bg-primary-200 flex items-center justify-center text-primary-400 text-2xl font-bold"
              >
                8
              </div>
            </div>
            <div class="text-center text-base text-bland-950 font-medium my-3">
              Shipments in Transit
            </div>
            <div class="text-xs text-center text-bland-750">
              Updated 5 minutes ago
            </div>
          </div>

          <div class="text-center mt-4 flex justify-center">
            <Button
              type="button"
              class="shadow-none mt-2 cursor-pointer flex items-center justify-center w-fit"
              >View all Shipments<Icon
                icon="solar:arrow-right-linear"
                class="-ms-1.5 size-4"
              /></Button
            >
          </div>
        </div>

        <!-- <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold">Recent Shipments</div>
            <div class="muted text-sm">…</div>
          </div>
          <ul class="space-y-3">
              <li class="flex items-center justify-between">
                <div>
                  <div class="font-medium">#SP-2024-001</div>
                  <div class="text-xs muted">New York, USA → London, UK</div>
                </div>
                <div class="text-sm">
                  <span class="px-3 py-1 rounded-full text-white text-xs" style="background:#10b981">Delivered</span>
                </div>
              </li>

              <li class="flex items-center justify-between">
                <div>
                  <div class="font-medium">#SP-2024-002</div>
                  <div class="text-xs muted">Los Angeles, USA → Berlin, DE</div>
                </div>
                <div class="text-sm">
                  <span class="px-3 py-1 rounded-full text-white text-xs" style="background:#f59e0b">In Transit</span>
                </div>
              </li>

              <li class="flex items-center justify-between">
                <div>
                  <div class="font-medium">#SP-2024-003</div>
                  <div class="text-xs muted">Chicago, USA → Toronto, CA</div>
                </div>
                <div class="text-sm">
                  <span class="px-3 py-1 rounded-full text-white text-xs" style="background:#ef4444">Exception</span>
                </div>
              </li>
          </ul>
        </div> -->
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <div class="lg:col-span-2 h-fit">
        <div class="common-card">
          <div class="font-semibold mb-4">How it Works</div>

          <div class="relative py-8">
            <!-- horizontal connector line -->
            <div
              class="absolute w-[calc(100%-200px)] left-1/2 -translate-1/2 top-14 h-px bg-bland-750/40 hidden sm:block"
            ></div>

            <div class="flex justify-between gap-10 sm:gap-0 flex-wrap">
              <!-- Step 1 -->
              <div class="flex-1 flex flex-col items-center z-10">
                <div
                  class="w-12 h-12 rounded-xl bg-bland-850 flex items-center justify-center font-semibold text-lg"
                >
                  1
                </div>
                <div class="mt-4">
                  <Icon
                    icon="mdi:clipboard-text-outline"
                    class="size-6 text-bland-750"
                  />
                </div>
                <div class="mt-3 text-xs text-bland-300 text-center">
                  Enter shipment info
                </div>
              </div>

              <!-- Step 2 -->
              <div class="flex-1 flex flex-col items-center z-10">
                <div
                  class="w-12 h-12 rounded-xl bg-bland-850 flex items-center justify-center font-semibold text-lg"
                >
                  2
                </div>
                <div class="mt-4">
                  <Icon icon="mdi:magnify" class="size-6 text-bland-750" />
                </div>
                <div class="mt-3 text-xs text-bland-300 text-center">
                  Compare prices
                </div>
              </div>

              <!-- Step 3 -->
              <div class="flex-1 flex flex-col items-center z-10">
                <div
                  class="w-12 h-12 rounded-xl bg-bland-850 flex items-center justify-center font-semibold text-lg"
                >
                  3
                </div>
                <div class="mt-4">
                  <Icon icon="mdi:printer" class="size-6 text-bland-750" />
                </div>
                <div class="mt-3 text-xs text-bland-300 text-center">
                  Book shipping &amp; print label
                </div>
              </div>

              <!-- Step 4 -->
              <div class="flex-1 flex flex-col items-center z-10">
                <div
                  class="w-12 h-12 rounded-xl bg-bland-850 flex items-center justify-center font-semibold text-lg"
                >
                  4
                </div>
                <div class="mt-4">
                  <Icon
                    icon="mdi:calendar-check"
                    class="size-6 text-bland-750"
                  />
                </div>
                <div class="mt-3 text-xs text-bland-300 text-center">
                  Schedule pickup
                </div>
              </div>

              <!-- Step 5 -->
              <div class="flex-1 flex flex-col items-center z-10">
                <div
                  class="w-12 h-12 rounded-xl bg-bland-850 flex items-center justify-center font-semibold text-lg"
                >
                  5
                </div>
                <div class="mt-4">
                  <Icon
                    icon="mdi:package-variant-closed"
                    class="size-6 text-bland-750"
                  />
                </div>
                <div class="mt-3 text-xs text-bland-300 text-center">
                  Track package
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-bland-25 rounded-xl p-4 sm:p-6 border border-[#D0D5DD] mt-4"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold">Scheduled Pickups</div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger class="cursor-pointer"
                  ><Icon
                    icon="ph:dots-three-bold"
                    class="size-6"
                  /></DropdownMenuTrigger
                >
                <DropdownMenuContent
                  class="bg-bland-25 border rounded-lg p-2 min-w-[180px] absolute right-[-13px] border-bland-300/40 "
                >
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcSettings} alt="Settings" class="size-4" />
                    <span>Widget Setting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcExport} alt="Export" class="size-4" />
                    <span>Export to Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcHide} alt="Hide" class="size-4" />
                    <span>Hide Widget</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <ul class="space-y-3">
            <li
              class="bg-bland-850 rounded-md sm:p-4 flex items-center justify-between flex-wrap"
            >
              <div class="flex items-center gap-3">
                <div class="flex flex-col">
                  <div class="font-medium text-sm text-bland-950">
                    Today, 2:00 PM
                  </div>
                  <div class="text-xs text-bland-750">
                    123 Main St, New York
                  </div>
                </div>
              </div>

              <div class="text-sm">
                <span
                  class="px-2 py-1 bg-primary-75 rounded-sm text-primary-950 font-medium text-xs"
                  >Pending</span
                >
              </div>
            </li>

            <li
              class="bg-bland-850 rounded-md sm:p-4 flex items-center justify-between flex-wrap"
            >
              <div class="flex items-center gap-3">
                <div class="flex flex-col">
                  <div class="font-medium text-sm text-bland-950">
                    Tomorrow, 10:00 AM
                  </div>
                  <div class="text-xs text-bland-750">456 Oak Ave, Boston</div>
                </div>
              </div>

              <div class="text-sm">
                <span
                  class="px-2 py-1 bg-blueshade-200 rounded-sm text-blueshade-600 font-medium text-xs"
                  >Scheduled</span
                >
              </div>
            </li>

            <li
              class="bg-bland-850 rounded-md sm:p-4 flex items-center justify-between flex-wrap"
            >
              <div class="flex items-center gap-3">
                <div class="flex flex-col">
                  <div class="font-medium text-sm text-bland-950">
                    Tomorrow, 10:00 AM
                  </div>
                  <div class="text-xs text-bland-750">456 Oak Ave, Boston</div>
                </div>
              </div>

              <div class="text-sm">
                <span
                  class="px-2 py-1 bg-blueshade-200 rounded-sm text-blueshade-600 font-medium text-xs"
                  >Scheduled</span
                >
              </div>
            </li>
          </ul>
        </div>

        <div class="common-card mt-4">
          <div
            class="flex items-start sm:items-center justify-between sm:flex-row flex-col gap-4 sm:gap-0 mb-4"
          >
            <div class="font-semibold">Cost Breakdown</div>
            <div>
              <Select type="single">
                <SelectTrigger
                  class="!text-bland-950 border-[#D0D5DD] rounded-md py-2 [&_svg]:text-bland-950 [&_svg]:opacity-100  [&_svg]:w-[18px] cursor-pointer text-xs"
                  >Last 30 Days</SelectTrigger
                >
                <SelectContent class="bg-bland-25 border-[#D0D5DD]">
                  <SelectItem class="cursor-pointer" value={'30days'}
                    >Last 30 Days</SelectItem
                  >
                  <SelectItem class="cursor-pointer" value={'90days'}
                    >Last 90 Days</SelectItem
                  >
                  <SelectItem class="cursor-pointer" value={'6months'}
                    >Last 6 Months</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Tabs value="shipmentdata">
              <TabsList
                class="gap-2.5 [&_[data-state=inactive]]:text-bland-950 [&_[data-state=inactive]]:p-4 [&_[data-state=inactive]]:border [&_[data-state=inactive]]:border-[#D7E0E0] [&_[data-state=active]]:bg-primary-400 [&_[data-state=active]]:text-bland-25 [&_[data-state=active]]:p-4 p-0!"
              >
                <TabsTrigger class="cursor-pointer" value="billing"
                  >Billing</TabsTrigger
                >
                <TabsTrigger class="cursor-pointer" value="shipmentdata"
                  >Shipment Data</TabsTrigger
                >
              </TabsList>
              <TabsContent value="billing">Billing</TabsContent>
              <TabsContent value="shipmentdata">
                <div
                  class="flex flex-wrap justify-center gap-10 text-center mt-4 rounded-xl bg-bland-850 p-4"
                >
                  <div>
                    <span class="text-bland-300 text-xs">Spend</span>
                    <h5 class="text-bland-950 text-base font-bold">
                      $2,847.50
                    </h5>
                    <span class="text-bland-300 text-xs">$94.92 per day</span>
                  </div>

                  <div>
                    <span class="text-bland-300 text-xs">Parcel Count</span>
                    <h5 class="text-bland-950 text-base font-bold">67</h5>
                    <span class="text-bland-300 text-xs">2.2 per day</span>
                  </div>

                  <div>
                    <span class="text-bland-300 text-xs">Savings</span>
                    <h5 class="text-green-300 text-base font-bold">$342.80</h5>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div class="h-fit">
        <div class="bg-bland-25 rounded-xl p-4 sm:p-6 border border-[#D0D5DD]">
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold">Recent Shipments</div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger class="cursor-pointer"
                  ><Icon
                    icon="ph:dots-three-bold"
                    class="size-6"
                  /></DropdownMenuTrigger
                >
                <DropdownMenuContent
                  class="bg-bland-25 border rounded-lg p-2 min-w-[180px] absolute right-[-13px] border-bland-300/40 "
                >
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcSettings} alt="Settings" class="size-4" />
                    <span>Widget Setting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcExport} alt="Export" class="size-4" />
                    <span>Export to Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950 flex items-center gap-2"
                  >
                    <img src={IcHide} alt="Hide" class="size-4" />
                    <span>Hide Widget</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <ul class="space-y-3">
            <li
              class="bg-bland-850 rounded-md sm:p-4 flex items-center justify-between flex-wrap"
            >
              <div class="flex items-center gap-3">
                <div>
                  <div
                    class="size-2 bg-blueshade-600 rounded-full inline-block"
                  ></div>
                </div>

                <div class="flex flex-col">
                  <div class="font-medium text-sm text-bland-950">
                    #SP-2024-001
                  </div>
                  <div class="text-xs text-bland-750">
                    New York → Los Angeles
                  </div>
                </div>
              </div>

              <div class="text-sm">
                <span
                  class="px-2 py-1 bg-blueshade-200 rounded-sm text-blueshade-600 font-medium text-xs"
                  >In Transit</span
                >
              </div>
            </li>

            <li
              class="bg-bland-850 rounded-md sm:p-4 flex items-center justify-between flex-wrap"
            >
              <div class="flex items-center gap-3">
                <div>
                  <div
                    class="size-2 bg-primary-700 rounded-full inline-block"
                  ></div>
                </div>

                <div class="flex flex-col">
                  <div class="font-medium text-sm text-bland-950">
                    #SP-2024-002
                  </div>
                  <div class="text-xs text-bland-750">Chicago → Miami</div>
                </div>
              </div>

              <div class="text-sm">
                <span
                  class="px-2 py-1 bg-green-150 rounded-sm text-green-400 font-medium text-xs"
                  >Delivered</span
                >
              </div>
            </li>

            <li
              class="bg-bland-850 rounded-md sm:p-4 flex items-center justify-between flex-wrap"
            >
              <div class="flex items-center gap-3">
                <div>
                  <div
                    class="size-2 bg-gray-500 rounded-full inline-block"
                  ></div>
                </div>

                <div class="flex flex-col">
                  <div class="font-medium text-sm text-bland-950">
                    #SP-2024-003
                  </div>
                  <div class="text-xs text-bland-750">Boston → Seattle</div>
                </div>
              </div>

              <div class="text-sm">
                <span
                  class="px-2 py-1 bg-gray-50 rounded-sm text-bland-950 font-medium text-xs"
                  >Created</span
                >
              </div>
            </li>

            <li
              class="bg-bland-850 rounded-md sm:p-4 flex items-center justify-between flex-wrap"
            >
              <div class="flex items-center gap-3">
                <div>
                  <div
                    class="size-2 bg-gray-500 rounded-full inline-block"
                  ></div>
                </div>

                <div class="flex flex-col">
                  <div class="font-medium text-sm text-bland-950">
                    #SP-2024-003
                  </div>
                  <div class="text-xs text-bland-750">Boston → Seattle</div>
                </div>
              </div>

              <div class="text-sm">
                <span
                  class="px-2 py-1 bg-gray-50 rounded-sm text-bland-950 font-medium text-xs"
                  >Created</span
                >
              </div>
            </li>
          </ul>
        </div>

        <div class="common-card mt-4">
          <div
            class="flex items-start sm:items-center justify-between sm:flex-row flex-col gap-4 sm:gap-0 mb-4"
          >
            <div class="font-semibold">Top Destinations</div>
            <div>
              <Select type="single">
                <SelectTrigger
                  class="!text-bland-950 border-[#D0D5DD] rounded-md py-2 [&_svg]:text-bland-950 [&_svg]:opacity-100  [&_svg]:w-[18px] cursor-pointer text-xs"
                  >Last 30 Days</SelectTrigger
                >
                <SelectContent class="bg-bland-25 border-[#D0D5DD]">
                  <SelectItem value={'30days'}>Last 30 Days</SelectItem>
                  <SelectItem value={'90days'}>Last 90 Days</SelectItem>
                  <SelectItem value={'6months'}>Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="flex justify-center items-center flex-wrap gap-5">
            <!-- Donut chart (static segments via conic-gradient) -->
            <div class="relative">
              <img src={Donut} alt="Donut Chart" />
            </div>

            <!-- legend and list -->
            <div class="flex-1">
              <ul class="space-y-3">
                <li class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="size-2 rounded-full inline-block bg-blueshade-300"
                    ></span>
                    <div class="text-xs text-bland-950">Los Angeles, CA</div>
                  </div>
                  <div class="text-xs text-bland-950 font-semibold">15</div>
                </li>

                <li class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full inline-block bg-green-75"
                    ></span>
                    <div class="text-xs text-bland-950">Miami, FL</div>
                  </div>
                  <div class="text-xs text-bland-950 font-semibold">12</div>
                </li>

                <li class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="size-2 rounded-full inline-block bg-primary-850"
                    ></span>
                    <div class="text-xs text-bland-950">Seattle, WA</div>
                  </div>
                  <div class="text-xs text-bland-950 font-semibold">8</div>
                </li>

                <li class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="size-2 rounded-full inline-block bg-primary-750"
                    ></span>
                    <div class="text-xs text-bland-950">Chicago, IL</div>
                  </div>
                  <div class="text-xs text-bland-950 font-semibold">6</div>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div>
              <!-- detailed rows like image -->
              <div class="mt-5 space-y-3">
                <div
                  class="bg-bland-850 rounded-sm sm:p-3 flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="w-3 h-3 rounded-full inline-block"
                      style="background:#63b3ff"
                    ></span>
                    <div class="text-xs sm:text-sm text-bland-750">
                      Los Angeles, CA
                    </div>
                  </div>
                  <div class="text-xs sm:text-sm text-bland-950 font-medium">
                    15 shipments
                  </div>
                </div>

                <div
                  class="bg-bland-850 rounded-sm sm:p-3 flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="w-3 h-3 rounded-full inline-block"
                      style="background:#9ee6c9"
                    ></span>
                    <div class="text-xs sm:text-sm text-bland-750">
                      Miami, FL
                    </div>
                  </div>
                  <div class="text-xs sm:text-sm text-bland-950 font-medium">
                    12 shipments
                  </div>
                </div>

                <div
                  class="bg-bland-850 rounded-sm sm:p-3 flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="w-3 h-3 rounded-full inline-block"
                      style="background:#b8a5ff"
                    ></span>
                    <div class="text-xs sm:text-sm text-bland-750">
                      Seattle, WA
                    </div>
                  </div>
                  <div class="text-xs sm:text-sm text-bland-950 font-medium">
                    8 shipments
                  </div>
                </div>

                <div
                  class="bg-bland-850 rounded-sm sm:p-3 flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="w-3 h-3 rounded-full inline-block"
                      style="background:#ffb3b3"
                    ></span>
                    <div class="text-xs sm:text-sm text-bland-750">
                      Chicago, IL
                    </div>
                  </div>
                  <div class="text-xs sm:text-sm text-bland-950 font-medium">
                    6 shipments
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<Toaster position="top-right" />
