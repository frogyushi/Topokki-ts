"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.PlayerEvent = void 0;
class PlayerEvent {
    constructor(options) {
        this.name = options.name;
        this.callback = options.callback;
    }
}
exports.PlayerEvent = PlayerEvent;
class Player {
    constructor(client, distube, events) {
        this.client = client;
        this.distube = distube;
        this.events = events;
    }
    init() {
        this.registerEvents(this.events);
    }
    registerEvents(events) {
        for (const event of events.values()) {
            this.distube.on(event.name, (...args) => event.callback(this, ...args));
        }
    }
    play(interaction, searchTerm, options = {}) {
        const member = interaction.member;
        const textChannel = interaction.channel;
        const voiceChannel = member.voice.channel;
        const playOptions = Object.assign({ textChannel: textChannel, member: member }, options);
        return this.distube.play(voiceChannel, searchTerm, playOptions);
    }
}
exports.Player = Player;
