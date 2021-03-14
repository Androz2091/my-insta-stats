import { writable } from 'svelte/store';

let loadedValue = false, dataValue = null;

if (window.location.href.includes('demo')) {
    loadedValue = true;
    dataValue = {
        likeCount: 300,
        likeCountPerDay: 12,
        topLikes: [],
        messageCount: 3000,
        messageCountPerDay: 20,
        topics: new Array(20).fill(null).map((e) => 'Cats')
    };
}

export const loaded = writable(loadedValue);
export const loadTask = writable(null);
export const data = writable(dataValue);
