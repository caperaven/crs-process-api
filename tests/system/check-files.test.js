import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import * as path from "https://deno.land/std/path/mod.ts";

import {checkSource} from "./../../tools/checksource.js";

describe("checksource tests", async () => {
    it.ignore("checkSource", async () => {
        const testFilePath = Deno.mainModule;
        const testDir = path.dirname(testFilePath);
        const folder = path.fromFileUrl(testDir.replace("tests/system", ""));

        const result = await checkSource(folder, ["app"]);

        if (result.length > 0) {
            console.error(result);
        }

        assertEquals(result.length, 0);
    })
})

