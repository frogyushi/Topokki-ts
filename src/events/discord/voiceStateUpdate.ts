import { ClientEvent } from '../../app/app';

export default new ClientEvent({
    name: 'voiceStateUpdate',

    callback: async (app, oldState, newState) => {
        const member = newState?.member;

        if (!member) {
            return;
        };

        const { guild } = newState;
        const { channelId: newChannelId } = newState;
        const { channelId: oldChannelId } = oldState || {};

        if (
            !oldChannelId &&
            newChannelId
        ) {
            app.onVoiceChannelJoin(guild.id, member.id, newChannelId);
        } else if (
            oldChannelId &&
            newChannelId &&
            oldChannelId !== newChannelId
        ) {
            app.onVoiceChannelLeave(guild.id, member.id, oldChannelId);
            app.onVoiceChannelJoin(guild.id, member.id, newChannelId);
        } else if (
            oldChannelId &&
            !newChannelId
        ) {
            app.onVoiceChannelLeave(guild.id, member.id, oldChannelId);
        }
    }
});