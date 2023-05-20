import { EmbedBuilder } from 'discord.js';
import { DistubeEvent } from '../../app/player';

export default new DistubeEvent({
    name: 'addSong',

    callback: async (app, queue, song) => {
        const queueLength: number = queue.songs.length - 1;

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Added to Queue' })
            .setTitle(song.name!)
            .setTimestamp()
            .setFields([
                {
                    name: 'Artist',
                    value: song.uploader.name!,
                    inline: true,
                },
                {
                    name: 'Duration',
                    value: song.formattedDuration!,
                    inline: true,
                },
                {
                    name: 'Estimate time of playback',
                    value: queue.formattedCurrentTime,
                    inline: true,
                },
                {
                    name: 'Position',
                    value: queueLength ? queueLength.toString() : '-',
                    inline: true,
                }
            ]);

        queue.textChannel!.send({ embeds: [embed] });
    }
});
