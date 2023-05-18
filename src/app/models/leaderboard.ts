export class Leaderboard {
    public readonly entries: LeaderboardEntry[];
    public readonly guildId: string;

    constructor(guildId: string, users: LeaderboardEntry[]) {
        this.guildId = guildId;
        this.entries = users;
    }
}

export class LeaderboardEntry {
    public readonly userId: string;
    public readonly points: number;
    public isMember: boolean;

    constructor(userId: string, points: number, isMember: boolean = true) {
        this.userId = userId;
        this.points = points;
        this.isMember = isMember;
    }
}
