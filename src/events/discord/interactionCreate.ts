import {
    ClientEvent,
    MessageBuilder,
    MessageResponses,
    Requirements
} from '../../app/app';
import { GuildMember, VoiceChannel } from 'discord.js';

export default new ClientEvent({
    name: 'interactionCreate',

    callback: async (app, interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        const command = app.commands.get(interaction.commandName);
        const guild = interaction.guild;
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel as VoiceChannel;

        if (!command || !guild || !interaction.member) {
            return;
        }

        if (
            command.requirements.hasRequirements(Requirements.VoiceChannelRequired) &&
            !voiceChannel
        ) {
            new MessageBuilder()
                .setContent(MessageResponses.VoiceChannelRequired)
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        if (
            command.requirements.hasRequirements(Requirements.SameVoiceChannelRequired) &&
            app.client.voice.adapters.get(guild.id) &&
            !voiceChannel.members.has(app.client.user!.id)
        ) {
            new MessageBuilder()
                .setContent(MessageResponses.SameVoiceChannelRequired)
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        if (
            command.requirements.hasRequirements(Requirements.QueueRequired) &&
            !app.player.distube.getQueue(guild.id)
        ) {
            new MessageBuilder()
                .setContent(MessageResponses.QueueRequired)
                .setEphemeral(true)
                .send(interaction);

            return;
        }

        try {
            await command.callback(app, interaction, command);
        } catch (err) {
            console.error(err);
        }
    }
});
