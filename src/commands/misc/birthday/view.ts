import BirthdayModel from '../../../models/birthday';
import { GuildMember } from 'discord.js';
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

    route: 'birthday.view',

    callback: async (app, interaction) => {
        const member = interaction.options.getMember('member') as GuildMember;

        const birthdayModel = await BirthdayModel.findOne({
            guildId: interaction.guildId,
            userId: member.id,
        });

        if (!birthdayModel || !birthdayModel.date) {
            new MessageBuilder()
                .setContent('This member has not set their birthday')
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        const user = await app.fetchUser(birthdayModel.userId);

        if (!user) {
            new MessageBuilder()
                .setContent(MessageResponses.MemberNotFoundError)
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        const month = birthdayModel.date.toLocaleString('default', { month: 'long' });
        const day = birthdayModel.date.getDate();

        interaction.reply(`${user.username}'s birthday is on \`${month} ${day}\``);
    },
});
