import 'dotenv/config';

import { registerCommands, registerPlayerEvents, registerAppEvents } from './helpers';
import { GatewayIntentBits, Client } from 'discord.js';
import { App, Command, AppEvent } from './app/app';
import { DisTube } from 'distube';
import { Player, PlayerEvent } from './app/player';
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

const playerEvents: Map<string, PlayerEvent<any>> = registerPlayerEvents(
    Events.addSong,
);

const player = new Player(
    client,
    distube,
    playerEvents
);

player.init();

const commands: Map<string, Command> = registerCommands(
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
    commands,
    appEvents,
);

app.login(process.env.CLIENT_TOKEN!);

app.init();


