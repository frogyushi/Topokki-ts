import { AppEventCallback, CommandCallback, CommandOptionsData } from '../types';
import discord from 'discord.js';
import { Player } from './player';

export enum MessageResponses {
	PermissionError = 'You do not have the necessary permissions to use this command',
	RequestFailed = 'I was unable to process your request, please try again',
	VoiceChannelRequired = 'You must be in a voice channel to use this command',
	SameVoiceChannelRequiredError = 'You must be in the same voice channel as me to use this command',
	QueueRequired = 'There is currently no queue available to use this command',
}

export interface CommandOptions {
	readonly requirements: RequirementsManager;
	readonly perms: PermissionsManager;
	readonly data: CommandOptionsData;
	readonly callback: CommandCallback;
}

export interface AppEventOptions<EventName extends keyof discord.ClientEvents> {
	name: EventName;
	callback: AppEventCallback<EventName>;
}

export class PermissionsManager {
	public readonly permissions: bigint;

	constructor(permissions: bigint = BigInt(0)) {
		this.permissions = permissions;
	}
}

export enum Requirements {
	VoiceChannelRequired = 'voiceChannelRequired',
	SameVoiceChannelRequired = 'SameVoiceChannelRequired',
	QueueRequired = 'queueRequired',
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

export class MessageBuilder implements discord.MessageReplyOptions {
	public content?: string;
	public ephemeral?: boolean;

	constructor() {
		this.content = undefined;
		this.ephemeral = undefined;
	}

	public setContent(content: string): MessageBuilder {
		this.content = content;
		return this;
	}

	public setEphemeral(ephemeral: boolean): MessageBuilder {
		this.ephemeral = ephemeral;
		return this;
	}

	public send(interaction: discord.CommandInteraction): Promise<discord.InteractionResponse<boolean>> {
		return interaction.reply({ content: this.content, ephemeral: this.ephemeral });
	}
}

export class AppEvent<EventName extends keyof discord.ClientEvents> {
	public readonly name: EventName;
	public readonly callback: AppEventCallback<EventName>;

	constructor(options: AppEventOptions<EventName>) {
		this.name = options.name;
		this.callback = options.callback;
	}
}

export class AppCommand {
	public readonly data: CommandOptionsData;
	public readonly requirements: RequirementsManager;
	public readonly permissions: bigint;
	public readonly callback: CommandCallback;

	constructor(options: CommandOptions) {
		this.data = options.data;
		this.requirements = options.requirements;
		this.permissions = options.perms.permissions;
		this.callback = (app, interaction) => this.beforeCallback(app, interaction, options.callback);
	}

	private beforeCallback(app: App, interaction: discord.CommandInteraction, callback: CommandCallback): void {
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

	private checkPermissions(interaction: discord.CommandInteraction): boolean {
		return (interaction.member as discord.GuildMember).permissions.has(this.permissions);
	}
}

export class App {
	public readonly client: discord.Client;
	public readonly player: Player;
	public readonly commands: Map<string, AppCommand>;
	public readonly events: Map<string, AppEvent<any>>;

	constructor(
		client: discord.Client,
		player: Player,
		commands: Map<string, AppCommand>,
		events: Map<string, AppEvent<any>>,
	) {
		this.client = client;
		this.player = player;
		this.commands = commands;
		this.events = events;
	}

	public init(): void {
		this.registerEvents(this.events);
	}

	private registerEvents(events: Map<string, AppEvent<any>>): void {
		for (const event of events.values()) {
			this.client.on(event.name, (...args) => event.callback(this, ...args));
		}
	}

	public deployCommands(commands: Map<string, AppCommand>): void {
		this.client.application?.commands.set(Array.from(commands.values(), (AppCommand) => AppCommand.data));
	}

	public login(token: string): Promise<string> {
		return this.client.login(token);
	}
}