import { DistubeEvent } from '../../app/player';
import { TextChannel } from 'discord.js';

export default new DistubeEvent({
    name: 'addList',

    callback: async (app, queue, playlist) => {
        const textChannel = queue.textChannel as TextChannel;

        textChannel.send(`Added \`${playlist.songs.length}\` songs to the queue`);
    }
});
