import { AppEvent, AppCommand } from './app/app';
import { DistubeEvent } from './app/player';

export function registerPlayerEvents(...events: DistubeEvent<any>[]) {
    return new Map(events.map((event) => [event.name, event]));
}

export function registerDistubeEvents(...events: DistubeEvent<any>[]) {
    return new Map(events.map((event) => [event.name, event]));
}

export function registerAppEvents(...events: AppEvent<any>[]) {
    return new Map(events.map((event) => [event.name, event]));
}

export function registerAppCommands(...commands: AppCommand[]) {
    return new Map(commands.map((command) => [command.data.name, command]));
}

export function sanitize(data: object | any[]): object | any[] {
    if (Array.isArray(data)) {
        return data.filter(value => value !== null);
    }

    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null)
    );
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}