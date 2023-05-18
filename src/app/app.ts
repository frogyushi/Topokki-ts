import discord from 'discord.js';
import { ClientEventCallback, CommandCallback, CommandBuilder } from '../types';
import { Player } from './player';
import { cleanArray } from '../helpers';
import { Database } from './database';

export enum MessageResponses {
	PermissionError = 'You do not have the necessary permissions to use this command',
	RequestFailed = 'I was unable to process your request, please try again',
	VoiceChannelRequired = 'You must be in a voice channel to use this command',
	SameVoiceChannelRequired = 'You must be in the same voice channel as me to use this command',
	QueueRequired = 'There is currently no queue available to use this command',
	UnknownError = 'Something went wrong, try again',
}

export enum Requirements {
	VoiceChannelRequired = 'voiceChannelRequired',
	SameVoiceChannelRequired = 'SameVoiceChannelRequired',
	QueueRequired = 'queueRequired',
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
	readonly perms: PermissionsManager;
	readonly callback?: CommandCallback;
}

export interface CommandOptions extends BaseCommandOptions {
	readonly data: CommandBuilder;
	readonly subcommands: SubcommandManager;
}

export interface SubcommandOptions extends BaseCommandOptions {
	readonly data: SubcommandBuilder;
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
		return requirements.every((requirement) => this.requirements.includes(requirement));
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
		this.permissions = options.perms.permissions;
		this.callback = (app, interaction) => this._callback(app, interaction, this, options.callback);
	}

	protected _callback(app: App, interaction: discord.CommandInteraction, baseCommand: BaseCommand, callback?: CommandCallback): void {
		const perms: boolean = this.checkPermissions(interaction);

		if (!perms) {
			new MessageBuilder()
				.setContent(MessageResponses.PermissionError)
				.setEphemeral(true)
				.send(interaction);

			return;
		}

		this.beforeCallback(app, interaction, baseCommand);
		callback?.(app, interaction, baseCommand);
	}

	protected beforeCallback(app: App, interaction: discord.CommandInteraction, baseCommand: BaseCommand): void { }

	protected checkPermissions(interaction: discord.CommandInteraction): boolean {
		return (interaction.member as discord.GuildMember).permissions.has(this.permissions);
	}
}

export class SubcommandManager {
	public readonly subcommands: Map<string, Subcommand> = new Map();

	constructor(...subcommands: Subcommand[]) {
		for (const sub of subcommands) {
			this.subcommands.set(sub.getPath(), sub);
		}
	}

	private getPath(interaction: discord.CommandInteraction): string {
		const options = interaction.options as discord.CommandInteractionOptionResolver;
		const name = interaction.commandName;
		const group = options.getSubcommandGroup();
		const subgroup = options.getSubcommand();

		return cleanArray<string>([name, group, subgroup]).join('.');
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
	public readonly data: SubcommandBuilder;

	constructor(options: SubcommandOptions) {
		super(options);

		this.data = options.data;
	}

	public getPath(): string {
		return this.data.route!;
	}
}

export class App {
	public readonly client: discord.Client;
	public readonly player: Player;
	public readonly commands: Map<string, Command>;
	public readonly events: Map<string, ClientEvent<any>>;
	public readonly database: Database;

	constructor(
		client: discord.Client,
		database: Database,
		player: Player,
		commands: Map<string, Command>,
		events: Map<string, ClientEvent<any>>,
	) {
		this.client = client;
		this.database = database;
		this.player = player;
		this.commands = commands;
		this.events = events;
	}

	public init(): void {
		this.registerEvents(this.events);
	}

	private registerEvents(events: Map<string, ClientEvent<any>>): void {
		for (const event of events.values()) {
			this.client.on(event.name, (...args) => event.callback(this, ...args));
		}
	}

	public deployCommands(commands: Map<string, Command>): void {
		this.client.application?.commands.set(Array.from(commands.values(), (command) => command.data));
	}

	public login(token: string): Promise<string> {
		return this.client.login(token);
	}
}