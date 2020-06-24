import * as vscode from 'vscode';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import { FileSystemProvider, FileStat } from './fileExplorer';

export function activate(context: vscode.ExtensionContext) {
    const dispose = vscode.commands.registerCommand('oops.swap', async (uri: vscode.Uri) => {
        const fileState = new FileStat(fs.lstatSync(uri.fsPath));
        const provider = new FileSystemProvider();
        if (fileState.isFile) {
            const content = await provider.readFile(uri);
            if (content.length) {
                vscode.window.showErrorMessage('File is not empty.');
            } else {
                await provider.delete(uri, { recursive: false });
                vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
                await provider.createDirectory(uri);
                vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
            }
        }

        if (fileState.isDirectory) {
            const children = await provider.readDirectory(uri);
            if (children.length) {
                vscode.window.showErrorMessage('Directory is not empty.');
            } else {
                const newUri = vscode.Uri.file(uri.fsPath);
                await provider.delete(uri, { recursive: true });
                vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
                try {
                    const content = new Uint8Array(0);
                    const result = await provider.writeFile(newUri, content, { create: true, overwrite: true });
                    console.log(result);
                } catch (error) {
                    console.error(error);
                }
                vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
            }
        }
    });
    context.subscriptions.push(dispose);
}

export function deactivate() { }
