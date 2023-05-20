import { Command, BaseEvent } from './app/app';

export function registerEvents<Event extends BaseEvent>(...events: Event[]): Map<string, Event> {
    return new Map(events.map((event) => [event.name, event]));
}

export function registerCommands(...commands: Command[]): Map<string, Command> {
    return new Map(commands.map((command) => [command.data!.name, command]));
}

export function delay(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cleanArray<T>(data: (T | null)[]): T[] {
    return data.filter((value): value is T => value !== null);
}

export function cleanObject<T extends object>(data: T): Partial<T> {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null)) as Partial<T>;
}