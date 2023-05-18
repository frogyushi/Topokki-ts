import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String },
    points: { type: Number, default: 0 },
    isMember: { type: Boolean, default: true },
    lastActive: { type: String },
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);

export default Leaderboard;
