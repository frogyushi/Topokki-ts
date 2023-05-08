import 'dotenv/config';

import { registerAppCommands, registerDistubeEvents, registerAppEvents, registerPlayerEvents } from './helpers';
import { GatewayIntentBits, Client } from 'discord.js';
import { App, AppCommand, AppEvent } from './app/app';
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

const distubeEvents: Map<string, DistubeEvent<any>> = registerDistubeEvents(
    Events.addSong,
    Events.distubeError,
);

const playerEvents: Map<string, PlayerEvent<any>> = registerPlayerEvents(
    Events.playerError,
);

const player = new Player(
    client,
    distube,
    distubeEvents,
    playerEvents
);

player.init();

const appCommand: Map<string, AppCommand> = registerAppCommands(
    Commands.echo,
    Commands.clear,
    Commands.play,
);

const appEvents: Map<string, AppEvent<any>> = registerAppEvents(
    Events.ready,
    Events.interactionCreate,
);

const app = new App(
    client,
    player,
    appCommand,
    appEvents,
);

app.login(process.env.CLIENT_TOKEN!);

app.init();


