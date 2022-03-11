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
        [fileHandle] = await window.showOpenFilePicker();
        console.log(fileHandle)
    }

    /**
     * read the content of a file
     * @returns {Promise<void>}
     */
    static async read_file(step, context, process, item) {
    }

    /**
     * read the content of a file and convert it to json
     * @returns {Promise<void>}
     */
    static async read_json(step, context, process, item) {
    }

    /**
     * save text as utf8 in a file
     * @returns {Promise<void>}
     */
    static async write_file(step, context, process, item) {
    }

    /**
     * save a json file to a utf8 file with a json extension
     * @returns {Promise<void>}
     */
    static async write_json(step, context, process, item) {
    }

    /**
     * Get a list of files in a given folder
     * @returns {Promise<void>}
     */
    static async get_files(step, context, process, item) {
    }


}

crs.intent.fs = FsActions;