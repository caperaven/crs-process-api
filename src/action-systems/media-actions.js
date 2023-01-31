export class MediaActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * It takes a canvas element and a set of constraints,
     * and then sets the canvas to display the video stream from the camera
     * @param step - The step object
     * @param context - The context of the current process.
     * @param process - The current process
     * @param item - the item that is being processed
     *
     * @param constraints {object} - The constraints to use for the video stream.
     * @param canvas {object} - The canvas element to display the video stream on.
     *
     * @returns {Promise<void>}
     * @example <caption>javascript example</caption>
     * await crs.call("media", "render_camera", {
     *     constraints: {
     *        video: {
     *            width: 1280,
     *            height: 720
     *        }
     *     },
     *     canvas: document.getElementById("canvas")
     * }, context, process, item);
     *
     */
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

    /**
     * "Capture the current frame of the video element and draw it on the canvas element."
     *
     * The first line of the function is a comment. Comments are ignored by the interpreter
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the process.
     * @param process - The process that is running the step.
     * @param item - The item that is being processed.
     *
     * @param video {object} - The video element to capture the frame from.
     * @param canvas {object} - The canvas element to draw the frame on.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("media", "capture_image", {
     *     video: element,
     *     canvas: element
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "media",
     *    "action": "capture_image",
     *    "args": {
     *          "video": element,
     *          "canvas": element
     *     }
     * }
     */
    static async capture_image(step, context, process, item) {
        const canvas = await crs.dom.get_element(step.args.target);
        const video = await crs.dom.get_element(step.args.source);
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    }
}

crs.intent.media = MediaActions;