import { Command } from './app/app';

export function registerEvents(...events: any[]) {
    return new Map(events.map((event) => [event.name, event]));
}

export function registerCommands(...commands: Command[]) {
    return new Map(commands.map((command) => [command.data.name, command]));
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function bold(content: string | number): string {
    return `**${content.toString()}**`;
}

export function code(content: string | number): string {
    return `\`${content.toString()}\``;
}

export function sanitize(data: object | any[]): object | any[] {
    if (Array.isArray(data)) {
        return data.filter(value => value !== null);
    }

    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null));
}