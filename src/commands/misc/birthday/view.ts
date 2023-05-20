import { GuildMember } from 'discord.js';
import { MessageResponses, PermissionsManager, RequirementsManager, Subcommand } from '../../../app/app';
import BirthdayModel from '../../../models/birthday';

export default new Subcommand({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(),

    route: 'birthday.view',

    callback: async (app, interaction) => {
        const member = interaction.options.getMember('member') as GuildMember;

        const birthday = await BirthdayModel.findOne({
            guildId: interaction.guildId,
            userId: member.id
        });

        if (!birthday || !birthday.date) {
            interaction.reply('This member has not set their birthday');
            return;
        }

        const user = await app.fetchUser(birthday.userId);

        if (!user) {
            interaction.reply(MessageResponses.MemberNotFoundError);
            return;
        }

        const month = birthday.date.toLocaleString('default', { month: 'long' });
        const day = birthday.date.getDate();

        interaction.reply(`${user.username}'s birthday is on \`${month} ${day}\``);
    },
});
