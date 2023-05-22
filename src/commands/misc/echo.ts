import {
    Command,
    MessageBuilder,
    MessageResponses,
    PermissionsManager,
    RequirementsManager,
    SubcommandManager
} from '../../app/app';
import {
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionFlagsBits,
    SlashCommandBuilder
} from 'discord.js';

export default new Command({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(),

    subcommands: new SubcommandManager(),

    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repeats a given message in the same channel')
        .addStringOption((option) => option
            .setName('message')
            .setDescription('Provide a message')
            .setRequired(true)
        )
        .addBooleanOption((option) => option
            .setName('hidden')
            .setDescription('Set reply to be anonymous')
        ),

    callback: async (app, interaction) => {
        const member = interaction.member as GuildMember;
        const options = interaction.options as CommandInteractionOptionResolver;
        const message = options.getString('message')!;
        const hidden = options.getBoolean('hidden') || false;

        if (hidden) {
            if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
                new MessageBuilder()
                    .setContent(MessageResponses.PermissionError)
                    .setEphemeral(true)
                    .send(interaction);

                return;
            }

            await interaction.deferReply();
            await interaction.deleteReply();

            interaction.channel!.send(message);
        }

        interaction.reply(message);
    }
});