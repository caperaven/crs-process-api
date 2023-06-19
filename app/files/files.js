import "./../../src/action-systems/fs-actions.js";

export default class Files extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
        await this._setupDropzone();
    }

    async disconnectedCallback() {
        await crs.call("files", "disable_dropzone", {
            element: this.shadowRoot.querySelector("#dropzone")
        });
        await super.disconnectedCallback();
    }

    async loadAsBlob() {
        let data = await crs.call("files", "load", { dialog: true })

        await crs.call("files", "save", {
            details: data
        })
    }

    async loadFromFile() {
        let data = await crs.call("files", "load", {
            files: ["/app/files/barchart.png"]
        })

        await crs.call("files", "save", {
            details: data
        })
    }

    async select() {
        this.handle = await crs.call("fs", "select_file");
        console.log(this.handle);
    }

    async selectText() {
        const content = await crs.call("fs", "read_file");
        console.log(content);
    }

    async selectJson() {
        const content = await crs.call("fs", "read_json");
        console.log(content);
    }

    async saveFile() {
        if (this.handle == null) return;

        const content = this.getProperty("content");
        await crs.call("fs", "save_file", {
            file_handle: this.handle,
            content: content
        })
    }

    async saveNewText() {
        const content = this.getProperty("content");
        await crs.call("fs", "write_new_file", {
            content: content
        })
    }

    async saveNewJson() {
        const content = this.getProperty("content");
        const json = JSON.parse(content);
        await crs.call("fs", "write_new_json", {
            content: json
        })
    }

    async openFolder() {
        const result = await crs.call('fs', "open_folder");
        for(let item of result) {
            console.log(item);
        }
    }

    async _setupDropzone() {
        await crs.call("files", "enable_dropzone",
            {
                element: this.shadowRoot.querySelector("#dropzone"),
                handler: this.dropHandler.bind(this)
            })
    }

    async dropHandler(results) {
        console.log(results);
    }
}