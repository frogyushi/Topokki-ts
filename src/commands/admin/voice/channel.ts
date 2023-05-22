import VoiceEntrypointModel from '../../../models/voiceEntrypoint';
import { cleanObject } from '../../../helpers';
import { CommandInteractionOptionResolver } from 'discord.js';
import {
    MessageBuilder,
    MessageResponses,
    PermissionsManager,
    RequirementsManager,
    Subcommand
} from '../../../app/app';

export default new Subcommand({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(),

    route: 'voice.channel',

    callback: async (app, interaction) => {
        const interactionOptions = interaction.options as CommandInteractionOptionResolver;

        const voiceModel = await VoiceEntrypointModel.findOne({
            guildId: interaction.guildId,
        });

        const options = cleanObject({
            isEnabled: interactionOptions.getBoolean('is_enabled'),
            channelId: interactionOptions.getChannel('voice_channel'),
        });

        if (!Object.keys(options).length) {
            new MessageBuilder()
                .setContent(MessageResponses.NoOptionsError)
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        if (!voiceModel?.channelId && !options?.channelId) {
            new MessageBuilder()
                .setContent('Unable to update setting since no voice channel has been set')
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        await VoiceEntrypointModel.findOneAndUpdate(
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
