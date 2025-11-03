<!-- Dark Mode Theme Test Component -->
<div class="p-8 space-y-4 w-[1400px]">
  <h2 class="text-2xl font-bold text-red-700 dark:text-green-100">
    Dark Mode Theme Test
  </h2>

  <!-- Color Palette Test -->
  <div class="grid grid-cols-4 gap-4">
    <div class="p-4 rounded-lg bg-primary-100 dark:bg-white">
      <p class="text-sm text-primary-400">Primary 100</p>
    </div>
    <div class="p-4 rounded-lg bg-secondary-100 dark:bg-secondary-100">
      <p class="text-sm text-secondary-700">Secondary 100</p>
    </div>
    <div class="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-100">
      <p class="text-sm text-neutral-900 dark:text-neutral-100">Neutral 100</p>
    </div>
    <div class="p-4 rounded-lg bg-mint-500">
      <p class="text-sm text-white">Mint 500</p>
    </div>
  </div>

  <!-- Text Colors Test -->
  <div class="space-y-2">
    <p class="text-neutral-900 dark:text-neutral-100">
      Dark text in light mode, light text in dark mode
    </p>
    <p class="text-neutral-600 dark:text-neutral-400">Muted text</p>
    <p class="text-primary-400 dark:text-red-600">
      Primary color (same in both modes)
    </p>
  </div>

  <!-- Background Test -->
  <div
    class="p-6 rounded-lg bg-white dark:bg-neutral-50 border border-neutral-200 dark:border-neutral-800"
  >
    <p class="text-neutral-900 dark:text-neutral-100">Card background test</p>
  </div>
</div>
