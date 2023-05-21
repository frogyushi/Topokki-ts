import mongoose from 'mongoose';

const VoiceEntrypointSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String },
    isEnabled: { type: Boolean, default: false },
});

const VoiceEntrypointModel = mongoose.model('Voice', VoiceEntrypointSchema);

export default VoiceEntrypointModel;
