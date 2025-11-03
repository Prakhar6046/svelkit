// import { writable } from 'svelte/store';

// export interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// export interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }

// // Create the auth store
// function createAuthStore() {
//   const { subscribe, set, update } = writable<AuthState>({
//     user: null,
//     isAuthenticated: false,
//     isLoading: false,
//   });

//   return {
//     subscribe,
//     // Sign in function
//     signIn: async (email: string, password: string) => {
//       update(state => ({ ...state, isLoading: true }));

//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       // Mock authentication - in real app, this would be an API call
//       if (email === 'user@example.com' && password === 'password') {
//         const user: User = {
//           id: '1',
//           email: email,
//           name: 'John Doe',
//         };

//         update(state => ({
//           ...state,
//           user,
//           isAuthenticated: true,
//           isLoading: false,
//         }));

//         // Store in localStorage for persistence
//         localStorage.setItem('user', JSON.stringify(user));
//         return { success: true };
//       } else {
//         update(state => ({
//           ...state,
//           isLoading: false,
//         }));
//         return { success: false, error: 'Invalid credentials' };
//       }
//     },

//     // Sign out function
//     signOut: () => {
//       set({
//         user: null,
//         isAuthenticated: false,
//         isLoading: false,
//       });
//       localStorage.removeItem('user');
//     },

//     // Initialize auth state from localStorage
//     initialize: () => {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         try {
//           const user = JSON.parse(storedUser);
//           set({
//             user,
//             isAuthenticated: true,
//             isLoading: false,
//           });
//         } catch (error) {
//           console.error('Error parsing stored user:', error);
//           localStorage.removeItem('user');
//         }
//       }
//     },
//   };
// }

// export const authStore = createAuthStore();

// src/stores/auth.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// --- Safe initialization ---
const getInitialToken = (): string | null => {
  if (browser) return localStorage.getItem('auth_token');
  return null;
};

const getInitialUser = (): object | null => {
  if (browser) {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

// --- Writable stores ---
export const authToken = writable<string | null>(getInitialToken());
export const userDetails = writable<object | null>(getInitialUser());

// --- Sync changes to localStorage when in browser ---
if (browser) {
  authToken.subscribe((value) => {
    if (value) localStorage.setItem('auth_token', value);
    else localStorage.removeItem('auth_token');
  });

  userDetails.subscribe((value) => {
    if (value) localStorage.setItem('user', JSON.stringify(value));
    else localStorage.removeItem('user');
  });
}

// --- Check authentication safely ---
export const isAuthenticated = (): boolean => {
  return browser && !!localStorage.getItem('auth_token');
};

// --- Utility: generate pseudo-token ---
const generateToken = (): string => {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
};

// --- Log in ---
export const login = (email: string, password: string) => {
  if (!email || !password) {
    return { status: 'error', message: 'Please enter both email and password' };
  }

  if (!browser) return { status: 'error', message: 'Cannot login during SSR' };

  try {
    const token = generateToken();
    const user = { email, password };

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    authToken.set(token);
    userDetails.set(user);

    return { status: 'success', message: 'Logged in successfully!', token };
  } catch (error) {
    console.error('Login error:', error);
    return { status: 'error', message: 'Unexpected error during login' };
  }
};

// --- Create Account (same logic) ---
export const createAccount = (email: string, password: string) => {
  if (!email || !password) {
    return { status: 'error', message: 'Please enter both email and password' };
  }

  if (!browser)
    return { status: 'error', message: 'Cannot create account during SSR' };

  try {
    const token = generateToken();
    const user = { email, password };

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    authToken.set(token);
    userDetails.set(user);

    return { status: 'success', message: 'Account created successfully!', token };
  } catch (error) {
    console.error('Account creation error:', error);
    return { status: 'error', message: 'Unexpected error during signup' };
  }
};

// --- Logout ---
export const logout = () => {
  if (browser) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  authToken.set(null);
  userDetails.set(null);

  return { status: true, message: 'Logged out successfully' };
};
