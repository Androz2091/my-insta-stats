import { writable } from 'svelte/store';

export const loaded = writable(false);
export const loadTask = writable(null);
export const data = writable(null);
