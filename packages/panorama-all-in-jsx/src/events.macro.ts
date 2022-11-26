import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import { addNamed } from '@babel/helper-module-imports';
import { NodePath, PluginPass } from '@babel/core';
import * as Babel from '@babel/core';
import { registerImportMethod } from './utils';

export default createMacro(function ({ references, state, babel }) {
    for (const name in references) {
        if (name === 'useGameEvent') {
            useGameEvent(references[name], state, babel);
        }
    }
});

const buildGameEventCode = `
createEffect(() => {
    const id = GameEvents.Subscribe();
    return () => {
        GameEvents.Unsubscribe(id);
    };
});`;

function useGameEvent(
    refs: NodePath[],
    state: PluginPass,
    babel: typeof Babel
) {
    for (const path of refs) {
        const parentPath = path.parentPath;
        if (!parentPath?.isCallExpression()) {
            continue;
        }
        const buildGameEvent = babel.parse(buildGameEventCode);
        if (!buildGameEvent) {
            continue;
        }
        babel.traverse(buildGameEvent, {
            enter(eventPath) {
                if (eventPath.isCallExpression()) {
                    if (t.isMemberExpression(eventPath.node.callee)) {
                        if (
                            t.isIdentifier(eventPath.node.callee.object) &&
                            eventPath.node.callee.object.name ===
                                'GameEvents' &&
                            t.isIdentifier(eventPath.node.callee.property) &&
                            eventPath.node.callee.property.name === 'Subscribe'
                        ) {
                            eventPath.node.arguments =
                                parentPath.node.arguments;
                        }
                    } else if (
                        t.isIdentifier(eventPath.node.callee) &&
                        eventPath.node.callee.name === 'createEffect'
                    ) {
                        eventPath.node.callee = registerImportMethod(
                            path,
                            'createEffect',
                            'solid-js'
                        );
                    }
                }
            }
        });
        parentPath.replaceWith(buildGameEvent.program.body[0]);
    }
}