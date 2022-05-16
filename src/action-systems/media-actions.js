export class MediaActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async render_camera(step, context, process, item) {
        const canvas = await crs.dom.get_element(step, context, process, item);
        let constraints = await crs.process.getValue(step.args.constraints, context, process, item);

        if (constraints == null) {
            constraints = {
                video: true
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        canvas.srcObject = stream;
        canvas.setAttribute("autoplay", "autoplay");
    }

    static async capture_image(step, context, process, item) {
        const canvas = await crs.dom.get_element(step.args.target);
        const video = await crs.dom.get_element(step.args.source);
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    }
}

crs.intent.media = MediaActions;