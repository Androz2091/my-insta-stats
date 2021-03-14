import { DecodeUTF8 } from 'fflate';
import { loadTask } from './store';

const defaultAvatarURL = 'https://turtlegirltravel.com/wp-content/uploads/2020/11/profile.png';

export const extractData = async (files) => {

    const extractedData = {
        likeCount: 0,
        likeCountPerDay: 0,

        topLikes: [],

        commentCount: 0,
        commentCountPerDay: 0,

        messageCount: 0,
        messageCountPerDay: 0,
        channels: [],

        topics: []
    };

    const getFile = (name) => files.find((file) => file.name === name);
    // Read a file from its name
    const readFile = (name) => {
        return new Promise((resolve) => {
            const file = getFile(name);
            if (!file) return resolve(null);
            const fileContent = [];
            const decoder = new DecodeUTF8();
            file.ondata = (err, data, final) => {
                decoder.push(data, final);
            };
            decoder.ondata = (str, final) => {
                fileContent.push(str);
                if (final) resolve(fileContent.join(''));
            };
            file.start();
        });
    };

    const accountCreationData = JSON.parse(await readFile('login_and_account_creation/signup_information.json')).account_history_registration_info[0].string_map_data;
    const accountCreationTimestamp = accountCreationData[Object.keys(accountCreationData)[2]].timestamp * 1000;

    console.log('[debug] Reading likes...');
    loadTask.set('Loading likes...');
    const likes = JSON.parse(await readFile('likes/liked_posts.json'))?.likes_media_likes;
    extractedData.likeCount = likes.length;
    extractedData.likeCountPerDay = Math.ceil(extractedData.likeCount / ((Date.now() - accountCreationTimestamp) / 1000 / 60 / 60 / 24));
    const likesFetched = [];
    const likePromises = likes.map((like) => {
        const username = like.title;
        if (likesFetched.includes(username)) return;
        likesFetched.push(username);
        return new Promise((resolve) => {
            extractedData.topLikes.push({
                count: likes.filter((like) => like.title === username).length,
                username,
                avatarURL: defaultAvatarURL
            });
            resolve();
        });
    });
    await Promise.all(likePromises);
    extractedData.topLikes = extractedData.topLikes.slice(0, 10);
    console.log('[debug] Likes read.');

    console.log('[debug] Loading messages...');
    loadTask.set('Loading messages...');
    const groups = files.filter((f) => /messages\/inbox\/[a-zA-Z0-9-_]+\/message_1\.json/.test(f.name));
    const participants = [];
    const groupsPromises = groups.map((group) => {

        return new Promise((resolve) => {
            const [,groupName] = group.name.match(/messages\/inbox\/([a-zA-Z0-9-_]+)\/message_1\.json/);
            readFile(`messages/inbox/${groupName}/message_1.json`).then((content) => {

                const data = JSON.parse(content);
                participants.push(...data.participants.map((p) => p.name));
                extractedData.channels.push({
                    messages: data.messages,
                    isDM: data.participants.length === 2
                });
                resolve();

            });
        });

    });

    await Promise.all(groupsPromises);
    const probabAccountUsername = participants.sort((a, b) => participants.filter(v => v===a).length - participants.filter(v => v===b).length).pop();
    extractedData.channels.forEach((chan) => {
        const count = chan.messages.filter((m) => m.sender_name === probabAccountUsername).length;
        extractedData.messageCount += count;
    });

    extractedData.messageCountPerDay = Math.ceil(extractedData.messageCount / ((Date.now() - accountCreationTimestamp) / 1000 / 60 / 60 / 24));
    console.log('[debug] Messages loaded.');
    
    console.log('[debug] Loading comments...');
    const commentsNoData = files.some((f) => f.name.startsWith('comments/no-data'));
    const comments = JSON.parse(await readFile('comments/post_comments.json'));
    extractedData.commentCount = commentsNoData ? 0 : comments.comments_media_comments.length;
    extractedData.commentCountPerDay = Math.ceil(extractedData.commentCount / ((Date.now() - accountCreationTimestamp) / 1000 / 60 / 60 / 24));
    console.log('[debug] Comments loaded');

    console.log('[debug] Loading topics...');
    loadTask.set('Loading topics...');
    const topicsNoData = files.some((f) => f.name.startsWith('your_topics/no-data'));
    const yourTopics = topicsNoData ? [] : JSON.parse(await readFile('your_topics/your_topics.json')).topics_your_topics.map((t) => t.string_map_data[Object.keys(t.string_map_data)[0]].value);
    extractedData.topics = yourTopics;
    console.log('[debug] Topics loaded');

    return extractedData;
};
