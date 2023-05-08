import { AppEventCallback, CommandCallback, CommandOptionsData } from '../types';
import discord from 'discord.js';
import { Player } from './player';

export interface CommandOptions {
    readonly data: CommandOptionsData,
    readonly callback: CommandCallback;
}

export interface AppEventOptions<EventName extends keyof discord.ClientEvents> {
    name: EventName;
    callback: AppEventCallback<EventName>;
}

export class AppEvent<EventName extends keyof discord.ClientEvents> {
    public readonly name: EventName;
    public readonly callback: AppEventCallback<EventName>;

    constructor(options: AppEventOptions<EventName>) {
        this.name = options.name;
        this.callback = options.callback;
    }
}

export class Command {
    public readonly data: CommandOptionsData;
    public readonly callback: CommandCallback;

    constructor(options: CommandOptions) {
        this.data = options.data;
        this.callback = options.callback;
    }
}

export class App {
    private readonly client: discord.Client;
    public readonly player: Player;
    public readonly commands: Map<string, Command>;
    public readonly events: Map<string, AppEvent<any>>;

    constructor(
        client: discord.Client,
        player: Player,
        commands: Map<string, Command>,
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

    public deployCommands(commands: Map<string, Command>): void {
        this.client.application?.commands.set(Array.from(commands.values(), (command) => command.data));
    }

    private registerEvents(events: Map<string, AppEvent<any>>): void {
        for (const event of events.values()) {
            this.client.on(event.name, (...args) => event.callback(this, ...args));
        }
    }

    public login(token: string): Promise<string> {
        return this.client.login(token);
    }
}