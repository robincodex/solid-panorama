export interface BundlePanoramaPolyfillOptions {
    /** Output bundle to file path */
    output: string;
    /** Using lib of polyfill */
    using: { console?: boolean; timers?: boolean };
    /** Merge javascript code to bundle, not support ts */
    merges?: string[];
}
export function bundlePanoramaPolyfill(
    options: BundlePanoramaPolyfillOptions
): Promise<void>;
