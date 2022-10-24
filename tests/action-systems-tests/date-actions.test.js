import {init} from "./../mockups/init.js";
import {assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";

await init();

Deno.test("date_diff_test_one_second", async () => {
   const res = await crs.call("date", "date_diff", {
       date1: "2022-02-01T00:00:00.000Z",
       date2: "2022-02-01T00:00:01.000Z"
   });

   assertEquals(res, "0:0:0:1");
});

Deno.test("date_diff_test_large_swapped", async () => {
    const res = await crs.call("date", "date_diff", {
        date1: "2022-03-04T08:02:10.015Z",
        date2: "2022-02-01T00:00:00.000Z"
    });

    assertEquals(res, "31:8:2:10");
});