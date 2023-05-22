import BirthdayChannelModel from '../models/birthdayChannel';
import BirthdayModel from '../models/birthday';
import { ChannelType, EmbedBuilder } from 'discord.js';
import { Cron } from '../app/app';

export default new Cron({
    name: 'birthday',

    schedule: '0 0 * * *',

    callback: async (app) => {
        const currentDate = new Date();

        for (const birthday of await BirthdayModel.find()) {
            if (!birthday.date) {
                continue;
            }

            const birthdate = new Date(birthday.date);

            if (
                currentDate.getMonth() !== birthdate.getMonth() ||
                currentDate.getDate() !== birthdate.getDate()
            ) {
                continue;
            }

            const channel = await BirthdayChannelModel.findOne({
                guildId: birthday.guildId,
            });

            if (!channel || !channel.isEnabled || !channel.channelId) {
                continue;
            }

            const member = await app.fetchMember(birthday.userId, birthday.guildId);
            const textChannel = await app.fetchChannel(channel.channelId);

            if (!member || !textChannel || textChannel.type !== ChannelType.GuildText) {
                continue;
            }

            const embed = new EmbedBuilder()
                .setTitle('Birthday Announcement')
                .setDescription(`Wishing \`${member.user.id}\` a happy birthday!`)
                .setTimestamp();

            textChannel.send({ embeds: [embed] });
        }
    }
});