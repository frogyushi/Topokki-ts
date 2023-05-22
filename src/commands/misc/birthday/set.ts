import BirthdayModel from '../../../models/birthday';
import { cleanObject } from '../../../helpers';
import { CommandInteractionOptionResolver } from 'discord.js';
import { isValid } from 'date-fns';
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

    route: 'birthday.set',

    callback: async (app, interaction) => {
        const interactionOptions = interaction.options as CommandInteractionOptionResolver;

        const birthdayModel = await BirthdayModel.findOne({
            guildId: interaction.guildId,
            userId: interaction.member!.user.id
        });

        const options = cleanObject({
            isEnabled: interactionOptions.getBoolean('is_public'),
            date: interactionOptions.getString('date'),
        });

        if (!Object.keys(options).length) {
            new MessageBuilder()
                .setContent(MessageResponses.NoOptionsError)
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        if (!birthdayModel?.date && !options?.date) {
            new MessageBuilder()
                .setContent('Unable to update setting since no date has been specified')
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        if (options?.date && !isValid(new Date(options.date))) {
            new MessageBuilder()
                .setContent('The provided date is invalid')
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        await BirthdayModel.findOneAndUpdate(
            { guildId: interaction.guildId, userId: interaction.user.id },
            { $set: options },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        interaction.reply(MessageResponses.SettingsUpdateSuccess);
    }
});
