<script lang="ts">
  import { t } from 'svelte-i18n';
  import PublicNavbar from '$lib/components/PublicNavbar.svelte';
  import PublicFooter from '$lib/components/PublicFooter.svelte';
  import { Button } from '$lib/components/ui/button';
  import Icon from '@iconify/svelte';
  import Reliability from '$lib/assets/images/Reliability.svg';
  import Simplicity from '$lib/assets/images/Simplicity.svg';
  import Trust from '$lib/assets/images/trust.svg';
  import careersic1 from '$lib/assets/images/careers-ic-1.svg';
  import careersic2 from '$lib/assets/images/careers-ic-2.svg';
  import careersic3 from '$lib/assets/images/careers-ic-3.svg';
  import careersic4 from '$lib/assets/images/careers-ic-4.svg';
  import people from '$lib/assets/images/people.png';
  import { onMount } from 'svelte';
  import { setMeta } from '$lib/meta/meta';

  const coreValues = [
    { icon: Reliability, key: 'coreValues.0' },
    { icon: Simplicity, key: 'coreValues.1' },
    { icon: Trust, key: 'coreValues.2' },
    { icon: Trust, key: 'coreValues.3' },
  ];

  const teamMembers = Array(8).fill({
    name: 'team.members.0.name',
    role: 'team.members.0.role',
  });
  const careersIcons = [careersic1, careersic2, careersic3, careersic4];

  onMount(() => {
    setMeta({
      title: 'About | About Page',
      description: 'Learn more about us and our mission.',
      image:
        'https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXJsfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
      url: import.meta.env.VITE_SITE_URL,
    });
  });
</script>

<PublicNavbar />

<main>
  <!-- Ship and return Section Start -->

  <section>
    <div class="header-bg-600">
      <div class="max-w-[1296px] px-4 mx-auto">
        <div class="mt-4 md:mt-0 text-center py-10 md:py-20">
          <h2
            class=" text-3xl md:text-5xl lg:text-[60px] font-semibold leading-[1.3em]"
          >
            {$t('about.shippingPage.header.title')}
          </h2>

          <p class="sub-heading">{$t('about.shippingPage.header.subtitle')}</p>
        </div>
      </div>
    </div>

    <!-- Story / Mission / Vision -->
    <section class="md:pt-12">
      <div
        class="bg-[url(/assets/worldMap.svg)] bg-cover lg:bg-contain bg-no-repeat bg-center max-w-[1296px] mx-auto"
      >
        <div
          class="max-w-[948px] px-4 mx-auto py-5 md:py-[100px] flex flex-col gap-10 md:gap-4xl"
        >
          {#each ['ourStory', 'ourMission', 'ourVision'] as sectionKey}
            <div>
              <h2 class="heading-h2">
                {$t(`about.shippingPage.${sectionKey}.title`)}
              </h2>
              <p class="sub-heading">
                {$t(`about.shippingPage.${sectionKey}.description`)}
              </p>
            </div>
          {/each}

          <!-- Core Values -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-bland-950"
          >
            {#each coreValues as value, idx}
              <div
                class="bg-white border border-bland-300/30 rounded-[24px] p-5 flex flex-col gap-4"
              >
                <img src={value.icon} class="w-12" alt="Core Value Icon" />
                <p class="text-2xl font-semibold">
                  {$t(`about.shippingPage.${value.key}.title`)}
                </p>
                <p>{$t(`about.shippingPage.${value.key}.description`)}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- Careers Section -->
    <section>
      <div
        class="max-w-[948px] px-4 mx-auto flex flex-col justify-center items-center py-[60px] gap-6"
      >
        <p class="text-lg font-semibold">
          {$t('about.shippingPage.trustedBy.subtitle')}
        </p>
        <div class="flex gap-6 flex-wrap justify-center">
          {#each careersIcons as icon}
            <img src={icon} alt="Career Icon" />
          {/each}
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section>
      <div
        class="max-w-[948px] px-4 mx-auto flex flex-col justify-center items-center py-5 md:py-[100px] gap-[60px]"
      >
        <div class="text-center mt-4 md:mt-0">
          <h2 class="heading-h2">{$t('about.shippingPage.team.title')}</h2>
          <p class="sub-heading">{$t('about.shippingPage.team.subtitle')}</p>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
        >
          {#each teamMembers as member, idx}
            <div
              class="rounded-2xl max-w-[300px] sm:max-w-full mx-auto sm:mx-0 w-full"
            >
              <img class="w-full" src={people} alt="people" />
              <p class=" font-medium mb-1 mt-2">{$t(member.name)}</p>
              <p class="text-sm text-bland-300">{$t(member.role)}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- CTA Section Start -->
    <section class="py-12 lg:py-[100px] header-bg-300">
      <div class="max-w-[1296px] px-4 mx-auto">
        <div
          class="flex flex-col md:grid grid-cols-12 gap-6 sm:gap-10 lg:gap-20"
        >
          <div class="col-span-8 my-auto text-center md:text-start">
            <h2 class="heading-h2 capitalize">
              {$t('about.shippingPage.cta.title')}
            </h2>

            <p class="sub-heading">
              {$t('about.shippingPage.cta.description')}
            </p>
          </div>

          <div class="col-span-4 my-auto">
            <Button
              class="ms-auto me-auto md:me-0 flex items-center font-semibold text-sm sm:text-base md:text-lg text-bland-25 bg-primary-400 shadow-none border border-primary-400 rounded-xl py-2 xl:py-2.5 !px-6 h-auto cursor-pointer hover:shadow-md"
            >
              {$t('about.shippingPage.ctaButton')}
              <Icon
                icon="solar:arrow-right-linear"
                class="text-bland-25 size-3.5 sm:size-6"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  </section>
</main>

<PublicFooter />
