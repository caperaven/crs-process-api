import { describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assert, assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../../../mockups/init.js";
import {ensureOptions} from "./../../../../src/action-systems/managers/dragdrop-manager/options.js";

await init();

describe("options tests", () => {
    it ("ensureOptions - default", async () => {
        const options = ensureOptions();
        assertEquals(options.drag.query, "[draggable='true']");
        assertEquals(options.drag.placeholderType, "standard");
        assertEquals(options.drag.clone, "element");
        assertEquals(options.drop.allowDrop, "[aria-dropeffect]");
        assertEquals(options.drop.action, "move");
    });
})