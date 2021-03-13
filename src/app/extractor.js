import { DecodeUTF8 } from 'fflate';

export const extractData = async (files) => {

    const extractedData = {
        likes: 0
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

    console.log('[debug] Reading likes...');
    const likes = JSON.parse(await readFile('likes/liked_posts.json'));
    extractedData.likes = likes.likes_media_likes.length;
    console.log('[debug] Likes read.');

    return extractedData;
};
