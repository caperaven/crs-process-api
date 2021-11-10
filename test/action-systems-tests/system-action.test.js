import {loadBinding} from "../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("../../src/index.js");
})