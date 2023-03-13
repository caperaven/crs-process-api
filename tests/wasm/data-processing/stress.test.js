// import {join} from "https://deno.land/std@0.150.0/path/mod.ts";
// import init, {filter} from "./../bin/wasm_lib.js";
//
// await init();
//
// console.warn("*** WARNING ------ loading large data file ------ ");
// const file = `file:///${join(Deno.cwd(), "/data/work.json")}`;
// const json = await fetch(file).then(result => result.json());
// console.warn(`*** Loaded JSON with (${json.length}) records`);
//
// Deno.test("filter - large list", async () => {
//     const start = performance.now();
//     const result = filter(json, { "field": "asset_id", "operator": "eq", "value": 7950 }, false);
//     const end = performance.now();
//
//     console.log(`filter time: ${end - start}ms`);
// })