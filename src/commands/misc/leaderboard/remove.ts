import LeaderboardModel from '../../../models/leaderboard';
import { GuildMember, PermissionFlagsBits } from 'discord.js';
import { PermissionsManager, RequirementsManager, Subcommand } from '../../../app/app';

export default new Subcommand({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(
        PermissionFlagsBits.Administrator
    ),

    route: 'leaderboard.remove',

    callback: async (app, interaction) => {
        const member = interaction.options.getMember('member') as GuildMember;

        await LeaderboardModel.findOneAndDelete({
            guildId: interaction.guild!.id,
            userId: member.id,
        });

        interaction.reply('Leaderboard entry has been successfully removed');
    }
});