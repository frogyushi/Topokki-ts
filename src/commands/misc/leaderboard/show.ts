import { APIEmbedField, EmbedBuilder } from 'discord.js';
import {
    PermissionsManager,
    RequirementsManager,
    SlashSubcommandBuilder,
    Subcommand
} from '../../../app/app';

export default new Subcommand({
    requirements: new RequirementsManager(),

    perms: new PermissionsManager(),

    data: new SlashSubcommandBuilder()
        .setRoute('leaderboard.show'),

    callback: async (app, interaction) => {
        const Leaderboard = app.database.get('leaderboard')!.model;

        const members = await Leaderboard
            .find({ guildId: interaction.guild!.id })
            .sort({ points: -1 })
            .limit(10) || [];

        const texts = [];
        const points = [];

        for (const [id, member] of members.entries()) {
            const user = await app.client.users.fetch(member.userId).catch(() => null);

            if (!user || user?.bot || member.points <= 0) {
                continue;
            }

            texts.push(`**${id + 1}** - ${user.tag}`);
            points.push(member.points);
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