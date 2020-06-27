import * as vscode from 'vscode';
import * as fs from 'fs';
import { FileSystemProvider, FileStat } from './fileExplorer';
import { resolve } from 'path';

export function activate(context: vscode.ExtensionContext) {
    const dispose = vscode.commands.registerCommand('oops.swap', async (uri: vscode.Uri) => {
        fileToFolder(uri);
        folderToFile(uri);
    });
    context.subscriptions.push(dispose);
}

export async function fileToFolder(uri: vscode.Uri): Promise<String> {
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
    return;
}

export async function folderToFile(uri: vscode.Uri): Promise<String> {
    const fileState = new FileStat(fs.lstatSync(uri.fsPath));
    const provider = new FileSystemProvider();
    if (fileState.isDirectory) {
        const children = await provider.readDirectory(uri);
        if (children.length) {
            vscode.window.showErrorMessage('Directory is not empty.');
        } else {
            const newUri = vscode.Uri.file(uri.fsPath);
            await provider.delete(uri, { recursive: true });
            vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
            const content = new Uint8Array(0);
            await provider.writeFile(newUri, content, { create: true, overwrite: true });
            vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
        }
    }
    return;
}

export function deactivate() { }
