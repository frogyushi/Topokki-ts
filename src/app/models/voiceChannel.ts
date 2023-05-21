export interface VoiceChannelOptions {
    guildId: string;
    ownerId: string;
    channelId: string;
    markedForDeletion: boolean;
}

export class VoiceChannel {
    public readonly ownerId: string;
    public readonly channelId: string;

    constructor(options: VoiceChannelOptions) {
        this.ownerId = options.ownerId;
        this.channelId = options.channelId;
    }
}