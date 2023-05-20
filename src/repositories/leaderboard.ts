import mongoose from 'mongoose';
import LeaderboardModel from '../models/leaderboard';
import { Leaderboard, LeaderboardEntry } from '../app/models/leaderboard';

export default class LeaderboardRepository {
    constructor() { }

    public async getLeaderboard(guildId: string): Promise<Leaderboard> {
        const leaderboardEntries = await (LeaderboardModel as mongoose.Model<any>)
            .find({ guildId })
            .sort({ points: -1 })
            .limit(10)
            .exec();

        const entries = leaderboardEntries.map((entry) => new LeaderboardEntry(entry.userId, entry.points));

        return new Leaderboard(guildId, entries);
    }

    public async updateLeaderboard(leaderboard: Leaderboard) {
        const { guildId, entries } = leaderboard;

        for (const { userId, points, isMember } of entries) {
            await LeaderboardModel.updateOne(
                { guildId, userId },
                { points, isMember }
            );
        }
    }
}