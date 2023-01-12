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

(function () {
    globalThis.setInterval = timers.setInterval;
    globalThis.clearInterval = timers.clearInterval;
    globalThis.setTimeout = timers.setTimeout;
    globalThis.clearTimeout = timers.clearTimeout;
    globalThis.setImmediate = timers.setImmediate;
    globalThis.clearImmediate = timers.clearImmediate;
})();
