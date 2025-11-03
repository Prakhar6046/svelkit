<script lang="ts">
  import PublicNavbar from '$lib/components/PublicNavbar.svelte';
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '$lib/components/ui/tabs';
  import { Button } from '$lib/components/ui/button';
  import Label from '$lib/components/ui/label/label.svelte';
  import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
  import { ChatButton, ChatWidget } from '$lib/components/chat';
  import EyeIcon from '@lucide/svelte/icons/eye';
  import EyeOffIcon from '@lucide/svelte/icons/eye-off';
  import { createAccount, login } from '$lib/stores/auth';
  import { Toaster, toast } from 'svelte-sonner';
  import { navigate } from 'svelte-routing';
  import { createForm } from 'svelte-forms-lib';
  import * as yup from 'yup';
	import { goto } from '$app/navigation';

  //   import PublicFooter from '$lib/components/PublicFooter.svelte';

  let chatOpen = false;
  let rememberMe = false;
  let showLoginPassword = false;
  let showSignupPassword = false;
  let activeTab = 'login';

  // Login form validation schema
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  // Signup form validation schema
  const signupSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  // Login form
  const loginForm = createForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: values => {
      const res = login(values.email, values.password);

      if (res.status === 'success') {
        toast.success(res.message);
        setTimeout(() => goto('/dashboard'), 2000);
      } else {
        toast.error(res.message);
      }
    },
  });

  // Signup form
  const signupForm = createForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signupSchema,
    onSubmit: values => {
      const res = createAccount(values.email, values.password);

      if (res.status === 'success') {
        toast.success(res.message);
        setTimeout(() => goto('/dashboard'), 2000);
      } else {
        toast.error(res.message);
      }
    },
  });

  const {
    form: loginFormValues,
    errors: loginErrors,
    touched: loginTouched,
    handleChange: handleLoginChange,
    handleBlur: handleLoginBlur,
    handleSubmit: handleLoginSubmit,
  } = loginForm;

  const {
    form: signupFormValues,
    errors: signupErrors,
    touched: signupTouched,
    handleChange: handleSignupChange,
    handleBlur: handleSignupBlur,
    handleSubmit: handleSignupSubmit,
  } = signupForm;

  function toggleChat() {
    chatOpen = !chatOpen;
  }

  function toggleLoginPassword() {
    showLoginPassword = !showLoginPassword;
  }

  function toggleSignupPassword() {
    showSignupPassword = !showSignupPassword;
  }
</script>

<nav class="flex items-center justify-between md:px-10 px-4 py-4">
  <a href="/">
    <img src="/img/app-logo.svg" alt="logo" />
  </a>
  <button
    on:click={() => {
      goto('/');
    }}
    class="font-semibold text-sm sm:text-base md:text-lg shadow-none border border-bland-200 rounded-xl py-1 sm:py-2 xl:py-2.5 px-2.5 sm:px-4 xl:!px-6 h-auto cursor-pointer hover:shadow-md"
  >
    Home
  </button>
</nav>

