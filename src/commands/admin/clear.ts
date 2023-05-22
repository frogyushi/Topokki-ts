import {
    Command,
    PermissionsManager,
    RequirementsManager,
    SubcommandManager
} from '../../app/app';
import {
    CommandInteractionOptionResolver,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel
} from 'discord.js';

export default new Command({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(),

    subcommands: new SubcommandManager(),

    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears a specified amount of messages in the current text channel')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator |
            PermissionFlagsBits.ManageMessages
        )
        .addNumberOption((option) => option
            .setName('amount')
            .setDescription('Provide an amount')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        ),

    callback: async (app, interaction) => {
        const options = interaction.options as CommandInteractionOptionResolver;
        const textChannel = interaction.channel as TextChannel;
        const amount = options.getNumber('amount')!;

        await textChannel.bulkDelete(amount, true);

        interaction.reply(`\`${amount}\` messages removed`);
    }
});