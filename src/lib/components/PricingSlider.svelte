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

  interface PricingSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    currentPrice: string;
    originalPrice: string;
    savingsPercent: string;
    carrier: string;
    service: string;
    deliveryTime: string;
  }

  interface PricingSliderProps {
    slides?: PricingSlide[];
  }

  let {
    slides = [
      {
        id: '1',
        title: 'Big Discounts,',
        subtitle: 'Trusted Carriers.',
        description:
          'Partner with top carriers and access bulk-rate discounts—slash shipping costs by up to 60% without losing reliability.',
        currentPrice: '$59.85',
        originalPrice: '$95.00',
        savingsPercent: '63% Saved',
        carrier: 'FedEx',
        service: 'Express',
        deliveryTime: '1-2 Days',
      },
      {
        id: '2',
        title: 'Lightning Fast,',
        subtitle: 'Reliable Delivery.',
        description:
          'Get your packages delivered quickly and safely with our network of trusted shipping partners worldwide.',
        currentPrice: '$45.20',
        originalPrice: '$78.50',
        savingsPercent: '42% Saved',
        carrier: 'UPS',
        service: 'Ground',
        deliveryTime: '2-3 Days',
      },
      {
        id: '3',
        title: 'Premium Service,',
        subtitle: 'Best Rates.',
        description:
          'Access premium shipping services at discounted rates. Track your packages and ensure safe delivery.',
        currentPrice: '$72.30',
        originalPrice: '$120.00',
        savingsPercent: '40% Saved',
        carrier: 'Purolator',
        service: 'Priority',
        deliveryTime: '1 Day',
      },
      {
        id: '4',
        title: 'Global Reach,',
        subtitle: 'Local Prices.',
        description:
          'Ship anywhere in the world with our global network. Competitive rates for international shipping.',
        currentPrice: '$89.50',
        originalPrice: '$145.00',
        savingsPercent: '38% Saved',
        carrier: 'DHL',
        service: 'International',
        deliveryTime: '3-5 Days',
      },
    ],
  }: PricingSliderProps = $props();
</script>

<section
  class="relative w-full py-16 bg-gradient-to-br from-purple-50 to-blue-50"
