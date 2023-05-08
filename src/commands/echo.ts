import { AppCommand, PermissionsManager, RequirementsManager } from '../app/app';
import {
    SlashCommandBuilder,
    CommandInteractionOptionResolver,
} from 'discord.js';

export default new AppCommand({
    requirements: new RequirementsManager(),

    perms: new PermissionsManager(),

    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repeats a given message in the same channel')
        .addStringOption(option => option
            .setName('message')
            .setDescription('Provide a message')
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('hidden')
            .setDescription('Set reply to be anonymous')
        ),

    callback: async (app, interaction) => {
        const options = interaction.options as CommandInteractionOptionResolver;
        const message = options.getString('message')!;
        const hidden = options.getBoolean('hidden') || false;

        if (hidden) {
            await interaction.deferReply();
            await interaction.deleteReply();
            await interaction.channel!.send(message);
        }

        await interaction.reply(message);
    }
})