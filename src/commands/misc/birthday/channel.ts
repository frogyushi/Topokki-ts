import BirthdayChannelModel from '../../../models/birthdayChannel';
import { cleanObject } from '../../../helpers';
import { CommandInteractionOptionResolver, PermissionFlagsBits } from 'discord.js';
import {
    MessageBuilder,
    MessageResponses,
    PermissionsManager,
    RequirementsManager,
    Subcommand
} from '../../../app/app';

export default new Subcommand({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(
        PermissionFlagsBits.Administrator
    ),

    route: 'birthday.channel',

    callback: async (app, interaction) => {
        const interactionOptions = interaction.options as CommandInteractionOptionResolver;

        const options = cleanObject({
            isEnabled: interactionOptions.getBoolean('is_enabled'),
            channelId: interactionOptions.getChannel('text_channel'),
        });

        if (!Object.keys(options).length) {
            new MessageBuilder()
                .setContent(MessageResponses.NoOptionsError)
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        await BirthdayChannelModel.findOneAndUpdate(
            { guildId: interaction.guildId },
            { $set: options },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        interaction.reply(MessageResponses.SettingsUpdateSuccess);
    },
});
