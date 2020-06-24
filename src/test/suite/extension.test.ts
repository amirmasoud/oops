import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as Oops from '../../extension';

const testFolderLocation = '/../../../src/test/example/';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});

	test('Should change file to folder', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'oops_file.js')
		);
		await Oops.fileToFolder(uri);
		assert.ok(fs.lstatSync(uri.fsPath).isDirectory());
	});

	test('Should change folder to file', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'oops_folder')
		);
		await Oops.folderToFile(uri);
		assert.ok(fs.lstatSync(uri.fsPath).isFile());
	});
});
