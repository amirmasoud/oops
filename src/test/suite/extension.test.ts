import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as Oops from '../../extension';

const testFolderLocation = '/../../../src/test/example/';

suite('Extension Test Suite', () => {
	test('Should change folder to file', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'oops_file.js')
		);
		await Oops.folderToFile(uri);
		assert.ok(fs.lstatSync(uri.fsPath).isFile());
	});

	test('Should change file to folder', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'oops_folder')
		);
		await Oops.fileToFolder(uri);
		assert.ok(fs.lstatSync(uri.fsPath).isDirectory());
	});

	test('Should not be able to delete not empty directory', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'not_empty_directory')
		);
		await Oops.folderToFile(uri);
		assert.ok(fs.lstatSync(uri.fsPath).isDirectory());
		assert.ok(fs.lstatSync(uri.fsPath + '/directory_with_children').isFile());
	});

	test('Should not be able to delete not empty file', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'not_empty_file')
		);
		await Oops.folderToFile(uri);
		assert.ok(fs.lstatSync(uri.fsPath).isFile());
	});
});
