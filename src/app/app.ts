import discord from 'discord.js';
import { ClientEventCallback, CommandCallback, CommandOptionsData } from '../types';
import { Player } from './player';

export enum MessageResponses {
	PermissionError = 'You do not have the necessary permissions to use this command',
	RequestFailed = 'I was unable to process your request, please try again',
	VoiceChannelRequired = 'You must be in a voice channel to use this command',
	SameVoiceChannelRequired = 'You must be in the same voice channel as me to use this command',
	QueueRequired = 'There is currently no queue available to use this command',
}

export enum Requirements {
	VoiceChannelRequired = 'voiceChannelRequired',
	SameVoiceChannelRequired = 'SameVoiceChannelRequired',
	QueueRequired = 'queueRequired',
}

export interface NamedEvent {
	name: string;
	callback: Function;
}

export interface ClientEventOptions<EventName extends keyof discord.ClientEvents> {
	name: EventName;
	callback: ClientEventCallback<EventName>;
}

export interface CommandBaseOptions {
	readonly requirements: RequirementsManager;
	readonly perms: PermissionsManager;
	readonly callback: CommandCallback;
}

export interface CommandOptions extends CommandBaseOptions {
	readonly data: CommandOptionsData;
}

export interface CommandCategory {
	readonly data: CommandOptionsData;
}

export interface SubCommandOptions extends CommandBaseOptions { 
	readonly category: string;
}

export interface MessageBuilderOptions extends discord.MessageReplyOptions {
	content?: string;
	ephemeral?: boolean;
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

	hasRequirements(...requirements: Requirements[]): boolean {
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

export class ClientEvent<EventName extends keyof discord.ClientEvents> implements NamedEvent {
	public readonly name: EventName;
	public readonly callback: ClientEventCallback<EventName>;

	constructor(options: ClientEventOptions<EventName>) {
		this.name = options.name;
		this.callback = options.callback;
	}
}

export class CommandBase {
	public readonly requirements: RequirementsManager;
	public readonly permissions: bigint;
	public readonly callback: CommandCallback;

	constructor(options: CommandBaseOptions) {
		this.requirements = options.requirements;
		this.permissions = options.perms.permissions;
		this.callback = (app, interaction) => this.beforeCallback(app, interaction, options.callback);
	}

	protected beforeCallback(app: App, interaction: discord.CommandInteraction, callback: CommandCallback): void {
		const perms: boolean = this.checkPermissions(interaction);

		if (!perms) {
			new MessageBuilder()
				.setContent(MessageResponses.PermissionError)
				.setEphemeral(true)
				.send(interaction);

			return;
		}

		callback(app, interaction);
	}

	protected checkPermissions(interaction: discord.CommandInteraction): boolean {
		return (interaction.member as discord.GuildMember).permissions.has(this.permissions);
	}
}

export class Command extends CommandBase {
	public readonly data: CommandOptionsData;

	constructor(options: CommandOptions) {
		super(options);

		this.data = options.data;
	}
}

export class SubCommand extends CommandBase {
	constructor(options: SubCommandOptions) {
		super(options);
	}
}

export class App {
	public readonly client: discord.Client;
	public readonly player: Player;
	public readonly commands: Map<string, Command>;
	public readonly events: Map<string, ClientEvent<any>>;

	constructor(
		client: discord.Client,
		player: Player,
		commands: Map<string, Command>,
		events: Map<string, ClientEvent<any>>,
	) {
		this.client = client;
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