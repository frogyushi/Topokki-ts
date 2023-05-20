import { Guild, SlashCommandBuilder } from 'discord.js';
import { Command, PermissionsManager, Requirements, RequirementsManager, SubcommandManager } from '../../app/app';
import { Queue } from 'distube';

export default new Command({
    requirements: new RequirementsManager(
        Requirements.VoiceChannelRequired,
        Requirements.QueueRequired,
        Requirements.SameVoiceChannelRequired
    ),

    permissions: new PermissionsManager(),

    subcommands: new SubcommandManager(),

    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the currently playing audio track'),

    callback: async (app, interaction) => {
        const guild = interaction.guild as Guild;
        const queue = app.player.distube.getQueue(guild.id) as Queue;

        queue.songs.length <= 1
            ? queue.stop()
            : queue.skip();

        interaction.reply('The current song has been skipped');
    }
})