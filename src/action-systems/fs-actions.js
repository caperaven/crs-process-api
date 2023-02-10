/**
 * Also, check out {@link https://web.dev/file-system-access/#transparency}
 * @class FsActions - This is a static class that contains the actions for the file system
 *
 * Features:
 * perform - perform an action on a component or element
 * select_folder - select a folder
 * create_folder - create a folder in the target location
 * select_file - the function `select_file` is an asynchronous function that returns a file handle
 * read_file - It reads the contents of a file
 * read_file_json - It reads a file and returns the contents as a JSON object
 * save_file - It takes a file handle and a content string, and writes the content to the file
 * write_new_file - Saves text as utf8 in a file
 * write_new_json - save a json file to a utf8 file with a json extension
 * open_folder - It opens a folder and returns a list of files in the folder.
 */
export class FsActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method select_folder - This function selects a folder
     * @param step - The step number of the current step.
     * @param context - The context object that is passed to the step.
     * @param process - The process object that is being executed.
     * @param item - The item that was selected.
     */
    static async select_folder(step, context, process, item) {
    }

    /**
     * @method create_folder - Create a folder in the target location
     * @param step - The step number of the current step in the process.
     * @param context - The context object that is passed to the step.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     */
    static async create_folder(step, context, process, item) {
    }

    /**
     * @method select_file - The function `select_file` is an asynchronous function that returns a file handle
     * @param step - The step object that is being executed.
     * @param context - The context of the step.
     * @param process - The process object that is being run.
     * @param item - The item that is being processed.
     *
     * @returns The fileHandle is being returned.
     */
    static async select_file(step, context, process, item) {
        let fileHandle;
        [fileHandle] = await window.showOpenFilePicker();
        return fileHandle;
    }

    /**
     * @method read_file - It reads the contents of a file
     * @param step - The step object from the process definition.
     * @param context - The current context of the process.
     * @param process - The process that is running the step.
     * @param item - The item that is being processed.
     *
     * @param [step.args.handle = "handle"] {string} - The handle of the file to read.
     *
     * @returns {Promise<void>} - The contents of the file.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("fs", "read_file",{
     *     handle: "$context.value"
     * },context, process, item);
     *
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "fs",
     *     "action": "read_file",
     *     "args": {
     *         "handle": "$context.value"
     *     }
     * }
     */
    static async read_file(step, context, process, item) {
        const handle = await crs.process.getValue(step.args?.handle, context, process, item);
        const fileHandle = handle || await this.select_file(step, context, process, item);
        const file = await fileHandle.getFile();
        return await file.text();
    }

    /**
     * @method read_json - It reads a file and returns the contents as a JSON object
     * @param step - the step object
     * @param context - The context object that is passed to the function.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     *  @param [step.args.handle = "handle"] {string} - The handle of the file to read.
     *
     * @returns The JSON.parse(text) is being returned.
     *
     * @example <content>javascript example</caption>
     * const result = await crs.call("fs", "read_json", {
     *     handle: "$context.value"
     * });
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "fs",
     *     "action": "read_json"
     *     "args": {
     *         "handle": "$context.value"
     *      }
     * }
     */
    static async read_json(step, context, process, item) {
        const text = await this.read_file(step, context, process, item);
        return JSON.parse(text);
    }

    /**
     * @method save_file - It takes a file handle and a content string, and writes the content to the file
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param step.args.handle {string} - The handle of the file to read.
     * @param step.args.content {string|object} - The content to write to the file.
     *
     * @example <caption>javascript example </caption>
     * await crs.call("fs", "save_file", {
     *     fileHandle: "$context.value",
     *     content: "content"
     * },context, process, item);
     *
     * @example <caption>json example </caption>
     * {
     *     "type": "fs",
     *     "action": "save_file",
     *     "args": {
     *          "fileHandle": "$context.value",
     *          "content": "content"
     *      }
     * }
     */
    static async save_file(step, context, process, item) {
        const fileHandle = await crs.process.getValue(step.args.handle, context, process, item);
        const content = await crs.process.getValue(step.args.content, context, process, item);
        await writeFile(fileHandle, content);
    }

    /**
     * @method write_new_file - Saves text as utf8 in a file
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param step.args.file_types {string} - The file types that are allowed to be selected.
     * @param step.args.default_name {string} - The default name of the file.
     * @param step.args.content {string|object} - The content to write to the file.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("fs", "write_new_file", {
     *     file_types: "$context.value,
     *     default_name: "defaultName",
     *     content: "content"
     * },context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "fs",
     *      "action": "write_new_file",
     *      "args": {
     *          "file_types": "$context.value,
     *          "default_name": "defaultName",
     *          "content": "content"
     *       }
     * }
     */
    static async write_new_file(step, context, process, item) {
        const fileTypes = await crs.process.getValue(step.args.file_types, context, process, item);
        const defaultName = await crs.process.getValue(step.args.default_name, context, process, item);
        const fileHandle = await getSaveHandle(fileTypes, defaultName);
        const content = await crs.process.getValue(step.args.content, context, process, item);
        await writeFile(fileHandle, content);
        return fileHandle;
    }

    /**
     * @method write_new_json - save a json file to a utf8 file with a json extension
     * @param step - the step object from the process
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The current item being processed.
     *
     * @param step.args.content {string|object} - The content to write to the file.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     *  await crs.call("fs", "write_new_json", {
     *      "content": "contents"
     *  },context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "fs",
     *    "action": "write_new_json",
     *    "args": {
     *      "content": "contents"
     *    }
     *  }
     */
    static async write_new_json(step, context, process, item) {
        const json = await crs.process.getValue(step.args.content, context, process, item);
        const defaultName = "untitled.json";
        const fileTypes = [
            {
                description: 'JSON Files',
                accept: {
                    'text/json': ['.json'],
                },
            }
        ]
        const fileHandle = await getSaveHandle(fileTypes, defaultName);
        await writeFile(fileHandle, JSON.stringify(json, null, '\t'));
        return fileHandle;
    }

    /**
     * @method open_folder - It opens a folder and returns a list of files in the folder.
     * @param step - The step object from the workflow.
     * @param context - The context of the current process.
     * @param process - The current process
     * @param item - The item that is being processed.
     *
     * @param step.args.handle {string} - The handle of the folder to open.
     *
     * @returns An array of file entries.
     *
     * @example <caption>javascript example</caption>
     * const results = await crs.call("fs", "open_folder", {
     *     handle: "$context.value"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "fs",
     *    "action": "open_folder",
     *    "args": {
     *      "handle": "$context.value"
     *    }
     * }
     */
    static async open_folder(step, context, process, item) {
        const handle = await crs.process.getValue(step.args?.handle, context, process, item);
        const dirHandle = handle || await window.showDirectoryPicker();
        await verifyPermission(dirHandle, true);

        const results = [];

        for await (const entry of dirHandle.values()) {
            results.push(entry);
        }

        return results;
    }
}

