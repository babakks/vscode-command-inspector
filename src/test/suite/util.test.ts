import * as assert from 'assert';

import * as vscode from 'vscode';
import { toJSON, tryParseJSON } from '../../util';

suite('util.toJSON', () => {
    test('primitive', () => {
        assert.strictEqual(toJSON(123), "123");
        assert.strictEqual(toJSON("123"), '"123"');
        assert.strictEqual(toJSON(false), "false");
        assert.strictEqual(toJSON(true), "true");
    });

    test('object', () => {
        assert.strictEqual(toJSON({}), "{}");
        assert.strictEqual(toJSON({ a: 1 }), '{\n  "a": 1\n}');
    });

    test('array', () => {
        assert.strictEqual(toJSON([]), "[]");
        assert.strictEqual(toJSON([1]), '[\n  1\n]');
    });
});


suite('util.tryParseJSON', () => {
    function assertTryParseJSONResult(x: string, expectsError: boolean, expectedValue?: any, expectedError?: any) {
        const value = tryParseJSON(x);
        assert.strictEqual(!expectsError || !!value.error, true);
        if (expectedError !== undefined) {
            assert.deepStrictEqual(value.error, expectedError);
        }
        if (expectedValue !== undefined) {
            assert.deepStrictEqual(value.value, expectedValue);
        }
    }
    test('valid arg', () => {
        assertTryParseJSONResult("{}", false, {});
        assertTryParseJSONResult("[]", false, []);
        assertTryParseJSONResult('"a"', false, "a");
        assertTryParseJSONResult("123", false, 123);
        assertTryParseJSONResult("false", false, false);
        assertTryParseJSONResult("true", false, true);
    });

    test('invalid arg', () => {
        assertTryParseJSONResult("a0", true);
        assertTryParseJSONResult(".", true);
        assertTryParseJSONResult("{a}", true);
        assertTryParseJSONResult("a=0", true);
        assertTryParseJSONResult("a=0", true);
    });
});
