import { APIEmbedField, EmbedBuilder, Guild } from 'discord.js';
import {
    PermissionsManager,
    RequirementsManager,
    SubcommandBuilder,
    Subcommand
} from '../../../app/app';

export default new Subcommand({
    requirements: new RequirementsManager(),

    perms: new PermissionsManager(),

    data: new SubcommandBuilder()
        .setRoute('leaderboard.show'),

    callback: async (app, interaction) => {
        const guild = interaction.guild as Guild;
        const leaderboard = await app.getLeaderboard(guild.id);

        const texts: string[] = [];
        const points: string[] = [];

        for (const [i, entry] of leaderboard.entries.entries()) {
            const user = await app.client.users.fetch(entry.userId, { cache: true }).catch(() => null);

            if (user && !user.bot && entry.points !== 0) {
                texts.push(`**${i + 1}** - ${user.tag}`);
                points.push(entry.points.toString());
            }
        }

        const embedFields: APIEmbedField[] = [
            {
                name: 'Members',
                value: texts.join('\n\n') || '-',
                inline: true,
            },
            {
                name: 'Points',
                value: points.join('\n\n') || '-',
                inline: true,
            }
        ]

        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setDescription('The list of the most active members of this server')
            .setTimestamp()
            .addFields(embedFields);

        interaction.reply({ embeds: [embed] })
    }
})