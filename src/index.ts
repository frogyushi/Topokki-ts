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
import { VoiceChannelRepository } from './repositories/voiceChannel';

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


