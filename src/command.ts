import { TextDecoder, TextEncoder } from "util";
import * as vscode from "vscode";
import { openDoc, toJSON, tryParseJSON } from "./util";

async function getCommands() {
    return await vscode.commands.getCommands();
}

export async function dumpCommandsAsJSON(context: vscode.ExtensionContext) {
    await openDoc(toJSON(await getCommands()), "json");
}

export async function dumpExtensionCommandsAsJSON(context: vscode.ExtensionContext) {
    await openDoc(toJSON(getExtensionsAndCommands()), "json");
}

function getExtensionsAndCommands() {
    return vscode.extensions.all.reduce((r: any, x) => {
        r[x.id] = {
            "id": x.id,
            "name": x.packageJSON.name,
            "description": x.packageJSON.description,
            "version": x.packageJSON.version,
            "commands": x.packageJSON.contributes?.commands,
        };
        return r;
    }, {});
}

export async function askAndDumpExtensions(context: vscode.ExtensionContext) {
    const exts = await quickPickMultipleExtensions();
    if (exts.length === 0) { return; }
    const content = toJSON(exts.reduce((r: any, x) => {
        r[x.id] = x.packageJSON;
        return r;
    }, {}));
    await openDoc(content, "json");
}

async function quickPickMultipleExtensions(): Promise<vscode.Extension<any>[]> {
    const all = { alwaysShow: true, label: "All extensions", value: undefined };
    const exts = vscode.extensions.all.map((x) => <vscode.QuickPickItem & { value: vscode.Extension<any> }>{
        label: x.packageJSON.displayName,
        description: x.packageJSON.name,
        detail: x.packageJSON.description,
        value: x,
    });

    const selection = await vscode.window.showQuickPick(
        [all, ...exts],
        { placeHolder: "Select extension", canPickMany: true });
    if (!selection) { return []; }
    if (selection.includes(all)) { return [...vscode.extensions.all]; }
    return selection.map((x) => x.value!);
}

export async function askAndInvokeCommand(context: vscode.ExtensionContext) {
    const ls = await getCommands();
    const command = await vscode.window.showQuickPick(ls, { placeHolder: "Select a command to invoke" });
    if (!command) { return; }

    const choiceWithoutArgs = { label: "Invoke with no arg", fn: async () => [] };
    const choiceFromEditor = { label: "Read args array from active file/selection (JSON)", fn: readArgsFromEditor };
    const choiceFromInput = { label: "Read args array from plain input (JSON)", fn: readArgsFromInput };
    const choiceFromFile = { label: "Read args array from JSON file...", fn: readArgsFromFile };
    const choice = await vscode.window.showQuickPick([
        choiceWithoutArgs,
        choiceFromEditor,
        choiceFromInput,
        choiceFromFile,
    ]);
    if (!choice) {
        return;
    }

    const args = await choice.fn();
    if (!args) {
        vscode.window.showErrorMessage("Arguments is not in JSON format");
        return;
    }
    const ret = await vscode.commands.executeCommand(command, ...args);
    if (ret === undefined) {
        vscode.window.showInformationMessage("Command executed (no return value)");
        return;
    }
    await openDoc(toJSON(ret), "json");
}

function parseArgs(args: string): any[] | undefined {
    if (!args) { return []; }
    const parsed = tryParseJSON(args);
    if (parsed.error) {
        console.error(parsed.error);
        return undefined;
    }
    return Array.isArray(parsed.value) ? parsed.value : [parsed.value];
}

async function readArgsFromEditor(): Promise<any[] | undefined> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document) {
        await vscode.window.showErrorMessage("No active document");
        return;
    }

    const selection = editor.selections.length > 0 && !editor.selection.isEmpty ? editor.selection : undefined;
    const content = editor.document.getText(selection);
    return parseArgs(content);
}

async function readArgsFromInput(): Promise<any[] | undefined> {
    const result = await vscode.window.showInputBox({
        prompt: "Enter arg array in JSON",
        placeHolder: "e.g. [\"a\", \"b\", 1] or []",
    });
    if (result === undefined) {
        return;
    }
    return parseArgs(result);
}

async function readArgsFromFile(): Promise<any[] | undefined> {
    const file = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        openLabel: "Select JSON file",
    });
    if (!file || file.length !== 1) {
        return;
    }
    const content = new TextDecoder().decode(await vscode.workspace.fs.readFile(file[0]));
    return parseArgs(content);
}
