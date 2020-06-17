import * as vscode from 'vscode';
import * as fs from 'fs';
// import { FileExplorer } from './fileExplorer';

export function activate(context: vscode.ExtensionContext) {
    const dispose = vscode.commands.registerCommand('oops.swap', async (uri: vscode.Uri) => {
        // console.log(uri);
        // fs.stat(uri.fsPath, (error, state) => {
        //     console.log(state.isSymbolicLink);
        // });

        fs.exists(uri.fsPath, exists => console.log(exists));

        vscode.window.showInformationMessage('Command received');
        // console.log(posix.extname(uri.path));
    });
    context.subscriptions.push(dispose);
}

export function stat(path: string): Promise<fs.Stats> {
    return new Promise<fs.Stats>((resolve, reject) => {
        fs.stat(path, (error, stat) => (resolve, reject, error, stat) => {
            console.log(resolve, reject, error, stat);
        });
    });
}

export function deactivate() { }
