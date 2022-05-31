/**
 * https://web.dev/file-system-access/#transparency
 */

export class FsActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * select folder and return handle
     * @returns {Promise<void>}
     */
    static async select_folder(step, context, process, item) {
    }

    /**
     * read the content of a file
     * @returns {Promise<void>}
     */
    static async create_folder(step, context, process, item) {
    }

    /**
     * using the file picker select a file, read it's content and pass it back
     * @returns {Promise<void>}
     */
    static async select_file(step, context, process, item) {
        let fileHandle;
        [fileHandle] = await window.showOpenFilePicker();
        return fileHandle;
    }

    /**
     * read the content of a file
     * @returns {Promise<void>}
     */
    static async read_file(step, context, process, item) {
        const handle = await crs.process.getValue(step.args?.handle, context, process, item);
        const fileHandle = handle || await this.select_file(step, context, process, item);
        const file = await fileHandle.getFile();
        return await file.text();
    }

    /**
     * read the content of a file and convert it to json
     * @returns {Promise<void>}
     */
    static async read_json(step, context, process, item) {
        const text = await this.read_file(step, context, process, item);
        return JSON.parse(text);
    }

    /**
     * save a existing file
     * @returns {Promise<void>}
     */
    static async save_file(step, context, process, item) {
        const fileHandle = await crs.process.getValue(step.args.file_handle, context, process, item);
        const content = await crs.process.getValue(step.args.content, context, process, item);
        await writeFile(fileHandle, content);
    }

    /**
     * save text as utf8 in a file
     * @returns {Promise<void>}
     */
    static async write_new_file(step, context, process, item) {
        const fileTypes = await crs.process.getValue(step.args.file_types, context, process, item);
        const defaultName = await crs.process.getValue(step.args.default_name, context, process, item);
        const fileHandle = await getSaveHandle(fileTypes, defaultName);
        const content = await crs.process.getValue(step.args.content, context, process, item);
        await writeFile(fileHandle, content);
    }

    /**
     * save a json file to a utf8 file with a json extension
     * @returns {Promise<void>}
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
    }

    /**
     * Get a list of files in a selected folder
     * @returns {Promise<void>}
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

async function writeFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}

async function getSaveHandle(types, defaultName) {
    const options = {
        suggestedName: defaultName || 'Untitled.txt',
        types: types || []
    };

    return await window.showSaveFilePicker(options);
}

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