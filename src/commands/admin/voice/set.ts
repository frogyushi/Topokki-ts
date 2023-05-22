import VoicePreferencesModel from '../../../models/voicePreferences';
import { cleanObject } from '../../../helpers';
import { CommandInteractionOptionResolver, Guild, VoiceChannel } from 'discord.js';
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

    route: 'voice.set',

    callback: async (app, interaction) => {
        const interactionOptions = interaction.options as CommandInteractionOptionResolver;
        const guild = interaction.guild as Guild;
        const member = await app.fetchMember(interaction.member!.user.id, guild.id);

        if (!member) {
            return;
        }

        const voiceChannel = member.voice.channel as VoiceChannel;
        const storedVoiceChannel = await app.voiceChannelRepository.getVoiceChannel(guild.id, voiceChannel.id);

        const options = cleanObject({
            name: interactionOptions.getString('name'),
            maxSlots: interactionOptions.getNumber('max_slots'),
        });

        if (!Object.keys(options).length) {
            new MessageBuilder()
                .setContent(MessageResponses.NoOptionsError)
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        const voicePreferences = await VoicePreferencesModel.findOneAndUpdate(
            { guildId: interaction.guildId },
            { $set: { userId: member.id, ...options } },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        if (
            voiceChannel &&
            storedVoiceChannel?.ownerId === member.id
        ) {
            if (voicePreferences?.name) {
                voiceChannel.setName(voicePreferences.name);
            };

            if (voicePreferences?.maxSlots) {
                voiceChannel.setUserLimit(voicePreferences.maxSlots);
            };
        }

        interaction.reply(MessageResponses.SettingsUpdateSuccess);
    },
});
