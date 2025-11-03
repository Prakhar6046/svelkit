import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
  ? Omit<T, 'children'>
  : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};


// src/lib/utils/getLocaleData.ts
import { get } from 'svelte/store';
import { dictionary, locale } from 'svelte-i18n';

// Generic helper for deep nested dictionary access
export function getLocaleData<T>(path: string): T | undefined {
  const currentLocale = get(locale);
  const currentDictionary = get(dictionary);

  if (!currentLocale || !currentDictionary[currentLocale]) return undefined;

  const keys = path.split('.');
  let result: unknown = currentDictionary[currentLocale];

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return result as T;
}