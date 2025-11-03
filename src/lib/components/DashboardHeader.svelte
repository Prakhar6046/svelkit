<script>
  import Icon from '@iconify/svelte';
  import { Button } from './ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from './ui/dropdown-menu';
  import { showDashboardSidebar } from '../../lib/stores/store';
  import UserImg from '../../../public/assets/images/dashboard/user.png';
  import { logout } from '../../lib/stores/auth';
  import { toast, Toaster } from 'svelte-sonner';
  import { navigate } from 'svelte-routing';

  function handleLogout() {
    const result = logout();

    if (result.status) {
      toast.success('Logged Out Successfully');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      toast.error('Failed to log out');
    }
  }
</script>

<header
  class={`w-full p-5 bg-bland-25 flex items-center justify-between sticky top-0 z-50 duration-300 border-b border-b-bland-300/40
           ${$showDashboardSidebar ? 'lg:w-[calc(100%-256px)] lg:ms-auto' : 'lg:w-full lg:ms-auto'}`}
>
  <Button
    onclick={() => {
      showDashboardSidebar.update(v => !v);
    }}
    variant="secondary"
    class="shadow-none cursor-pointer"
    ><Icon icon="hugeicons:menu-05" class="size-5" /></Button
  >

  <div class="flex gap-3 justify-end items-center">
    <Button
      variant="secondary"
      class="shadow-none bg-bland-200/30 rounded-[6px] size-10 cursor-pointer"
      ><Icon icon="proicons:bell" class="size-5 text-bland-950" /></Button
    >

    <DropdownMenu>
      <DropdownMenuTrigger class="flex items-center gap-2 cursor-pointer">
        <img src={UserImg} alt="User" class="rounded-[6px] size-10" />
        <div class="flex flex-col items-start">
          <span class="font-semibold text-base text-bland-950">Abir Adnan</span>
          <span class="text-bland-300 text-xs">Account # : 154221</span>
        </div>
        <Icon icon="uil:angle-down" class="size-6 text-bland-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        class="bg-bland-25 border rounded-lg p-2 min-w-[180px] border-bland-300/40 my-4"
      >
        <DropdownMenuItem
          class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950"
          >Profile</DropdownMenuItem
        >
        <DropdownMenuItem
          class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950"
          >Billing</DropdownMenuItem
        >
        <DropdownMenuItem
          class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950"
          >Team</DropdownMenuItem
        >
        <DropdownMenuItem
          class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md mb-0.5 cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950"
          >Subscription</DropdownMenuItem
        >
        <DropdownMenuItem
          onclick={handleLogout}
          class="px-3 py-2 text-sm text-bland-750 hover:bg-bland-850 rounded-md cursor-pointer data-[highlighted]:bg-bland-850 data-[highlighted]:text-bland-950"
          >Logout</DropdownMenuItem
        >
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</header>
