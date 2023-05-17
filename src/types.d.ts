import discord from 'discord.js';
import * as distube from 'distube';
import * as app from './app/app';
import * as player from './app/player';

export type CommandCallback = (app: app.App, interaction: discord.CommandInteraction, command: app.BaseCommand) => discord.Awaitable<void>;

export type ClientEventCallback<EventName extends keyof discord.ClientEvents> = (app: app.App, ...args: discord.ClientEvents[EventName]) => discord.Awaitable<void>;

export type DistubeEventCallback<EventName extends keyof distube.DisTubeEvents> = (player: player.Player, ...args: distube.DisTubeEvents[EventName]) => discord.Awaitable<void>;

export type PlayerEventCallback<EventName extends keyof player.PlayerEvents> = (player: player.Player, ...args: player.PlayerEvents[EventName]) => discord.Awaitable<void>;

export type CommandBuilder = Omit<discord.SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand" | "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;