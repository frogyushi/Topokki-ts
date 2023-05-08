import { Command } from '../app/app';
import {
    SlashCommandBuilder,
    CommandInteractionOptionResolver,
    inlineCode
} from 'discord.js';

export default new Command({
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play audio in the voice channel the user is currently in')
        .addStringOption(option => option
            .setName('search_term')
            .setDescription('Play any audio or video content by providing a search term or a url')
            .setRequired(true)
        ),

    callback: async (app, interaction) => {
        const options = interaction.options as CommandInteractionOptionResolver;
        const searchTerm = options.getString('search_term')!;

        app.player.play(interaction, searchTerm);

        interaction.reply(`Searching ${inlineCode(searchTerm)}`);
    }
})