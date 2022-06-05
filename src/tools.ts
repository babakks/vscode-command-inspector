import * as vscode from 'vscode';
import { toJSON } from './util';

let echoPanel: vscode.OutputChannel | undefined;

export async function echo(...args: any[]) {
    if (!echoPanel) {
        echoPanel = vscode.window.createOutputChannel("Echo");
    }
    echoPanel.show();
    echoPanel.appendLine(toJSON(args));
}