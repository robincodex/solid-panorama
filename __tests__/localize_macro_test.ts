import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import {
    getLocalizationTable,
    autoApplyToLocalizationFile
} from '../packages/panorama-all-in-jsx/src/localize.macro';
import { join } from 'path';
import { mkdir, readFile } from 'fs/promises';
import { KeyValues } from 'easy-keyvalues';
import { existsSync } from 'fs';

describe('localize_macro', function () {
    test('getLocalizationTable', async function () {
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

        const basePath = join(__dirname, 'localization');
        await mkdir(basePath, { recursive: true });
        const kv = KeyValues.CreateRoot();
        kv.CreateChild('lang', []);
        kv.Save(join(basePath, 'addon_schinese.txt'), 'utf8');
        kv.FindKey('lang')?.CreateChild('addon_game_name', 'My Game');
        kv.Save(join(basePath, 'addon_english.txt'), 'utf8');
        await autoApplyToLocalizationFile(basePath);
        expect(await readFile(join(basePath, 'addon_english.txt'), 'utf8'))
            .toBe(`"lang"
{
    "addon_game_name"           "My Game"
    "test_token_a"              "this is a"
    "test_token_b"              "this is b"
    "token_f780dc967d9b71be"    "this is c"
    "token_fa636963348fd7d0"    "this is d"
}`);
        expect(await readFile(join(basePath, 'addon_schinese.txt'), 'utf8'))
            .toBe(`"lang"
{
    "test_token_a"              "这是a"
    "test_token_b"              "这是b"
    "token_f780dc967d9b71be"    "这是c"
    "token_fa636963348fd7d0"    "这是d"
}`);
        expect(await readFile(join(basePath, 'addon_russian.txt'), 'utf8'))
            .toBe(`"lang"
{
    "test_token_a"              "Это a"
    "test_token_b"              "Это b"
    "token_f780dc967d9b71be"    "Это c"
    "token_fa636963348fd7d0"    "Это d"
}`);
    });
});
