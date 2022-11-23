import { console as Console } from './utils/console';

declare global {
    var console: typeof Console;
}

const global: typeof globalThis = new Function('return this')();
global.console = Console;
