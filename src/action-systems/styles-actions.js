export class StylesActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async load_file(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        const file = await crs.process.getValue(step.args.file, context, process, item);

        if (document.querySelector(`#${id}`) != null) return;

        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = file;
        document.getElementsByTagName("head")[0].appendChild(link)
    }

    static async unload_file(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id);
        const link = document.querySelector(`#${id}`);
        link.parentElement.removeChild(link);
    }
}

crs.intent.styles = StylesActions;

