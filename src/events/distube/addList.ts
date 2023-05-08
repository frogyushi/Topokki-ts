import { TextChannel, inlineCode } from 'discord.js';
import { DistubeEvent } from '../../app/player';

export default new DistubeEvent({
    name: 'addList',

    callback: async (app, queue, playlist) => {
        const textChannel = queue.textChannel as TextChannel;

        textChannel.send(`Added ${inlineCode(playlist.songs.length.toString())} songs to the queue`);
    }
});
