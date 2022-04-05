import {loadBinding} from "./crsbinding.mock.js";

export async function init() {
    await loadBinding();
    await import("./../../src/index.js");
    const module = await import("./../../schema-manager/index.js");
    await module.init();
}