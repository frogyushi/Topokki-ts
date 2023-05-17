import { CommandInteractionOptionResolver, SlashCommandBuilder } from 'discord.js';
import {
    Command,
    PermissionsManager,
    Requirements,
    RequirementsManager,
    SubcommandManager
} from '../../app/app';

export default new Command({
    requirements: new RequirementsManager(
        Requirements.VoiceChannelRequired
    ),

    perms: new PermissionsManager(),

    subcommands: new SubcommandManager(),

    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play audio in the voice channel the user is currently in')
        .addStringOption((option) => option
            .setName('search_term')
            .setDescription('Play any audio or video content by providing a search term or a url')
            .setRequired(true)
        ),

    callback: async (app, interaction) => {
        const options = interaction.options as CommandInteractionOptionResolver;
        const searchTerm = options.getString('search_term')!;

        app.player.play(interaction, searchTerm);

        interaction.reply(`Searching \`${searchTerm}\``);
    }
})