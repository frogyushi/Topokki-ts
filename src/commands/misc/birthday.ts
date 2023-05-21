import { ChannelType, SlashCommandBuilder } from 'discord.js';
import { Command, PermissionsManager, RequirementsManager, SubcommandManager } from '../../app/app';
import set from './birthday/set';
import channel from './birthday/channel';
import view from './birthday/view';

export default new Command({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(),

    subcommands: new SubcommandManager(
        view,
        set,
        channel,
    ),

    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Manage your birthday information')
        .addSubcommand((subcommand) => subcommand
            .setName('set')
            .setDescription('Set your birthday')
            .addStringOption((option) => option
                .setName('date')
                .setDescription('Set your birthday date')
            )
            .addBooleanOption((option) => option
                .setName('is_public')
                .setDescription('Choose whether your birthday is publicly visible')
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('view')
            .setDescription('View the birthday of a member')
            .addUserOption((option) => option
                .setName('member')
                .setDescription('Specify the member to view their birthday')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('channel')
            .setDescription('Manage channel settings for birthday notifications')
            .addChannelOption((option) => option
                .setName('text_channel')
                .setDescription('Specify a text channel for birthday notifications')
                .addChannelTypes(ChannelType.GuildText)
            )
            .addBooleanOption((option) => option
                .setName('is_enabled')
                .setDescription('Enable or disable birthday notifications')
            )
        ),
})