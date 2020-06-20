import * as vscode from 'vscode';
import * as fs from 'fs';
// import { FileExplorer } from './fileExplorer';

export function activate(context: vscode.ExtensionContext) {
    const dispose = vscode.commands.registerCommand('oops.swap', async (uri: vscode.Uri) => {
        console.log(uri);
        fs.readdir(uri.fsPath, (error, children) => {
            if (error) {
                fs.readFile(uri.fsPath, (error, buffer) => {
                    if (!error && buffer.length) {
                        vscode.window.showErrorMessage('File is not empty.');
                        return;
                    }

                    if (!error && !buffer.length) {
                        fs.unlink(uri.fsPath, error => vscode.window.showErrorMessage(error));
                    }
                });
            } else {
                if (children.length) {
                    vscode.window.showErrorMessage('Directory is not empty.');
                    return;
                }
                vscode.window.showInformationMessage('directory');
            }
        });
        // console.log(uri);
        // fs.stat(uri.fsPath, (error, state) => {
        //     console.log(state.isSymbolicLink);
        // });

        // fs.exists(uri.fsPath, exists => console.log(exists));

        // Is it file?
        // fs.readdir(uri.fsPath, (error, children) => {
        //     console.log(error);
        //     console.log(children);
        // });

        // Is it file and is it empty?
        // fs.readFile(uri.fsPath, (error, buffer) => {
        //     console.log(error, buffer);
        // });


        // Cretae new file/dir if not existed already
        // fs.exists(uri.fsPath, exists => console.log());

        // Remove directoy
        // rimraf(path, error => handleResult(resolve, reject, error, void 0));

        // Crete new directory
        // mkdirp(path, error => handleResult(resolve, reject, error, void 0));

        // Remove file
        // fs.unlink(path, error => handleResult(resolve, reject, error, void 0));

        // Write new file
        // fs.writeFile(path, content, error => handleResult(resolve, reject, error, void 0));

        // vscode.window.showInformationMessage('Command received');
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
