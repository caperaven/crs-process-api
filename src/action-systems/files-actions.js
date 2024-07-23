/**
 * @class FilesActions - It provides a set of actions for working with files.
 * Features:
 * -load - load files from the file system
 * -save - save a file to the file system
 * -save_canvas - save a canvas to the file system
 * -enable_dropzone - enable a dropzone for files
 * -disable_dropzone - disable a dropzone for files
 */
export class FilesActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method load - It either opens a file dialog and returns the files selected, or it returns the files from the specified source
     * @param step {Object} - The step object
     * @param context {Object} - The context of the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.dialog {boolean} - If true, it opens a file dialog and returns the files selected.
     * @param step.args.target {string} - The target to save the files to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("files", "load", {
     *    dialog: true,
     *    target: "@process.files"
     * });
     *
     * @example <caption>json</caption>
     * {
     *   "type": "files",
     *   "action": "load",
     *   "args": {
     *   "dialog": true,
     *   "target": "@process.files"
     *   }
     * }
     * @returns The file details.
     */
    static async load(step, context, process, item) {
        const dialog = await crs.process.getValue(step.args.dialog, context, process, item);
        const return_content = await crs.process.getValue(step.args.return_content, context, process, item);

        if (dialog == true) {
            const files = await get_files_dialog(step);

            let results = [];
            for (const file of files) {
                const fileDetails = await get_file_name(file.name);

                let value = file;
                if (return_content === true) {
                    value = await get_file_content(file);
                }

                results.push({
                    name: fileDetails.name,
                    ext: fileDetails.ext,
                    type: file.type,
                    size: file.size,
                    value
                })
            }

            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, results, context, process, item);
            }

            return results;
        }
        else {
            const results = await get_files(step, context, process, item);

            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, results, context, process, item);
            }

            return results;
        }
    }

    /**
     * @method save - This function takes a list of file details, creates a link element, sets the link's href to a blob of the file's
     * value, sets the link's download attribute to the file's name and extension, clicks the link, and then removes the
     * link from the DOM
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.details {[Object]} - An array of file details.
     * @param step.args.details.name {string} - The name of the file.
     * @param step.args.details.ext {string} - The extension of the file.
     * @param step.args.details.type {string} - The mime type of the file.
     * @param step.args.details.value {string} - The value of the file.
     *
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("files", "save", {
     *   details: [
     *    {
     *      name: "test",
     *      ext: "txt",
     *      type: "text/plain",
     *      value: "This is a test"
     *    }
     *   ]
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "files",
     *  "action": "save",
     *  "args": {
     *    "details": [
     *    {
     *      "name": "test",
     *      "ext": "txt",
     *      "type": "text/plain",
     *      "value": "This is a test"
     *     }
     *    ]
     *   }
     * }
     */
    static async save(step, context, process, item) {
        const fileDetails = await crs.process.getValue(step.args.details, context, process, item);

        let link = document.createElement("a");
        link.style.display = "none";
        document.body.appendChild(link);

        for (let fileDetail of fileDetails) {
            let blob = new Blob([fileDetail.value], {type: fileDetail.type});
            let url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = `${fileDetail.name}.${fileDetail.ext}`;
            link.click();
            window.URL.revokeObjectURL(url);
            url = null;
            blob = null;
        }

        link.parentElement.removeChild(link);
        link = null;
    }

    /**
     * @method save_canvas - It takes a canvas element, converts it to a PNG image, and then downloads it to the user's computer
     * @param step {Object} - The step object that is being executed.
     * @param context {Object} - The context of the current step.
     * @param process {Object} - The process that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.source {string} - The id of the canvas element to save.
     * @param step.args.name {string} - The name of the file to save.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("files", "save_canvas", {
     *  source: "myCanvas",
     *  name: "myImage"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "files",
     *  "action": "save_canvas",
     *  "args": {
     *    "source": "myCanvas",
     *    "name": "myImage"
     *   }
     * }
     */
    static async save_canvas(step, context, process, item) {
        const source = await crs.dom.get_element(step.args.source);
        const name = (await crs.process.getValue(step.args.name, context, process, item)) || "image";
        const url = source.toDataURL("image/png");

        let link = document.createElement("a");
        link.style.display = "none";
        document.body.appendChild(link);

        link.href = url.replace("image/png", "image/octet-stream");
        link.download = `${name}.png`;
        link.click();

        link.parentElement.removeChild(link);
        link  = null;
    }

    /**
     * @method enable_dropzone - Sets the drag drop events necessary for handeling a file drop
     * A callback should be passed in through the arguments which based on the action (drop, drag over, drag leave)
     * will pass in the event and any associated files on drop.
     * A dropTemplate should also be passed in which will be used to highlight the drop zone when a file is dragged over it.
     * Any dropClasses will be added to the dropTemplate in order to style it as needed.
     *
     * NOTE: we require a dragover event as in the dragover event handler for the target container,
     * we call event.preventDefault(), which enables it to receive drop events.
     * Please see for further details: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
     *
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {string} - The id of the element to set the drop events on.
     * @param step.args.callback {string} - The name of the callback to call when a file is dropped, dragged over the drop target, or dragged and the leaves the drop target.
     * @param step.args.drop_template {HTMLTemplateElement} - The template which will be added to the animation layer when a file is dragged over the drop target.
     * @param step.args.drop_classes {[]} - The classes to add to the dropTemplate when a file is dragged over the drop target in order to style it appropriately.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("files", "enable_dropzone", {
     *   element: "myElement",
     *   callback: "eventCallback"
     *   drop_template: dropTemplate,
     *   drop_classes: ["drop-area"]
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "files",
     *  "action": "enable_dropzone",
     *  "args": {
     *    "element": "myElement",
     *    "callback": "eventCallback"
     *    "drop_template": dropTemplate,
     *    "drop_classes": ["drop-area"]
     *   }
     * }
     * @returns {Promise<void>}
     */
    static async enable_dropzone(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);
        const dropTemplate = await crs.process.getValue(step.args.drop_template, context, process, item);
        const dropClasses = await crs.process.getValue(step.args.drop_classes, context, process, item);

        element.addEventListener("drop", file_drop_handler);
        element.addEventListener("dragenter", drag_enter_handler);
        element.addEventListener("dragover", drag_over_handler);
        element.addEventListener("dragleave", drag_leave_handler);
        element.__callback = callback;
        element.__dropTemplate = dropTemplate;
        element.__highlighted = false;
        element.__dropClasses = dropClasses;
    }

    /**
     * @method disable_dropzone - Cleans up and removes file drop events, associated callback, and any properties required during the drag process.
     * Must be called after using enable_dropzone
     *
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {string} - The id of the element to remove the drop events from.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("files", "disable_dropzone", {
     *  element: "myElement"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "files",
     *  "action": "disable_dropzone",
     *  "args": {
     *    "element": "myElement"
     *   }
     * }
     * @returns {Promise<void>}
     */
    static async disable_dropzone(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.removeEventListener("drop", file_drop_handler);
        element.removeEventListener("dragenter", drag_enter_handler);
        element.removeEventListener("dragover", drag_over_handler);
        element.removeEventListener("dragleave", drag_leave_handler);

        await crs.call("dom_interactive", "remove_animation_layer");

        delete element.__callback;
        delete element.__dropTemplate;
        delete element.__highlighted;
        delete element.__dropClasses;
        delete element.__dropBounds;
    }
}




