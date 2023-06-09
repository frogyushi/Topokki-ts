import discord from 'discord.js';
import LeaderboardRepository from '../repositories/leaderboard';
import VoiceChannelRepository from '../repositories/voiceChannel';
import { cleanArray } from '../helpers';
import {
	ClientEventCallback,
	CommandBuilder,
	CommandCallback,
	CronCallback
} from '../types';
import { Leaderboard } from './models/leaderboard';
import { Player } from './player';
import { schedule } from 'node-cron';

export enum MessageResponses {
	PermissionError = 'You do not have the necessary permissions to use this command',
	RequestFailed = 'I was unable to process your request, please try again',
	VoiceChannelRequired = 'You must be in a voice channel to use this command',
	SameVoiceChannelRequired = 'You must be in the same voice channel as me to use this command',
	QueueRequired = 'There is currently no queue available to use this command',
	UnknownError = 'Something went wrong, try again',
	MemberNotFoundError = 'This member cannot be found in the server',
	NoOptionsError = 'There were no options provided',
	SettingsUpdateSuccess = 'Settings updated successfully',
}

export enum Requirements {
	VoiceChannelRequired = 'voiceChannelRequired',
	SameVoiceChannelRequired = 'SameVoiceChannelRequired',
	QueueRequired = 'queueRequired',
}

export interface CreateVoiceChannelOptions {
	name: string;
	parent?: discord.CategoryChannel | null;
	userLimit: number;
}

export interface BaseEvent {
	name: string;
	callback: Function;
}

export interface ClientEventOptions<EventName extends keyof discord.ClientEvents> {
	name: EventName;
	callback: ClientEventCallback<EventName>;
}

export interface BaseCommandOptions {
	readonly requirements: RequirementsManager;
	readonly permissions: PermissionsManager;
	readonly callback?: CommandCallback;
}

export interface CommandOptions extends BaseCommandOptions {
	readonly data: CommandBuilder;
	readonly subcommands: SubcommandManager;
}

export interface SubcommandOptions extends BaseCommandOptions {
	readonly route: string;
}

export interface MessageBuilderOptions extends discord.MessageReplyOptions {
	content?: string;
	ephemeral?: boolean;
}

export class SubcommandBuilder {
	public route?: string;

	public setRoute(route: string) {
		this.route = route;
		return this;
	}
}

export class PermissionsManager {
	public readonly permissions: bigint;

	constructor(permissions: bigint = BigInt(0)) {
		this.permissions = permissions;
	}
}

export class RequirementsManager {
	private readonly requirements: Requirements[];

	constructor(...requirements: Requirements[]) {
		this.requirements = requirements;
	}

	public hasRequirements(...requirements: Requirements[]): boolean {
		return requirements.every((requirement) => {
			this.requirements.includes(requirement);
		});
	}
}

export class MessageBuilder {
	private readonly options: MessageBuilderOptions;

	constructor(options: MessageBuilderOptions = {}) {
		this.options = options;
	}

	public setContent(content: string): MessageBuilder {
		this.options.content = content;
		return this;
	}

	public setEphemeral(ephemeral: boolean): MessageBuilder {
		this.options.ephemeral = ephemeral;
		return this;
	}

	public send(interaction: discord.CommandInteraction): Promise<discord.InteractionResponse<boolean>> {
		return interaction.reply(this.options as discord.InteractionReplyOptions);
	}
}

export class ClientEvent<EventName extends keyof discord.ClientEvents> implements BaseEvent {
	public readonly name: EventName;
	public readonly callback: ClientEventCallback<EventName>;

	constructor(options: ClientEventOptions<EventName>) {
		this.name = options.name;
		this.callback = options.callback;
	}
}

export class BaseCommand {
	public readonly requirements: RequirementsManager;
	public readonly permissions: bigint;
	public readonly callback: CommandCallback;

	constructor(options: BaseCommandOptions) {
		this.requirements = options.requirements;
		this.permissions = options.permissions.permissions;

		this.callback = (app, interaction) => {
			this.callbackOverride(app, interaction, this, options.callback);
		};
	}

