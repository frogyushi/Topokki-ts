import { Queue } from 'distube';
import { Command, PermissionsManager, Requirements, RequirementsManager } from '../app/app';
import { SlashCommandBuilder, Guild, EmbedBuilder } from 'discord.js';

export default new Command({
    requirements: new RequirementsManager(
        Requirements.SameVoiceChannelRequired
    ),

    perms: new PermissionsManager(),

    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing the current audio and clear the queue'),

    callback: async (app, interaction) => {
        const guild = interaction.guild as Guild;
        const queue = app.player.distube.getQueue(guild.id) as Queue;
        const currentSong = queue.songs[0];
        const nextSongs = queue.songs.slice(1, 11);

        const songs = nextSongs
            .map((song, i) => `**${i + 1}** - ${song.name} - ${song.formattedDuration}`)
            .join('\n\n');

        const embed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setDescription(`${currentSong.name} - ${currentSong.formattedDuration}`)
            .setFooter({ text: `${queue.songs.length - 1} song(s) in queue` })
            .addFields({ name: 'Next up', value: songs || '-' })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
})