<main>
  <!-- Ship and return Section Start -->

  <section>
    <div class="mx-auto h-[calc(100vh-82px)] flex items-center">
      <div class="grid grid-cols-1 md:grid-cols-3 w-full gap-y-6 h-full">
        <div
          class="flex items-center bg-gradient-to-b from-white to-[#E0E0FF] h-full px-4"
        >
          {#if activeTab === 'login'}
            <img src="/assets/images/hero-img-4.svg" alt="hero-img-login" />
          {:else}
            <img src="/assets/images/create-acc.svg" alt="hero-img-signup" />
          {/if}
        </div>
        <div
          class="flex flex-col items-center justify-center w-full text-center col-span-2 md:px-[100px]"
        >
          <h2 class="heading-h2">👋 Hi! Welcome to Shipping.CA</h2>

          <p class="sub-heading">Fast, secure, easy shipping tools—save now!</p>

          <div class="mt-[60px] w-full">
            <Tabs bind:value={activeTab} class="items-center">
              <TabsList
                class="bg-secondary-100 rounded-3xl p-1 h-auto [&_[data-state=active]]:bg-bland-25 [&_button]:sm:min-w-[180px] [&_button]:rounded-xl [&_button]:text-lg [&_button]:text-bland-950 [&_button]:font-semibold [&_button]:py-3 [&_button]:sm:px-10 [&_button]:px-5 [&_button]:h-auto [&_[data-state=active]]:shadow-lg "
              >
                <TabsTrigger class="cursor-pointer" value="login"
                  >Log In</TabsTrigger
                >
                <TabsTrigger class="cursor-pointer" value="signin"
                  >Create Account</TabsTrigger
                >
              </TabsList>
              <TabsContent class="w-full max-w-[700px] mt-8 px-4" value="login">
                <form
                  on:submit|preventDefault={handleLoginSubmit}
                  class="rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-4 shadow-lg border border-bland-300/30 mb-20 md:mb-0 w-full"
                >
                  <div class="relative flex flex-col gap-2">
                    <Label class="text-sm sm:text-base ">Email</Label>
                    <input
                      class="bg-transparent px-4 w-full rounded-xl border {$loginErrors.email
                        ? 'border-red-500'
                        : 'accordeion-border'} input-tex py-[11px] text-sm sm:text-base"
                      placeholder="Enter your email"
                      type="text"
                      name="email"
                      value={$loginFormValues.email}
                      on:change={handleLoginChange}
                      on:blur={handleLoginBlur}
                    />
                    {#if $loginTouched.email || $loginErrors.email}
                      <span
                        class="absolute -bottom-5 text-red-500 text-xs sm:text-sm text-left"
                        >{$loginErrors.email}</span
                      >
                    {/if}
                  </div>

                  <div class="flex flex-col gap-2">
                    <Label class="text-sm sm:text-base ">Password</Label>
                    <div class="relative">
                      <input
                        class="bg-transparent px-4 pr-12 w-full rounded-xl border {$loginErrors.password
                          ? 'border-red-500'
                          : 'accordeion-border'} input-tex py-[11px] text-sm sm:text-base"
                        placeholder="Enter your password"
                        type={showLoginPassword ? 'text' : 'password'}
                        name="password"
                        value={$loginFormValues.password}
                        on:change={handleLoginChange}
                        on:blur={handleLoginBlur}
                      />
                      <button
                        type="button"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none underline cursor-pointer"
                        on:click={toggleLoginPassword}
                      >
                        {#if showLoginPassword}
                          Hide
                        {:else}
                          Show
                        {/if}
                      </button>
                      {#if $loginTouched.password || $loginErrors.password}
                        <span
                          class="absolute -bottom-5 left-0 w-auto text-red-500 text-xs sm:text-sm text-left"
                          >{$loginErrors.password}</span
                        >
                      {/if}
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex gap-2 items-center text-bland-400">
                      <Checkbox bind:checked={rememberMe} />
                      <Label
                        class="text-sm sm:text-base {rememberMe
                          ? 'font-bold text-black'
                          : ''}">Remember Me</Label
                      >
                    </div>
                    <div>
                      <a class="text-primary-400" href="/">Forgot Password</a>
                    </div>
                  </div>

                  <!-- Button -->
                  <div
                    class="flex flex-col gap-3 col-span-1 sm:col-span-2 lg:col-span-1"
                  >
                    <button
                      type="submit"
                      class="flex items-center justify-center font-semibold text-sm sm:text-base text-bland-25 border border-primary-400 bg-primary-400 shadow-none rounded-xl py-2 xl:py-[11px] px-6 h-auto cursor-pointer hover:shadow-md"
                    >
                      Log In
                    </button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent
                class="w-full max-w-[700px] mt-8 px-4"
                value="signin"
              >
                <form
                  on:submit|preventDefault={handleSignupSubmit}
                  class="rounded-4xl p-4 sm:p-6 lg:p-10 flex flex-col gap-4 shadow-lg border border-bland-300/30 mb-20 md:mb-0 w-full"
                >
                  <div class="flex flex-col gap-2 relative">
                    <Label class="text-sm sm:text-base ">Email</Label>
                    <input
                      class="bg-transparent px-4 w-full rounded-xl border {$signupErrors.email
                        ? 'border-red-500'
                        : 'accordeion-border'} input-tex py-[11px] text-sm sm:text-base"
                      placeholder="Enter your email"
                      type="text"
                      name="email"
                      value={$signupFormValues.email}
                      on:change={handleSignupChange}
                      on:blur={handleSignupBlur}
                    />
                    {#if $signupTouched.email || $signupErrors.email}
                      <span
                        class="absolute -bottom-5 text-red-500 text-xs sm:text-sm text-left"
                        >{$signupErrors.email}</span
                      >
                    {/if}
                  </div>

                  <div class="flex flex-col gap-2">
                    <Label class="text-sm sm:text-base ">Password</Label>
                    <div class="relative">
                      <input
                        class="bg-transparent px-4 pr-12 w-full rounded-xl border {$signupErrors.password
                          ? 'border-red-500'
                          : 'accordeion-border'} input-tex py-[11px] text-sm sm:text-base"
                        placeholder="Enter your password"
                        type={showSignupPassword ? 'text' : 'password'}
                        name="password"
                        value={$signupFormValues.password}
                        on:change={handleSignupChange}
                        on:blur={handleSignupBlur}
                      />
                      <button
                        type="button"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none underline cursor-pointer"
                        on:click={toggleSignupPassword}
                      >
                        {#if showSignupPassword}
                          Hide
                        {:else}
                          Show
                        {/if}
                      </button>
                      {#if $signupTouched.password || $signupErrors.password}
                        <span
                          class="absolute -bottom-5 left-0 text-red-500 text-xs sm:text-sm text-left"
                          >{$signupErrors.password}</span
                        >
                      {/if}
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex gap-2 items-center text-bland-400">
                      <Label
                        class="text-sm sm:text-base flex items-center gap-2"
                      >
                        {#if $signupFormValues.password.length >= 8}
                          <img
                            src="/assets/images/greenCheckmark.svg"
                            alt="green checkmark"
                          />
                        {/if}
                        <p
                          class={$signupFormValues.password.length >= 8
                            ? 'font-bold'
                            : ''}
                        >
                          At Least 8 Character
                        </p>
                      </Label>
                    </div>
                  </div>

                  <!-- Button -->
                  <div
                    class="flex flex-col gap-3 col-span-1 sm:col-span-2 lg:col-span-1"
                  >
                    <button
                      type="submit"
                      class="flex items-center justify-center font-semibold text-sm sm:text-base text-bland-25 border border-primary-400 bg-primary-400 shadow-none rounded-xl py-2 xl:py-[11px] px-6 h-auto cursor-pointer hover:shadow-md"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<!-- Chat widget -->
<ChatWidget
  open={chatOpen}
  on:close={() => (chatOpen = false)}
  onClose={() => (chatOpen = false)}
/>
<ChatButton on:toggle={toggleChat} />
<Toaster position="top-right" />
