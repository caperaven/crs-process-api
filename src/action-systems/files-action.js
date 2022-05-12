export class FileActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async load(step, context, process, item) {
        const dialog = step.args.dialog;

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
                    value: data
                })
            }
            return results;
        }
        else {
            return await get_files(step, context, process, item);
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
    return {
        name: fileParts[0],
        ext: fileParts[1]
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