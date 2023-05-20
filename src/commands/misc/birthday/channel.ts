import { CommandInteractionOptionResolver } from 'discord.js';
import { MessageResponses, PermissionsManager, RequirementsManager, Subcommand } from '../../../app/app';
import { cleanObject } from '../../../helpers';
import BirthdayChannelModel from '../../../models/birthdayChannel';

export default new Subcommand({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(),

    route: 'birthday.channel',

    callback: async (app, interaction) => {
        const interactionOptions = interaction.options as CommandInteractionOptionResolver;

        const options = cleanObject({
            isEnabled: interactionOptions.getBoolean('is_enabled'),
            channelId: interactionOptions.getChannel('text_channel'),
        });

        if (!Object.keys(options).length) {
            interaction.reply(MessageResponses.NoOptionsError);
            return;
        }

        await BirthdayChannelModel.findOneAndUpdate(
            { guildId: interaction.guildId },
            { $set: options },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        interaction.reply(MessageResponses.SettingsUpdateSuccess);
    },
});
