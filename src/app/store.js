import { writable } from 'svelte/store';

let loadedValue = false, dataValue = null;

if (window.location.href.includes('demo')) {
    loadedValue = true;
    dataValue = {
        likes: 2
    };
}

export const loaded = writable(loadedValue);
export const loadTask = writable(null);
export const data = writable(dataValue);
