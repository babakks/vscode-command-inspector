import * as vscode from 'vscode';

export async function openDoc(content: string, language: string) {
    const result = await vscode.workspace.openTextDocument({
        language,
        content,
    });
    await vscode.window.showTextDocument(result);
    return result;
}

export function toJSON(x: any) {
    return JSON.stringify(x, null, 2);
}

export function tryParseJSON(x: string): { error: string, value: undefined } | { error: undefined, value: any } {
    try {
        return { error: undefined, value: JSON.parse(x) };
    } catch (e) {
        return { error: String(e), value: undefined };
    }
}