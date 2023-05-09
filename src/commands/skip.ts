import { Command, PermissionsManager, Requirements, RequirementsManager } from '../app/app';
import { Guild, SlashCommandBuilder } from 'discord.js';

export default new Command({
    requirements: new RequirementsManager(
        Requirements.VoiceChannelRequired,
        Requirements.QueueRequired,
        Requirements.SameVoiceChannelRequired
    ),

    perms: new PermissionsManager(),

    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the currently playing audio track'),

    callback: async (app, interaction) => {
        const guild = interaction.guild as Guild;
        const queue = app.player.distube.getQueue(guild.id);

        app.player.distube.skip(queue!);

        interaction.reply('The current song has been skipped');
    }
})