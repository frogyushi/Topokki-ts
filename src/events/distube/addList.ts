import { TextChannel } from 'discord.js';
import { DistubeEvent } from '../../app/player';

export default new DistubeEvent({
    name: 'addList',

    callback: async (app, queue, playlist) => {
        const textChannel = queue.textChannel as TextChannel;

        textChannel.send(`Added \`${playlist.songs.length}\` songs to the queue`);
    }
});