/**
 * @class FileFormatter - It reads a file and returns a blob
 * Features:
 * -blob - returns a blob of the file
 */
export class FileFormatter {
    static async blob(file) {
        return new Promise(resolve => {
            const reader = new FileReader();

            reader.onload = () => {
                reader.onload = null;
                resolve(reader.result);
            }

            reader.readAsArrayBuffer(file);
        })
    }
}

/**
 * @function get_file_name - It takes a path, splits it on the forward slash, splits the last part of the path on the period, and returns the first
 * part of the last part of the path and the last part of the last part of the path
 * @param path {String}- The path to the file.
 *
 * @example <caption>javascript</caption>
 * const result = await crs.call("files", "get_file_name", {
 *  path: "my/path/to/my/file.txt"
 * });
 */
export async function get_file_name(path) {
    const pathParts = path.split("/");
    const filePart = pathParts[pathParts.length - 1];
    const fileParts = filePart.split(".");
    const ext =  fileParts[fileParts.length - 1];
    return {
        name: fileParts[0],
        ext
    }
}


/**
 * @function get_files_dialog - It creates an input element, sets its type to file, sets its multiple attribute to true, and then returns a promise that
 * resolves to an array of files when the user selects files
 *
 * @example <caption>javascript</caption>
 * const result = await crs.call("files", "get_files_dialog");
 *
 * @returns A promise that resolves to an array of files.
 */
async function get_files_dialog() {
    return new Promise(resolve => {
        let input = document.createElement('input');
        input.type = 'file';
        input.setAttribute("multiple", "multiple");
        input.onchange = () => {
            input.onchange = null;
            const files = Array.from(input.files);
            resolve(files)
        };
        input.click();
    })
}

