import mongoose from 'mongoose';

const VoicePreferencesSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String },
    name: { type: String },
    maxSlots: { type: Number, default: 0 },
});

const VoicePreferencesModel = mongoose.model('VoicePreferences', VoicePreferencesSchema);

export default VoicePreferencesModel;
