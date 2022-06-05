# VS Code Commands Inspector

**Commands Inspector** lets you explore VS Code commands (both native and those added by third-party extensions), invoke them (with or without arguments) and explore under-the-hood of the installed extensions. 🕵️

## Dump all commands

1. Open the command bar (`Ctrl`+`Shift`+`P`).
1. Type in `Dump commands (JSON)` and press `Enter`.

## Invoke a command (with/without arguments)

1. Open the command bar (`Ctrl`+`Shift`+`P`).
1. Type in `Invoke command` and press `Enter`.
1. Select the command from the list or type in a part of its identifier then press `Enter`.

   ℹ️ As an example you can try executing the `echo` command defined in this extension, named `vscode-command-inspector.tools.echo` or the builtin `Toggle Terminal` named as `workbench.action.terminal.toggleTerminal`.

1. Select if you'd want to invoke the command:
   - Without argument.
   - With arguments read from a JSON file.
   - With arguments read from the active document/selection.
   - With arguments in plain JSON (i.e., to be typed in the command bar).

   ℹ️ Provide arguments as a JSON array. For example:

   ```json
   [
     "First argument",
     { "name": "Second argument as on object" }
   ]
   ```

1. A notification message would display the result of the action, if any.

## Dump commands grouped by extensions

1. Open the command bar (`Ctrl`+`Shift`+`P`).
1. Type in `Dump extension commands (JSON)` and press `Enter`.

## Dump extension manifests

1. Open the command bar (`Ctrl`+`Shift`+`P`).
1. Type in `Dump extension(s) (JSON)` and press `Enter`.
1. Select the extensions you'd want to see their manifests (i.e., `package.json` file).
