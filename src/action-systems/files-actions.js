export class FileActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async load(step, context, process, item) {
        const dialog = await crs.process.getValue(step.args.dialog, context, process, item);

        if (dialog == true) {
            const files = await get_files_dialog(step);

            let results = [];
            for (const file of files) {
                const data = await FileFormatter.blob(file);
                const fileDetails = await get_file_name(file.name);

                results.push({
                    name: fileDetails.name,
                    ext: fileDetails.ext,
                    type: file.type,
                    size: file.size,
                    value: data
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
     * Sets the drag drop events necessary for handeling a file drop
     * A handler should e passed in through the arguments to recieve the file results.
     * @returns {Promise<void>}
     */
    static async enable_dropzone(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const handler = await crs.process.getValue(step.args.handler, context, process, item);
        document.addEventListener("drop", filedrop_handler.bind(this, handler));
        document.addEventListener("dragover", dragover_handler)
        element.__dropHandler = filedrop_handler;
        element.__dragoverHandler = dragover_handler;
    }

    /**
     * Cleans up and removes file drop events and associated handlers, must be called after using enable_dropzone
     * @returns {Promise<void>}
     */
    static async disable_dropzone(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        document.removeEventListener("drop", element.__dropHandler);
        document.removeEventListener("dragover", element.__dragoverHandler);
        delete element.__dropHandler;
        delete element.__dragoverHandler;
    }
}

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

async function dragover_handler(event) {
    event.preventDefault();
}

async function filedrop_handler(handler, event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const results = [];

    for (const file of files) {
        const fileDetails = await get_file_name(file.name);
        results.push({
            type: file.type,
            name: fileDetails.name,
            ext: fileDetails.ext,
            size: file.size,
            value: await file.arrayBuffer()
        });
    }

    handler.call(this, results);
}

crs.intent.file = FileActions;