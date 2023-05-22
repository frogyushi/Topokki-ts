import {
    Command,
    PermissionsManager,
    Requirements,
    RequirementsManager,
    SubcommandManager
} from '../../app/app';
import { Guild, SlashCommandBuilder } from 'discord.js';

export default new Command({
    requirements: new RequirementsManager(Requirements.SameVoiceChannelRequired),

    permissions: new PermissionsManager(),

    subcommands: new SubcommandManager(),

    data: new SlashCommandBuilder().setName('stop').setDescription('Stop playing the current audio and clear the queue'),

    callback: async (app, interaction) => {
        const guild = interaction.guild as Guild;
        const queue = app.player.distube.getQueue(guild.id);

        queue?.stop();

        interaction.reply('Stopping playback and clearing the queue');
    },
});
