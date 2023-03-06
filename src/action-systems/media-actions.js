/**
 * @class MediaActions - This class contains a set of actions that can be used to interact with the media devices on
 * the computer.
 *
 * Features:
 * -perform - This method is called by the action system to execute the action.
 * -render_camera - This method takes a canvas element and a set of constraints, and then sets the canvas to display the
 * -capture_image - This method captures the current frame of the video element and draws it on the canvas element.
 */
export class MediaActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method render_camera - It takes a canvas element and a set of constraints,and then sets the canvas to display.
     * @param step {object} - The step object
     * @param context {object} - The context of the current process.
     * @param process {object} - The current process
     * @param item {object} - the item that is being processed
     *
     *@param step.args.element{object} - The canvas element to display the video on.
     *@param step.args.constraints {object} - The constraints to use when capturing the video.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("media", "render_camera", {
     *     element: {canvas}
     *     constraints: {constraints}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "media",
     *      "action": "render_camera",
     *      "args": {
     *          "element": {canvas}
     *          "constraints": {constraints}
     *      }
     * }
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
     * @method capture_image - "Capture the current frame of the video element and draw it on the canvas element."
     * The first line of the function is a comment. Comments are ignored by the interpreter
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process that is running the step.
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.target {string} - The canvas element to draw the image on.
     * @param step.args.source {string} - The video element to capture the image from.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("media", "capture_image", {
     *     target: this.querySelector("canvas"),
     *     source: this.querySelector("video")
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "media",
     *    "action": "capture_image",
     *    "args": {
     *          "target": "canvas",
     *          "source": "video"
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