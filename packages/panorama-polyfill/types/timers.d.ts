declare function setInterval<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    timeout?: number,
    ...args: TArgs
): number;
declare function clearInterval(handle?: number): void;

declare function setTimeout<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    timeout?: number,
    ...args: TArgs
): number;
declare function clearTimeout(handle?: number): void;

declare function setImmediate<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    ...args: TArgs
): number;
declare function clearImmediate(handle?: number): void;
