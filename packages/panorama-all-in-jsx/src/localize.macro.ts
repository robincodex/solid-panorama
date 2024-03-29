import { createMacro } from 'babel-plugin-macros';
import { createHash } from 'crypto';

type LocalizationTable = Record<string, Record<string, string>>;

let fileLocalization: Record<string, LocalizationTable> = {};

export default createMacro(
    function ({ references, state, babel, config }) {
        if (!state.filename) {
            throw new Error('state.filename is not defined');
        }
        const localizationTable: LocalizationTable = {};
        fileLocalization[state.filename] = localizationTable;
        const argv = config ? config['localize_language_argv'] : ['english'];

        for (const path of references.default) {
            if (path.parentPath && path.parentPath.isCallExpression()) {
                // arguments must be more than 1
                if (path.parentPath.node.arguments.length <= 1) {
                    console.warn(
                        `${state.filename} localize arguments must be more than 1`
                    );
                    continue;
                }

                // fetch token and localization data
                let token = '';
                let isAnonymous = false;
                let localizationData: Record<string, string> = {};
                for (const [
                    i,
                    arg
                ] of path.parentPath.node.arguments.entries()) {
                    // arguments must be string literals
                    if (!babel.types.isStringLiteral(arg)) {
                        throw new Error(
                            'localize arguments must be string literals'
                        );
                    }
                    // first argument is token
                    if (i === 0) {
                        token = arg.value;
                        if (token === '' || token[0] === '#') {
                            if (token.length <= 1) {
                                isAnonymous = true;
                                token = '';
                            } else {
                                token = token.slice(1);
                            }
                        }
                    } else {
                        // arguments must be defined in config
                        const lang = argv[i - 1];
                        if (!lang) {
                            throw new Error(
                                `localize argument ${i} is not defined in config, please define it in babel-plugin-macros config, example: { "language_argv": ["english", "schinese", "russian"] }`
                            );
                        }
                        localizationData[lang] = arg.value;
                        if (isAnonymous) {
                            token += arg.value;
                        }
                    }
                }

                // if token is anonymous, hash it
                if (isAnonymous) {
                    const hash = createHash('sha256');
                    hash.update(token);
                    token = `token_${hash.digest('hex').slice(0, 16)}`;
                }
                localizationTable[token] = localizationData;

                // replace localize call with token
                path.parentPath.replaceWith(
                    babel.types.stringLiteral('#' + token)
                );
            }
        }
    },
    { configName: 'panorama-all-in-jsx' }
);

export function getLocalizationTable() {
    const localizationTable: LocalizationTable = {};
    for (const [_, table] of Object.entries(fileLocalization)) {
        Object.assign(localizationTable, table);
    }
    return localizationTable;
}
