/**
 * https://web.dev/file-system-access/#transparency
 */

export class FsActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }


    static async select_folder(step, context, process, item) {
    }

    /**
     * > Create a folder in the target location
     * @param step - The step number of the current step in the process.
     * @param context - The context object that is passed to the step.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     */
    static async create_folder(step, context, process, item) {
    }

    /**
     * > The function `select_file` is an asynchronous function that returns a file handle
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
     * It reads the contents of a file
     * @param step - The step object from the process definition.
     * @param context - The current context of the process.
     * @param process - The process that is running the step.
     * @param item - The item that is being processed.
     *
     * @param handle {string} - The handle of the file to read.
     * @param fileHandle {string} - The file handle of the file to read.
     *
     * @returns {Promise<void>} - The contents of the file.
     *
     * @example <caption>javascript example</caption>
     * const text = await crs.call("fs", "read_file",{
     *     handle: "fileHandle"
     * },context, process, item);
     *
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "fs",
     *     "action": "read_file",
     *     "args": {
     *         "handle": "fileHandle"
     *
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
     * It reads a file and returns the contents as a JSON object
     * @param step - the step object
     * @param context - The context object that is passed to the function.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param text {string} - The text to parse as JSON.
     *
     * @returns The JSON.parse(text) is being returned.
     *
     * @example <content>javascript example</caption>
     * const json = await crs.call("fs", "read_json");
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "fs",
     *     "action": "read_json"
     * }
     */
    static async read_json(step, context, process, item) {
        const text = await this.read_file(step, context, process, item);
        return JSON.parse(text);
    }

    /**
     * It takes a file handle and a content string, and writes the content to the file
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param handle {string} - The handle of the file to write to.
     * @param content {string} - The content to write to the file.
     *
     * @example <caption>javascript example </caption>
     * await crs.call("fs", "save_file", {
     *     fileHandle: "this.handle",
     *     content: "content"
     * },context, process, item);
     *
     * @example <caption>json example </caption>
     * {
     *     "type": "fs",
     *     "action": "save_file",
     *     "args": {
     *          "fileHandle": "this.handle",
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
     * > Saves text as utf8 in a file
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param fileTypes {string} - The file types that are allowed to be selected.
     * @param defaultName {string} - The default name of the file.
     * @param content {string} - The content to write to the file.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("fs", "write_new_file", {
     *     content: "content"
     * },context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "fs",
     *      "action": "write_new_file",
     *      "args": {
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
     * save a json file to a utf8 file with a json extension
     * @param step - the step object from the process
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The current item being processed.
     *
     * @param json {object} - The json object to write to the file.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     *  await crs.call("fs", "write_new_json", {
     *      "json": {}
     *  },context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "fs",
     *    "action": "write_new_json",
     *    "args": {
     *      "json": {}
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
     * It opens a folder and returns a list of files in the folder.
     * @param step - The step object from the workflow.
     * @param context - The context of the current process.
     * @param process - The current process
     * @param item - The item that is being processed.
     *
     * @param handle {string} - The handle of the folder to open.
     *
     * @returns An array of file entries.
     *
     * @example <caption>javascript example</caption>
     * const results = await crs.call("fs", "open_folder", {
     *     handle: "handle"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * "step": {
     *    "type": "fs",
     *    "action": "open_folder",
     *    "args": {
     *      "handle": "handle"
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
 * It takes a file handle and some contents, and writes the contents to the file
 * @param fileHandle - The file handle that you want to write to.
 * @param contents - The contents of the file. This can be a string or an object. If it's an object, it will be converted
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
 * It shows a save file picker dialog and returns a handle to the file that the user selected
 * @param types - An array of strings that specify the types of files that can be saved.
 * @param defaultName - The default name of the file.
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
 * It checks if the user has granted permission to read or
 * write to the file, and if not, it requests permission
 * @param fileHandle - The file handle to verify permissions for.
 * @param readWrite - A boolean value that indicates whether the file should be opened for reading and writing.
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