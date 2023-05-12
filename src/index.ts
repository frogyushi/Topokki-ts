import 'dotenv/config';
import { registerCommands, registerEvents } from './helpers';
import { GatewayIntentBits, Client } from 'discord.js';
import { App, Command, ClientEvent } from './app/app';
import { DisTube } from 'distube';
import { Player, DistubeEvent, PlayerEvent } from './app/player';
import Commands from './commands/index';
import Events from './events/index';

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

const distubeEvents = registerEvents<DistubeEvent<any>>(
    Events.addSong,
    Events.distubeError,
);

const playerEvents = registerEvents<PlayerEvent<any>>(
    Events.playerError,
);

const player = new Player(
    client,
    distube,
    distubeEvents,
    playerEvents
);

player.init();

const commands: Map<string, Command> = registerCommands(
    Commands.echo,
    Commands.clear,
    Commands.play,
    Commands.nowplaying,
    Commands.queue,
    Commands.skip,
    Commands.stop,
);

const clientEvents = registerEvents<ClientEvent<any>>(
    Events.ready,
    Events.interactionCreate,
);

const app = new App(
    client,
    player,
    commands,
    clientEvents,
);

app.login(process.env.CLIENT_TOKEN!);

app.init();


