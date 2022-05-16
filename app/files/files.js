export default class Files extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async loadAsBlob() {
        let data = await crs.call("files", "load", {
            dialog: true
        })

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

    async loadView() {
        const blob = "";

        const image_element = await crs.call("view", "image", {
            data: blob
        })

        const pdf_element = await crs.call("view", "pdf", {
            data: blob
        })

        const word_element = await crs.call("view", "external", {
            data: blob
        })

        const text_element = await crs.call("view", "text", {
            data: blob
        })
    }
}