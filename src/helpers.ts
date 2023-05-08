import { AppEvent, Command } from './app/app';
import { PlayerEvent } from './app/player';

export function registerPlayerEvents(...events: PlayerEvent<any>[]) {
    return new Map(events.map((event) => [event.name, event]));
}

export function registerAppEvents(...events: AppEvent<any>[]) {
    return new Map(events.map((event) => [event.name, event]));
}

export function registerCommands(...commands: Command[]) {
    return new Map(commands.map((command) => [command.data.name, command]));
}