"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.Command = exports.AppEvent = void 0;
class AppEvent {
    constructor(options) {
        this.name = options.name;
        this.callback = options.callback;
    }
}
exports.AppEvent = AppEvent;
class Command {
    constructor(options) {
        this.data = options.data;
        this.callback = options.callback;
    }
}
exports.Command = Command;
class App {
    constructor(client, player, commands, events) {
        this.client = client;
        this.player = player;
        this.commands = commands;
        this.events = events;
    }
    init() {
        this.registerEvents(this.events);
    }
    deployCommands(commands) {
        var _a;
        (_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.set(Array.from(commands.values(), (command) => command.data));
    }
    registerEvents(events) {
        for (const event of events.values()) {
            this.client.on(event.name, (...args) => event.callback(this, ...args));
        }
    }
    login(token) {
        return this.client.login(token);
    }
}
exports.App = App;
