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

export const authToken = writable<string | null>(
  localStorage.getItem('auth_token')
);
export const userDetails = writable<Object | null>(
  localStorage.getItem('user')
);
// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('auth_token') !== null;
};

// Generate a random token (pseudo-token)
const generateToken = (): string => {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
};

// Log in locally
export const login = (email: string, password: string) => {
  if (!email || !password) {
    return {
      status: 'error',
      message: 'Please enter both email and password',
    };
  }

  try {
    const token = generateToken();
    const user = { email, password };

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    authToken.set(token);
    userDetails.set(user);

    return {
      status: 'success',
      message: 'Logged in successfully!',
      token,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      status: 'error',
      message: 'An unexpected error occurred during login',
    };
  }
};
export const createAccount = (email: string, password: string) => {
  if (!email || !password) {
    return {
      status: 'error',
      message: 'Please enter both email and password',
    };
  }

  try {
    const token = generateToken();
    const user = { email, password };

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    authToken.set(token);
    userDetails.set(user);

    return {
      status: 'success',
      message: 'Account Created Successfully!',
      token,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      status: 'error',
      message: 'An unexpected error occurred during creating an account',
    };
  }
};
// Log out
export const logout = () => {
  localStorage.removeItem('auth_token');
  authToken.set(null);
  return {
    status: true,
    message: 'Logged Out Succesfully',
  };
};
