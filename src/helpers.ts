import { AppEvent, AppCommand } from './app/app';
import { DistubeEvent } from './app/player';

export function registerPlayerEvents(...events: DistubeEvent<any>[]) {
    const map = new Map(events.map((event) => [event.name, event]));
    console.table([...map]);
    return map;
}

export function registerDistubeEvents(...events: DistubeEvent<any>[]) {
    const map = new Map(events.map((event) => [event.name, event]));
    console.table([...map]);
    return map;
}

export function registerAppEvents(...events: AppEvent<any>[]) {
    const map = new Map(events.map((event) => [event.name, event]));
    console.table([...map]);
    return map;
}

export function registerAppCommands(...commands: AppCommand[]) {
    const map = new Map(commands.map((command) => [command.data.name, command]));
    console.table([...map]);
    return map;
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