/**
 * @function writeFile - It takes a file handle and some contents, and writes the contents to the file
 * @param fileHandle {string} - The file handle that you want to write to.
 * @param contents {string|object} - The contents of the file. This can be a string or an object. If it's an object, it will be converted
 * to a JSON string.
 */
async function writeFile(fileHandle, contents) {
    if (typeof contents == "object") {
        contents = JSON.stringify(contents, null, 4);
    }

    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}

/**
 * @function getSaveHandle - It shows a save file picker dialog and returns a handle to the file that the user selected
 * @param types {array} - An array of strings that specify the types of files that can be saved.
 * @param defaultName {string} - The default name of the file.
 * @returns A Promise that resolves to a FileSystemWritableFileStream.
 */
async function getSaveHandle(types, defaultName) {
    const options = {
        suggestedName: defaultName || 'Untitled.txt',
        types: types || []
    };

    return await window.showSaveFilePicker(options);
}

/**
 * @function verifyPermission - It checks if the user has granted permission to read or
 * write to the file, and if not, it requests permission
 * @param fileHandle {string} - The file handle to verify permissions for.
 * @param readWrite {boolean} - A boolean value that indicates whether the file should be opened for reading and writing.
 * @returns A boolean value.
 */
async function verifyPermission(fileHandle, readWrite) {
    const options = {};

    if (readWrite) {
        options.mode = 'readwrite';
    }

    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }

    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }

    return false;
}

crs.intent.fs = FsActions;