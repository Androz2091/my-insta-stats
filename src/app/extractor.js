import { DecodeUTF8 } from 'fflate';
import { loadTask } from './store';

export const extractData = async (files) => {

    const extractedData = {
        likeCount: 0,
        likeCountPerDay: 0,

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
    const accountUsername = accountCreationData[Object.keys(accountCreationData)[0]].value;

    console.log('[debug] Reading likes...');
    loadTask.set('Loading likes...');
    const likes = JSON.parse(await readFile('likes/liked_posts.json'));
    extractedData.likeCount = likes.likes_media_likes.length;
    extractedData.likeCountPerDay = Math.ceil(extractedData.likeCount / ((Date.now() - accountCreationTimestamp) / 1000 / 60 / 60 / 24));
    console.log('[debug] Likes read.');

    console.log('[')

    console.log('[debug] Loading messages...');
    loadTask.set('Loading messages...');
    const groups = files.filter((f) => /messages\/inbox\/[a-zA-Z0-9-_]+\/message_1\.json/.test(f.name));
    const groupsPromises = groups.map((group) => {

        return new Promise((resolve) => {
            const [,groupName] = group.name.match(/messages\/inbox\/([a-zA-Z0-9-_]+)\/message_1\.json/);
            readFile(`messages/inbox/${groupName}/message_1.json`).then((content) => {

                const data = JSON.parse(content);
                const messageCount = data.messages.filter((s) => s.sender_name === accountUsername).length;
                extractedData.channels.push({
                    count: messageCount,
                    isDM: data.participants.length === 2
                });
                extractedData.messageCount += messageCount;
                resolve();

            });
        });

    });

    await Promise.all(groupsPromises);
    extractedData.messageCountPerDay = Math.ceil(extractedData.messageCount / ((Date.now() - accountCreationTimestamp) / 1000 / 60 / 60 / 24));
    console.log('[debug] Messages loaded.');
    
    console.log('[debug] Loading comments...');
    const comments = JSON.parse(await readFile('comments/post_comments.json'));
    extractedData.commentCount = comments.comments_media_comments.length;
    extractedData.commentCountPerDay = Math.ceil(extractedData.commentCount / ((Date.now() - accountCreationTimestamp) / 1000 / 60 / 60 / 24));
    console.log('[debug] Comments loaded');

    console.log('[debug] Loading topics...');
    loadTask.set('Loading topics...');
    const yourTopics = JSON.parse(await readFile('your_topics/your_topics.json')).topics_your_topics.map((t) => t.string_map_data[Object.keys(t.string_map_data)[0]].value);
    extractedData.topics = yourTopics;
    console.log('[debug] Topics loaded');

    return extractedData;
};
