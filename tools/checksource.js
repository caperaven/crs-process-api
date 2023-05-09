/**
 * This file uses deno to check all source files and do checks for potential memory issues.
 *
 * example command:
 * deno run --allow-all ./tools/checksource.js ./ "tests"
 *
 * parameters:
 * 1. root folder to start the search e.g. ./
 * 2. comma separated list of folders to ignore e.g. "tests,build"
 */

import { walk } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

/**
 * @function getFiles - get all the js files in this folder and subfolders.
 * Get the start folder from the args.
 * @param path
 * @returns {Promise<paths[]>}
 */
async function getFiles(rootPath, ignoreCustomFolders, ignoreCustomFiles) {
    console.log("src validation - rootPath: ", rootPath);

    const ignoreFolders = ["node_modules", "dist", "build", "test", "mockups", "resources", "documents", "styles", "packages", ...ignoreCustomFolders];

    // 1. get the start folder from the args.
    const startFolder = rootPath || Deno.args[0];

    console.log(`Checking files in ${startFolder}`);

    // 2. get all the js files in this folder and subfolders.
    const files = [];
    for await (const entry of walk(startFolder)) {
        let ignoreEntry = false;
        for (const ignoreFolder of ignoreFolders) {
            if (ignoreFolder.length > 0 && entry.path.includes(ignoreFolder)) {
                ignoreEntry = true;
                continue;
            }
        }

        if (ignoreEntry == true) continue;

        if (entry.isFile && entry.path.endsWith(".js")) {
            let ignore = false;

            for (const ignoreFile of ignoreCustomFiles || []) {
                if (entry.path.endsWith(ignoreFile)) {
                    ignore = true;
                    continue;
                }
            }

            if (ignore == false) {
                files.push(entry.path);
            }
        }
    }

    return files;
}

/**
 * @function EvaluateFiles - evaluate all the files.
 * Open each file and count the number of times "addEventListener" is used.
 * Also count the number of times "removeEventListener" is used.
 * If the numbers are not equal, add the file name and the count to the result array.
 * @param files
 * @returns {Promise<void>}
 * @constructor
 */
async function EvaluateFiles(files) {
    const result = [];
    for (const file of files) {
        const content = await Deno.readTextFile(file);
        checkForEventListeners(file, content, result);
        checkForFields(file, content, result);
    }

    return result;
}

/**
 * @function checkForEventListeners - check if the number of addEventListener and removeEventListener are equal.
 * @param file {string} - the file name
 * @param content {string} - the content of the file
 * @param resultCollection {array} - the array to add the result to
 */
function checkForEventListeners(file, content, resultCollection) {
    const addCount = (content.match(/addEventListener/g) || []).length;
    const removeCount = (content.match(/removeEventListener/g) || []).length;
    if (addCount > removeCount) {
        resultCollection.push({ file, addCount, removeCount, action: "event listeners" });
    }
}

function checkForFields(file, content, resultCollection) {
    console.log(`processing: ${file}`);

    // get the code between the class keyword and the constructor or connectedCallback method
    const classContent = content.match(/class\s+\w+\s*{([\s\S]*?)(?=constructor|connectedCallback)/g);
    if (classContent == null) return;

    // 1. get the fields defined in the code
    // fields are defined in a class as #field.
    // find all the fields that are defined in the class.
    // make sure the field is not a comment, so if there is a * before the field, don't include it
    // fields is always an array, so if there are no fields, it will be an empty array
    // only check for fields before the "constructor" or "connectedCallback" method
    const fields = classContent.join("").match(/(?<!\*)(?<!this.)#([^ ;]*)/g) || [];
    if (fields.length == 0) return;

    // 2. check if those fields are set to null in the dispose method
    let disposedFields = getDisposedFields(content); // content.match(/dispose\s*\([^)]*\)\s*{((?:(?!if|for)[\s\S])*?)}/g);

    // 4. if the dispose method is missing but there are fields, add the file to the result
    if (disposedFields == null && fields.length > 0) {
        resultCollection.push({ file, field: fields.join(","), error: "missing dispose and disconnectedCallback method", action: "dispose field" });
    }

    if (disposedFields) {
        for (const field of fields) {
            if (disposedFields.indexOf(field.replace(";", "")) == -1) {
                resultCollection.push({ file, field, action: "dispose field" });
            }
        }
    }
}

/**
 * Find the dispose method and get the source code.
 * @param content
 */
function getDisposedFields(content) {
    const lines = content.split("\r\n");
    let disposedFields = [];
    let disposeFound = false;
    let skipCodeBlock = 0;

    for (const line of lines) {
        const codeLine = line.trim();

        if (codeLine.startsWith("*") || codeLine.length == 0) continue;

        if (codeLine.startsWith("dispose") || codeLine.startsWith("disconnectedCallback") || codeLine.startsWith("async disconnectedCallback")) {
            disposeFound = true;
            continue;
        }

        if (disposeFound == false) continue;

        if (codeLine.startsWith("if") || codeLine.startsWith("for") || codeLine.indexOf("crs.call") != -1) {
            skipCodeBlock += 1;
            continue;
        }

        if (codeLine.startsWith("this.#")) {
            disposedFields.push(codeLine.substring(0, codeLine.indexOf(" ")).replace("this.", ""));
            continue;
        }

        if (codeLine.includes("}")) {
            if (skipCodeBlock > 0) {
                skipCodeBlock -= 1;
            }
            else {
                disposeFound = false;
                break;
            }
        }
    }

    return disposedFields.length == 0 ? null : disposedFields;
}

export async function checkSource(rootPath, ignoreFolders, ignoreFiles) {
    const files = await getFiles(rootPath, ignoreFolders || [], ignoreFiles || []);

    if (files.length == 0) {
        throw new Error("no files found");
    }

    const result = await EvaluateFiles(files);
    return result;
}

console.log("--------- check version: 1.1.0 ---------");
if (Deno.args.length > 0) {
    console.log("running commandline")
    const testFilePath = Deno.mainModule;
    const testDir = path.dirname(testFilePath);
    const folder = path.fromFileUrl(testDir.replace(Deno.args[0], ""));

    const ignore = (Deno.args[1] || "").split(",").map(item => item.trim());
    const files = await getFiles(folder, ignore);
    const result = await EvaluateFiles(files);

    if (result.length == 0) {
        console.log("all files are ok");
    }
    else {
        console.log("files with issues:");
        console.log(result);
    }
}