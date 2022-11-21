import { createEffect } from 'solid-js';

export function useGameEvent<
    T extends keyof GameEventDeclarations,
    D extends NetworkedData<GameEventDeclarations[T]>
>(eventName: T, callback: (event: D) => void, deps?: any): void;
export function useGameEvent<T extends keyof CustomGameEventDeclarations>(
    eventName: keyof CustomGameEventDeclarations,
    callback: (event: NetworkedData<CustomGameEventDeclarations[T]>) => void,
    deps?: any
): void;
export function useGameEvent(
    eventName: string,
    callback: (event: object) => void,
    deps?: any
): void {
    createEffect(() => {
        const id = GameEvents.Subscribe(eventName, evt => {
            callback(evt);
        });
        return () => {
            GameEvents.Unsubscribe(id);
        };
    }, deps);
}
