// import { writable } from 'svelte/store';

// export type Theme = 'light' | 'dark' | 'system';

// interface ThemeState {
//   theme: Theme;
//   isDark: boolean;
// }

// function createThemeStore() {
//   const { subscribe, set, update } = writable<ThemeState>({
//     theme: 'system',
//     isDark:
//       typeof window !== 'undefined'
//         ? window.matchMedia('(prefers-color-scheme: dark)').matches
//         : false,
//   });

//   return {
//     subscribe,

//     initialize: () => {
//       if (typeof window === 'undefined') return;

//       // Get saved theme from localStorage or default to system
//       const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';

//       update(state => {
//         state.theme = savedTheme;
//         if (savedTheme === 'system') {
//           state.isDark = getSystemTheme() === 'dark';
//         } else {
//           state.isDark = savedTheme === 'dark';
//         }
//         return state;
//       });

//       applyTheme(savedTheme);
//     },

//     setTheme: (theme: Theme) => {
//       if (typeof window === 'undefined') return;

//       update(state => {
//         state.theme = theme;
//         state.isDark =
//           theme === 'dark' ||
//           (theme === 'system' && getSystemTheme() === 'dark');
//         return state;
//       });

//       localStorage.setItem('theme', theme);
//       applyTheme(theme);
//     },

//     toggleTheme: () => {
//       if (typeof window === 'undefined') return;

//       let newTheme: Theme;
//       update(state => {
//         newTheme = state.isDark ? 'light' : 'dark';
//         state.theme = newTheme;
//         state.isDark = newTheme === 'dark';
//         return state;
//       });

//       localStorage.setItem('theme', newTheme!);
//       applyTheme(newTheme!);
//     },
//   };
// }

// function getSystemTheme(): 'light' | 'dark' {
//   if (typeof window === 'undefined') return 'light';
//   return window.matchMedia('(prefers-color-scheme: dark)').matches
//     ? 'dark'
//     : 'light';
// }

// function applyTheme(theme: Theme) {
//   if (typeof window === 'undefined') return;

//   const root = document.documentElement;
//   const isDark =
//     theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');

//   if (isDark) {
//     root.classList.add('dark');
//   } else {
//     root.classList.remove('dark');
//   }
// }

// // Listen for system theme changes
// if (typeof window !== 'undefined') {
//   window
//     .matchMedia('(prefers-color-scheme: dark)')
//     .addEventListener('change', e => {
//       const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
//       if (savedTheme === 'system') {
//         applyTheme('system');
//       }
//     });
// }

// export const themeStore = createThemeStore();

import { writable } from 'svelte/store';

export type Theme = 'light';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
}

function createThemeStore() {
  const { subscribe, set } = writable<ThemeState>({
    theme: 'light',
    isDark: false,
  });

  // Apply light theme immediately
  if (typeof window !== 'undefined') {
    applyLightTheme();
  }

  return {
    subscribe,

    initialize: () => {
      if (typeof window === 'undefined') return;
      applyLightTheme();
    },

    setTheme: () => {
      // No-op: theme is always light
    },

    toggleTheme: () => {
      // No-op: always light
    },
  };
}

function applyLightTheme() {
  const root = document.documentElement;
  root.classList.remove('dark');
}

export const themeStore = createThemeStore();
