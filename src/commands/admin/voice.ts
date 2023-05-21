import { ChannelType, SlashCommandBuilder } from 'discord.js';
import { Command, PermissionsManager, RequirementsManager, SubcommandManager } from '../../app/app';
import set from './voice/set';
import channel from './voice/channel';

export default new Command({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(),

    subcommands: new SubcommandManager(
        set,
        channel,
    ),

    data: new SlashCommandBuilder()
        .setName('voice')
        .setDescription('Set up custom voice channels')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Update your personal custom voice channel')
            .addStringOption(option => option
                .setName('name')
                .setDescription('Change the name of your custom channel')
            )
            .addNumberOption(option => option
                .setName('max_slots')
                .setDescription('Change the maximum number of slots in your custom channel')
                .setMinValue(0)
                .setMaxValue(99)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('channel')
            .setDescription('Manage custom voice channel entry')
            .addChannelOption(option => option
                .setName('voice_channel')
                .setDescription('Set up a custom voice channel entrypoint')
                .addChannelTypes(ChannelType.GuildVoice)
            )
            .addBooleanOption(option => option
                .setName('is_enabled')
                .setDescription('Enable or disable the custom voice channel feature')
            )
        ),
})