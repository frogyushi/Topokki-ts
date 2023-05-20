import BirthdayModel from '../../../models/birthday';
import { GuildMember, PermissionFlagsBits, CommandInteractionOptionResolver } from 'discord.js';
import { MessageResponses, PermissionsManager, RequirementsManager, Subcommand } from '../../../app/app';
import { cleanObject } from '../../../helpers';
import { isValid } from 'date-fns';

export default new Subcommand({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(
        PermissionFlagsBits.Administrator
    ),

    route: 'birthday.configure',

    callback: async (app, interaction) => {
        const interactionOptions = interaction.options as CommandInteractionOptionResolver;
        const member = interaction.options.getMember('member') as GuildMember;

        const birthday = await BirthdayModel.findOne({
            guildId: interaction.guildId,
            userId: member.id
        });

        const options = cleanObject({
            isEnabled: interactionOptions.getBoolean('is_public'),
            date: interactionOptions.getString('date'),
        });

        if (!Object.keys(options).length) {
            interaction.reply(MessageResponses.NoOptionsError);
            return;
        }

        if (!birthday?.date && !options?.date) {
            interaction.reply('Unable to update setting since no date has been specified');
            return;
        }

        if (options?.date && !isValid(new Date(options.date))) {
            interaction.reply('The provided date is invalid');
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
})
