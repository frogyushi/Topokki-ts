"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = exports.registerAppEvents = exports.registerPlayerEvents = void 0;
function registerPlayerEvents(...events) {
    return new Map(events.map((event) => [event.name, event]));
}
exports.registerPlayerEvents = registerPlayerEvents;
function registerAppEvents(...events) {
    return new Map(events.map((event) => [event.name, event]));
}
exports.registerAppEvents = registerAppEvents;
function registerCommands(...commands) {
    return new Map(commands.map((command) => [command.data.name, command]));
}
exports.registerCommands = registerCommands;
