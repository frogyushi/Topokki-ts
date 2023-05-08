import discord from 'discord.js';
import * as distube from 'distube';
import { PlayerEventCallback } from '../types';

export interface PlayerEventOptions<EventName extends keyof distube.DisTubeEvents> {
    name: EventName;
    callback: PlayerEventCallback<EventName>;
}

export class PlayerEvent<EventName extends keyof distube.DisTubeEvents> {
    public readonly name: EventName;
    public readonly callback: PlayerEventCallback<EventName>;

    constructor(options: PlayerEventOptions<EventName>) {
        this.name = options.name;
        this.callback = options.callback;
    }
}

export class Player {
    private readonly client: discord.Client;
    private readonly distube: distube.DisTube;
    public readonly events: Map<string, PlayerEvent<any>>;

    constructor(
        client: discord.Client,
        distube: distube.DisTube,
        events: Map<string, PlayerEvent<any>>,
    ) {
        this.client = client;
        this.distube = distube;
        this.events = events;
    }

    public init(): void {
        this.registerEvents(this.events);
    }

    private registerEvents(events: Map<string, PlayerEvent<any>>): void {
        for (const event of events.values()) {
            this.distube.on(event.name, (...args: any) => event.callback(this, ...args));
        }
    }

    public play(interaction: discord.BaseInteraction, searchTerm: string, options = {}) {
        const member = interaction.member as discord.GuildMember;
        const textChannel = interaction.channel as discord.TextChannel;
        const voiceChannel = member.voice.channel as discord.VoiceChannel;

        const playOptions: distube.PlayOptions = {
            textChannel: textChannel,
            member: member,
            ...options,
        };

        return this.distube.play(voiceChannel, searchTerm, playOptions);
    }
}