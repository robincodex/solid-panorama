import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import { getLocalizationTable } from '../packages/panorama-all-in-jsx/src/localize.macro';

describe('localize_macro', function () {
    test('getLocalizationTable', function () {
        const result = parseMacros(
            `
            import localize from '../packages/panorama-all-in-jsx/src/localize.macro';
            const token_a = localize('test_token_a', 'this is a', '这是a', 'Это a')
            const token_b = localize('#test_token_b', 'this is b', '这是b', 'Это b')
            const token_c = localize('#', 'this is c', '这是c', 'Это c')
            const token_d = localize('', 'this is d', '这是d', 'Это d')
        `,
            __filename,
            {
                'panorama-all-in-jsx': {
                    localize_language_argv: ['english', 'schinese', 'russian']
                }
            }
        );
        expect(result).toMatchSnapshot();

        expect(getLocalizationTable()).toStrictEqual({
            test_token_a: {
                english: 'this is a',
                schinese: '这是a',
                russian: 'Это a'
            },
            test_token_b: {
                english: 'this is b',
                schinese: '这是b',
                russian: 'Это b'
            },
            token_f780dc967d9b71be: {
                english: 'this is c',
                schinese: '这是c',
                russian: 'Это c'
            },
            token_fa636963348fd7d0: {
                english: 'this is d',
                schinese: '这是d',
                russian: 'Это d'
            }
        });
    });
});
