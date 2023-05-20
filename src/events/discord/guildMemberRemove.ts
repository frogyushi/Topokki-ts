import { ClientEvent } from '../../app/app';

export default new ClientEvent({
    name: 'guildMemberRemove',

    callback: async (app, member) => {
        app.updateLeaderboard(member.guild.id, member.id);
    },
})