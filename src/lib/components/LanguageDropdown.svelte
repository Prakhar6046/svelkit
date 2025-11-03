<script lang="ts">
  import { onMount } from 'svelte';
  import { languageStore, languageActions } from '../stores/language.js';
  import { _ } from 'svelte-i18n';
  import * as Select from './ui/select';

  onMount(() => {
    languageActions.initializeLanguage();
  });

  $: currentLanguage = $languageStore.current;

  $: if (currentLanguage && currentLanguage !== $languageStore.current) {
    languageActions.setLanguage(currentLanguage);
  }

  $: currentLanguageInfo = $languageStore.available.find(
    lang => lang.code === currentLanguage
  ) || { code: 'en', name: 'English', flag: '🇺🇸' };
</script>

<div class="relative">
  <Select.Root type="single" bind:value={currentLanguage}>
    <Select.Trigger
      class="font-semibold text-xs sm:text-sm md:text-base shadow-none border border-bland-200 rounded-xl py-1 sm:py-2 xl:py-2.5 px-2.5 sm:px-4 h-auto cursor-pointer hover:shadow-md"
    >
      <div class="flex items-center gap-2 w-full">
        <span class="text-base opacity-50">{currentLanguageInfo.flag}</span>
        <span class="font-medium flex-1">{currentLanguageInfo.name}</span>
      </div>
    </Select.Trigger>

    <Select.Content
      class="min-w-[140px] form-bg border border-gray-200 rounded-lg shadow-lg z-50"
    >
      {#each $languageStore.available as language (language.code)}
        <Select.Item
          value={language.code}
          class="flex items-center gap-2 px-3 py-2  cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
        >
          <span class="text-base opacity-50">{language.flag}</span>
          <span class="font-medium">{language.name}</span>
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
