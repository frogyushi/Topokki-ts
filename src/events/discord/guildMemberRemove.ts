import discord from 'discord.js';
import { AppClientEvent } from '../../app/app';

export default new AppClientEvent({
    name: 'guildMemberRemove',

    callback: async (app, member) => {
        app.updateLeaderboard(member.guild.id, member.id);
    },
})