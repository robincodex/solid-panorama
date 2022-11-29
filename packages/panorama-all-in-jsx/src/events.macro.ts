import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import { addNamed } from '@babel/helper-module-imports';
import { NodePath, PluginPass } from '@babel/core';
import * as Babel from '@babel/core';
import { registerImportMethod } from './utils';

let useNetTableCache: Record<
    string,
    Array<{
        table: string;
        block: Babel.types.BlockStatement;
    }>
> = {};

export default createMacro(function ({ references, state, babel }) {
    for (const name in references) {
        if (name === 'useGameEvent') {
            useGameEvent(references[name], state, babel);
        } else if (name === 'useNetTable') {
            useNetTable(references[name], state, babel);
        }
    }
    useNetTableCache = {};
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
        const ast = babel.parse(buildGameEventCode);
        if (!ast) {
            continue;
        }
        let deps: any;
        babel.traverse(ast, {
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
                                parentPath.node.arguments.slice(0, 2);
                            deps = parentPath.node.arguments[2];
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

        const body = ast.program.body[0];
        if (
            t.isExpressionStatement(body) &&
            t.isCallExpression(body.expression)
        ) {
            if (deps) {
                body.expression.arguments.push(deps);
            }
            parentPath.replaceWith(body.expression);
        }
    }
}

const useNetTableCode = `
createEffect(() => {
    const id = CustomNetTables.SubscribeNetTableListener();
    return () => {
        CustomNetTables.UnsubscribeNetTableListener(id);
    };
});`;

function useNetTable(refs: NodePath[], state: PluginPass, babel: typeof Babel) {
    if (!state.filename) {
        return;
    }

    let cacheList = useNetTableCache[state.filename];
    if (!cacheList) {
        cacheList = [];
        useNetTableCache[state.filename] = cacheList;
    }

    // register createEffect
    function registerCreateEffect(path: NodePath<Babel.types.CallExpression>) {
        const rootBlock = path.findParent(v =>
            v.isBlockStatement()
        ) as NodePath<Babel.types.BlockStatement>;
        if (!rootBlock) {
            return;
        }
        const rootLine = rootBlock.node.loc?.start.line;
        if (typeof rootLine !== 'number') {
            throw new Error('Not found line');
        }

        const argTableName = path.node.arguments[0];
        let tableName = '';
        if (t.isIdentifier(argTableName)) {
            tableName = argTableName.name;
        } else if (t.isStringLiteral(argTableName)) {
            tableName = argTableName.value;
        }
        const table = `${rootLine}:${tableName}`;

        let cache = cacheList.find(v => v.table === table);
        if (cache) {
            return cache;
        }
        const body = rootBlock.node.body;
        let index = 0;
        for (const [i, exp] of body.entries()) {
            if (t.isReturnStatement(exp)) {
                break;
            }
            index = i;
        }
        cache = {
            table,
            block: t.blockStatement([])
        };
        cacheList.push(cache);

        const ast = babel.parse(useNetTableCode);
        if (!ast) {
            return;
        }

        body.splice(index + 1, 0, ...ast!.program.body);

        babel.traverse(ast, {
            enter(eventPath) {
                if (eventPath.isCallExpression()) {
                    if (t.isMemberExpression(eventPath.node.callee)) {
                        if (
                            t.isIdentifier(eventPath.node.callee.object) &&
                            eventPath.node.callee.object.name ===
                                'CustomNetTables' &&
                            t.isIdentifier(eventPath.node.callee.property) &&
                            eventPath.node.callee.property.name ===
                                'SubscribeNetTableListener'
                        ) {
                            eventPath.node.arguments = [
                                argTableName,
                                t.functionExpression(
                                    t.identifier(''),
                                    [
                                        t.identifier('_'),
                                        t.identifier('k'),
                                        t.identifier('v')
                                    ],
                                    cache!.block
                                )
                            ];
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
        return cache;
    }

    for (const path of refs) {
        const parentPath = path.parentPath;
        if (!parentPath?.isCallExpression()) {
            continue;
        }
        if (!parentPath.parentPath.isVariableDeclarator()) {
            continue;
        }

        // Get variable name
        let setterName = '';
        {
            if (!t.isIdentifier(parentPath.parentPath.node.id)) {
                throw new Error(
                    '[useNetTable] The variable must be a identifier.'
                );
            }
            const name = parentPath.parentPath.node.id.name;
            setterName = 'set' + name[0].toUpperCase() + name.slice(1);
            const id = path.scope.generateUidIdentifier(setterName);
            setterName = id.name;
            parentPath.parentPath.node.id = t.arrayPattern([
                parentPath.parentPath.node.id,
                id
            ]);
        }

        const argTableName = parentPath.node.arguments[0];
        const argKey = parentPath.node.arguments[1];
        // check tableName
        if (!t.isStringLiteral(argTableName) && !t.isIdentifier(argTableName)) {
            throw new Error('[useNetTable] The tableName must be a string.');
        }
        // check key
        if (!t.isStringLiteral(argKey) && !t.isIdentifier(argKey)) {
            throw new Error('[useNetTable] The key must be a string.');
        }

        const cache = registerCreateEffect(parentPath);
        if (!cache) {
            continue;
        }
        const callStat = t.ifStatement(
            t.binaryExpression('===', t.identifier('k'), argKey),
            t.blockStatement([
                t.expressionStatement(
                    t.callExpression(t.identifier(setterName), [
                        t.identifier('v')
                    ])
                )
            ])
        );
        if (cache.block.body.length === 0) {
            cache.block.body.push(callStat);
        } else {
            let stat = cache.block.body[0] as t.IfStatement;
            while (t.isIfStatement(stat.alternate)) {
                stat = stat.alternate;
            }
            stat.alternate = callStat;
        }

        parentPath.replaceWith(
            t.callExpression(
                registerImportMethod(path, 'createSignal', 'solid-js'),
                [t.nullLiteral()]
            )
        );
    }
}