/**
 * @function get_files - It takes a list of files, and returns a list of objects containing the file name, extension, and the file itself
 * @param step {Object} - The step object that is being executed.
 * @param context {Object} - The context of the current process.
 * @param process {Object} - The current process
 * @param item {Object} - The item that is being processed.
 *
 * @param step.args.files {Array} - An array of file paths.
 *
 * @example <caption>javascript</caption>
 * const result = await crs.call("files", "get_files", {
 * files: ["my/path/to/my/file.txt", "my/path/to/my/other/file.txt"]
 * });
 *
 * @example <caption>json</caption>
 * {
 *  "type": "files",
 *  "action": "get_files",
 *  "args": {
 *    "files": ["my/path/to/my/file.txt", "my/path/to/my/other/file.txt"]
 *   }
 * }
 *
 * @returns An array of objects with the following properties:
 * - name: the name of the file
 * - ext: the extension of the file
 * - value: the file itself
 */
export async function get_files(step, context, process, item) {
    const files = await crs.process.getValue(step.args.files, context, process, item);
    const results = [];

    for (const file of files) {
        const fileDetails = await get_file_name(file);

        results.push({
            name: fileDetails.name,
            ext: fileDetails.ext,
            value: await fetch(file).then(result => result.blob())
        });
    }

    return results;
}

/**
 * @function drag_enter_handler - The `drag_enter_handler` function is called when the user first drags a file over the drop zone
 * Will enable the animation layer and highlight the drop zone via the drop template and drop classes supplied in the enable_dropzone action
 *
 * @param event {Object} - The event object.
 *
 * @example <caption>javascript</caption>
 * const result = await crs.call("files", "drag_enter_handler", {
 *  event: event
 * });
 */
async function drag_enter_handler(event) {
    event.preventDefault();

    const element = event.currentTarget;

    if (element.__highlighted !== true) {
        await crs.call("dom_interactive", "highlight", {
            target: element,
            template: element.__dropTemplate,
            classes: element.__dropClasses
        });
        element.__highlighted = true;
    }

    element.__dropBounds = element.getBoundingClientRect();

    element.__callback({action: "dragEnter", event: event});
}

/**
 * @function drag_over_handler - The `drag_over_handler` function is called when the user drags a file over the drop zone
 * Ensures the drop event always fires as expected, by calling event.preventDefault()
 * @param event {Event} - Drag over event
 * @returns {Promise<void>}
 */
async function drag_over_handler(event) {
    event.preventDefault();
}

/**
 * @function drag_leave_handler - The `drag_leave_handler` function is called when the user drags a file over the drop zone and then leaves the drop zone
 * During the leave event, the animation layer and drop zone highlight will be removed
 *
 * @param event {Object}- The event object.
 *
 * @example <caption>javascript</caption>
 * const result = await crs.call("files", "drag_leave_handler", {
 *  event: event
 * });
 */
async function drag_leave_handler(event) {
    event.preventDefault();

    const element = event.currentTarget;
    const bounds = event.currentTarget.__dropBounds;
    if (bounds == null) return;

    if (event.x >= bounds.left && event.x <= bounds.right &&
        event.y >= bounds.top && event.y <= bounds.bottom) return;

    await crs.call("dom_interactive", "remove_animation_layer");
    element.__highlighted = false;

    element.__callback({action: "dragLeave", event: event});
}

/**
 * @method file_drop_handler - It takes a callback function and an event object, and then it calls the callback function with an array of file objects
 * Will remove the animation layer and drop zone highlight when the event is triggered.
 *
 * @param event {Object}- The event object that was triggered.
 *
 * @example <caption>javascript</caption>
 * const result = await crs.call("files", "file_drop_handler", {
 *   handler: myHandler,
 *   event: event
 * });
 */
async function file_drop_handler(event) {
    event.preventDefault();
    const element = event.currentTarget;

    await crs.call("dom_interactive", "remove_animation_layer");
    element.__highlighted = false;

    const files = event.dataTransfer.files;
    const results = [];

    for (const file of files) {
        const fileDetails = await get_file_name(file.name);
        results.push({
            type: file.type,
            name: fileDetails.name,
            ext: fileDetails.ext,
            size: file.size,
            value: file
        });
    }

    element.__callback({action: "drop", event: event, results: results});
}

function get_file_content(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const content = event.target.result;
            resolve(content);
        };

        reader.onerror = function(event) {
            reject(event.target.error);
        };

        reader.readAsText(file);
    })
}

crs.intent.files = FilesActions;1