import { Schema } from '../app/database';

export default new Schema({
    name: 'leaderboard',

    model: {
        guildId: { type: String, required: true },
        userId: { type: String },
        points: { type: Number, default: 0 },
        lastActive: { type: String },
    },
});