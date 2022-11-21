import { createEffect } from 'solid-js';
import { noop } from './utils';

export function useGameEvent<
    T extends keyof GameEventDeclarations,
    D extends NetworkedData<GameEventDeclarations[T]>
>(eventName: T, callback: (event: D) => void, deps?: any): void;
export function useGameEvent<
    T extends keyof CustomGameEventDeclarations,
    D extends NetworkedData<CustomGameEventDeclarations[T]>
>(eventName: T, callback: (event: D) => void, deps?: any): void;
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

export function setDragEvent(
    node: Panel,
    event: string,
    callback: ((...args: any[]) => void) | undefined
): void {
    event = event.slice(2);
    if (!callback) {
        $.RegisterEventHandler(event, node, noop);
        return;
    }
    if (event === 'DragStart') {
        node.SetDraggable(true);
    }
    $.RegisterEventHandler(event, node, callback);
}
