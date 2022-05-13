export class MediaActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async render_camera(step, context, process, item) {
        const canvas = await crs.get_element(step, context, process, item);

    }
}