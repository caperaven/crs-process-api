import {assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

Deno.test("ObjectActions - delete - delete property from object through loop", async () => {

    const testData = [
        {id: 'xx', field1: 'xx', field2: 'xx'},
        {id: 'yy', field1: 'yy', field2: 'yy'},
        {id: 'zz', field1: 'zz', field2: 'zz'}
    ]

    const assertData = [
        {id: 'xx', field1: 'xx'},
        {id: 'yy', field1: 'yy'},
        {id: 'zz', field1: 'zz'}
    ]

    await crs.call("loop", "perform", {
        source: testData,
        steps: {
            start: {
                type: "object",
                action: "delete",
                args: {
                    properties: ["$item.field2"]
                }
            }
        }
    });

    assertEquals(testData, assertData);
});