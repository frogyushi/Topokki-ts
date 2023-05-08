"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const helpers_1 = require("./helpers");
const discord_js_1 = require("discord.js");
const app_1 = require("./app/app");
const distube_1 = require("distube");
const player_1 = require("./app/player");
const index_1 = __importDefault(require("./commands/index"));
const index_2 = __importDefault(require("./events/index"));
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildInvites,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildModeration,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.GuildPresences,
    ],
});
const distube = new distube_1.DisTube(client);
const playerEvents = (0, helpers_1.registerPlayerEvents)(index_2.default.addSong);
const player = new player_1.Player(client, distube, playerEvents);
player.init();
const commands = (0, helpers_1.registerCommands)(index_1.default.echo, index_1.default.clear, index_1.default.play);
const appEvents = (0, helpers_1.registerAppEvents)(index_2.default.ready, index_2.default.interactionCreate);
const app = new app_1.App(client, player, commands, appEvents);
app.login(process.env.CLIENT_TOKEN);
app.init();
