import * as distube from 'distube';
import discord from 'discord.js';
import { DistubeEventCallback, PlayerEventCallback } from '../types';
import { EventEmitter } from 'events';
import { NamedEvent } from './app';

export interface PlayerEvents {
    error: [discord.CommandInteraction, Error]
}

export interface PlayerEventOptions<EventName extends keyof PlayerEvents> {
    name: EventName;
    callback: PlayerEventCallback<EventName>;
}

export interface DistubeEventOptions<EventName extends keyof distube.DisTubeEvents> {
    name: EventName;
    callback: DistubeEventCallback<EventName>;
}

export class DistubeEvent<EventName extends keyof distube.DisTubeEvents> implements NamedEvent {
    public readonly name: EventName;
    public readonly callback: DistubeEventCallback<EventName>;

    constructor(options: DistubeEventOptions<EventName>) {
        this.name = options.name;
        this.callback = options.callback;
    }
}

export class PlayerEvent<EventName extends keyof PlayerEvents> implements NamedEvent  {
    public readonly name: EventName;
    public readonly callback: PlayerEventCallback<EventName>;

    constructor(options: PlayerEventOptions<EventName>) {
        this.name = options.name;
        this.callback = options.callback;
    }
}

export class Player {
    public readonly client: discord.Client;
    public readonly distube: distube.DisTube;
    public readonly distubeEvents: Map<string, DistubeEvent<any>>;
    public readonly playerEvents: Map<string, PlayerEvent<any>>;
    public readonly emitter: EventEmitter;

    constructor(
        client: discord.Client,
        distube: distube.DisTube,
        distubeEvents: Map<string, DistubeEvent<any>>,
        playerEvents: Map<string, PlayerEvent<any>>
    ) {
        this.client = client;
        this.distube = distube;
        this.distubeEvents = distubeEvents;
        this.playerEvents = playerEvents;
        this.emitter = new EventEmitter();
    }

    public init(): void {
        this.registerDistubeEvents(this.distubeEvents);
        this.registerPlayerEvents(this.playerEvents);
    }

    private registerPlayerEvents(events: Map<string, PlayerEvent<any>>): void {
        for (const event of events.values()) {
            this.emitter.on(event.name, (...args: any) => event.callback(this, ...args));
        }
    }

    private registerDistubeEvents(events: Map<string, DistubeEvent<any>>): void {
        for (const event of events.values()) {
            this.distube.on(event.name, (...args: any) => event.callback(this, ...args));
        }
    }

    public async play(interaction: discord.CommandInteraction, searchTerm: string, options = {}): Promise<void> {
        const member = interaction.member as discord.GuildMember;
        const textChannel = interaction.channel as discord.TextChannel;
        const voiceChannel = member.voice.channel as discord.VoiceChannel;

        const playOptions: distube.PlayOptions = {
            textChannel: textChannel,
            member: member,
            ...options,
        };

        try {
            await this.distube.play(voiceChannel, searchTerm, playOptions);
        } catch (error) {
            this.emitter.emit('error', interaction, error);
        }
    }
}