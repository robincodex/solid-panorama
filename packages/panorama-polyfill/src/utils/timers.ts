const intervals = new Map<number, ScheduleID>();
let nextIntervalId = -100000;

export const setTimeout = <TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    timeout = 0,
    ...args: TArgs
): number => $.Schedule(timeout / 1000, () => callback(...args));

export function setInterval<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    timeout = 0,
    ...args: TArgs
): number {
    timeout /= 1000;
    nextIntervalId -= 1;
    const intervalId = nextIntervalId;

    const run = () => {
        intervals.set(intervalId, $.Schedule(timeout, run));
        callback(...args);
    };

    intervals.set(intervalId, $.Schedule(timeout, run));
    return intervalId;
}

export const setImmediate = <TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    ...args: TArgs
): number => $.Schedule(0, () => callback(...args));

function clearTimer(handle?: number) {
    if (typeof handle === 'number') {
        // $.CancelScheduled throws on expired or non-existent timer handles
        try {
            if (handle < -100000) {
                $.CancelScheduled(intervals.get(handle)!);
            } else {
                $.CancelScheduled(handle as ScheduleID);
            }
        } catch {}
    }
}

export {
    clearTimer as clearTimeout,
    clearTimer as clearInterval,
    clearTimer as clearImmediate
};