	protected callbackOverride(app: App, interaction: discord.CommandInteraction, baseCommand: BaseCommand, callback?: CommandCallback): void {
		const perms = this.checkPermissions(interaction.member as discord.GuildMember);

		if (!perms) {
			new MessageBuilder()
				.setContent(MessageResponses.PermissionError)
				.setEphemeral(true)
				.send(interaction);

			return;
		}

		try {
			this.beforeCallback(app, interaction, baseCommand);
			callback?.(app, interaction, baseCommand);
		} catch (err) {
			console.error(err);
		}
	}

	protected beforeCallback(app: App, interaction: discord.CommandInteraction, baseCommand: BaseCommand): void { }

	public checkPermissions(member: discord.GuildMember): boolean {
		return member.permissions.has(this.permissions);
	}
}

export class SubcommandManager {
	public readonly subcommands: Map<string, Subcommand> = new Map();

	constructor(...subcommands: Subcommand[]) {
		for (const subcommand of subcommands) {
			this.subcommands.set(subcommand.getPath(), subcommand);
		}
	}

	private getPath(interaction: discord.CommandInteraction): string {
		const options = interaction.options as discord.CommandInteractionOptionResolver;

		return cleanArray<string>([
			interaction.commandName,
			options.getSubcommandGroup(),
			options.getSubcommand(),
		]).join('.');
	}

	public getSubcommand(interaction: discord.CommandInteraction): Subcommand | undefined {
		return this.subcommands.get(this.getPath(interaction));
	}
}

export class Command extends BaseCommand {
	public readonly data: CommandBuilder;
	public readonly subcommands: SubcommandManager;

	constructor(options: CommandOptions) {
		super(options);

		this.data = options.data;
		this.subcommands = options.subcommands;
	}

	protected beforeCallback(app: App, interaction: discord.CommandInteraction, baseCommand: BaseCommand): void {
		if (this.subcommands.subcommands.size <= 0) {
			return;
		}

		const command = baseCommand as Command;
		const subcommand = command.subcommands.getSubcommand(interaction);

		if (!subcommand) {
			new MessageBuilder()
				.setContent(MessageResponses.UnknownError)
				.setEphemeral(true)
				.send(interaction);

			return;
		}

		subcommand.callback(app, interaction, baseCommand);
	}
}

export class Subcommand extends BaseCommand {
	private readonly route: string;

	constructor(options: SubcommandOptions) {
		super(options);

		this.route = options.route;
	}

	public getPath(): string {
		return this.route;
	}
}

export interface CronOptions {
	name: string;
	schedule: string;
	callback: CronCallback;
}

export class Cron {
	public readonly name: string;
	public readonly schedule: string;
	public readonly callback: CronCallback;

	constructor(options: CronOptions) {
		this.name = options.name;
		this.schedule = options.schedule;
		this.callback = options.callback;
	}
}

export class App {
	public readonly client: discord.Client;
	public readonly player: Player;
	public readonly crons: Map<string, Cron>;
	public readonly commands: Map<string, Command>;
	public readonly events: Map<string, ClientEvent<any>>;
	public readonly leaderboardRepository: LeaderboardRepository;
	public readonly voiceChannelRepository: VoiceChannelRepository;

	constructor(
		client: discord.Client,
		player: Player,
		crons: Map<string, Cron>,
		commands: Map<string, Command>,
		events: Map<string, ClientEvent<any>>,
		leaderboardRepository: LeaderboardRepository,
		voiceChannelRepository: VoiceChannelRepository,
	) {
		this.client = client;
		this.player = player;
		this.crons = crons;
		this.commands = commands;
		this.events = events;
		this.leaderboardRepository = leaderboardRepository;
		this.voiceChannelRepository = voiceChannelRepository;
	}

	public init(): void {
		this.registerCrons(this.crons);
		this.registerEvents(this.events);
	}

	private registerEvents(events: Map<string, ClientEvent<any>>): void {
		for (const event of events.values()) {
			this.client.on(event.name, (...args) => {
				event.callback(this, ...args);
			});
		}
	}

	private registerCrons(crons: Map<string, Cron>): void {
		for (const cron of crons.values()) {
			schedule(cron.schedule, () => {
				cron.callback(this, cron);
			});
		}
	}

