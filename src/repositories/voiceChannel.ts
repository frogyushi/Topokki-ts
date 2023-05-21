import VoiceChannelModel from '../models/voiceChannel';
import VoiceEntrypointModel from '../models/voiceEntrypoint';
import VoicePreferencesModel from '../models/voicePreferences';

export class VoiceChannelRepository {
    constructor() { }

    public async createVoiceChannel(guildId: string, channelId: string, ownerId: string): Promise<void> {
        const newVoiceChannel = new VoiceChannelModel({
            guildId: guildId,
            channelId: channelId,
            ownerId: ownerId,
        });

        await newVoiceChannel.save();
    }

    public async getVoiceChannelEntrypoint(guildId: string) {
        return await VoiceEntrypointModel.findOne({ guildId });
    }

    public async getVoicePreferences(guildId: string, userId: string) {
        return await VoicePreferencesModel.findOne({ guildId, userId });
    }

    public async getVoiceChannel(guildId: string, channelId: string) {
        return await VoiceChannelModel.findOne({ guildId, channelId });
    }

    public async getVoiceChannels() {
        return await VoiceChannelModel.find();
    }
}
