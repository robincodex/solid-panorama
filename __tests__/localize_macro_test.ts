import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import { getLocalizationList } from '../packages/panorama-all-in-jsx/src/localize.macro';

describe('localize_macro', function () {
    test('getLocalizationList', function () {
        const result = parseMacros(
            `
            import localize from '../packages/panorama-all-in-jsx/src/localize.macro';
            const token_a = localize('test_token_a', 'this is a', '这是a', 'Это a')
            const token_b = localize('#test_token_b', 'this is b', '这是b', 'Это b')
        `,
            __filename,
            {
                'panorama-all-in-jsx': {
                    localize_language_argv: ['english', 'schinese', 'russian']
                }
            }
        );
        expect(result).toMatchSnapshot();

        expect(getLocalizationList()).toStrictEqual({
            test_token_a: {
                english: 'this is a',
                schinese: '这是a',
                russian: 'Это a'
            },
            test_token_b: {
                english: 'this is b',
                schinese: '这是b',
                russian: 'Это b'
            }
        });
    });
});
