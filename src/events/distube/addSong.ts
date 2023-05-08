import discord from 'discord.js';
import { DistubeEvent } from '../../app/player';

export default new DistubeEvent({
    name: 'addSong',

    callback: async (app, queue, song) => {
        const queueLength: number = queue.songs.length - 1;

        const embedFields: discord.APIEmbedField[] = [
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
        ]

        const embed = new discord.EmbedBuilder()
            .setAuthor({ name: 'Added to Queue' })
            .setTitle(song.name!)
            .setTimestamp()
            .setColor('#1E1F22')
            .addFields(embedFields);

        queue.textChannel!.send({ embeds: [embed] });
    }
});
