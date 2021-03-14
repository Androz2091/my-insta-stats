import { writable } from 'svelte/store';

export const loaded = writable(false);
export const loadTask = writable(null);
export const data = writable(null);

const getWords = (count) => fetch(`https://random-word-api.herokuapp.com//word?number=${count}`).then((res) => res.json());

if (window.location.href.includes('demo')) {
    loaded.set(true);
    const demoData = {
        likeCount: 300,
        likeCountPerDay: 12,
        topLikes: ['levraimcfly', 'xsqueezie', 'alyciajasmin', 'katyperry', 'khloekardashian', 'nickiminaj', 'cristiano', 'arianagrande', 'therock', 'kyliejenner'].map((name) => ({
            count: Math.ceil(Math.random() * 10000) + 1,
            username: name,
            avatarURL: 'https://turtlegirltravel.com/wp-content/uploads/2020/11/profile.png'
        })),
        messageCount: 3000,
        messageCountPerDay: 20,
        commentCount: 100,
        commentCountPerDay: 2,
        topics: []
    };
    data.set(demoData);
    getWords(30).then((words) => {
        demoData.topics = words;
        data.set(demoData);
    });
}

