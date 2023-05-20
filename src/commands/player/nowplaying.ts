import { APIEmbedField, EmbedBuilder, Guild, SlashCommandBuilder } from 'discord.js';
import { Command, PermissionsManager, Requirements, RequirementsManager, SubcommandManager } from '../../app/app';
import { Queue } from 'distube';

export default new Command({
    requirements: new RequirementsManager(
        Requirements.SameVoiceChannelRequired,
        Requirements.QueueRequired,
        Requirements.VoiceChannelRequired,
    ),

    permissions: new PermissionsManager(),

    subcommands: new SubcommandManager(),

    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Displays information about the currently playing audio and the next audios in the queue'),

    callback: async (app, interaction) => {
        const guild = interaction.guild as Guild;
        const queue = app.player.distube.getQueue(guild.id) as Queue;
        const song = queue.songs[0];
        const nextUp = queue.songs[1];

        const embed = new EmbedBuilder()
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
                    value: `${queue.formattedCurrentTime}/${song.formattedDuration}`,
                    inline: true,
                },
                {
                    name: 'Requested by',
                    value: song.user!.tag,
                    inline: true,
                },
                {
                    name: 'Next up',
                    value: nextUp?.name || '-',
                    inline: true,
                }
            ]);

        interaction.reply({ embeds: [embed] });
    }
})