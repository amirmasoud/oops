import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const fileToFolder = vscode.commands.registerCommand('oops/fileToFolder', () => {
        vscode.window.showInformationMessage('Convert file to folder');
    });

    const folderToFile = vscode.commands.registerCommand('oops/folderToFile', () => {
        vscode.window.showInformationMessage('Convert folder to file');
    });

    context.subscriptions.push(fileToFolder);
}

export function deactivate() { }
