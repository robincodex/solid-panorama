import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * @param {import('../types/index').BundlePanoramaPolyfillOptions} options
 */
export async function bundlePanoramaPolyfill(options) {
    let bundle = '';

    for (const [name, using] of Object.entries(options.using)) {
        if (using) {
            if (bundle.length !== 0) {
                bundle += '\n';
            }
            bundle += await readFile(resolve(__dirname, `${name}.js`), 'utf8');
            bundle += '\n';
        }
    }

    if (options.merges) {
        for (const filename of options.merges) {
            if (bundle.length !== 0) {
                bundle += '\n';
            }
            bundle += await readFile(filename);
            bundle += '\n';
        }
    }

    await writeFile(options.output, bundle, 'utf8');
}
