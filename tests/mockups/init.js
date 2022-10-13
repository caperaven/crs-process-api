/**
 * Initialize the mocking objects for testing purposes
 */
import * as path from "https://deno.land/std/path/mod.ts";
import {exists} from "https://deno.land/std/fs/mod.ts"
import {ElementMock} from "./element-mock.js"
import "./custom-elements.js";
import "./document-mock.js";
import "./computed-style.js";
import "./screen.js";
import "./custom-event.js";

export async function init() {
    const packages = await getPackagesFolder()

    globalThis.DocumentFragment = ElementMock;
    globalThis.HTMLElement = ElementMock;
    globalThis.HTMLInputElement = ElementMock;
    globalThis.requestAnimationFrame = (callback) => callback();

    const crs_binding = path.join(packages, "crs-binding/crs-binding.js");
    const crs_modules = path.join(packages, "crs-modules/crs-modules.js");
    const crs_process = path.join(packages, "./..", "src/index.js");

    await import(crs_binding);
    await import(crs_modules);

    const processModule = await import(crs_process);
    const folder = crs_process.replace("\\index.js", "");
    processModule.initialize(folder);
}

async function getPackagesFolder() {
    const dirname = path.dirname(path.fromFileUrl(import.meta.url));

    let dir = path.join(dirname, "./../../packages");
    if (! await exists(dir)) {
        dir = path.join(dirname, "./../..");
    }

    return path.join("file://", dir);
}