	public deployCommands(commands: Map<string, Command>): void {
		this.client.application?.commands.set(Array.from(commands.values(), (command) => command.data));
	}

	public login(token: string): Promise<string> {
		return this.client.login(token);
	}

	public getLeaderboard(guildId: string): Promise<Leaderboard> {
		return this.leaderboardRepository.getLeaderboard(guildId);
	}

	public async fetchUser(userId: string): Promise<discord.User | null> {
		try {
			return await this.client.users.fetch(userId, { cache: true });
		} catch {
			return null;
		}
	}

	public async fetchMember(userId: string, guildId: string): Promise<discord.GuildMember | null> {
		try {
			const guild = await this.client.guilds.fetch(guildId);
			return await guild.members.fetch(userId);
		} catch {
			return null;
		}
	}

	public async fetchGuild(guildId: string): Promise<discord.Guild | null> {
		try {
			return await this.client.guilds.fetch(guildId);
		} catch {
			return null;
		}
	}

	public async fetchChannel(channelId: string): Promise<discord.Channel | null> {
		try {
			return await this.client.channels.fetch(channelId);
		} catch {
			return null;
		}
	}

	public async updateLeaderboard(guildId: string, userId: string): Promise<void> {
		const leaderboard = await this.leaderboardRepository.getLeaderboard(guildId);
		const entry = leaderboard.entries.find((entry) => entry.userId === userId);

		if (entry) {
			entry.isMember = false;
		}

		await this.leaderboardRepository.updateLeaderboard(leaderboard);
	}

	public async createVoiceChannel(guildId: string, options: CreateVoiceChannelOptions): Promise<discord.VoiceChannel | undefined> {
		const guild = await this.fetchGuild(guildId);

		return guild?.channels.create({
			type: discord.ChannelType.GuildVoice,
			...options
		});
	}

	public async onVoiceChannelJoin(guildId: string, userId: string, voiceChannelId: string): Promise<void> {
		const entrypoint = await this.voiceChannelRepository.getVoiceChannelEntrypoint(guildId);
		const member = await this.fetchMember(userId, guildId);

		if (!entrypoint?.channelId) {
			return;
		}

		const voiceChannelEntrypoint = await this.fetchChannel(entrypoint.channelId);

		if (voiceChannelEntrypoint?.type !== discord.ChannelType.GuildVoice) {
			return;
		}

		if (entrypoint.channelId === voiceChannelId) {
			const voicePreferences = await this.voiceChannelRepository.getVoicePreferences(guildId, userId);

			const voiceChannel = await this.createVoiceChannel(guildId, {
				name: voicePreferences?.name || `${member?.user.username}'s channel`,
				parent: voiceChannelEntrypoint.parent,
				userLimit: voicePreferences?.maxSlots || 0,
			});

			if (voiceChannel) {
				this.voiceChannelRepository.createVoiceChannel(guildId, voiceChannel.id, userId);

				member?.voice.setChannel(voiceChannel);
			}
		}
	}

	public async onVoiceChannelLeave(guildId: string, userId: string, voiceChannelId: string): Promise<void> {
		const voiceChannel = await this.fetchChannel(voiceChannelId);

		if (
			!voiceChannel ||
			voiceChannel.type !== discord.ChannelType.GuildVoice ||
			voiceChannel.members.size > 0
		) {
			return;
		}

		const storedVoiceChannel = await this.voiceChannelRepository.getVoiceChannel(guildId, voiceChannelId);

		if (
			storedVoiceChannel &&
			storedVoiceChannel.channelId === voiceChannelId
		) {
			await voiceChannel.delete();
			await storedVoiceChannel.deleteOne();
		}
	}

	public async clearEmptyStoredVoiceChannels(): Promise<void> {
		const storedVoiceChannels = await this.voiceChannelRepository.getVoiceChannels();

		for (const storedVoiceChannel of storedVoiceChannels) {
			const { channelId } = storedVoiceChannel;
			const voiceChannel = await this.fetchChannel(channelId) as discord.VoiceChannel;

			if (
				voiceChannel &&
				voiceChannel.members.size === 0
			) {
				voiceChannel.delete();
				storedVoiceChannel.deleteOne();
			}
		}
	}
}