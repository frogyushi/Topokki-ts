import discord from 'discord.js';
import { AppEvent } from '../../app/app';

export default new AppEvent({
    name: 'interactionCreate',

    callback: async (app, interaction) => {
        if (
            !(interaction instanceof discord.CommandInteraction) ||
            !interaction.isCommand()
        ) {
            return;
        }

        const command = app.commands.get(interaction.commandName);
        const guild = interaction.guild;

        if (
            !command ||
            !guild ||
            !interaction.member
        ) {
            return;
        }

        try {
            await command.callback(app, interaction);
        } catch (err) {
            console.error(err);
        }
    }
});
