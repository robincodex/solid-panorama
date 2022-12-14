import { Accessor } from 'solid-js';

export function useGameEvent<
    T extends keyof GameEventDeclarations,
    D extends NetworkedData<GameEventDeclarations[T]>
>(eventName: T, callback: (event: D) => void, deps?: any): void;
export function useGameEvent<
    T extends keyof CustomGameEventDeclarations,
    D extends NetworkedData<CustomGameEventDeclarations[T]>
>(eventName: T, callback: (event: D) => void, deps?: any): void;

export function useNetTable<
    TName extends keyof CustomNetTableDeclarations,
    T extends CustomNetTableDeclarations[TName]
>(tableName: TName, key: keyof T): Accessor<T | undefined>;
