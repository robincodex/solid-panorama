import { console as Console } from './utils/console';

declare global {
    var console: typeof Console;
}

export default function (g: typeof globalThis) {
    g.console = Console;
}