>
  <div class="container mx-auto px-6">
    <!-- Hero Section -->
    <div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
      <!-- Left Content -->
      <div class="space-y-6">
        <div class="space-y-4">
          <h1
            class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
          >
            {slides[0].title}<br />
            <span class="text-blue-600">{slides[0].subtitle}</span>
          </h1>
          <p class="text-lg text-gray-600 leading-relaxed max-w-lg">
            {slides[0].description}
          </p>
        </div>

        <!-- Partner Logos -->
        <div class="space-y-3">
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Partnered With
          </p>
          <div class="flex items-center gap-6">
            <div
              class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">CP</span>
            </div>
            <div class="text-purple-600 font-bold text-lg">FedEx</div>
            <div class="text-blue-600 font-bold text-lg">Purolator</div>
            <div class="text-yellow-600 font-bold text-lg">UPS</div>
          </div>
        </div>
      </div>

      <!-- Right Content - Pricing Card -->
      <div class="relative">
        <!-- Background Boxes -->
        <div
          class="absolute -top-4 -left-4 w-32 h-32 bg-amber-200 rounded-lg transform rotate-12 opacity-60"
        ></div>
        <div
          class="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200 rounded-lg transform -rotate-12 opacity-60"
        ></div>

        <!-- Main Pricing Card -->
        <div
          class="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div class="space-y-6">
            <!-- Savings Badge -->
            <div
              class="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold"
            >
              {slides[0].savingsPercent}
            </div>

            <!-- Pricing -->
            <div class="space-y-2">
              <div class="flex items-baseline gap-3">
                <span class="text-4xl font-bold text-gray-900"
                  >{slides[0].currentPrice}</span
                >
                <span class="text-xl text-gray-400 line-through"
                  >{slides[0].originalPrice}</span
                >
              </div>
              <p class="text-sm text-gray-500">
                {slides[0].carrier}
                {slides[0].service}
              </p>
            </div>

            <!-- Service Details -->
            <div class="space-y-3 pt-4 border-t border-gray-100">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Delivery Time</span>
                <span class="text-sm font-medium text-gray-900"
                  >{slides[0].deliveryTime}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Service</span>
                <span class="text-sm font-medium text-gray-900"
                  >{slides[0].service}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Slider -->
    <div class="mb-16">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Compare Shipping Rates
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the best shipping option for your needs with our competitive
          rates
        </p>
      </div>

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
              <div
                class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div class="space-y-4">
                  <!-- Savings Badge -->
                  <div
                    class="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold"
                  >
                    {slide.savingsPercent}
                  </div>

                  <!-- Pricing -->
                  <div class="space-y-2">
                    <div class="flex items-baseline gap-2">
                      <span class="text-2xl font-bold text-gray-900"
                        >{slide.currentPrice}</span
                      >
                      <span class="text-lg text-gray-400 line-through"
                        >{slide.originalPrice}</span
                      >
                    </div>
                    <p class="text-sm text-gray-500">
                      {slide.carrier}
                      {slide.service}
                    </p>
                  </div>

                  <!-- Service Details -->
                  <div class="space-y-2 pt-3 border-t border-gray-100">
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-600">Delivery</span>
                      <span class="text-xs font-medium text-gray-900"
                        >{slide.deliveryTime}</span
                      >
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-600">Service</span>
                      <span class="text-xs font-medium text-gray-900"
                        >{slide.service}</span
                      >
                    </div>
                  </div>

                  <!-- Action Button -->
                  <Button class="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Select This Rate
                  </Button>
                </div>
              </div>
            </CarouselItem>
          {/each}
        </CarouselContent>

        <!-- Navigation Buttons -->
        <div class="absolute top-1/2 -translate-y-1/2 left-4 z-10">
          <CarouselPrevious
            class="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white"
          >
            <ChevronLeft class="h-4 w-4" />
          </CarouselPrevious>
        </div>
        <div class="absolute top-1/2 -translate-y-1/2 right-4 z-10">
          <CarouselNext
            class="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white"
          >
            <ChevronRight class="h-4 w-4" />
          </CarouselNext>
        </div>
      </Carousel>
    </div>

    <!-- Shipping Form Section -->
    <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div class="text-center mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">
          Your Shipping Starts Here
        </h3>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- From Location -->
        <div class="space-y-2">
          <label for="from-location" class="text-sm font-medium text-gray-700"
            >From</label
          >
          <select
            id="from-location"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Shipping From</option>
            <option>Toronto, ON</option>
            <option>Vancouver, BC</option>
            <option>Montreal, QC</option>
          </select>
        </div>

        <!-- To Location -->
        <div class="space-y-2">
          <label for="to-location" class="text-sm font-medium text-gray-700"
            >To</label
          >
          <select
            id="to-location"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Destination</option>
            <option>New York, NY</option>
            <option>Los Angeles, CA</option>
            <option>Chicago, IL</option>
          </select>
        </div>

        <!-- Package Type -->
        <div class="space-y-2">
          <label for="package-type" class="text-sm font-medium text-gray-700"
            >Package Type</label
          >
          <select
            id="package-type"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Select Package Type</option>
            <option>Envelope</option>
            <option>Box</option>
            <option>Tube</option>
          </select>
        </div>

        <!-- Package Weight -->
        <div class="space-y-2">
          <label for="package-weight" class="text-sm font-medium text-gray-700"
            >Package Weight</label
          >
          <div class="flex gap-3">
            <input
              id="package-weight"
              type="number"
              placeholder="In LBS"
              class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button class="bg-orange-500 hover:bg-orange-600 px-8">
              Get Estimate
            </Button>
          </div>
        </div>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-500">
          Free Quotes • No Commitment • Instant Results
        </p>
      </div>
    </div>
  </div>
</section>
