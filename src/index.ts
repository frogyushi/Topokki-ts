import 'dotenv/config';
import { registerCommands, registerCrons, registerEvents } from './helpers';
import { GatewayIntentBits, Client } from 'discord.js';
import { App, ClientEvent } from './app/app';
import { DisTube } from 'distube';
import { connect } from 'mongoose';
import { Player, DistubeEvent, PlayerEvent } from './app/player';
import LeaderboardRepository from './repositories/leaderboard';
import crons from './cronjobs/index';
import commands from './commands/index';
import events from './events/index';

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
})

const distube = new DisTube(client);

const distubeEventsMap = registerEvents<DistubeEvent<any>>(
    events.addSong,
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
)

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
);

const clientEventsMap = registerEvents<ClientEvent<any>>(
    events.ready,
    events.interactionCreate,
);

connect(process.env.MONGO_URI!);

const leaderboardRepo = new LeaderboardRepository();

const app = new App(
    client,
    player,
    cronsMap,
    commandsMap,
    clientEventsMap,
    leaderboardRepo,
);

app.login(process.env.CLIENT_TOKEN!);

app.init();


