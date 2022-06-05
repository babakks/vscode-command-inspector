import * as vscode from "vscode";
import {
    askAndDumpExtensions,
    dumpExtensionCommandsAsJSON,
    dumpCommandsAsJSON,
    askAndInvokeCommand,
} from "./command";
import { echo } from "./tools";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        makeDumpCommandsAsJSON(context),
        makeDumpExtensionCommandsAsJSON(context),
        makeDumpExtensionAsJSON(context),
        makeInvokeCommand(context),
        makeEchoCommand(context),
    );
}

export function deactivate() { }

function makeDumpCommandsAsJSON(
    context: vscode.ExtensionContext
): vscode.Disposable {
    return vscode.commands.registerCommand(
        "vscode-command-inspector.dumpCommandsAsJSON",
        () => dumpCommandsAsJSON(context)
    );
}

function makeDumpExtensionCommandsAsJSON(
    context: vscode.ExtensionContext
): vscode.Disposable {
    return vscode.commands.registerCommand(
        "vscode-command-inspector.dumpExtensionCommandsAsJSON",
        () => dumpExtensionCommandsAsJSON(context)
    );
}

function makeDumpExtensionAsJSON(
    context: vscode.ExtensionContext
): vscode.Disposable {
    return vscode.commands.registerCommand(
        "vscode-command-inspector.dumpExtensionAsJSON",
        () => askAndDumpExtensions(context)
    );
}


function makeInvokeCommand(
    context: vscode.ExtensionContext
): vscode.Disposable {
    return vscode.commands.registerCommand(
        "vscode-command-inspector.invokeCommand",
        () => askAndInvokeCommand(context)
    );
}


function makeEchoCommand(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(
        "vscode-command-inspector.tools.echo",
        (...args) => echo(...args)
    );
}
