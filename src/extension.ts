import * as fs from "fs";
import * as vscode from "vscode";
import { FileSystemProvider, FileStat } from "./fileExplorer";

export function activate(context: vscode.ExtensionContext) {
  // Activate extension command `oops.swap`
  const dispose = vscode.commands.registerCommand(
    "oops.swap",
    async (uri: vscode.Uri) => {
      // Get information about selected symbolic link
      const fileState = new FileStat(fs.lstatSync(uri.fsPath));

      // We have only 2 methods in this extension, and we need to invoke as follow:
      // 1. if it's a file:   invoke function to convert file to folder
      // 2. if it's a folder: invoke function to convert folder to file
      if (fileState.isFile) {
        fileToFolder(uri);
      }

      if (fileState.isDirectory) {
        folderToFile(uri);
      }
    }
  );

  context.subscriptions.push(dispose);
}

/**
 * Convert given file URI to folder.
 *
 * @param uri file URI
 */
export async function fileToFolder(uri: vscode.Uri) {
  const provider = new FileSystemProvider();

  // Read file content and check its content to see if it's empty.
  const content = await provider.readFile(uri);
  const isEmpty = content.every((el, inx, arr) => {
    const emptyChars = [
      // Tab
      9,
      // Line Feed
      10,
      // Carriage Return
      13, 
      // Space
      32
    ];
    return emptyChars.includes(el);
  });

  // Basic check: `content.length`
  if (isEmpty) {
    vscode.window.showErrorMessage("File is not empty.");
  } else {
    // Remove given file URI and refresh files explorer
    await provider.delete(uri, { recursive: false });
    vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );

    // Create new directory with same file URI and refresh files explorer
    await provider.createDirectory(uri);
    vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
  }
}

/**
 * convert given folder URI to file.
 * 
 * @param uri folder URI
 */
export async function folderToFile(uri: vscode.Uri) {
  const provider = new FileSystemProvider();

  // Read directory children to check we won't mess users' projects
  const children = await provider.readDirectory(uri);
  if (children.length) {
    vscode.window.showErrorMessage("Directory is not empty.");
  } else {
    // Init new file with same URI as folder URI
    const newUri = vscode.Uri.file(uri.fsPath);

    // Remove folder and refresh files explorer
    await provider.delete(uri, { recursive: true });
    vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );

    // Empty content for new file
    const content = new Uint8Array(0);

    // Write file we created earlier and write empty content into it and refresh files explorer
    await provider.writeFile(newUri, content, {
      create: true,
      overwrite: true,
    });
    vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
  }
}
