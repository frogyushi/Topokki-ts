import { Command, NamedEvent } from './app/app';

export function registerEvents<Event extends NamedEvent>(...events: Event[]) {
    return new Map(events.map((event) => [event.name, event]));
}

export function registerCommands(...commands: Command[]) {
    return new Map(commands.map((command) => [command.data.name, command]));
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cleanArray<T>(data: (T | null)[]): T[] {
    return data.filter((value): value is T => value !== null);
}

export function cleanObject(data: object): object {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null));
}
