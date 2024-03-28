import { createMacro } from 'babel-plugin-macros';

let localizationList: Record<string, Record<string, string>> = {};

export default createMacro(
    function ({ references, state, babel, config }) {
        localizationList = {};
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
                        if (token[0] === '#') {
                            token = token.slice(1);
                        }
                        localizationList[token] = localizationData;
                    } else {
                        // arguments must be defined in config
                        const lang = argv[i - 1];
                        if (!lang) {
                            throw new Error(
                                `localize argument ${i} is not defined in config, please define it in babel-plugin-macros config, example: { "language_argv": ["english", "schinese", "russian"] }`
                            );
                        }
                        localizationData[lang] = arg.value;
                    }
                }

                // replace localize call with token
                path.parentPath.replaceWith(
                    babel.types.stringLiteral('#' + token)
                );
            }
        }
    },
    { configName: 'panorama-all-in-jsx' }
);

export function getLocalizationList() {
    return localizationList;
}
