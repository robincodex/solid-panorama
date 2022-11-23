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

const global: typeof globalThis = new Function('return this')();
global.setInterval = timers.setInterval;
global.clearInterval = timers.clearInterval;
global.setTimeout = timers.setTimeout;
global.clearTimeout = timers.clearTimeout;
global.setImmediate = timers.setImmediate;
global.clearImmediate = timers.clearImmediate;
