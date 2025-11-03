<script lang="ts">
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from '../components/ui/carousel';
  import { Button } from '../components/ui/button';
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  interface Slide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    buttonText: string;
    buttonUrl: string;
    buttonVariant?:
      | 'default'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
      | 'destructive';
  }

  interface HeroSliderProps {
    slides?: Slide[];
  }

  let {
    slides = [
      {
        id: '1',
        title: 'Welcome to Ship Flash',
        subtitle: 'Build Fast, Deploy Faster',
        description:
          'Your all-in-one solution for modern web development. Build, deploy, and scale your applications with ease using cutting-edge technologies.',
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
        buttonText: 'Get Started',
        buttonUrl: '/signin',
        buttonVariant: 'default',
      },
      {
        id: '2',
        title: 'Lightning Fast Performance',
        subtitle: 'Optimized for Speed',
        description:
          'Experience blazing-fast performance with our optimized stack. Built with modern technologies for optimal user experience.',
        image:
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=600&fit=crop',
        buttonText: 'Learn More',
        buttonUrl: '#features',
        buttonVariant: 'outline',
      },
      {
        id: '3',
        title: 'Enterprise Security',
        subtitle: 'Secure by Design',
        description:
          'Enterprise-grade security with protected routes, authentication, and data encryption. Your data is safe with us.',
        image:
          'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop',
        buttonText: 'Explore Security',
        buttonUrl: '#security',
        buttonVariant: 'secondary',
      },
      {
        id: '4',
        title: 'Developer Friendly',
        subtitle: 'Built for Developers',
        description:
          'Intuitive interface and comprehensive documentation designed for developers. Get up and running in minutes, not hours.',
        image:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop',
        buttonText: 'View Docs',
        buttonUrl: '#docs',
        buttonVariant: 'ghost',
      },
    ],
  }: HeroSliderProps = $props();
</script>

<section class="relative w-full">
  <Carousel
    class="w-full"
    opts={{
      align: 'start',
      loop: true,
    }}
  >
    <CarouselContent class="-ml-1">
      {#each slides as slide (slide.id)}
        <CarouselItem class="pl-1 md:basis-1/2 lg:basis-1/3">
          <div class="relative group">
            <div
              class="aspect-[16/9] relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-800"
            >
              <img
                src={slide.image}
                alt={slide.title}
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
              ></div>

              <!-- Content Overlay -->
              <div
                class="absolute inset-0 flex flex-col justify-end p-6 text-white"
              >
                <div class="space-y-3">
                  <div class="space-y-1">
                    <p
                      class="text-sm font-medium text-blue-300 uppercase tracking-wide"
                    >
                      {slide.subtitle}
                    </p>
                    <h3 class="text-2xl font-bold leading-tight">
                      {slide.title}
                    </h3>
                  </div>
                  <p class="text-sm text-gray-200 leading-relaxed max-w-md">
                    {slide.description}
                  </p>
                  <div class="pt-2">
                    <Button
                      variant={slide.buttonVariant || 'default'}
                      size="sm"
                      class="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    >
                      {slide.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
      {/each}
    </CarouselContent>

    <!-- Navigation Buttons -->
    <div class="absolute top-1/2 -translate-y-1/2 left-4 z-10">
      <CarouselPrevious
        class="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
      >
        <ChevronLeft class="h-4 w-4" />
      </CarouselPrevious>
    </div>
    <div class="absolute top-1/2 -translate-y-1/2 right-4 z-10">
      <CarouselNext
        class="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
      >
        <ChevronRight class="h-4 w-4" />
      </CarouselNext>
    </div>
  </Carousel>
</section>
