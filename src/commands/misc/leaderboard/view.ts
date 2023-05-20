import { EmbedBuilder } from 'discord.js';
import { PermissionsManager, RequirementsManager, Subcommand } from '../../../app/app';

export default new Subcommand({
    requirements: new RequirementsManager(),

    permissions: new PermissionsManager(),

    route: 'leaderboard.view',

    callback: async (app, interaction) => {
        const leaderboard = await app.getLeaderboard(interaction.guild!.id);
        const members: string[] = [];
        const points: number[] = [];

        for (const entry of leaderboard.entries) {
            const user = await app.fetchUser(entry.userId);

            if (user && !user.bot && entry.points > 0) {
                members.push(user.tag);
                points.push(entry.points);
            }
        }

        const membersList = members
            .map((username, i) => `${i + 1} - ${username}`)
            .join('\n\n');

        const pointsList = points
            .map((score) => score.toString())
            .join('\n\n');

        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setDescription('The list of the most active members of this server')
            .setTimestamp()
            .setFields([
                {
                    name: 'Members',
                    value: membersList || 'No members',
                    inline: true,
                },
                {
                    name: 'Points',
                    value: pointsList || 'No points',
                    inline: true,
                }
            ]);

        interaction.reply({ embeds: [embed] });
    }
})