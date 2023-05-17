import { Guild, SlashCommandBuilder } from 'discord.js';
import { Queue } from 'distube';
import {
    Command,
    PermissionsManager,
    Requirements,
    RequirementsManager,
    SubcommandManager
} from '../../app/app';

export default new Command({
    requirements: new RequirementsManager(
        Requirements.VoiceChannelRequired,
        Requirements.QueueRequired,
        Requirements.SameVoiceChannelRequired
    ),

    perms: new PermissionsManager(),

    subcommands: new SubcommandManager(),

    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the currently playing audio track'),

    callback: async (app, interaction) => {
        const guild = interaction.guild as Guild;
        const queue = app.player.distube.getQueue(guild.id) as Queue;

        queue.songs.length <= 1 ? queue.stop() : queue.skip();

        interaction.reply('The current song has been skipped');
    }
})