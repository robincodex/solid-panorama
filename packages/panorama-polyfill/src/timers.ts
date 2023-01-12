import * as timers from './utils/timers';

declare global {
    function setInterval<TArgs extends any[]>(
        callback: (...args: TArgs) => void,
        timeout?: number,
        ...args: TArgs
    ): number;
    function clearInterval(handle?: number): void;

    function setTimeout<TArgs extends any[]>(
        callback: (...args: TArgs) => void,
        timeout?: number,
        ...args: TArgs
    ): number;
    function clearTimeout(handle?: number): void;

    function setImmediate<TArgs extends any[]>(
        callback: (...args: TArgs) => void,
        ...args: TArgs
    ): number;
    function clearImmediate(handle?: number): void;
}

export default function (g: typeof globalThis) {
    g.setInterval = timers.setInterval;
    g.clearInterval = timers.clearInterval;
    g.setTimeout = timers.setTimeout;
    g.clearTimeout = timers.clearTimeout;
    g.setImmediate = timers.setImmediate;
    g.clearImmediate = timers.clearImmediate;
}
