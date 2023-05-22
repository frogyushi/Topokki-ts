import 'dotenv/config';
import commands from './commands/index';
import crons from './cronjobs/index';
import events from './events/index';
import LeaderboardRepository from './repositories/leaderboard';
import VoiceChannelRepository from './repositories/voiceChannel';
import { App, ClientEvent } from './app/app';
import { Client, GatewayIntentBits } from 'discord.js';
import { connect } from 'mongoose';
import { DisTube } from 'distube';
import { DistubeEvent, Player, PlayerEvent } from './app/player';
import { registerCommands, registerCrons, registerEvents } from './helpers';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { SpotifyPlugin } from '@distube/spotify';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildPresences,
    ],
});

const ytdlpPlugin = new YtDlpPlugin({
    update: false,
});

const spotifyPlugin = new SpotifyPlugin({
    parallel: false,
    emitEventsAfterFetching: true,
    api: {
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
    },
});

const distube = new DisTube(client, {
    nsfw: false,
    searchSongs: 0,
    searchCooldown: 30,
    leaveOnEmpty: true,
    emptyCooldown: 60,
    leaveOnFinish: false,
    leaveOnStop: true,
    ytdlOptions: {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        requestOptions: {
            maxRetries: 3,
            highWaterMark: 1 << 20,
        },
    },
    plugins: [
        ytdlpPlugin,
        spotifyPlugin,
    ],
});

const distubeEventsMap = registerEvents<DistubeEvent<any>>(
    events.addSong,
    events.addList,
    events.distubeError,
);

const playerEventsMap = registerEvents<PlayerEvent<any>>(
    events.playerError,
);

const player = new Player(
    client,
    distube,
    distubeEventsMap,
    playerEventsMap,
);

player.init();

const cronsMap = registerCrons(
    crons.birthday,
);

const commandsMap = registerCommands(
    commands.echo,
    commands.clear,
    commands.play,
    commands.nowplaying,
    commands.queue,
    commands.skip,
    commands.stop,
    commands.leaderboard,
    commands.birthday,
    commands.voice,
);

const clientEventsMap = registerEvents<ClientEvent<any>>(
    events.ready,
    events.interactionCreate,
    events.voiceStateUpdate,
    events.guildMemberRemove,
);

connect(process.env.MONGO_URI!);

const leaderboardRepository = new LeaderboardRepository();
const voiceChannelRepository = new VoiceChannelRepository();

const app = new App(
    client,
    player,
    cronsMap,
    commandsMap,
    clientEventsMap,
    leaderboardRepository,
    voiceChannelRepository,
);

app.login(process.env.CLIENT_TOKEN!);

app.init();


