/**
 * Initialize the mocking objects for testing purposes
 */
import {ElementMock} from "./element-mock.js"
import "./custom-elements.js";
import "./document-mock.js";
import "./computed-style.js";
import "./screen.js";
import "./custom-event.js";

export async function init() {
    globalThis.DocumentFragment = ElementMock;
    globalThis.HTMLElement = ElementMock;
    globalThis.Element = ElementMock;
    globalThis.HTMLInputElement = ElementMock;
    globalThis.requestAnimationFrame = (callback) => callback();

    await import("./../../packages/crs-binding/crs-binding.js");
    await import("./../../packages/crs-modules/crs-modules.js");

    const processModule = await import("./../../src/index.js");
    await processModule.initialize("./../../src");
}

await init();