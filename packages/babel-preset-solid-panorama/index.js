const jsxTransform = require('babel-plugin-jsx-panorama-expressions');

module.exports = function (context, options = {}) {
    const plugins = [
        [
            jsxTransform,
            Object.assign(
                {
                    moduleName: 'solid-panorama-runtime',
                    builtIns: [
                        'For',
                        'Show',
                        'Switch',
                        'Match',
                        'Suspense',
                        'SuspenseList',
                        'Portal',
                        'Index',
                        'Dynamic',
                        'ErrorBoundary'
                    ],
                    contextToCustomElements: true,
                    wrapConditionals: true,
                    generate: 'universal'
                },
                options
            )
        ]
    ];

    return {
        plugins
    };
};
