import * as vscode from 'vscode';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';

// import { FileExplorer } from './fileExplorer';

export function activate(context: vscode.ExtensionContext) {
    const dispose = vscode.commands.registerCommand('oops.swap', async (uri: vscode.Uri) => {
        fs.readdir(uri.fsPath, async (error, children) => {
            if (error) {
                fs.readFile(uri.fsPath, (error, buffer) => {
                    if (!error && buffer.length) {
                        vscode.window.showErrorMessage('File is not empty.');
                        return;
                    }

                    if (!error && !buffer.length) {
                        const path = uri.fsPath;
                        fs.unlink(path, error => {
                            if (error) {
                                vscode.window.showErrorMessage('Error deleting file.');
                            }
                        });

                        mkdirp(path);
                        vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
                    }
                });
            } else {
                if (children.length) {
                    vscode.window.showErrorMessage('Directory is not empty.');
                    return;
                }
                const path = uri.fsPath;
                await rimraf(path, error => {
                    if (error) {
                        vscode.window.showErrorMessage('Error deleting directory.');
                    }
                });

                console.log(path);

                // vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');


                // await fs.writeFile('/Users/amirmasoud/Sites/test', '', error => {
                //     if (error) {
                //         vscode.window.showErrorMessage('Error creating file.');
                //         console.error(error);
                //     }
                // });


                vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
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
